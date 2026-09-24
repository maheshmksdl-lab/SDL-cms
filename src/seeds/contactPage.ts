import type { Payload } from 'payload'

/**
 * The Contact Us page: its enquiry form, the page itself, and the footer's "Contact us" link.
 *
 * Idempotent, and careful with content an editor may already have changed:
 *   - the form and the page are CREATED if missing and otherwise left as they are — the page's
 *     copy and the form's fields are the CMS's to own once they exist. The one exception: form
 *     fields still holding an earlier seed's exact values are upgraded (see SUPERSEDED_FIELDS)
 *   - the footer is the one thing rewritten on every run, and only the `link` of the entries
 *     labelled "Contact us"; every other column, link and setting is kept
 *
 * Run by `pnpm seed` after the design seed (which re-seeds the footer's links to `#contact`),
 * and on its own by `pnpm add:contact` for a database that already has content.
 */

export const CONTACT_PAGE_SLUG = 'contact-us'
export const CONTACT_FORM_SLUG = 'contact-us'

/** Footer entries that should open the Contact Us page, matched case-insensitively. */
const FOOTER_LABELS = ['contact us', 'contact']

const CONTACT_US_FORM = {
  name: 'Contact Us',
  cardTitle: 'Get in touch',
  submitLabel: 'Submit',
  success: {
    title: 'Thank you — your enquiry has been received.',
    body: 'Someone from our team will get back to you shortly.',
  },
  /*
   * Labels, placeholders and required-ness follow the "Let's talk" reference design. The popup
   * (LetsTalkModal) and this page's embedded form both render this one Form document.
   */
  fields: [
    { label: 'Name', name: 'name', type: 'text', placeholder: 'Your name', required: true, width: 'half' },
    { label: 'Work email', name: 'email', type: 'email', placeholder: 'you@company.com', required: true, width: 'half' },
    { label: 'Company', name: 'company', type: 'text', placeholder: 'Your company', required: true, width: 'half' },
    { label: 'Phone', name: 'phone', type: 'tel', placeholder: '+1', required: false, width: 'half' },
    {
      label: 'What are you looking to achieve?',
      name: 'message',
      type: 'textarea',
      placeholder: 'A little about the challenge or opportunity…',
      required: true,
      width: 'full',
    },
  ],
}

/**
 * The field values an earlier version of this seed created, by field name. A form whose field
 * still carries exactly these values was never edited, so it is brought up to CONTACT_US_FORM on
 * the next seed; a field an editor has changed in any way is left alone.
 */
const SUPERSEDED_FIELDS: Record<string, { label: string; required: boolean }> = {
  email: { label: 'Email', required: true },
  phone: { label: 'Phone', required: true },
  message: { label: 'Brief message of your requirements', required: false },
}

const contactSection = (formId: number) => ({
  blockType: 'contact-offices',
  heading: 'Get in touch',
  headingLevel: 'h1',
  sub: 'Need help with digital transformation?\nContact us today!',
  offices: [
    {
      region: 'India',
      addressLabel: 'Address',
      address: '264, 14, Old Madras Road, Bhattarahalli, K R Puram, Bengaluru – 560049',
      email: 'info@socialdnalabs.com',
      phone: '+91-9900931624',
    },
    {
      region: 'USA',
      addressLabel: 'Address',
      address: '2033 Gateway Place, Suite 500 San Jose, CA 95110',
      email: 'info@socialdnalabs.com',
    },
  ],
  intro:
    'We are excited to hear from you. Let’s collaborate and transform your business, meeting your customer demands.',
  form: formId,
  settings: { anchorId: 'contact', hidden: false, background: 'default', spacing: 'default' },
})

type Options = { dryRun?: boolean }

