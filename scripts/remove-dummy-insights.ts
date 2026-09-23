/**
 * Removes the 12 placeholder Insights the design seed created during development, in two
 * separately-run steps:
 *
 *   STEP=carousels  Switch the two insights carousels that hand-picked those placeholders — home
 *                   "Think ahead." and /services "Ideas for what's next" — from "Chosen manually"
 *                   to "Latest published", 6 items. Only `source` and `limit` change.
 *   STEP=delete     Permanently delete the 12 placeholders, by id.
 *
 * `delete` refuses to run unless every guard holds: both carousels already read "latest", each of
 * the 12 ids still carries its exact expected title, and at least 6 other published Insights exist
 * for the carousels to fall back on. Deletion goes through the local API one id at a time, so the
 * afterDelete revalidation hook fires for each and a failure part-way leaves a clear log of what
 * is already gone.
 *
 * The placeholders carry the newest `publishedAt` dates on the site (the seed dated them
 * "today minus N days"), so between the two steps "latest" still shows them — run `delete` straight
 * after `carousels`.
 *
 *   STEP=carousels DRY_RUN=true tsx scripts/with-env.ts .env.production tsx scripts/remove-dummy-insights.ts
 *   STEP=delete    DRY_RUN=true tsx scripts/with-env.ts .env.production tsx scripts/remove-dummy-insights.ts
 */
import 'dotenv/config'
import { getPayload, type Payload } from 'payload'
import config from '../payload.config.js'

const DRY_RUN = process.env.DRY_RUN === 'true'
const STEP = process.env.STEP

const DUMMY_INSIGHTS: ReadonlyArray<readonly [number, string]> = [
  [1, 'Add a strong recent AI or technology article'],
  [2, 'Add a strong strategic transformation article'],
  [3, 'Add a strong practical growth article'],
  [4, 'Add a strong data and analytics article'],
  [5, 'Add a strong cloud and platforms article'],
  [6, 'Add a strong customer experience article'],
  [7, 'AI and the changing technology landscape'],
  [8, 'Business transformation without the disruption'],
  [9, 'Turning technology into business growth'],
  [10, 'Designing digital experiences people actually use'],
  [11, "Building digital products for what's next"],
  [12, 'What good data discipline looks like'],
]
const DUMMY_IDS = DUMMY_INSIGHTS.map(([id]) => id)

const CAROUSELS = [
  { pageSlug: 'home', title: 'Think ahead.' },
  { pageSlug: 'services', title: "Ideas for what's next" },
] as const

type Loose = Record<string, unknown>

async function findCarousel(payload: Payload, target: (typeof CAROUSELS)[number]) {
  const found = await payload.find({
    collection: 'pages',
    where: { slug: { equals: target.pageSlug } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  const doc = found.docs[0] as (Loose & { id: number; layout: Loose[]; _status?: string }) | undefined
  if (!doc) throw new Error(`no page with slug "${target.pageSlug}"`)

  const matches = (doc.layout ?? [])
    .map((block, index) => ({ block, index }))
    .filter(({ block }) => block.blockType === 'insights-carousel' && block.title === target.title)
  if (matches.length !== 1) {
    throw new Error(`"${target.pageSlug}": expected exactly 1 "${target.title}" carousel, found ${matches.length}`)
  }
  return { doc, ...matches[0]! }
}

async function switchCarousels(payload: Payload): Promise<void> {
  for (const target of CAROUSELS) {
    const { doc, block, index } = await findCarousel(payload, target)
    console.log(`  · ${target.pageSlug} "${target.title}": source ${block.source} → latest, limit ${block.limit} → 6`)
    if (block.source === 'latest' && block.limit === 6) {
      console.log('      already set — nothing to do')
      continue
    }
    if (DRY_RUN) continue

    const newLayout = doc.layout.map((b, i) => (i === index ? { ...b, source: 'latest', limit: 6 } : b))
    await payload.update({
      collection: 'pages',
      id: doc.id,
      data: { layout: newLayout, _status: doc._status } as never,
      overrideAccess: true,
      draft: false,
    })
  }
}

async function deleteDummies(payload: Payload): Promise<void> {
  for (const target of CAROUSELS) {
    const { block } = await findCarousel(payload, target)
    if (block.source !== 'latest') {
      throw new Error(`"${target.pageSlug}" carousel is still "${block.source}" — run STEP=carousels first`)
    }
  }
  console.log('  ✓ both carousels read "latest"')

  const existing = await payload.find({
    collection: 'insights',
    where: { id: { in: DUMMY_IDS } },
    limit: 100,
    depth: 0,
    overrideAccess: true,
  })
  const byId = new Map(existing.docs.map((doc) => [doc.id as number, doc.title as string]))
  for (const [id, title] of DUMMY_INSIGHTS) {
    if (byId.has(id) && byId.get(id) !== title) {
      throw new Error(`insight ${id} is titled "${byId.get(id)}", expected "${title}" — refusing to delete`)
    }
  }
  const toDelete = DUMMY_INSIGHTS.filter(([id]) => byId.has(id))
  console.log(`  ✓ ${toDelete.length} of 12 placeholders present, all titles match`)

  const replacements = await payload.find({
    collection: 'insights',
    where: { and: [{ id: { not_in: DUMMY_IDS } }, { _status: { equals: 'published' } }] },
    sort: '-publishedAt',
    limit: 6,
    depth: 0,
    overrideAccess: true,
  })
  if (replacements.docs.length < 6) {
    throw new Error(`only ${replacements.docs.length} other published insights — carousels would come up short`)
  }
  console.log('  ✓ carousels will show:')
  for (const doc of replacements.docs) console.log(`      ${doc.id}  ${doc.title}`)

  for (const [id, title] of toDelete) {
    console.log(`  ${DRY_RUN ? 'would delete' : 'deleting'} ${id}  ${title}`)
    if (DRY_RUN) continue
    await payload.delete({ collection: 'insights', id, overrideAccess: true })
    console.log(`      deleted ${id}`)
  }
}

async function main() {
  const payload = await getPayload({ config })

  console.log(`\n  target: ${process.env.NEXT_PUBLIC_SERVER_URL}`)
  console.log(`  mode:   ${DRY_RUN ? 'DRY RUN — nothing will be written' : 'WRITE'}`)
  console.log(`  step:   ${STEP}\n`)

  if (STEP === 'carousels') await switchCarousels(payload)
  else if (STEP === 'delete') await deleteDummies(payload)
  else throw new Error('set STEP=carousels or STEP=delete')

  process.exit(0)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
