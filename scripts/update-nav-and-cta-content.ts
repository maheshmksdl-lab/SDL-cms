/**
 * A batch of small, independent content updates requested together:
 *
 *   1. Header "Company" dropdown: remove "Our approach" and "Careers", keep About + Clients.
 *   2. Footer "Insights" column: its 4 links were seed placeholders pointing at `#contact` —
 *      point them at the real `/insights?type=...` deep links, mirroring what the Header's own
 *      Insights dropdown already does correctly (see INSIGHTS_MENU_LINKS in src/seeds/design.ts).
 *   3. Every "Talk to ... expert" CTA across the Pages collection (hero and cta-banner blocks)
 *      currently anchors to the home page's inline contact section (`#contact` /
 *      `/#contact`) — repoint them at the dedicated `/contact-us` page instead.
 *
 * Deliberately NOT included: the Insights "Product" filter. Verified against live data first
 * (per the request) — the filter already counts live from each Insight's real `products`
 * relationships (web/components/insights/insights-explorer.tsx `countsFor()`), and the real
 * tally is CRM:14, Projects:12, Campaigns:9, Desk:7, Sync:7, Billing:6, Inventory:4, HRMS:2,
 * Practice Management:1, ServiceOps:1, CPQ:1, Skillberry:1 — not "ServiceOps:3, everything else
 * 0" as assumed. Changing anything here would replace correct, real counts with fabricated ones,
 * so nothing was touched.
 *
 *   pnpm update:nav-cta              against .env (local)
 *   pnpm update:nav-cta:prod         against .env.production
 *   DRY_RUN=true pnpm update:nav-cta:prod
 *
 * Safe to re-run: each step is idempotent — re-running after the dropdown items are already gone,
 * the footer links already fixed, or the CTAs already repointed is a no-op for that step.
 */
import 'dotenv/config'
import { getPayload, type Payload } from 'payload'
import config from '../payload.config.js'

const DRY_RUN = process.env.DRY_RUN === 'true'

type Loose = Record<string, unknown>

const INSIGHTS_LINKS: { label: string; url: string }[] = [
  { label: 'Blogs', url: '/insights?type=blog' },
  { label: 'Case studies', url: '/insights?type=case-study' },
  { label: 'Whitepapers', url: '/insights?type=whitepaper' },
  { label: 'Featured projects', url: '/insights?type=featured-project' },
]

async function updateHeaderCompanyDropdown(payload: Payload): Promise<void> {
  const header = await payload.findGlobal({ slug: 'header', depth: 0, overrideAccess: true })
  const menuItems = (header.menuItems ?? []) as Loose[]
  const company = menuItems.find((item) => item.key === 'company') as (Loose & { subItems?: Loose[] }) | undefined
  if (!company) {
    console.log('  ✗ Header: no "company" menu item found — skipping')
    return
  }

  const before = company.subItems ?? []
  const removed = before.filter((sub) => sub.title === 'Our approach' || sub.title === 'Careers')
  const after = before.filter((sub) => sub.title !== 'Our approach' && sub.title !== 'Careers')

  if (!removed.length) {
    console.log('  · Header Company dropdown: "Our approach" and "Careers" already absent — nothing to do')
    return
  }

  console.log(`  · Header Company dropdown: removing [${removed.map((r) => r.title).join(', ')}], keeping [${after.map((s) => s.title).join(', ')}]`)
  if (DRY_RUN) return

  const newMenuItems = menuItems.map((item) => (item.key === 'company' ? { ...item, subItems: after } : item))
  await payload.updateGlobal({ slug: 'header', data: { menuItems: newMenuItems } as never, overrideAccess: true })
}

