/**
 * One-time content update: rewrites the hero title/description on the five Services detail
 * pages (Digital engineering, Business transformation, Digital experience, Growth
 * transformation, AI transformation), per copy supplied directly by the user. Touches only the
 * `hero` block's `sub` (description) and `headingLines` (title) fields — nothing else on the
 * page, and no other block in `layout`, is modified.
 *
 * The hero title isn't a single text field: it's `headingLines`, an array of lines each with a
 * plain `before` and a styled `accent` segment (rendered as two stacked <div> rows, the second
 * highlighted — see web/components/ui/primitives.tsx's AccentLines). Every existing hero on this
 * site follows the same 2-line shape: line 1 is plain (`before` only), line 2 is the accent
 * (`accent` only). The user supplied each title as a single plain sentence, so each one below is
 * split across those two lines at a natural clause break, preserving the exact wording given —
 * only the line break placement is an editorial choice, easily changed in the admin.
 *
 *   pnpm update:service-hero              against .env (local)
 *   pnpm update:service-hero:prod         against .env.production
 *   DRY_RUN=true pnpm update:service-hero:prod
 *
 * Safe to re-run: idempotent (always sets the same target values), and every other field/block on
 * each page is round-tripped unchanged. `_status` is echoed back explicitly so this can't
 * accidentally publish a draft or unpublish a live page.
 */
import 'dotenv/config'
import { getPayload, type Payload } from 'payload'
import config from '../payload.config.js'

const DRY_RUN = process.env.DRY_RUN === 'true'

const UPDATES: {
  slug: string
  sub: string
  line1: string
  line2: string
}[] = [
  {
    slug: 'digital-engineering',
    sub: 'Design, develop and modernize applications and platforms with modern architecture, AI-accelerated engineering and the expertise to evolve with your business.',
    line1: 'Transform technology',
    line2: 'into digital advantage.',
  },
  {
    slug: 'business-transformation',
    sub: 'Modernize processes and business capabilities to improve efficiency, increase agility and create a stronger foundation for growth.',
    line1: 'Simplify complexity.',
    line2: 'Strengthen the business.',
  },
  {
    slug: 'digital-experience',
    sub: 'Design intuitive digital experiences around how people think, interact and get things done, making every journey clearer, simpler and more effective.',
    line1: 'Make every digital interaction',
    line2: 'count.',
  },
  {
    slug: 'growth-transformation',
    sub: 'Make every digital effort more targeted, measurable and effective, from discovery and engagement to conversion.',
    line1: 'Precision. Performance.',
    line2: 'Growth.',
  },
  {
    slug: 'ai-transformation',
    sub: 'Activate intelligence across the business to uncover opportunities, strengthen decisions, automate processes and improve how work gets done.',
    line1: 'Turn intelligence',
    line2: 'into action.',
  },
]

type Loose = Record<string, unknown>

async function updatePage(payload: Payload, update: (typeof UPDATES)[number]): Promise<'updated' | 'skipped'> {
  const found = await payload.find({
    collection: 'pages',
    where: { slug: { equals: update.slug } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  const doc = found.docs[0] as (Loose & { id: number; layout: Loose[]; _status?: string }) | undefined
  if (!doc) {
    console.log(`  ✗ no page found for slug "${update.slug}"`)
    return 'skipped'
  }

  const layout = doc.layout ?? []
  const heroIndex = layout.findIndex((block) => block.blockType === 'hero')
  if (heroIndex === -1) {
    console.log(`  ✗ "${update.slug}" has no hero block`)
    return 'skipped'
  }

  const hero = layout[heroIndex] as Loose & { headingLines?: Loose[] }
  const existingLines = hero.headingLines ?? []

  const newHeadingLines = [
    { ...(existingLines[0] ?? {}), before: update.line1, accent: null, after: null },
    { ...(existingLines[1] ?? {}), before: null, accent: update.line2, after: null },
  ]

  console.log(`  · ${update.slug} (page ${doc.id})`)
  console.log(`      title: "${update.line1}" / "${update.line2}"`)
  console.log(`      description: "${update.sub}"`)

  if (DRY_RUN) return 'updated'

  const newLayout = layout.map((block, i) => (i === heroIndex ? { ...block, sub: update.sub, headingLines: newHeadingLines } : block))

  await payload.update({
    collection: 'pages',
    id: doc.id,
    data: { layout: newLayout, _status: doc._status } as never,
    overrideAccess: true,
    draft: false,
  })
  return 'updated'
}

async function main() {
  const payload = await getPayload({ config })

  console.log(`\n  target: ${process.env.NEXT_PUBLIC_SERVER_URL}`)
  console.log(`  mode:   ${DRY_RUN ? 'DRY RUN — nothing will be written' : 'WRITE'}\n`)

  let updated = 0
  let skipped = 0
  for (const update of UPDATES) {
    const result = await updatePage(payload, update)
    if (result === 'updated') updated += 1
    else skipped += 1
  }

  console.log(`\n  ${DRY_RUN ? 'would update' : 'updated'}: ${updated}   skipped: ${skipped}\n`)
  process.exit(0)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
