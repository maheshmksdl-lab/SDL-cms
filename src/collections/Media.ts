import fs from 'fs/promises'
import path from 'path'
import sharp from 'sharp'
import type { CollectionConfig, PayloadRequest } from 'payload'

/**
 * Media.
 *
 * Copied from the EFTMRA reference with the derivative set changed to match this design.
 * The two long comments below are carried over deliberately: each encodes a real production
 * incident, and removing them invites the same mistake again.
 */

const MAX_IMAGE_DIMENSION = 2400

/**
 * Generated derivatives, and the single source of truth for them.
 *
 * Sizes are taken from the design's actual consumers, not invented:
 *   thumb    400x300  — admin list view and generic cards
 *   insight  720x900  — the insights carousel card (portrait bias)
 *   logo     320x160  — the client logo strip, `contain` so marks are never cropped
 *   avatar   160x160  — testimonial avatars
 *   og      1200x630  — social sharing
 *
 * Adding an entry needs a migration too: each size is six real columns on `media`
 * (`sizes_<name>_url`, `_width`, `_height`, `_mime_type`, `_filesize`, `_filename`) plus an
 * index, and the adapter runs with `push: false`.
 */
export const MEDIA_IMAGE_SIZES = [
  { name: 'thumb', width: 400, height: 300 },
  { name: 'insight', width: 720, height: 900 },
  { name: 'logo', width: 320, height: 160, fit: 'contain' as const },
  { name: 'avatar', width: 160, height: 160 },
  { name: 'og', width: 1200, height: 630 },
] as const

export const ADMIN_THUMBNAIL = 'thumb'

const MEDIA_STATIC_DIR = process.env.SDL_MEDIA_DIR
  ? path.resolve(process.cwd(), process.env.SDL_MEDIA_DIR)
  : path.resolve(process.cwd(), 'media')

type CompressibleMimeType = 'image/avif' | 'image/jpeg' | 'image/png' | 'image/webp'
type UploadFile = NonNullable<PayloadRequest['file']>
type BeforeOperationHook = NonNullable<NonNullable<CollectionConfig['hooks']>['beforeOperation']>[number]
type UploadHandler = NonNullable<Extract<CollectionConfig['upload'], object>['handlers']>[number]

const fallbackMimeTypes: Record<string, string> = {
  '.avif': 'image/avif',
  '.gif': 'image/gif',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.pdf': 'application/pdf',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
}

function isCompressibleImage(mimeType?: string): mimeType is CompressibleMimeType {
  return (
    mimeType === 'image/avif' ||
    mimeType === 'image/jpeg' ||
    mimeType === 'image/png' ||
    mimeType === 'image/webp'
  )
}

async function getFileBuffer(file: UploadFile) {
  if (file.tempFilePath) return fs.readFile(file.tempFilePath)
  return file.data
}

async function setFileBuffer(file: UploadFile, buffer: Buffer) {
  if (file.tempFilePath) await fs.writeFile(file.tempFilePath, buffer)
  file.data = buffer
  file.size = buffer.length
}

async function compressImageBuffer(buffer: Buffer, mimeType: CompressibleMimeType) {
  const image = sharp(buffer, { failOn: 'none' })
    .rotate()
    .resize({ fit: 'inside', height: MAX_IMAGE_DIMENSION, width: MAX_IMAGE_DIMENSION, withoutEnlargement: true })

  if (mimeType === 'image/jpeg') return image.jpeg({ mozjpeg: true, quality: 82 }).toBuffer()
  if (mimeType === 'image/png') return image.png({ compressionLevel: 9, palette: true, quality: 82 }).toBuffer()
  if (mimeType === 'image/webp') return image.webp({ effort: 4, quality: 82 }).toBuffer()
  return image.avif({ effort: 4, quality: 60 }).toBuffer()
}

const compressUploadedImage: BeforeOperationHook = async ({ args, operation, req }) => {
  if (operation !== 'create' && operation !== 'update') return args

  const file = req.file
  if (!file || !isCompressibleImage(file.mimetype)) return args

  try {
    const originalBuffer = await getFileBuffer(file)
    if (!originalBuffer.length) return args

    const compressed = await compressImageBuffer(originalBuffer, file.mimetype)
    if (compressed.length >= originalBuffer.length) return args

    await setFileBuffer(file, compressed)
    req.payload.logger.info(
      `Compressed ${file.name}: ${originalBuffer.length} -> ${compressed.length} bytes`,
    )
  } catch (error) {
    req.payload.logger.warn(
      `Skipped compression for ${file.name}: ${error instanceof Error ? error.message : String(error)}`,
    )
  }

  return args
}