async function findId(payload: Payload, collection: 'forms' | 'pages' | 'email-templates', slug: string) {
  const result = await payload.find({
    collection,
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  return (result.docs[0] as { id: number } | undefined)?.id
}

async function ensureForm(payload: Payload, { dryRun }: Options): Promise<number | undefined> {
  const existing = await findId(payload, 'forms', CONTACT_FORM_SLUG)
  if (existing) {
    await upgradeUneditedFields(payload, existing, { dryRun })
    return existing
  }
  if (dryRun) {
    payload.logger.info(`forms: would create "${CONTACT_FORM_SLUG}"`)
    return undefined
  }

  // The same notification and confirmation emails as the site's other contact forms.
  const [notificationTemplate, confirmationTemplate] = await Promise.all([
    findId(payload, 'email-templates', 'contact-form-notification'),
    findId(payload, 'email-templates', 'contact-form-confirmation'),
  ])

  const created = await payload.create({
    collection: 'forms',
    data: { ...CONTACT_US_FORM, slug: CONTACT_FORM_SLUG, notificationTemplate, confirmationTemplate } as never,
    overrideAccess: true,
  })
  payload.logger.info(`forms: "${CONTACT_FORM_SLUG}" created`)
  return created.id as number
}

type FormField = { name?: string | null; label?: string | null; placeholder?: string | null; required?: boolean | null }

/** Rewrites only the fields still holding SUPERSEDED_FIELDS' values — see that table. */
async function upgradeUneditedFields(payload: Payload, formId: number, { dryRun }: Options): Promise<void> {
  const form = (await payload.findByID({ collection: 'forms', id: formId, depth: 0, overrideAccess: true })) as {
    fields?: FormField[] | null
  }
  const fields = form.fields ?? []
  let upgraded = 0
  const next = fields.map((field) => {
    const old = SUPERSEDED_FIELDS[String(field.name ?? '')]
    const target = CONTACT_US_FORM.fields.find((f) => f.name === field.name)
    if (!old || !target || field.label !== old.label || Boolean(field.required) !== old.required || field.placeholder) {
      return field
    }
    upgraded += 1
    return { ...field, label: target.label, placeholder: target.placeholder, required: target.required }
  })
  // Name and Company kept their labels; they only gain the placeholders the reference design has.
  const withPlaceholders = next.map((field) => {
    const target = CONTACT_US_FORM.fields.find((f) => f.name === field.name)
    if (!upgraded || !target || field.placeholder || field.label !== target.label) return field
    return { ...field, placeholder: target.placeholder }
  })

  if (!upgraded) {
    payload.logger.info(`forms: "${CONTACT_FORM_SLUG}" exists — left as it is`)
    return
  }
  if (dryRun) {
    payload.logger.info(`forms: would update ${upgraded} unedited field(s) on "${CONTACT_FORM_SLUG}"`)
    return
  }
  await payload.update({ collection: 'forms', id: formId, data: { fields: withPlaceholders } as never, overrideAccess: true })
  payload.logger.info(`forms: "${CONTACT_FORM_SLUG}" — ${upgraded} unedited field(s) brought up to the reference design`)
}

async function ensurePage(
  payload: Payload,
  formId: number | undefined,
  { dryRun }: Options,
): Promise<number | undefined> {
  const existing = await findId(payload, 'pages', CONTACT_PAGE_SLUG)
  if (existing) {
    payload.logger.info(`pages: "${CONTACT_PAGE_SLUG}" exists — left as it is`)
    return existing
  }
  if (dryRun || !formId) {
    payload.logger.info(`pages: would create "${CONTACT_PAGE_SLUG}"`)
    return undefined
  }

  const created = await payload.create({
    collection: 'pages',
    data: {
      title: 'Contact Us',
      slug: CONTACT_PAGE_SLUG,
      template: 'service',
      _status: 'published',
      layout: [contactSection(formId)],
      seo: {
        title: 'Contact Us',
        description:
          'Get in touch with Social DNA Labs in Bengaluru or San Jose about digital transformation, engineering and AI.',
      },
    } as never,
    overrideAccess: true,
    draft: false,
  })
  payload.logger.info(`pages: "${CONTACT_PAGE_SLUG}" created`)
  return created.id as number
}

type FooterLink = { label?: string | null; type?: string | null; page?: unknown; url?: string | null; anchor?: string | null; newTab?: boolean | null }
type FooterColumn = { links?: { link?: FooterLink | null }[] | null }

async function linkFooter(payload: Payload, pageId: number | undefined, { dryRun }: Options) {
  const footer = (await payload.findGlobal({ slug: 'footer', depth: 0, overrideAccess: true })) as {
    columns?: FooterColumn[] | null
  }
  const columns = footer.columns ?? []

  let matched = 0
  const next = columns.map((column) => ({
    ...column,
    links: (column.links ?? []).map((entry) => {
      const label = String(entry.link?.label ?? '').trim()
      if (!FOOTER_LABELS.includes(label.toLowerCase())) return entry
      matched += 1
      // Every other destination field is cleared: a link holding both a page and a url is
      // ambiguous, and which one wins is resolveLink's detail rather than something to rely on.
      return {
        ...entry,
        link: { label, type: 'internal', page: pageId ?? null, url: null, anchor: null, newTab: false },
      }
    }),
  }))

  if (!matched) {
    payload.logger.warn('footer: no "Contact us" link found — footer left untouched')
    return
  }
  if (dryRun || !pageId) {
    payload.logger.info(`footer: would point ${matched} "Contact us" link(s) at /${CONTACT_PAGE_SLUG}`)
    return
  }

  await payload.updateGlobal({ slug: 'footer', data: { columns: next } as never, overrideAccess: true })
  payload.logger.info(`footer: ${matched} "Contact us" link(s) now open /${CONTACT_PAGE_SLUG}`)
}

export async function seedContactPage(payload: Payload, options: Options = {}): Promise<void> {
  const formId = await ensureForm(payload, options)
  const pageId = await ensurePage(payload, formId, options)
  await linkFooter(payload, pageId, options)
}
