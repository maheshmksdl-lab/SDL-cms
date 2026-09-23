/**
 * One-time content migration: brings Blog / Case study / Whitepaper Insights across from the
 * live legacy site (www.socialdnalabs.com) into this CMS, per SDL_Master_Website_Migration_Audit.xlsx
 * ("Master URL Audit" tab, rows 38+, "Target architecture" column). Rows marked "Delete / 410"
 * were excluded before this script was written — see scripts/migrate-insights-data/manifest.json.
 * "Insights / Featured products" does not appear anywhere in that column, so nothing was migrated
 * under `kind: 'featured-project'`; there was nothing to migrate.
 *
 * Content was scraped, converted to Lexical JSON, and downloaded to
 * scripts/migrate-insights-data/{manifest.json,images/} by a separate one-off Node pipeline (not
 * checked in — see the migration notes in the PR/commit this script shipped with). This script
 * only does the CMS-side write: upload media, upsert the `insights` docs, and derive
 * services/products/tags from `category` using the exact same mapping
 * scripts/assign-insight-facets.ts uses, so this content is tagged identically to everything else
 * in the collection. `category` itself is the one per-article editorial judgement call — see
 * CATEGORY_BY_SLUG below; it's a one-click change in the admin afterwards, like KIND_BY_SLUG in
 * assign-insight-facets.ts.
 *
 *   pnpm migrate:insights              against .env (local)
 *   pnpm migrate:insights:prod         against .env.production
 *   DRY_RUN=true pnpm migrate:insights:prod
 *
 * Safe to re-run: media is looked up by filename before upload (never re-uploaded), and insights
 * are upserted by slug (existing docs are updated in place, not duplicated).
 *
 * Run `pnpm check:media` afterward to confirm every thumbnail/inline image is actually reachable.
 */
import 'dotenv/config'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { getPayload, type Payload } from 'payload'
import config from '../payload.config.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DATA_DIR = path.join(__dirname, 'migrate-insights-data')
const MANIFEST_PATH = path.join(DATA_DIR, 'manifest.json')
const IMAGES_DIR = path.join(DATA_DIR, 'images')

const DRY_RUN = process.env.DRY_RUN === 'true'

const MIME_BY_EXT: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
}

type Loose = Record<string, unknown>

type ManifestItem = {
  kind: 'blog' | 'case-study' | 'whitepaper'
  sourceUrl: string
  slug: string
  title: string
  excerpt: string
  publishedAt: string | null
  author: string | null
  wpCategories: string[]
  featuredImage: { localFile: string; sourceUrl: string } | null
  bodyLexical: { root: { children: unknown[] } }
  warnings?: string[]
  error?: string
}

/** The one editorial call this migration makes per article — everything else (services, products,
 * tags) is derived from it below, exactly as scripts/assign-insight-facets.ts derives them for the
 * rest of the collection. Reviewed against each article's actual subject matter; change freely in
 * the admin afterwards. */
const CATEGORY_BY_SLUG: Record<string, string> = {
  'business-intelligence-analytics-solution-for-hospitality': 'Data / Analytics',
  'reports-for-drawing-forecast-and-other-analytical-data': 'Data / Analytics',
  'creating-a-learning-management-system-with-different-custom-modules': 'Digital Engineering',
  'revamping-user-interface-with-an-interactive-template': 'Digital Experience',
  'modernizing-complaint-management-for-uaes-leading-insurance-provider': 'Business / Transformation',
  'empowering-smart-living-designing-and-implementing-a-seamless-iot-application-for-interactive-home-devices':
    'Digital Engineering',
  'optimizing-inventory-management-and-driving-profitability-for-a-leading-u-s-architectural-metals-business':
    'Business / Transformation',
  'enhancing-customer-interaction-and-operational-efficiency-with-odoo-based-crm-solutions-in-dubai':
    'Customer Experience',
  'online-display-of-pharmaceutical-products': 'Digital Experience',
  'achieving-higher-brand-sales-and-top-ranking-with-organic-paid-digital-marketing': 'Growth / Digital',
  'field-service-mobile-application-for-solar-energy-products-and-water-purification-business':
    'Digital Engineering',

  'the-advent-of-iot-in-the-health-care-industry': 'AI / Technology',
  'chatbots-are-improving-e-commerce-experience': 'AI / Technology',

  'how-design-thinking-can-reach-product-development-breakthroughs-with-agile': 'Digital Experience',
  'next-js-vs-nuxt-js-vs-nest-js': 'Digital Engineering',
  'diversification-and-convergence-strategies-for-digitalization': 'Business / Transformation',
  'field-service-operation-challenges-and-solutions': 'Business / Transformation',
  'e-commerce-guide': 'Growth / Digital',
  'what-is-preventive-maintenance-everything-one-needs-to-know': 'Digital Engineering',
  'laravel-definitive-guide': 'Digital Engineering',
  'react-native-for-cross-mobile-app-development': 'Digital Engineering',
  'why-react-framework': 'Digital Engineering',
  'find-balance-seo-creative-website-design': 'Growth / Digital',
  'empowering-businesses-react-js-framework': 'Digital Engineering',
  'improve-ecommerce-business-with-digital-marketing-services': 'Growth / Digital',
  'how-digital-marketing-can-grow-your-business-effectively': 'Growth / Digital',
  'wooing-with-woocommerce-for-solving-ecommerce-woes': 'Digital Engineering',
  'omnichannel-marketing-services-ecommerce-industry': 'Growth / Digital',
  'is-it-time-to-redesign-your-website': 'Digital Experience',
  'how-to-set-up-an-ecommerce-website-for-instant-conversions': 'Growth / Digital',
  'strategic-cloud-adoption-for-answering-current-future-workloads': 'Cloud / Platforms',
  'ai-in-ecommerce': 'AI / Technology',
  'how-to-choose-the-best-digital-transformation-agency': 'Business / Transformation',
}

