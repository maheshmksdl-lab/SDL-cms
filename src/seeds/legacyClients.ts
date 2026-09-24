/**
 * The real client logos from the legacy site's https://www.socialdnalabs.com/clients/ ("Trusted by
 * Industry Leaders" grid — every logo on that page, confirmed by diffing the full set of <img> tags
 * in that section against the page's total image count), as `clients` records.
 *
 * Run by `pnpm seed` after the design seed, and on its own by `pnpm migrate:clients`.
 *
 * The design seed's six `Client 1`…`Client 6` records are NOT removed here. They were meant to
 * be, but production still carries them, and this seed reproduces production rather than changing
 * it. Retiring them is a content decision — delete them in the admin, or remove
 * seedClientsAndTestimonials' CLIENT_LOGOS loop, and every environment follows.
 *
 * None of the 23 source images have alt text (every one is `alt=""` on the legacy site), so each
 * company name below was read directly off the logo artwork by eye, not scraped — double-check
 * `016-300x163-1.jpg` ("Bowring Institute") in particular, its monogram was the hardest to read
 * with confidence. Everything else cross-references cleanly against already-migrated Insights
 * content (NUETECH, Architectural Iron Designs, BAHRI Pharmaceuticals, The Anglican Centre all
 * match names/companies that already appear in migrated case studies or testimonials).
 *
 *   pnpm migrate:clients              against .env (local)
 *   pnpm migrate:clients:prod         against .env.production
 *   DRY_RUN=true pnpm migrate:clients:prod
 *
 * Safe to re-run: media is looked up by filename before upload (never re-uploaded), and clients
 * are upserted by name (existing docs updated in place, not duplicated).
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { Payload } from 'payload'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const LOGOS_DIR = path.resolve(__dirname, '../../scripts/migrate-clients-data/logos')

const DRY_RUN = process.env.DRY_RUN === 'true'

const MIME_BY_EXT: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
}

const CLIENTS: { name: string; file: string }[] = [
  { name: 'Mercedes-Benz', file: '001.jpg' },
  { name: 'REPOSE', file: '002.jpg' },
  { name: 'NUETECH', file: '003-1.jpg' },
  { name: 'NeoLacta Lifesciences', file: '004.jpg' },
  { name: 'SOAIS', file: '006.jpg' },
  { name: 'Mentor Global', file: '007.jpg' },
  { name: 'Array', file: '008-300x163-1.jpg' },
  { name: 'MaraMentor', file: '009-300x163-1.jpg' },
  { name: 'Architectural Iron Designs', file: '010-300x163-1.jpg' },
  { name: 'Zafin', file: '011-300x163-1.jpg' },
  { name: 'Act-On', file: '012-300x163-1.jpg' },
  { name: 'DuraGates', file: '013-300x163-1.jpg' },
  { name: 'India House Food & Imports', file: '015-300x163-1.jpg' },
  { name: 'Bowring Institute', file: '016-300x163-1.jpg' },
  { name: 'Bedding Industries of America', file: '017-300x163-1.jpg' },
  { name: 'The Anglican Centre', file: 'angli.jpg' },
  { name: 'DLI IT / Security / AV Solutions', file: 'clients-11.jpg' },
  { name: 'Attitude', file: 'clients-new-1.jpg' },
  { name: 'ReDesigned Thinking', file: 'clients-new-2.jpg' },
  { name: 'KAADOO', file: 'clients-new-3.jpg' },
  { name: 'BAHRI Pharmaceuticals', file: 'clients-new-4.jpg' },
  { name: 'SOS Technology', file: 'clients-new-5.jpg' },
  { name: 'SOS HR Solutions', file: 'clients-new-6.jpg' },
]


async function uploadLogo(payload: Payload, filename: string, alt: string): Promise<number | undefined> {
  const existing = await payload.find({
    collection: 'media',
    where: { filename: { equals: filename } },
    limit: 1,
    overrideAccess: true,
  })
  if (existing.docs[0]) return (existing.docs[0] as { id: number }).id

  if (DRY_RUN) {
    console.log(`    would upload media: ${filename}`)
    return undefined
  }

  const sourcePath = path.join(LOGOS_DIR, filename)
  if (!fs.existsSync(sourcePath)) {
    console.warn(`    ! missing local logo file, skipping: ${sourcePath}`)
    return undefined
  }
  const buffer = fs.readFileSync(sourcePath)
  const mimetype = MIME_BY_EXT[path.extname(filename).toLowerCase()] ?? 'application/octet-stream'
  const doc = await payload.create({
    collection: 'media',
    data: { alt },
    file: { data: buffer, mimetype, name: filename, size: buffer.length },
    overrideAccess: true,
    overwriteExistingFiles: true,
  })
  return doc.id as number
}

async function upsertClient(
  payload: Payload,
  name: string,
  data: Record<string, unknown>,
): Promise<'created' | 'updated'> {
  const existing = await payload.find({
    collection: 'clients',
    where: { name: { equals: name } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  const first = existing.docs[0] as { id: number } | undefined

  if (DRY_RUN) return first ? 'updated' : 'created'

  if (first) {
    await payload.update({ collection: 'clients', id: first.id, data: data as never, overrideAccess: true })
    return 'updated'
  }
  await payload.create({ collection: 'clients', data: { ...data, name } as never, overrideAccess: true })
  return 'created'
}

export async function seedLegacyClients(payload: Payload): Promise<void> {
  let created = 0
  let updated = 0
  let order = 10

  for (const client of CLIENTS) {
    console.log(`  · ${client.name} [${client.file}]`)
    const logoId = await uploadLogo(payload, client.file, client.name)
    const result = await upsertClient(payload, client.name, {
      logo: logoId,
      featured: true,
      order,
    })
    if (result === 'created') created += 1
    else updated += 1
    order += 10
  }

  console.log(
    `
  ${DRY_RUN ? 'would create' : 'created'}: ${created}   ${DRY_RUN ? 'would update' : 'updated'}: ${updated}
`,
  )
}