const serveLocalMediaFile: UploadHandler = async (_req, { doc, params }) => {
  const filename = params.filename

  // Reject any path component: this handler reads straight off disk.
  if (!filename || path.basename(filename) !== filename) {
    return Response.json({ errors: [{ message: 'Invalid filename.' }] }, { status: 400 })
  }

  const filePath = path.join(MEDIA_STATIC_DIR, filename)

  try {
    const buffer = await fs.readFile(filePath)
    /*
     * `doc` is undefined whenever the collection's read access returns a plain `true` rather
     * than a `Where` constraint — Payload's own `checkFileAccess` only resolves a document when
     * there is a constraint to query by (see its source). `publicRead` returns `true`
     * unconstrained, so this is the normal path for every public asset, not an edge case.
     */
    const docRecord = doc as Record<string, unknown> | undefined
    const docMimeType = typeof docRecord?.mimeType === 'string' ? docRecord.mimeType : null
    const mimeType =
      docMimeType || fallbackMimeTypes[path.extname(filename).toLowerCase()] || 'application/octet-stream'

    return new Response(new Uint8Array(buffer), {
      headers: {
        /*
         * Deliberately NOT `immutable`, and not a year.
         *
         * A previous `max-age=31536000, immutable` meant the CDN kept serving files the origin
         * had already lost — the same URL returned 200 from a warm edge and 404 from a cold
         * one, which made the breakage look intermittent and hid it for weeks.
         * `must-revalidate` with a one-day TTL keeps images cached but lets a genuine loss
         * surface quickly.
         *
         * Payload writes a new filename on re-upload, so nothing depends on immutability.
         */
        'Cache-Control': 'public, max-age=86400, must-revalidate',
        'Content-Type': mimeType,
      },
    })
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error

    // Never let a miss be cached: once the file is restored the URL must recover immediately,
    // without waiting for an edge TTL or a manual purge.
    return Response.json(
      { errors: [{ message: 'File not found.' }] },
      { status: 404, headers: { 'Cache-Control': 'no-store' } },
    )
  }
}

export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    staticDir: MEDIA_STATIC_DIR,
    handlers: [serveLocalMediaFile],
    mimeTypes: [
      'image/avif', 'image/jpeg', 'image/png', 'image/webp',
      'image/svg+xml', 'image/gif', 'application/pdf',
    ],
    /*
     * Rectangle cropping is OFF deliberately.
     *
     * Payload's crop is destructive: it re-reads the existing file, sets
     * `overwriteExistingFiles`, and writes cropped bytes back over the SAME filename — the
     * original is gone, with no undo. Media docs are also shared across documents, so a crop
     * intended for one usage re-crops every other.
     *
     * Framing is controlled by the focal point instead, which only affects the derivatives.
     */
    crop: false,
    focalPoint: true,
    /*
     * `withoutEnlargement: false` matters more than it looks. Left undefined, Payload OMITS
     * the size entirely for any source smaller than the target on both axes, storing null and
     * giving the frontend nothing to render.
     */
    imageSizes: MEDIA_IMAGE_SIZES.map((size) => ({ ...size, withoutEnlargement: false })),
    adminThumbnail: ADMIN_THUMBNAIL,
  },
  admin: {
    group: 'Content',
    defaultColumns: ['filename', 'alt', 'mimeType', 'filesize', 'updatedAt'],
  },
  hooks: {
    beforeOperation: [compressUploadedImage],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      /*
       * Required for images, and not merely encouraged. The reference leaves `alt` optional,
       * which is how its library ended up with images that cannot be described to a screen
       * reader. Non-image uploads (PDF) have no alt concept, so the rule is conditional.
       */
      validate: (value: unknown, { data }: { data: Record<string, unknown> }) => {
        const mime = typeof data?.mimeType === 'string' ? data.mimeType : ''
        const isImage = mime.startsWith('image/') && mime !== 'image/svg+xml'
        if (isImage && (typeof value !== 'string' || !value.trim())) {
          return 'Alt text is required for images. Describe what the image shows, or its purpose.'
        }
        return true
      },
      admin: {
        description: 'Describe the image for screen readers. Required for photographs and graphics.',
      },
    },
    { name: 'caption', type: 'text' },
    { name: 'credit', type: 'text', admin: { description: 'Attribution, where one is required.' } },
    {
      name: 'uploadedBy',
      type: 'relationship',
      relationTo: 'users',
      admin: { readOnly: true, position: 'sidebar' },
      hooks: {
        beforeChange: [
          ({ value, req, operation }) => (operation === 'create' ? (req.user?.id ?? null) : value),
        ],
      },
    },
  ],
}
