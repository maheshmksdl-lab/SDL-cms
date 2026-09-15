import type { Payload } from 'payload'

/**
 * Email templates and the contact form.
 *
 * Idempotent — matched on `slug`, so re-running updates rather than duplicating. The bodies are
 * deliberately plain: they are a working default, not a designed campaign email, and an editor
 * is expected to rewrite them in the admin panel.
 */

const TEMPLATES = [
  {
    slug: 'contact-form-notification',
    name: 'Contact form — team notification',
    templateType: 'notification',
    description: 'Sent to the team when someone submits a form.',
    availableVariables: 'formName, submitterName, submitterEmail, submission, submissionHtml, pathname',
    subject: 'New {{formName}} submission',
    text: [
      'A new {{formName}} submission was received.',
      '',
      '{{submission}}',
      '',
      'Submitted from: {{pathname}}',
    ].join('\n'),
    html: [
      '<p>A new <strong>{{formName}}</strong> submission was received.</p>',
      '{{submissionHtml}}',
      '<p style="color:#8891A0;font-size:13px">Submitted from {{pathname}}</p>',
    ].join('\n'),
  },
  {
    slug: 'contact-form-confirmation',
    name: 'Contact form — submitter confirmation',
    templateType: 'confirmation',
    description: 'Sent to the person who submitted the form.',
    availableVariables: 'formName, submitterName, submitterEmail',
    subject: 'Thanks for getting in touch',
    text: [
      'Hi {{submitterName}},',
      '',
      'Thank you for reaching out to Social DNA Labs. We have your message and someone will',
      'reply shortly.',
      '',
      '— Social DNA Labs',
    ].join('\n'),
    html: [
      '<p>Hi {{submitterName}},</p>',
      '<p>Thank you for reaching out to Social DNA Labs. We have your message and someone will reply shortly.</p>',
      '<p>— Social DNA Labs</p>',
    ].join('\n'),
  },
] as const

/** Mirrors the fields the design's contact form shows on index.html. */
const CONTACT_FORM = {
  slug: 'contact',
  name: 'Contact',
  cardTitle: "Let's talk",
  submitLabel: 'Start the conversation',
  fineprint: "We'll only use your details to respond to this enquiry.",
  success: {
    title: 'Thanks — message received.',
    body: 'Someone from SDL will get back to you shortly.',
  },
  fields: [
    { label: 'Name', name: 'name', type: 'text', required: true, width: 'half', placeholder: 'Your name' },
    { label: 'Work email', name: 'email', type: 'email', required: true, width: 'half', placeholder: 'you@company.com' },
    { label: 'Company', name: 'company', type: 'text', required: true, width: 'half', placeholder: 'Your company' },
    { label: 'Phone', name: 'phone', type: 'tel', required: false, width: 'half', placeholder: '+1' },
    {
      label: 'What are you looking to achieve?',
      name: 'goal',
      type: 'textarea',
      required: true,
      width: 'full',
      placeholder: 'A little about the challenge or opportunity…',
    },
  ],
}

/**
 * Mirrors the services.html contact form, which differs from the home page's: an area dropdown and
 * a requirement field, a plain "Submit" button, and its own success line.
 */
const SERVICES_CONTACT_FORM = {
  slug: 'services-contact',
  name: 'Services contact',
  cardTitle: "Let's talk",
  submitLabel: 'Submit',
  fineprint: "We'll only use your details to respond to this enquiry.",
  success: {
    title: 'Thanks — message received.',
    body: 'Someone from Social DNA Labs will get back to you shortly.',
  },
  fields: [
    { label: 'Name', name: 'name', type: 'text', required: true, width: 'half', placeholder: 'Your name' },
    { label: 'Work email', name: 'email', type: 'email', required: true, width: 'half', placeholder: 'you@company.com' },
    { label: 'Company', name: 'company', type: 'text', required: true, width: 'half', placeholder: 'Your company' },
    { label: 'Phone', name: 'phone', type: 'tel', required: false, width: 'half', placeholder: '+1' },
    {
      label: 'What can we help you with?',
      name: 'help',
      type: 'select',
      required: true,
      width: 'full',
      placeholder: 'Select an area',
      options: [
        'AI transformation',
        'Digital engineering',
        'Business transformation',
        'Digital experience',
        'Growth transformation',
        'Something else',
      ],
    },
    {
      label: 'Tell us about your requirement',
      name: 'goal',
      type: 'textarea',
      required: true,
      width: 'full',
      placeholder: 'A little about the challenge or opportunity…',
    },
  ],
}

/**
 * Create-or-update, matched on slug.
 *
 * `collection` is typed as a union here, which Payload's overloads cannot narrow — the create
 * signature for a drafts-enabled collection differs from one without. The casts are confined to
 * this one helper rather than spread across every call site.
 */
async function upsert(
  payload: Payload,
  collection: 'email-templates' | 'forms',
  slug: string,
  data: Record<string, unknown>,
): Promise<number> {
  const existing = await payload.find({
    collection,
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })

  const first = existing.docs[0]

  if (first) {
    const updated = await payload.update({
      collection,
      id: first.id,
      data,
      overrideAccess: true,
    } as Parameters<typeof payload.update>[0])
    payload.logger.info(`${collection}: "${slug}" updated`)
    return updated.id as number
  }

  const created = await payload.create({
    collection,
    data: { ...data, slug },
    overrideAccess: true,
  } as Parameters<typeof payload.create>[0])
  payload.logger.info(`${collection}: "${slug}" created`)
  return created.id as number
}

export async function seedForms(payload: Payload): Promise<void> {
  const templateIds: Record<string, number> = {}

  for (const template of TEMPLATES) {
    templateIds[template.slug] = await upsert(payload, 'email-templates', template.slug, {
      ...template,
      enabled: true,
    })
  }

  for (const form of [CONTACT_FORM, SERVICES_CONTACT_FORM]) {
    await upsert(payload, 'forms', form.slug, {
      ...form,
      notificationTemplate: templateIds['contact-form-notification'],
      confirmationTemplate: templateIds['contact-form-confirmation'],
    })
  }
}
