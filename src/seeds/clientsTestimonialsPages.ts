import type { Payload } from 'payload'

/**
 * The Clients and Testimonials pages, and every link that should point at them.
 *
 * Mirrors src/seeds/contactPage.ts: the pages are CREATED if missing and otherwise left exactly
 * as an editor left them; the header's "Clients" submenu item, the footer's "Clients" link and
 * the home page's "View all clients" / "View all testimonials" CTAs are the things rewritten on
 * every run — before this seed, all four pointed at the home page's contact section (`#contact`),
 * which is the "wrong destination" the task calls out. Only those specific fields are touched;
 * everything else on every page and global is kept.
 *
 * Run by `pnpm seed` after the design seed and the Contact Us page (whose id the closing CTA
 * links to), and on its own by `pnpm add:clients-testimonials` for a database that already has
 * content.
 */

export const CLIENTS_PAGE_SLUG = 'clients'
export const TESTIMONIALS_PAGE_SLUG = 'testimonials'

const INTRO_TITLE = 'Our Clients & Testimonials'
const INTRO_SUB =
  "Trusted by innovative companies worldwide. Discover how we've helped businesses transform their digital presence and achieve remarkable growth."

const SUCCESS_CTA_TITLE = 'Ready to Join Our Success Stories?'
const SUCCESS_CTA_SUB =
  "Let's discuss how we can help transform your business with innovative digital solutions."

const sectionSettings = { hidden: false, background: 'default', spacing: 'default', reveal: true }

type Options = { dryRun?: boolean }

