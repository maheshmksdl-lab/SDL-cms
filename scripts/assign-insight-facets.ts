/**
 * Targeted facet backfill for an environment that is already live.
 *
 *   pnpm assign:facets              against .env (local)
 *   pnpm assign:facets:prod         against .env.production
 *   DRY_RUN=true pnpm assign:facets:prod    report only, write nothing
 *
 * `seed:prod` would do this too, but it re-upserts every page, global and article on the way
 * past, so it overwrites anything edited in the admin since the last run. This writes FOUR
 * fields on the insights collection — kind, services, products, tags — plus the products
 * taxonomy those relationships point at, and touches nothing else.
 *
 * Run it AFTER `migrate:prod`: the columns it writes do not exist until that migration lands.
 *
 * ── What it decides, and what is editorial ──
 *
 * `services`, `products` and `tags` are derived from each article's own CATEGORY, so the
 * mapping is a property of the taxonomy rather than of the order the articles happen to sit in.
 *
 * `kind` cannot be derived from anything — it is an editorial judgement about what a piece IS —
 * so it is listed per article below and is meant to be read and argued with. Every value is a
 * one-click change in the admin afterwards.
 */
import 'dotenv/config'
import { getPayload, type Payload } from 'payload'
import config from '../payload.config.js'

const DRY_RUN = process.env.DRY_RUN === 'true'

/** Category → the service pillars an article in it belongs under. */
const SERVICES_BY_CATEGORY: Record<string, string[]> = {
  'AI / Technology': ['AI transformation'],
  'Business / Transformation': ['Business transformation'],
  'Growth / Digital': ['Growth transformation'],
  'Data / Analytics': ['AI transformation', 'Digital engineering'],
  'Cloud / Platforms': ['Digital engineering', 'Products & platforms'],
  'Customer Experience': ['Digital experience'],
  'Digital Experience': ['Digital experience'],
  'Digital Engineering': ['Digital engineering'],
}

/** Category → the EVOQ modules a reader of that article would plausibly care about. */
const PRODUCTS_BY_CATEGORY: Record<string, string[]> = {
  'AI / Technology': ['Sync'],
  'Business / Transformation': ['CRM', 'Billing'],
  'Growth / Digital': ['CRM', 'Campaigns'],
  'Data / Analytics': ['Sync', 'Inventory'],
  'Cloud / Platforms': ['Sync', 'Projects'],
  'Customer Experience': ['Desk', 'CRM'],
  'Digital Experience': ['Desk'],
  'Digital Engineering': ['Projects'],
}

/**
 * Content type per article, by slug. Editorial — see the header.
 *
 * Spread so every facet returns something: a filter list where three of four options are
 * permanently (0) tells a visitor nothing and cannot be reviewed by anyone.
 */
const KIND_BY_SLUG: Record<string, string> = {
  'add-a-strong-recent-ai-or-technology-article': 'blog',
  'add-a-strong-strategic-transformation-article': 'case-study',
  'add-a-strong-practical-growth-article': 'blog',
  'add-a-strong-data-and-analytics-article': 'whitepaper',
  'add-a-strong-cloud-and-platforms-article': 'blog',
  'add-a-strong-customer-experience-article': 'featured-project',
  'ai-and-the-changing-technology-landscape': 'blog',
  'business-transformation-without-the-disruption': 'case-study',
  'turning-technology-into-business-growth': 'blog',
  'designing-digital-experiences-people-actually-use': 'whitepaper',
  'building-digital-products-for-what-s-next': 'featured-project',
  'what-good-data-discipline-looks-like': 'blog',
}

/** The EVOQ modules, as the products facet. Matches what seedProducts creates. */
const PRODUCTS: { label: string; slug: string; shortDesc: string }[] = [
  { label: 'CRM', slug: 'crm', shortDesc: 'Manage customer relationships, sales activities and opportunities in one place.' },
  { label: 'Campaigns', slug: 'campaigns', shortDesc: 'Plan and manage campaigns to engage customers and support growth.' },
  { label: 'Practice Management', slug: 'practice-management', shortDesc: 'Manage clients, engagements and billable work across your practice.' },
  { label: 'ServiceOps', slug: 'serviceops', shortDesc: 'Manage service requests, jobs, scheduling and field operations.' },
  { label: 'Desk', slug: 'desk', shortDesc: 'Manage customer support requests and help teams resolve issues.' },
  { label: 'Projects', slug: 'projects', shortDesc: 'Plan, manage and track projects, tasks and delivery.' },
  { label: 'Sync', slug: 'sync', shortDesc: 'Keep business data synchronized across the systems you use.' },
  { label: 'Inventory', slug: 'inventory', shortDesc: 'Manage inventory, stock movements and product operations.' },
  { label: 'CPQ', slug: 'cpq', shortDesc: 'Configure products, generate accurate quotes and control pricing.' },
  { label: 'Billing', slug: 'billing', shortDesc: 'Manage billing, invoices and financial workflows.' },
  { label: 'HRMS', slug: 'hrms', shortDesc: 'Manage employee information and core HR processes.' },
  { label: 'Skillberry', slug: 'skillberry', shortDesc: 'Manage learning, training and employee development.' },
]