async function updateFooterInsightsLinks(payload: Payload): Promise<void> {
  const footer = await payload.findGlobal({ slug: 'footer', depth: 0, overrideAccess: true })
  const columns = (footer.columns ?? []) as Loose[]
  const insightsCol = columns.find((col) => col.title === 'Insights') as (Loose & { links?: Loose[] }) | undefined
  if (!insightsCol) {
    console.log('  ✗ Footer: no "Insights" column found — skipping')
    return
  }

  const currentLinks = insightsCol.links ?? []
  const alreadyCorrect =
    currentLinks.length === INSIGHTS_LINKS.length &&
    INSIGHTS_LINKS.every((want, i) => {
      const link = currentLinks[i]?.link as Loose | undefined
      return link?.label === want.label && link?.type === 'external' && link?.url === want.url
    })
  if (alreadyCorrect) {
    console.log('  · Footer Insights links: already correct — nothing to do')
    return
  }

  console.log('  · Footer Insights links: repointing 4 links from #contact to real /insights?type=... routes')
  for (const l of INSIGHTS_LINKS) console.log(`      "${l.label}" -> ${l.url}`)
  if (DRY_RUN) return

  const newLinks = currentLinks.map((entry, i) => {
    const want = INSIGHTS_LINKS[i]
    if (!want) return entry
    return { ...entry, link: { label: want.label, type: 'external', url: want.url, newTab: false } }
  })
  const newColumns = columns.map((col) => (col.title === 'Insights' ? { ...col, links: newLinks } : col))
  await payload.updateGlobal({ slug: 'footer', data: { columns: newColumns } as never, overrideAccess: true })
}

const TALK_TO_EXPERT_RE = /^Talk to .*expert\.?$/i

/** Recursively finds every object shaped like a linkField group whose label matches
 * "Talk to ... expert" anywhere inside a page's `layout` blocks. */
function findTalkToExpertLinks(node: unknown, out: Loose[]): void {
  if (!node || typeof node !== 'object') return
  if (Array.isArray(node)) {
    for (const item of node) findTalkToExpertLinks(item, out)
    return
  }
  const obj = node as Loose
  if (typeof obj.label === 'string' && TALK_TO_EXPERT_RE.test(obj.label) && 'type' in obj) {
    out.push(obj)
  }
  for (const value of Object.values(obj)) findTalkToExpertLinks(value, out)
}

async function redirectTalkToExpertCtas(payload: Payload): Promise<number> {
  const contactUs = await payload.find({
    collection: 'pages',
    where: { pathname: { equals: '/contact-us' } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  const contactUsId = (contactUs.docs[0] as { id: number } | undefined)?.id
  if (!contactUsId) {
    console.log('  ✗ No /contact-us page found — cannot redirect CTAs, skipping')
    return 0
  }

  const pages = await payload.find({ collection: 'pages', limit: 100, depth: 0, overrideAccess: true })
  let totalUpdated = 0

  for (const doc of pages.docs as unknown as (Loose & { id: number; pathname?: string; layout?: Loose[]; _status?: string })[]) {
    const matches: Loose[] = []
    findTalkToExpertLinks(doc.layout, matches)
    const toChange = matches.filter((m) => !(m.type === 'internal' && m.page === contactUsId))
    if (!toChange.length) continue

    console.log(`  · ${doc.pathname ?? doc.id}: ${toChange.length} CTA(s) -> /contact-us`)
    for (const m of toChange) console.log(`      "${m.label}" (was type=${m.type})`)

    if (DRY_RUN) {
      totalUpdated += toChange.length
      continue
    }

    for (const m of toChange) {
      m.type = 'internal'
      m.page = contactUsId
      m.url = null
      m.anchor = null
    }
    await payload.update({
      collection: 'pages',
      id: doc.id,
      data: { layout: doc.layout, _status: doc._status } as never,
      overrideAccess: true,
      draft: false,
    })
    totalUpdated += toChange.length
  }

  return totalUpdated
}

async function main() {
  const payload = await getPayload({ config })

  console.log(`\n  target: ${process.env.NEXT_PUBLIC_SERVER_URL}`)
  console.log(`  mode:   ${DRY_RUN ? 'DRY RUN — nothing will be written' : 'WRITE'}\n`)

  console.log('-- 1. Header Company dropdown --')
  await updateHeaderCompanyDropdown(payload)

  console.log('\n-- 2. Footer Insights links --')
  await updateFooterInsightsLinks(payload)

  console.log('\n-- 3. "Talk to ... expert" CTAs -> /contact-us --')
  const ctaCount = await redirectTalkToExpertCtas(payload)
  console.log(`\n  ${DRY_RUN ? 'would update' : 'updated'} ${ctaCount} CTA(s) total\n`)

  process.exit(0)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
