import type { PayloadRequest } from 'payload'

/**
 * Template rendering.
 *
 * Adapted from the EFTMRA reference. The important property, carried over deliberately, is the
 * `fallback`: a caller always supplies inline subject/body text, so a template that has been
 * deleted, disabled, or never seeded degrades to a plain-but-correct email rather than losing
 * the notification entirely.
 */

export type RenderedEmail = {
  subject: string
  html: string
  text: string
  to?: string
}

export type TemplateVariables = Record<string, string | number | null | undefined>

/**
 * Substitutes `{{name}}` placeholders.
 *
 * Values are HTML-escaped for the HTML body and left raw for the text body. Submissions are
 * attacker-controlled — a lead's "message" field goes straight into a notification email — so
 * escaping is not optional here.
 */
export function interpolate(template: string, variables: TemplateVariables, escape: boolean): string {
  return template.replace(/\{\{\s*(\w+)\s*\}\}/g, (_match, key: string) => {
    const value = variables[key]
    if (value === null || value === undefined) return ''
    const str = String(value)
    return escape ? escapeHtml(str) : str
  })
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

type StoredTemplate = {
  subject?: string | null
  html?: string | null
  text?: string | null
  toEmail?: string | null
  enabled?: boolean | null
}

export async function renderEmailTemplate({
  req,
  slug,
  variables,
  fallback,
}: {
  req: PayloadRequest
  slug: string
  variables: TemplateVariables
  fallback: { subject: string; html: string; text: string }
}): Promise<RenderedEmail> {
  let template: StoredTemplate | null = null

  try {
    const result = await req.payload.find({
      collection: 'email-templates',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
      req,
    })
    template = (result.docs[0] as StoredTemplate | undefined) ?? null
  } catch {
    // A template lookup must never be the reason an email is lost — fall through to the
    // caller's inline fallback.
    template = null
  }

  // A disabled template is a deliberate "stop sending this", so it must not fall back.
  if (template && template.enabled === false) {
    req.payload.logger.info(`email: template "${slug}" is disabled — not sending.`)
    throw new TemplateDisabledError(slug)
  }

  const source = {
    subject: template?.subject || fallback.subject,
    html: template?.html || fallback.html,
    text: template?.text || fallback.text,
  }

  if (!template) {
    req.payload.logger.warn(`email: template "${slug}" not found — using the inline fallback.`)
  }

  return {
    subject: interpolate(source.subject, variables, false),
    html: interpolate(source.html, variables, true),
    text: interpolate(source.text, variables, false),
    to: template?.toEmail ? interpolate(template.toEmail, variables, false) : undefined,
  }
}

export class TemplateDisabledError extends Error {
  constructor(readonly slug: string) {
    super(`Email template "${slug}" is disabled.`)
    this.name = 'TemplateDisabledError'
  }
}