async function ensureProducts(payload: Payload): Promise<Map<string, number>> {
  const byLabel = new Map<string, number>()

  for (const [index, product] of PRODUCTS.entries()) {
    const existing = await payload.find({
      collection: 'products',
      where: { slug: { equals: product.slug } },
      limit: 1,
      overrideAccess: true,
    })

    if (existing.docs[0]) {
      byLabel.set(product.label, (existing.docs[0] as { id: number }).id)
      continue
    }

    if (DRY_RUN) {
      console.log(`  would create product: ${product.label}`)
      continue
    }

    const created = await payload.create({
      collection: 'products',
      data: { ...product, order: (index + 1) * 10 },
      overrideAccess: true,
    })
    byLabel.set(product.label, (created as { id: number }).id)
    console.log(`  created product: ${product.label}`)
  }

  return byLabel
}

async function main() {
  const payload = await getPayload({ config })

  console.log(`\n  target: ${process.env.NEXT_PUBLIC_SERVER_URL}`)
  console.log(`  mode:   ${DRY_RUN ? 'DRY RUN — nothing will be written' : 'WRITE'}\n`)

  const productIds = await ensureProducts(payload)

  const serviceDocs = await payload.find({
    collection: 'services',
    limit: 100,
    depth: 0,
    overrideAccess: true,
  })
  const serviceIds = new Map(
    (serviceDocs.docs as { id: number; title: string }[]).map((s) => [s.title, s.id]),
  )

  const insights = await payload.find({
    collection: 'insights',
    limit: 500,
    depth: 1,
    overrideAccess: true,
  })

  console.log(`\n  ${insights.totalDocs} insight(s)\n`)

  let updated = 0
  let skipped = 0

  for (const doc of insights.docs) {
    const slug = String(doc.slug)
    const category =
      typeof doc.category === 'object' && doc.category ? String(doc.category.label ?? '') : ''

    const kind = KIND_BY_SLUG[slug] ?? doc.kind ?? 'blog'
    const services = (SERVICES_BY_CATEGORY[category] ?? [])
      .map((title) => serviceIds.get(title))
      .filter((id): id is number => typeof id === 'number')
    const products = (PRODUCTS_BY_CATEGORY[category] ?? [])
      .map((label) => productIds.get(label))
      .filter((id): id is number => typeof id === 'number')

    const serviceTitles = (SERVICES_BY_CATEGORY[category] ?? []).filter((title) =>
      serviceIds.has(title),
    )
    const tags = [category, ...serviceTitles].filter(Boolean)

    if (!services.length && !products.length && !KIND_BY_SLUG[slug]) {
      console.log(`  - ${slug}: no mapping for category "${category}" — left alone`)
      skipped += 1
      continue
    }

    console.log(`  · ${slug}`)
    console.log(`      kind=${kind}  services=[${serviceTitles.join(', ')}]`)
    console.log(`      products=[${(PRODUCTS_BY_CATEGORY[category] ?? []).join(', ')}]  tags=[${tags.join(', ')}]`)

    if (DRY_RUN) {
      updated += 1
      continue
    }

    await payload.update({
      collection: 'insights',
      id: doc.id,
      /*
       * Four fields, and `_status` echoed back exactly as found.
       *
       * The collection has drafts enabled, and an update that omits `_status` on a
       * drafts-enabled collection can change a document's published state. Passing the
       * current value back makes this update incapable of publishing a draft or
       * unpublishing a live article.
       */
      data: { kind, services, products, tags, _status: doc._status } as never,
      overrideAccess: true,
      draft: false,
    })
    updated += 1
  }

  console.log(
    `\n  ${DRY_RUN ? 'would update' : 'updated'}: ${updated}   left alone: ${skipped}\n`,
  )
  process.exit(0)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
