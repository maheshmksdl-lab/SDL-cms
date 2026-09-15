import crypto from 'node:crypto'
import type { Payload } from 'payload'

/**
 * The `preview@` service user.
 *
 * The web app authenticates as this user — via its API key, server-side only — for draft reads
 * when an editor is in preview mode (plan §8.2). It holds the read-only `preview` role and
 * nothing else.
 *
 * Idempotent. On first creation it prints the API key ONCE: copy it into web/.env as
 * CMS_API_KEY. Re-running does not rotate the key.
 */

const EMAIL = process.env.PREVIEW_USER_EMAIL || 'preview@socialdnalabs.com'

export async function seedPreviewUser(payload: Payload): Promise<void> {
  const role = await payload.find({
    collection: 'role-management',
    where: { value: { equals: 'preview' } },
    limit: 1,
    overrideAccess: true,
  })
  const roleId = (role.docs[0] as { id: number } | undefined)?.id
  if (!roleId) {
    payload.logger.warn('preview user: the "preview" role is missing — run seedRoles first')
    return
  }

  const existing = await payload.find({
    collection: 'users',
    where: { email: { equals: EMAIL } },
    limit: 1,
    overrideAccess: true,
  })

  if (existing.docs.length) {
    // Keep the role in step, but never touch the key.
    await payload.update({
      collection: 'users',
      id: (existing.docs[0] as { id: number }).id,
      data: { roleSelection: roleId, enableAPIKey: true },
      overrideAccess: true,
    })
    payload.logger.info(`preview user: "${EMAIL}" already exists — role reasserted, key unchanged`)
    return
  }

  const apiKey = crypto.randomUUID()
  await payload.create({
    collection: 'users',
    data: {
      email: EMAIL,
      name: 'Website preview (service account)',
      password: crypto.randomBytes(24).toString('base64url'),
      roleSelection: roleId,
      enableAPIKey: true,
      apiKey,
    },
    overrideAccess: true,
  })

  payload.logger.info(
    [
      '',
      '  ┌─ preview user created ────────────────────────────────────────────',
      `  │  email:   ${EMAIL}`,
      `  │  API key: ${apiKey}`,
      '  │',
      '  │  Set this in web/.env  →  CMS_API_KEY=' + apiKey,
      '  └──────────────────────────────────────────────────────────────────',
      '',
    ].join('\n'),
  )
}
