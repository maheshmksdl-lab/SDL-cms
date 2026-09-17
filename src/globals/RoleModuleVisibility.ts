import type { GlobalConfig } from 'payload'

import { defaultRolePermissions, moduleOptions, type CrudOperation } from '../access/rbac'

/**
 * The matrix is rendered by SdlRolePermissionsMatrix, not by Payload's array field.
 *
 * 19 modules × 6 roles is 114 rows. Payload renders those as 114 collapsed "Permission N"
 * strips, which cannot be scanned, compared across roles, or navigated — the permission you
 * want is somewhere in a very long column. The `ui` field below replaces that with a role ×
 * module grid; the array itself stays the stored shape and is simply hidden.
 */
const permissionsMatrixField = {
  name: 'permissionsMatrix',
  type: 'ui' as const,
  admin: {
    components: {
      Field: './src/components/admin/SdlRolePermissionsMatrix.tsx#default',
    },
    // Read by the component through `field.admin.custom` — it needs the module list to build
    // the rows and the compiled-in defaults to seed a newly registered role.
    custom: { defaultPermissions: defaultRolePermissions, modules: moduleOptions },
  },
}

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
    permissionsMatrixField,
    {
      name: 'permissions',
      type: 'array',
      labels: { singular: 'Permission', plural: 'Permissions' },
      admin: {
        description: 'One row per role and module. Rows are regenerated automatically.',
        initCollapsed: true,
        // The stored shape, driven entirely through the matrix above. Hidden rather than
        // removed: it is still the field the access layer reads, and every checkbox in the
        // matrix writes to a `permissions.N.*` path in this array's form state.
        hidden: true,
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
