import type { CollectionConfig, Where } from 'payload'

/**
 * The role registry.
 *
 * Copied from the EFTMRA reference. A role's `value` (its key) is what every access check
 * reads, and it is derived from the label rather than typed — "Site Admin" becomes "siteadmin"
 * — so a typo cannot silently create a role that matches nothing.
 */

const PROTECTED_ROLE_VALUES = ['admin', 'superadmin']

function normalizeRoleKey(value?: string | null): string {
  return String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '')
}

export const RoleManagement: CollectionConfig = {
  slug: 'role-management',
  labels: { singular: 'Role', plural: 'Role Management' },
  admin: {
    useAsTitle: 'label',
    defaultColumns: ['label', 'value', 'active', 'sortOrder', 'updatedAt'],
    group: 'Settings',
    description: 'Roles available when assigning a user. The role key drives all access control.',
    hidden: ({ user }) =>
      !['admin', 'superadmin', 'siteadmin'].includes((user as { role?: string })?.role ?? ''),
  },
  access: {
    read: ({ req }): boolean | Where => {
      const role = req.user?.role as string | undefined
      if (!role) return false
      if (role === 'admin' || role === 'superadmin') return true
      // A lesser role must not be able to see that the privileged roles exist.
      if (role === 'siteadmin' || role === 'manager') {
        return { value: { not_in: PROTECTED_ROLE_VALUES } }
      }
      return false
    },
    create: ({ req }) => ['admin', 'superadmin'].includes((req.user?.role as string) ?? ''),
    update: ({ req }) => ['admin', 'superadmin'].includes((req.user?.role as string) ?? ''),
    delete: ({ req }) => ['admin', 'superadmin'].includes((req.user?.role as string) ?? ''),
  },
  hooks: {
    beforeValidate: [
      ({ data, operation }) => {
        if (!data) return data
        // On create the key follows the label; on update an existing key is preserved, so
        // renaming a role's display name never orphans the users assigned to it.
        const source = operation === 'create' ? data.label : data.value || data.label
        return { ...data, value: normalizeRoleKey(source) }
      },
    ],
    beforeDelete: [
      async ({ req, id }) => {
        const role = await req.payload.findByID({
          collection: 'role-management',
          id,
          depth: 0,
          overrideAccess: true,
        })
        if (PROTECTED_ROLE_VALUES.includes(String(role?.value))) {
          throw new Error(`The "${role.label}" role is built in and cannot be deleted.`)
        }
      },
    ],
  },
  fields: [
    { name: 'label', type: 'text', required: true },
    {
      name: 'value',
      label: 'Role Key',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        readOnly: true,
        description: 'Auto-generated from the role name. "Site Admin" becomes "siteadmin".',
      },
    },
    { name: 'active', type: 'checkbox', defaultValue: true },
    {
      name: 'sortOrder',
      type: 'number',
      defaultValue: 100,
      admin: { description: 'Lower numbers appear first in role pickers.' },
    },
    { name: 'description', type: 'textarea' },
  ],
}
