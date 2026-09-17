/**
 * Points the header's Insights menu at the insights index.
 *
 *   pnpm link:nav               against .env (local)
 *   pnpm link:nav:prod          against .env.production
 *   DRY_RUN=true pnpm link:nav:prod
 *
 * seedHeader does this too, but a full seed re-upserts every page, global and article on the way
 * past. This rewrites the `link` on ONE menu item, its four sub-items and its CTA, and leaves
 * every other menu — and everything else in the header — exactly as it was.
 *
 * The menu was seeded when no insights page existed, so all six entries pointed at
 * `anchor: contact`: a nav that named four content types and delivered a jump to the contact
 * form. `/insights` is a route rather than a Page document, so these are `external` links with a
 * root-relative url — the same shape the contact CTAs use, which `resolveLink` passes straight
 * through as an href.
 */
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config.js'

const DRY_RUN = process.env.DRY_RUN === 'true'

const MENU_KEY = 'insights'
const INDEX_URL = '/insights'

/** Sub-item title → the filtered view it should open. Titles are matched case-insensitively. */
const SUBITEM_URLS: Record<string, string> = {
  blogs: '/insights?type=blog',
  'case studies': '/insights?type=case-study',
  whitepapers: '/insights?type=whitepaper',
  'white papers': '/insights?type=whitepaper',
  'featured projects': '/insights?type=featured-project',
}

type LinkValue = {
  label?: string | null
  type?: string | null
  url?: string | null
  anchor?: string | null
  page?: unknown
  newTab?: boolean | null
}

function routeLink(label: string, url: string): LinkValue {
  // Every other field is cleared: a link left with both a `page` and a `url` is ambiguous, and
  // which one wins is an implementation detail of resolveLink rather than something to rely on.
  return { label, type: 'external', url, newTab: false, page: null, anchor: null }
}

function describe(link?: LinkValue | null): string {
  if (!link) return 'none'
  if (link.type === 'external') return `external:${link.url}`
  if (link.type === 'anchor') return `anchor:${link.anchor}`
  if (link.type === 'internal') return `page:${JSON.stringify(link.page)}`
  return String(link.type)
}

async function main() {
  const payload = await getPayload({ config })

  console.log(`\n  target: ${process.env.NEXT_PUBLIC_SERVER_URL}`)
  console.log(`  mode:   ${DRY_RUN ? 'DRY RUN — nothing will be written' : 'WRITE'}\n`)

  const header = (await payload.findGlobal({
    slug: 'header',
    depth: 0,
    overrideAccess: true,
  })) as { menuItems?: { key?: string | null; label?: string | null }[] }

  const menuItems = Array.isArray(header.menuItems) ? header.menuItems : []
  const target = menuItems.find(
    (item) => String(item.key ?? '').toLowerCase() === MENU_KEY,
  ) as (Record<string, unknown> & { subItems?: Record<string, unknown>[] }) | undefined

  if (!target) {
    console.error(`  ✗ no menu item with key "${MENU_KEY}" — header left untouched\n`)
    process.exit(1)
  }

  const label = String(target.label ?? 'Insights')
  console.log(`  menu "${label}"`)
  console.log(`    link: ${describe(target.link as LinkValue)} -> external:${INDEX_URL}`)

  const nextSubItems = (target.subItems ?? []).map((sub) => {
    const title = String(sub.title ?? '')
    const url = SUBITEM_URLS[title.toLowerCase()]
    if (!url) {
      console.log(`    - ${title}: no mapping — left as ${describe(sub.link as LinkValue)}`)
      return sub
    }
    console.log(`    - ${title}: ${describe(sub.link as LinkValue)} -> external:${url}`)
    return { ...sub, link: routeLink(title, url) }
  })

  const cta = target.submenuCTA as LinkValue | undefined
  const ctaLabel = String(cta?.label ?? 'Explore insights')
  if (cta) console.log(`    CTA "${ctaLabel}": ${describe(cta)} -> external:${INDEX_URL}`)

  if (DRY_RUN) {
    console.log('\n  dry run — nothing written\n')
    process.exit(0)
  }

  // Only the Insights entry is rebuilt; every other menu item is written back byte-for-byte.
  const updatedMenuItems = menuItems.map((item) =>
    String(item.key ?? '').toLowerCase() === MENU_KEY
      ? {
          ...target,
          link: routeLink(label, INDEX_URL),
          subItems: nextSubItems,
          ...(cta ? { submenuCTA: routeLink(ctaLabel, INDEX_URL) } : {}),
        }
      : item,
  )

  await payload.updateGlobal({
    slug: 'header',
    data: { menuItems: updatedMenuItems } as never,
    overrideAccess: true,
  })

  const after = (await payload.findGlobal({
    slug: 'header',
    depth: 0,
    overrideAccess: true,
  })) as { menuItems?: { key?: string | null; link?: LinkValue }[] }

  const check = (after.menuItems ?? []).find(
    (item) => String(item.key ?? '').toLowerCase() === MENU_KEY,
  )
  console.log(`\n  written. menu link is now: ${describe(check?.link)}\n`)
  process.exit(0)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
