import type { GlobalConfig } from 'payload'

import { defaultRolePermissions, moduleOptions, type CrudOperation } from '../access/rbac'

/**
 * The editable RBAC matrix.
 *
 * Adapted from the EFTMRA reference. The normalisation is the important part: the stored rows
 * are merged over the compiled-in defaults on every read, so adding a new module to
 * `moduleOptions` does not require a migration — the new module simply appears with its
 * default permissions the next time the global is opened.
 */

type PermissionRow = {
  id?: string | null
  role?: string | null
  module?: string | null
} & Partial<Record<CrudOperation, boolean | null>>

const OPS: CrudOperation[] = ['create', 'read', 'update', 'delete']

function coerceRows(rows?: PermissionRow[] | Record<string, PermissionRow> | null): PermissionRow[] {
  if (Array.isArray(rows)) return rows
  if (rows && typeof rows === 'object') return Object.values(rows)
  return []
}

/**
 * Produces one row per (role, module), taking a stored value where present and the compiled-in
 * default otherwise. Roles found only in the stored data are preserved, so a custom role
 * created in `role-management` keeps its matrix.
 */
function normalize(rows?: PermissionRow[] | Record<string, PermissionRow> | null): PermissionRow[] {
  const coerced = coerceRows(rows)
  const builtinRoles = Object.keys(defaultRolePermissions)
  const customRoles = coerced
    .map((r) => r.role)
    .filter((r): r is string => typeof r === 'string' && Boolean(r.trim()))

  const roles = [...new Set([...builtinRoles, ...customRoles])]
  const byKey = new Map(
    coerced.filter((r) => r.role && r.module).map((r) => [`${r.role}:${r.module}`, r]),
  )

  return roles.flatMap((role) =>
    moduleOptions.map(({ value: moduleKey }) => {
      const stored = byKey.get(`${role}:${moduleKey}`)
      const defaults = defaultRolePermissions[role]?.[moduleKey] ?? {
        create: false, read: false, update: false, delete: false,
      }

      const row: PermissionRow = { id: stored?.id ?? undefined, role, module: moduleKey }
      for (const op of OPS) {
        row[op] = typeof stored?.[op] === 'boolean' ? (stored[op] as boolean) : defaults[op]
      }
      return row
    }),
  )
}

export const RoleModuleVisibility: GlobalConfig = {
  slug: 'role-module-visibility',
  label: 'Role Permissions',
  admin: {
    group: 'Settings',
    description:
      'Which modules each role can see, and what it may do in them. Admin and Super Admin always have full access and are not listed.',
  },
  hooks: {
    // Normalising on both edges means the matrix is complete whether it is being read by an
    // access check or rendered in the admin panel, and a partially-saved matrix self-heals.
    afterRead: [({ doc }) => ({ ...doc, permissions: normalize(doc?.permissions) })],
    beforeValidate: [({ data }) => ({ ...data, permissions: normalize(data?.permissions) })],
  },
  fields: [
    {
      name: 'permissions',
      type: 'array',
      labels: { singular: 'Permission', plural: 'Permissions' },
      admin: {
        description: 'One row per role and module. Rows are regenerated automatically.',
        initCollapsed: true,
      },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'role', type: 'text', required: true, admin: { readOnly: true, width: '30%' } },
            {
              name: 'module',
              type: 'select',
              required: true,
              options: moduleOptions,
              admin: { readOnly: true, width: '30%' },
            },
          ],
        },
        {
          type: 'row',
          fields: OPS.map((op) => ({
            name: op,
            type: 'checkbox' as const,
            defaultValue: false,
            admin: { width: '25%' },
          })),
        },
      ],
    },
  ],
}
