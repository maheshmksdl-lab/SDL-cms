import type { PayloadRequest } from 'payload'

import type { RenderedEmail } from './templates'

/**
 * Email delivery.
 *
 * Resolves the account to use from Email Settings, then sends through whichever provider that
 * account names. Credentials are read from the ENVIRONMENT by the variable name the account
 * records — never from the database, so a database dump or a staging clone carries no secrets.
 *
 * Every failure is logged and swallowed. A form submission is already persisted by the time
 * this runs; losing the notification is bad, losing the enquiry is worse.
 */

type EmailSettings = {
  enabled?: boolean | null
  fromName?: string | null
  fromEmail?: string | null
  primaryNotificationEmail?: string | null
  account?: EmailAccount | number | null
}

type EmailAccount = {
  id: number
  label?: string | null
  provider?: string | null
  authMode?: string | null
  enabled?: boolean | null
  fromName?: string | null
  fromEmail?: string | null
  envKeyName?: string | null
  host?: string | null
  port?: number | null
  secure?: boolean | null
  username?: string | null
}

export type SendResult = { sent: boolean; reason?: string }

async function resolveAccount(req: PayloadRequest, settings: EmailSettings): Promise<EmailAccount | null> {
  if (settings.account && typeof settings.account === 'object') return settings.account

  if (typeof settings.account === 'number') {
    try {
      return (await req.payload.findByID({
        collection: 'email-accounts',
        id: settings.account,
        depth: 0,
        overrideAccess: true,
        req,
      })) as EmailAccount
    } catch {
      return null
    }
  }

  // No explicit choice — fall back to whichever account is marked as the default.
  try {
    const result = await req.payload.find({
      collection: 'email-accounts',
      where: { useAsDefault: { equals: true }, enabled: { equals: true } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
      req,
    })
    return (result.docs[0] as EmailAccount) ?? null
  } catch {
    return null
  }
}

async function sendViaResend(
  apiKey: string,
  message: { from: string; to: string[]; cc?: string[]; replyTo?: string; subject: string; html: string; text: string },
): Promise<void> {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { authorization: `Bearer ${apiKey}`, 'content-type': 'application/json' },
    body: JSON.stringify({
      from: message.from,
      to: message.to,
      cc: message.cc,
      reply_to: message.replyTo,
      subject: message.subject,
      html: message.html,
      text: message.text,
    }),
  })

  if (!res.ok) {
    throw new Error(`Resend responded ${res.status}: ${(await res.text()).slice(0, 200)}`)
  }
}

async function sendViaSmtp(
  account: EmailAccount,
  password: string,
  message: { from: string; to: string[]; cc?: string[]; replyTo?: string; subject: string; html: string; text: string },
): Promise<void> {
  // Imported lazily so a deployment that only ever uses an API provider does not load it.
  const { default: nodemailer } = await import('nodemailer')

  const transport = nodemailer.createTransport({
    host: account.host ?? undefined,
    port: account.port ?? 587,
    secure: account.secure ?? false,
    auth: account.username ? { user: account.username, pass: password } : undefined,
  })

  await transport.sendMail({
    from: message.from,
    to: message.to.join(', '),
    cc: message.cc?.join(', '),
    replyTo: message.replyTo,
    subject: message.subject,
    html: message.html,
    text: message.text,
  })
}

export async function sendCmsEmail({
  req,
  settings,
  to,
  cc,
  replyTo,
  email,
}: {
  req: PayloadRequest
  settings: EmailSettings
  to: string[]
  cc?: string[]
  replyTo?: string
  email: RenderedEmail
}): Promise<SendResult> {
  // The master switch. Off means "store submissions, send nothing" — what makes staging safe.
  if (settings.enabled === false) {
    req.payload.logger.info('email: delivery is disabled in Email Settings — not sending.')
    return { sent: false, reason: 'disabled' }
  }

  const recipients = to.filter(Boolean)
  if (!recipients.length) {
    req.payload.logger.warn('email: no recipient — not sending.')
    return { sent: false, reason: 'no-recipient' }
  }

  const account = await resolveAccount(req, settings)

  const fromName = account?.fromName || settings.fromName || 'Social DNA Labs'
  const fromEmail = account?.fromEmail || settings.fromEmail || process.env.EMAIL_FROM_ADDRESS
  if (!fromEmail) {
    req.payload.logger.warn('email: no sender address configured — not sending.')
    return { sent: false, reason: 'no-sender' }
  }

  const message = {
    from: `${fromName} <${fromEmail}>`,
    to: recipients,
    cc,
    replyTo,
    subject: email.subject,
    html: email.html,
    text: email.text,
  }

  /*
   * No account configured at all: log the message rather than dropping it silently. In
   * development that IS the delivery mechanism, and it makes the whole pipeline testable
   * without credentials.
   */
  if (!account || account.enabled === false) {
    req.payload.logger.info(
      `email: no delivery account configured. Would have sent to ${recipients.join(', ')} — "${email.subject}"`,
    )
    return { sent: false, reason: 'no-account' }
  }

  const credential = account.envKeyName ? process.env[account.envKeyName] : undefined
  if (!credential) {
    req.payload.logger.warn(
      `email: account "${account.label}" names ${account.envKeyName ?? '(nothing)'}, which is not set in the environment — not sending.`,
    )
    return { sent: false, reason: 'no-credential' }
  }

  try {
    if (account.authMode === 'smtp') await sendViaSmtp(account, credential, message)
    else if (account.provider === 'resend') await sendViaResend(credential, message)
    else {
      req.payload.logger.warn(`email: provider "${account.provider}" is not implemented yet — not sending.`)
      return { sent: false, reason: 'provider-unsupported' }
    }

    req.payload.logger.info(`email: sent "${email.subject}" to ${recipients.join(', ')}`)
    return { sent: true }
  } catch (error) {
    // Never rethrow. The lead is already saved; a delivery failure must not undo that.
    req.payload.logger.error(
      `email: failed to send to ${recipients.join(', ')} — ${error instanceof Error ? error.message : String(error)}`,
    )
    return { sent: false, reason: 'send-failed' }
  }
}
