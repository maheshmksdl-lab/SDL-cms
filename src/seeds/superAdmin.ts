import crypto from 'node:crypto'
import type { Payload, PayloadRequest } from 'payload'

import { BUILT_IN_ROLES } from './roles'

/**
 * The default Super Admin account, configured by environment:
 *
 *   CMS_ADMIN_EMAIL      required — nothing is created without a valid address
 *   CMS_ADMIN_PASSWORD   optional — when unset, a random password is generated and printed ONCE
 *   CMS_ADMIN_NAME       optional
 *
 * Run by the `seed_default_superadmin` migration, so a fresh database gets an administrator
 * without the `first-register` screen, and by `pnpm seed`, so an environment that sets
 * CMS_ADMIN_EMAIL only after migrating can still create the account.
 *
 * Idempotent, keyed on the email:
 *   - no such user          → created as superadmin
 *   - user exists, other role → promoted to superadmin; password and name are never touched
 *   - user is already superadmin → nothing changes
 *
 * `req` must be passed from a migration: it carries the migration's transaction, and without it
 * the writes below would run outside that transaction — invisible to one another before commit
 * and not rolled back if the migration fails.
 */

const SUPERADMIN = 'superadmin'
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export type SuperAdminOutcome = 'skipped' | 'created' | 'promoted' | 'unchanged'

export async function ensureSuperAdmin(payload: Payload, req?: PayloadRequest): Promise<SuperAdminOutcome> {
  const email = (process.env.CMS_ADMIN_EMAIL ?? '').trim().toLowerCase()

  if (!email) {
    payload.logger.warn('super admin: CMS_ADMIN_EMAIL is not set — no account created')
    return 'skipped'
  }
  if (!EMAIL_PATTERN.test(email)) {
    // Never print the value: a mistyped variable is sometimes a secret pasted into the wrong slot.
    payload.logger.warn('super admin: CMS_ADMIN_EMAIL is not a valid email address — no account created')
    return 'skipped'
  }

  const roleId = await ensureSuperAdminRole(payload, req)

  const existing = await payload.find({
    collection: 'users',
    where: { email: { equals: email } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
    req,
  })
  const user = existing.docs[0] as { id: number; role?: string | null } | undefined

  if (user) {
    if (user.role === SUPERADMIN) {
      payload.logger.info(`super admin: "${email}" already exists — unchanged`)
      return 'unchanged'
    }
    // Only the role relationship is written; the Users hook re-derives `role` from it.
    await payload.update({
      collection: 'users',
      id: user.id,
      data: { roleSelection: roleId },
      overrideAccess: true,
      req,
    })
    payload.logger.warn(
      `super admin: "${email}" already existed as "${user.role ?? 'none'}" — promoted to superadmin, password unchanged`,
    )
    return 'promoted'
  }

  const configuredPassword = process.env.CMS_ADMIN_PASSWORD ?? ''
  const password = configuredPassword || crypto.randomBytes(18).toString('base64url')

  await payload.create({
    collection: 'users',
    data: {
      email,
      name: process.env.CMS_ADMIN_NAME?.trim() || 'Super Admin',
      password,
      roleSelection: roleId,
    },
    overrideAccess: true,
    req,
  })

  if (configuredPassword) {
    payload.logger.info(`super admin: "${email}" created with the password from CMS_ADMIN_PASSWORD`)
  } else {
    payload.logger.info(
      [
        '',
        '  ┌─ super admin created ─────────────────────────────────────────────',
        `  │  email:    ${email}`,
        `  │  password: ${password}`,
        '  │',
        '  │  CMS_ADMIN_PASSWORD was not set, so this was generated. It is shown',
        '  │  only now — sign in and change it.',
        '  └──────────────────────────────────────────────────────────────────',
        '',
      ].join('\n'),
    )
  }
  return 'created'
}

/**
 * Migrations run before `pnpm seed`, so on a fresh database the role registry is still empty.
 * The Super Admin role is created here with the same label, order and description `seedRoles`
 * uses, so a later seed finds and updates it rather than creating a second one.
 */
async function ensureSuperAdminRole(payload: Payload, req?: PayloadRequest): Promise<number> {
  const found = await payload.find({
    collection: 'role-management',
    where: { value: { equals: SUPERADMIN } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
    req,
  })
  const existingId = (found.docs[0] as { id: number } | undefined)?.id
  if (existingId) return existingId

  const definition = BUILT_IN_ROLES.find((role) => role.label === 'Super Admin')
  if (!definition) throw new Error('super admin: "Super Admin" is missing from BUILT_IN_ROLES')

  const created = await payload.create({
    collection: 'role-management',
    data: {
      label: definition.label,
      value: SUPERADMIN,
      active: true,
      sortOrder: definition.sortOrder,
      description: definition.description,
    },
    overrideAccess: true,
    req,
  })
  payload.logger.info('super admin: "Super Admin" role created')
  return (created as { id: number }).id
}
