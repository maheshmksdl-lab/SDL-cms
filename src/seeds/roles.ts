import type { Payload } from 'payload'

import { defaultRolePermissions } from '../access/rbac'

/**
 * The built-in roles.
 *
 * `value` is what every access check reads and must match the keys in
 * `defaultRolePermissions`; the collection derives it from `label`, so the labels here are
 * chosen to normalise to exactly those keys ("Site Admin" → "siteadmin").
 *
 * Idempotent: re-running updates labels and ordering without touching assignments.
 */
export const BUILT_IN_ROLES = [
  {
    label: 'Preview',
    sortOrder: 5,
    description:
      'Service identity for the website’s preview reads. Read-only. Assign to the preview@ API-key user only.',
  },
  {
    label: 'Editor',
    sortOrder: 10,
    description: 'Writes and edits content. Cannot delete, and cannot change site configuration.',
  },
  {
    label: 'Manager',
    sortOrder: 20,
    description: 'Full control of content, services, clients, forms and navigation.',
  },
  {
    label: 'Site Admin',
    sortOrder: 30,
    description: 'Operates the site: users, roles, email and settings, in addition to all content.',
  },
  {
    label: 'Admin',
    sortOrder: 40,
    description: 'Unrestricted access.',
  },
  {
    label: 'Super Admin',
    sortOrder: 50,
    description: 'Unrestricted access. Reserved for the founding account.',
  },
] as const

export async function seedRoles(payload: Payload): Promise<void> {
  for (const role of BUILT_IN_ROLES) {
    const value = role.label.toLowerCase().replace(/[^a-z0-9]+/g, '')

    // Sanity check: a label that does not normalise to a known permission key would create a
    // role that silently matches nothing.
    if (!(value in defaultRolePermissions)) {
      throw new Error(
        `Role "${role.label}" normalises to "${value}", which has no entry in defaultRolePermissions.`,
      )
    }

    const existing = await payload.find({
      collection: 'role-management',
      where: { value: { equals: value } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })

    if (existing.docs.length) {
      await payload.update({
        collection: 'role-management',
        id: existing.docs[0]!.id,
        data: { label: role.label, sortOrder: role.sortOrder, description: role.description },
        overrideAccess: true,
      })
      payload.logger.info(`role "${role.label}" updated`)
    } else {
      await payload.create({
        collection: 'role-management',
        data: {
          label: role.label,
          value,
          active: true,
          sortOrder: role.sortOrder,
          description: role.description,
        },
        overrideAccess: true,
      })
      payload.logger.info(`role "${role.label}" created`)
    }
  }
}
