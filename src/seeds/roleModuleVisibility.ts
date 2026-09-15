import type { Payload } from 'payload'

/**
 * Materialises the RBAC matrix into the `role-module-visibility` global.
 *
 * The global's `beforeValidate` hook (globals/RoleModuleVisibility.ts) expands an empty
 * `permissions` array into one row per (role, module) from `defaultRolePermissions`, so writing
 * `[]` is enough to seed the full default matrix — every cell present and editable in the panel.
 *
 * Idempotent, and non-destructive: if an administrator has already customised the matrix, this
 * re-runs the same normalisation over their rows and changes nothing.
 */
export async function seedRoleModuleVisibility(payload: Payload): Promise<void> {
  const existing = (await payload.findGlobal({
    slug: 'role-module-visibility',
    depth: 0,
    overrideAccess: true,
  })) as { permissions?: unknown[] | null }

  await payload.updateGlobal({
    slug: 'role-module-visibility',
    data: { permissions: (existing?.permissions as never[]) ?? [] },
    overrideAccess: true,
  })

  const after = (await payload.findGlobal({
    slug: 'role-module-visibility',
    depth: 0,
    overrideAccess: true,
  })) as { permissions?: unknown[] | null }

  payload.logger.info(`role-module-visibility seeded: ${after?.permissions?.length ?? 0} rows`)
}
