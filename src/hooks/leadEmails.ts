import type { CollectionAfterChangeHook } from 'payload'

import { sendCmsEmail } from '../email/send'
import { renderEmailTemplate, TemplateDisabledError } from '../email/templates'

/**
 * Sends the two emails a submission produces: a notification to the team, and a confirmation
 * to the person who submitted.
 *
 * Ordering, carried over from the EFTMRA reference and the single most important property of
 * this pipeline: the lead is ALREADY SAVED by the time this runs. The two sends are independent
 * — one failing does not prevent the other — and neither can fail the request.
 */

type FormDoc = {
  name?: string | null
  slug?: string | null
  recipients?: (string | null)[] | null
  notificationTemplate?: number | { slug?: string } | null
  confirmationTemplate?: number | { slug?: string } | null
  fields?: { name: string; label?: string | null; type?: string | null }[] | null
}

/** Renders the submission as readable lines for the notification body. */
function formatSubmission(
  data: Record<string, unknown>,
  fields: FormDoc['fields'],
): { text: string; html: string } {
  const rows = (fields ?? [])
    .map((field) => {
      const value = data[field.name]
      if (value === undefined || value === null || value === '') return null
      return { label: field.label || field.name, value: String(value) }
    })
    .filter((row): row is { label: string; value: string } => row !== null)

  return {
    text: rows.map((r) => `${r.label}: ${r.value}`).join('\n'),
    // Values are escaped by the template interpolator; labels come from the CMS.
    html: rows.map((r) => `<p><strong>${r.label}:</strong> ${r.value}</p>`).join('\n'),
  }
}

async function templateSlug(
  ref: number | { slug?: string } | null | undefined,
  fallback: string,
): Promise<string> {
  if (ref && typeof ref === 'object' && ref.slug) return ref.slug
  return fallback
}

export const sendLeadEmails: CollectionAfterChangeHook = async ({ doc, operation, req }) => {
  if (operation !== 'create') return doc
  if (req.context?.skipLeadEmails) return doc

  const settings = (await req.payload
    .findGlobal({ slug: 'email-settings', depth: 1, overrideAccess: true, req })
    .catch(() => null)) as Parameters<typeof sendCmsEmail>[0]['settings'] | null

  if (!settings) {
    req.payload.logger.warn('lead: could not read Email Settings — no email sent.')
    return doc
  }

  // The form is a relationship; depth 0 gives an id, so fetch it when needed.
  const formRef = (doc as { form?: number | FormDoc }).form
  let form: FormDoc | null = typeof formRef === 'object' ? formRef : null
  if (!form && typeof formRef === 'number') {
    form = (await req.payload
      .findByID({ collection: 'forms', id: formRef, depth: 1, overrideAccess: true, req })
      .catch(() => null)) as FormDoc | null
  }

  const submission = ((doc as { submissionData?: Record<string, unknown> }).submissionData ?? {}) as Record<
    string,
    unknown
  >
  const submitterEmail = (doc as { submittedEmail?: string }).submittedEmail
  const formatted = formatSubmission(submission, form?.fields)

  const variables = {
    formName: form?.name ?? 'Website enquiry',
    submitterEmail: submitterEmail ?? '',
    submitterName: String(submission.name ?? submission.fullName ?? ''),
    submission: formatted.text,
    submissionHtml: formatted.html,
    pathname: String((doc as { source?: { pathname?: string } }).source?.pathname ?? ''),
  }

  // ── Notification to the team ───────────────────────────────────────────────
  const recipients = (form?.recipients ?? [])
    .filter((r): r is string => Boolean(r))
    .concat(settings.primaryNotificationEmail ? [settings.primaryNotificationEmail] : [])

  try {
    const template = await renderEmailTemplate({
      req,
      slug: await templateSlug(form?.notificationTemplate, 'contact-form-notification'),
      variables,
      fallback: {
        subject: 'New {{formName}} submission',
        text: 'A new {{formName}} submission was received.\n\n{{submission}}\n\nPage: {{pathname}}',
        html: '<p>A new {{formName}} submission was received.</p>{{submissionHtml}}<p>Page: {{pathname}}</p>',
      },
    })

    await sendCmsEmail({
      req,
      settings,
      to: template.to ? [template.to] : [...new Set(recipients)],
      // So a reply from the team goes to the enquirer, not into a shared inbox.
      replyTo: submitterEmail,
      email: template,
    })
  } catch (error) {
    if (!(error instanceof TemplateDisabledError)) {
      req.payload.logger.error(
        `lead: notification failed — ${error instanceof Error ? error.message : String(error)}`,
      )
    }
  }

  // ── Confirmation to the submitter ──────────────────────────────────────────
  if (submitterEmail) {
    try {
      const template = await renderEmailTemplate({
        req,
        slug: await templateSlug(form?.confirmationTemplate, 'contact-form-confirmation'),
        variables,
        fallback: {
          subject: 'We received your message',
          text: 'Hi {{submitterName}},\n\nThank you for getting in touch. Someone from Social DNA Labs will reply shortly.',
          html: '<p>Hi {{submitterName}},</p><p>Thank you for getting in touch. Someone from Social DNA Labs will reply shortly.</p>',
        },
      })

      await sendCmsEmail({
        req,
        settings,
        to: [submitterEmail],
        replyTo: settings.primaryNotificationEmail ?? undefined,
        email: template,
      })
    } catch (error) {
      if (!(error instanceof TemplateDisabledError)) {
        req.payload.logger.error(
          `lead: confirmation failed — ${error instanceof Error ? error.message : String(error)}`,
        )
      }
    }
  }

  return doc
}