async function findId(
  payload: Payload,
  collection: 'pages',
  slug: string,
): Promise<number | undefined> {
  const result = await payload.find({
    collection,
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  return (result.docs[0] as { id: number } | undefined)?.id
}

const internalLink = (pageId: number | undefined, label?: string) => ({
  ...(label ? { label } : {}),
  type: 'internal',
  page: pageId ?? null,
  url: null,
  anchor: null,
})

const pageIntroBlock = () => ({
  blockType: 'page-intro',
  title: INTRO_TITLE,
  sub: INTRO_SUB,
  settings: sectionSettings,
})

const successCtaBlock = (contactPageId: number | undefined) => ({
  blockType: 'success-cta',
  title: SUCCESS_CTA_TITLE,
  sub: SUCCESS_CTA_SUB,
  cta: internalLink(contactPageId, 'Start Your Project'),
  settings: sectionSettings,
})

async function ensureClientsPage(
  payload: Payload,
  contactPageId: number | undefined,
  { dryRun }: Options,
): Promise<number | undefined> {
  const existing = await findId(payload, 'pages', CLIENTS_PAGE_SLUG)
  if (existing) {
    payload.logger.info(`pages: "${CLIENTS_PAGE_SLUG}" exists — left as it is`)
    return existing
  }
  if (dryRun) {
    payload.logger.info(`pages: would create "${CLIENTS_PAGE_SLUG}"`)
    return undefined
  }

  const created = await payload.create({
    collection: 'pages',
    data: {
      title: 'Clients',
      slug: CLIENTS_PAGE_SLUG,
      template: 'service',
      _status: 'published',
      layout: [
        pageIntroBlock(),
        {
          blockType: 'clients-grid',
          title: 'Trusted by Industry Leaders',
          source: 'auto',
          featuredOnly: false,
          limit: 100,
          settings: sectionSettings,
        },
        successCtaBlock(contactPageId),
      ],
      seo: {
        title: 'Our Clients',
        description:
          'The businesses Social DNA Labs works with — trusted by innovative companies worldwide.',
      },
    } as never,
    overrideAccess: true,
    draft: false,
  })
  payload.logger.info(`pages: "${CLIENTS_PAGE_SLUG}" created`)
  return created.id as number
}

async function ensureTestimonialsPage(
  payload: Payload,
  contactPageId: number | undefined,
  { dryRun }: Options,
): Promise<number | undefined> {
  const existing = await findId(payload, 'pages', TESTIMONIALS_PAGE_SLUG)
  if (existing) {
    payload.logger.info(`pages: "${TESTIMONIALS_PAGE_SLUG}" exists — left as it is`)
    return existing
  }
  if (dryRun) {
    payload.logger.info(`pages: would create "${TESTIMONIALS_PAGE_SLUG}"`)
    return undefined
  }

  const created = await payload.create({
    collection: 'pages',
    data: {
      title: 'Testimonials',
      slug: TESTIMONIALS_PAGE_SLUG,
      template: 'service',
      _status: 'published',
      layout: [
        pageIntroBlock(),
        {
          blockType: 'testimonials-grid',
          title: 'What Our Clients Say',
          sub: 'Real stories from real clients who have experienced the Social DNA Labs difference.',
          source: 'auto',
          featuredOnly: false,
          limit: 100,
          settings: sectionSettings,
        },
        successCtaBlock(contactPageId),
      ],
      seo: {
        title: 'Client Testimonials',
        description:
          'Real stories from real clients who have experienced the Social DNA Labs difference.',
      },
    } as never,
    overrideAccess: true,
    draft: false,
  })
  payload.logger.info(`pages: "${TESTIMONIALS_PAGE_SLUG}" created`)
  return created.id as number
}

type LayoutBlockLoose = { blockType?: string; [key: string]: unknown }

/**
 * Points every `clients-grid` / `testimonials-grid` block's tab switcher at the two pages.
 *
 * Runs on every seed, not just on first creation, because the switcher is page chrome (like the
 * footer's "Contact us" link) rather than editorial copy — see contactPage.ts's `linkFooter` for
 * the same reasoning. Only the two tab fields are touched; every other field on the block (title,
 * source, limit…) is read back and passed through unchanged.
 */
async function pointTabSwitcher(
  payload: Payload,
  pageId: number | undefined,
  clientsPageId: number | undefined,
  testimonialsPageId: number | undefined,
  { dryRun }: Options,
): Promise<void> {
  if (!pageId || (!clientsPageId && !testimonialsPageId)) return

  const page = (await payload.findByID({
    collection: 'pages',
    id: pageId,
    depth: 0,
    overrideAccess: true,
  })) as { layout?: LayoutBlockLoose[] }
  const layout = page.layout ?? []

  let matched = 0
  const next = layout.map((block) => {
    if (block.blockType !== 'clients-grid' && block.blockType !== 'testimonials-grid') return block
    matched += 1
    return {
      ...block,
      clientsTab: internalLink(clientsPageId),
      testimonialsTab: internalLink(testimonialsPageId),
    }
  })

  if (!matched) return
  if (dryRun) {
    payload.logger.info(`pages: would point the tab switcher on page ${pageId}`)
    return
  }
  await payload.update({ collection: 'pages', id: pageId, data: { layout: next } as never, overrideAccess: true })
}

/**
 * Repoints the home page's "View all clients" (Proof) and "View all testimonials" (Testimonials)
 * links at the two new pages. Both currently resolve to the home page's own `#contact` anchor —
 * the "incorrect .../#contact destination" the task calls out — because `src/seeds/design.ts`
 * seeds them before either page exists. Fixed here, after both ids are known, the same way
 * `contactPage.ts` fixes the footer's "Contact us" link after the Contact Us page is created.
 */
async function pointHomepageCtas(
  payload: Payload,
  clientsPageId: number | undefined,
  testimonialsPageId: number | undefined,
  { dryRun }: Options,
): Promise<void> {
  const homeId = await findId(payload, 'pages', 'home')
  if (!homeId) {
    payload.logger.warn('pages: "home" not found — home page CTAs left untouched')
    return
  }

  const home = (await payload.findByID({
    collection: 'pages',
    id: homeId,
    depth: 0,
    overrideAccess: true,
  })) as { layout?: LayoutBlockLoose[] }
  const layout = home.layout ?? []

  let matched = 0
  const next = layout.map((block) => {
    if (block.blockType === 'proof' && clientsPageId) {
      matched += 1
      return { ...block, clientsLink: internalLink(clientsPageId, 'View all clients') }
    }
    if (block.blockType === 'testimonials' && testimonialsPageId) {
      matched += 1
      return { ...block, cta: internalLink(testimonialsPageId, 'View all testimonials') }
    }
    return block
  })

  if (!matched) return
  if (dryRun) {
    payload.logger.info('pages: would point the home page’s Proof/Testimonials CTAs')
    return
  }
  await payload.update({ collection: 'pages', id: homeId, data: { layout: next } as never, overrideAccess: true })
  payload.logger.info(
    `pages: home page CTAs now open /${CLIENTS_PAGE_SLUG} and /${TESTIMONIALS_PAGE_SLUG}`,
  )
}

type HeaderSubItem = { title?: string | null; link?: unknown }
type HeaderMenuItem = { subItems?: HeaderSubItem[] | null }

/** Points the header's Company → "Clients" submenu item at the Clients page. */
async function linkHeaderClients(
  payload: Payload,
  clientsPageId: number | undefined,
  { dryRun }: Options,
): Promise<void> {
  if (!clientsPageId) return

  const header = (await payload.findGlobal({
    slug: 'header',
    depth: 0,
    overrideAccess: true,
  })) as { menuItems?: HeaderMenuItem[] | null }
  const menuItems = header.menuItems ?? []

  let matched = 0
  const next = menuItems.map((item) => ({
    ...item,
    subItems: (item.subItems ?? []).map((sub) => {
      if (String(sub.title ?? '').trim().toLowerCase() !== 'clients') return sub
      matched += 1
      return { ...sub, link: internalLink(clientsPageId) }
    }),
  }))

  if (!matched) {
    payload.logger.warn('header: no "Clients" submenu item found — left untouched')
    return
  }
  if (dryRun) {
    payload.logger.info(`header: would point "Clients" at /${CLIENTS_PAGE_SLUG}`)
    return
  }
  await payload.updateGlobal({ slug: 'header', data: { menuItems: next } as never, overrideAccess: true })
  payload.logger.info(`header: "Clients" now points at /${CLIENTS_PAGE_SLUG}`)
}

type FooterLink = {
  label?: string | null
  type?: string | null
  page?: unknown
  url?: string | null
  anchor?: string | null
  newTab?: boolean | null
}
type FooterColumn = { links?: { link?: FooterLink | null }[] | null }

/** Points the footer's "Clients" link at the Clients page. */
async function linkFooterClients(
  payload: Payload,
  clientsPageId: number | undefined,
  { dryRun }: Options,
): Promise<void> {
  if (!clientsPageId) return

  const footer = (await payload.findGlobal({
    slug: 'footer',
    depth: 0,
    overrideAccess: true,
  })) as { columns?: FooterColumn[] | null }
  const columns = footer.columns ?? []

  let matched = 0
  const next = columns.map((column) => ({
    ...column,
    links: (column.links ?? []).map((entry) => {
      const label = String(entry.link?.label ?? '').trim()
      if (label.toLowerCase() !== 'clients') return entry
      matched += 1
      return { ...entry, link: { ...internalLink(clientsPageId, label), newTab: false } }
    }),
  }))

  if (!matched) {
    payload.logger.warn('footer: no "Clients" link found — footer left untouched')
    return
  }
  if (dryRun) {
    payload.logger.info(`footer: would point "Clients" at /${CLIENTS_PAGE_SLUG}`)
    return
  }
  await payload.updateGlobal({ slug: 'footer', data: { columns: next } as never, overrideAccess: true })
  payload.logger.info(`footer: "Clients" link now opens /${CLIENTS_PAGE_SLUG}`)
}

export async function seedClientsTestimonialsPages(payload: Payload, options: Options = {}): Promise<void> {
  const contactPageId = await findId(payload, 'pages', 'contact-us')

  const clientsPageId = await ensureClientsPage(payload, contactPageId, options)
  const testimonialsPageId = await ensureTestimonialsPage(payload, contactPageId, options)

  await pointTabSwitcher(payload, clientsPageId, clientsPageId, testimonialsPageId, options)
  await pointTabSwitcher(payload, testimonialsPageId, clientsPageId, testimonialsPageId, options)

  await pointHomepageCtas(payload, clientsPageId, testimonialsPageId, options)
  await linkHeaderClients(payload, clientsPageId, options)
  await linkFooterClients(payload, clientsPageId, options)
}
