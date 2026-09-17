/**
 * Read-only media diagnostic. Writes nothing — safe to point at production.
 *
 *   pnpm check:media                  against .env (local)
 *   pnpm check:media:prod             against .env.production
 *
 * Reports the three things that have to line up for an image to appear on the site:
 *
 *   1. a Media document exists in the database,
 *   2. the file it names is actually served by the CMS,
 *   3. the documents that should point at media do.
 *
 * Written after production shipped with 14 pages, 12 insights and ZERO media documents: the
 * seed had silently skipped every upload, and nothing in the stack reported it — the pages
 * rendered fine, just with no <img> tags at all. A count of 0 here is the signal that was
 * missing.
 */
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config.js'

const serverUrl = (process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3001').replace(/\/$/, '')

/** Probes a media URL the way a browser would, following the CMS's own file route. */
async function probe(url: string): Promise<string> {
  try {
    const res = await fetch(url, { method: 'GET', signal: AbortSignal.timeout(15_000) })
    return res.ok ? `${res.status} ${res.headers.get('content-type') ?? ''}`.trim() : `${res.status}`
  } catch (error) {
    return `unreachable (${error instanceof Error ? error.message : String(error)})`
  }
}

async function main() {
  const payload = await getPayload({ config })

  console.log(`\n  CMS origin: ${serverUrl}\n`)

  const media = await payload.find({ collection: 'media', limit: 500, depth: 0, overrideAccess: true })
  console.log(`  media documents: ${media.totalDocs}`)

  if (media.totalDocs === 0) {
    console.log(
      '\n  ✗ No media documents. Every image field on the site will be null.\n' +
        '    Re-run the design seed against this database (pnpm seed / pnpm seed:prod).\n',
    )
  }

  // Collections whose documents are supposed to carry an image.
  const linked: [string, string][] = [
    ['clients', 'logo'],
    ['testimonials', 'avatar'],
    ['insights', 'thumbnail'],
  ]
  console.log('\n  referencing documents:')
  for (const [collection, field] of linked) {
    const total = await payload.count({ collection: collection as never, overrideAccess: true })
    const withImage = await payload.count({
      collection: collection as never,
      where: { [field]: { exists: true } },
      overrideAccess: true,
    })
    const flag = total.totalDocs > 0 && withImage.totalDocs === 0 ? ' ✗' : ''
    console.log(`    ${collection}.${field}: ${withImage.totalDocs}/${total.totalDocs}${flag}`)
  }

  // A sample of real files, fetched over HTTP — this is what catches a stale NEXT_PUBLIC_SERVER_URL.
  const sample = media.docs.slice(0, 5) as { filename?: string; url?: string }[]
  if (sample.length) {
    console.log('\n  file reachability (sample):')
    for (const doc of sample) {
      const url = doc.url?.startsWith('http') ? doc.url : `${serverUrl}${doc.url ?? ''}`
      console.log(`    ${await probe(url)}  ${url}`)
    }
  }

  console.log()
  process.exit(0)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