/** Mirrors scripts/assign-insight-facets.ts exactly, so this content is tagged the same way the
 * rest of the collection is. Keep these two tables in sync if that script's tables change. */
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

async function uploadLocalAsset(payload: Payload, relativeFile: string, alt: string): Promise<number | undefined> {
  const filename = path.basename(relativeFile)

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

  const sourcePath = path.join(IMAGES_DIR, relativeFile)
  if (!fs.existsSync(sourcePath)) {
    console.warn(`    ! missing local image file, skipping: ${sourcePath}`)
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

/** Walks a Lexical tree and replaces our scraper's `{ __localFile }` upload placeholders with
 * real uploaded media ids. */
async function resolveInlineUploads(payload: Payload, nodes: Loose[] | undefined): Promise<void> {
  for (const n of nodes ?? []) {
    if (n.type === 'upload' && n.value && typeof n.value === 'object' && '__localFile' in (n.value as Loose)) {
      const localFile = (n.value as { __localFile: string }).__localFile
      const alt = path.basename(localFile).replace(/[-_]/g, ' ').replace(/\.[a-z0-9]+$/i, '')
      const id = await uploadLocalAsset(payload, localFile, alt)
      n.value = id ?? null
    }
    if (Array.isArray(n.children)) await resolveInlineUploads(payload, n.children as Loose[])
  }
}

function pruneUnresolvedUploads(nodes: Loose[] | undefined): Loose[] {
  const out: Loose[] = []
  for (const n of nodes ?? []) {
    if (n.type === 'upload' && n.value == null) continue
    if (Array.isArray(n.children)) n.children = pruneUnresolvedUploads(n.children as Loose[])
    out.push(n)
  }
  return out
}

function estimateReadTime(nodes: Loose[]): string {
  let words = 0
  const walk = (list: Loose[] | undefined) => {
    for (const n of list ?? []) {
      if (n.type === 'text' && typeof n.text === 'string') words += n.text.trim().split(/\s+/).filter(Boolean).length
      if (Array.isArray(n.children)) walk(n.children as Loose[])
    }
  }
  walk(nodes)
  const minutes = Math.max(1, Math.round(words / 200))
  return `${minutes} min read`
}

async function findOrCreateCategory(
  payload: Payload,
  label: string,
  cache: Map<string, number>,
  nextOrder: { value: number },
): Promise<number> {
  const cached = cache.get(label)
  if (cached) return cached

  const catSlug = label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

  const existing = await payload.find({
    collection: 'insight-categories',
    where: { slug: { equals: catSlug } },
    limit: 1,
    overrideAccess: true,
  })
  if (existing.docs[0]) {
    const id = (existing.docs[0] as { id: number }).id
    cache.set(label, id)
    return id
  }

  if (DRY_RUN) {
    console.log(`    would create category: ${label}`)
    return -1
  }
  const created = await payload.create({
    collection: 'insight-categories',
    data: { label, slug: catSlug, order: nextOrder.value },
    overrideAccess: true,
  })
  nextOrder.value += 10
  const id = created.id as number
  cache.set(label, id)
  return id
}

async function upsertInsight(payload: Payload, slug: string, data: Loose): Promise<'created' | 'updated'> {
  const existing = await payload.find({
    collection: 'insights',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  const first = existing.docs[0] as { id: number } | undefined

  if (DRY_RUN) return first ? 'updated' : 'created'

  if (first) {
    await payload.update({
      collection: 'insights',
      id: first.id,
      data: { ...data, _status: 'published' } as never,
      overrideAccess: true,
      draft: false,
    })
    return 'updated'
  }
  await payload.create({
    collection: 'insights',
    data: { ...data, slug, _status: 'published' } as never,
    overrideAccess: true,
    draft: false,
  })
  return 'created'
}

async function main() {
  const payload = await getPayload({ config })

  console.log(`\n  target: ${process.env.NEXT_PUBLIC_SERVER_URL}`)
  console.log(`  mode:   ${DRY_RUN ? 'DRY RUN — nothing will be written' : 'WRITE'}\n`)

  const manifest: ManifestItem[] = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'))

  const [serviceDocs, productDocs] = await Promise.all([
    payload.find({ collection: 'services', limit: 50, depth: 0, overrideAccess: true }),
    payload.find({ collection: 'products', limit: 50, depth: 0, overrideAccess: true }),
  ])
  const serviceIdByTitle = new Map(
    (serviceDocs.docs as { id: number; title: string }[]).map((s) => [s.title, s.id]),
  )
  const productIdByLabel = new Map(
    (productDocs.docs as { id: number; label: string }[]).map((p) => [p.label, p.id]),
  )

  const existingCats = await payload.find({ collection: 'insight-categories', limit: 100, overrideAccess: true })
  const catCache = new Map<string, number>(
    (existingCats.docs as { id: number; label: string }[]).map((c) => [c.label, c.id]),
  )
  const nextOrder = { value: (existingCats.totalDocs + 1) * 10 }

  let created = 0
  let updated = 0
  let skipped = 0

  for (const item of manifest) {
    if (item.error || !item.title || !item.slug) {
      console.log(`  ✗ skipping ${item.sourceUrl} (${item.error ?? 'no title/slug extracted'})`)
      skipped += 1
      continue
    }

    const categoryLabel = CATEGORY_BY_SLUG[item.slug]
    if (!categoryLabel) {
      console.log(`  ✗ skipping ${item.slug} — no CATEGORY_BY_SLUG entry`)
      skipped += 1
      continue
    }

    console.log(`  · ${item.slug} [${item.kind}] -> ${categoryLabel}`)

    const categoryId = await findOrCreateCategory(payload, categoryLabel, catCache, nextOrder)

    const thumbnailId = item.featuredImage
      ? await uploadLocalAsset(payload, item.featuredImage.localFile, item.title)
      : undefined

    await resolveInlineUploads(payload, item.bodyLexical.root.children as Loose[])
    item.bodyLexical.root.children = pruneUnresolvedUploads(item.bodyLexical.root.children as Loose[])

    const services = (SERVICES_BY_CATEGORY[categoryLabel] ?? [])
      .map((title) => serviceIdByTitle.get(title))
      .filter((id): id is number => typeof id === 'number')
    const products = (PRODUCTS_BY_CATEGORY[categoryLabel] ?? [])
      .map((label) => productIdByLabel.get(label))
      .filter((id): id is number => typeof id === 'number')
    const tags = [categoryLabel, ...(SERVICES_BY_CATEGORY[categoryLabel] ?? [])].filter(Boolean)

    const data: Loose = {
      title: item.title,
      excerpt: item.excerpt || undefined,
      body: item.bodyLexical,
      kind: item.kind,
      category: categoryId > 0 ? categoryId : undefined,
      readTime: estimateReadTime(item.bodyLexical.root.children as Loose[]),
      author: item.author ?? 'Social DNA Labs',
      ...(thumbnailId ? { thumbnail: thumbnailId } : {}),
      services,
      products,
      tags,
      featured: false,
      publishedAt: item.publishedAt ?? undefined,
      seo: {
        title: item.title,
        description: item.excerpt || undefined,
        ...(thumbnailId ? { image: thumbnailId } : {}),
      },
    }

    const result = await upsertInsight(payload, item.slug, data)
    if (result === 'created') created += 1
    else updated += 1

    if (item.warnings?.length) {
      for (const w of item.warnings) console.log(`      ! ${w}`)
    }
  }

  console.log(
    `\n  ${DRY_RUN ? 'would create' : 'created'}: ${created}   ${DRY_RUN ? 'would update' : 'updated'}: ${updated}   skipped: ${skipped}\n`,
  )
  process.exit(0)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
