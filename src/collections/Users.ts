import type { CollectionConfig, Payload, Where } from 'payload'

/**
 * CMS accounts.
 *
 * Adapted from the EFTMRA reference. The practitioner portal auth strategy and the
 * linkedPractitioner/linkedTrainer relationships are gone — no public-user portal is in scope.
 *
 * Two changes from the reference:
 *   - `useSessions: true`. The reference sets it false and its own comment explains that as
 *     legacy inertia; the consequence is stateless, unrevocable admin tokens. A new build has
 *     no such constraint.
 *   - `apiKey: true`, so the frontend can authenticate as a read-only service user for draft
 *     reads during preview.
 */

const ADMIN_ONLY_ROLES = ['admin', 'superadmin']

type RoleRelationshipValue = number | string | { value?: string | null } | null | undefined

async function resolveRoleKey({
  payload,
  selectedRole,
}: {
  payload: Payload
  selectedRole: RoleRelationshipValue
}): Promise<string | undefined> {
  if (!selectedRole) return undefined
  if (typeof selectedRole === 'object' && selectedRole.value) return selectedRole.value

  const id = typeof selectedRole === 'string' || typeof selectedRole === 'number' ? selectedRole : undefined
  if (!id) return undefined

  const role = await payload.findByID({
    collection: 'role-management',
    id,
    depth: 0,
    overrideAccess: true,
  })

  return typeof role?.value === 'string' && role.value ? role.value : undefined
}

export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    useSessions: true,
    tokenExpiration: 60 * 60 * 8,
    maxLoginAttempts: 5,
    lockTime: 10 * 60 * 1000,
    // Lets the web app authenticate as a read-only `preview@` user for draft reads.
    useAPIKey: true,
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'roleKey', 'updatedAt'],
    group: 'Settings',
    hidden: ({ user }) =>
      !['admin', 'superadmin', 'siteadmin'].includes((user as { role?: string })?.role ?? ''),
  },
  access: {
    /*
     * These are BACKSTOPS. payload.config.ts wires the rbac.ts versions through withAccess(),
     * which spreads the passed rules over the collection's own — so at runtime rbac.ts decides.
     * Kept in step deliberately, for the case where the config wiring is ever removed.
     */
    read: ({ req }): boolean | Where => {
      const role = req.user?.role as string | undefined
      if (!req.user) return false
      if (role === 'admin' || role === 'superadmin') return true
      if (role === 'siteadmin') return { role: { not_in: ADMIN_ONLY_ROLES } }
      return { id: { equals: req.user.id } }
    },
    create: ({ req }) => {
      const role = req.user?.role as string | undefined
      return role === 'admin' || role === 'superadmin' || role === 'siteadmin'
    },
    update: ({ req }): boolean | Where => {
      const role = req.user?.role as string | undefined
      if (!req.user) return false
      if (role === 'admin' || role === 'superadmin') return true
      if (role === 'siteadmin') return { role: { not_in: ADMIN_ONLY_ROLES } }
      return { id: { equals: req.user.id } }
    },
    delete: ({ req }) => {
      const role = req.user?.role as string | undefined
      return role === 'admin' || role === 'superadmin'
    },
  },
  /*
   * Role derivation runs at collection `beforeChange`, paired with `create`/`update` field
   * access on `role` set to false.
   *
   * The pairing is the point: field access refuses any client-supplied role — a request posting
   * `role: "superadmin"` is ignored rather than honoured — while this hook still supplies the
   * server-derived value, because the `data` it returns is what gets written.
   *
   * Verified end to end against a production build: `first-register` yields `superadmin` for
   * the founding account, and posting an explicit role as an authenticated admin does not
   * override the derivation.
   *
   * Note for anyone changing this: the `role` column carries a Postgres default of 'editor'
   * from the initial migration. If a future edit stops this hook from setting the field, the
   * failure is SILENT — accounts quietly land on 'editor' rather than erroring. The integration
   * test covering first-user role assignment is what guards that.
   */
  hooks: {
    beforeChange: [
      async ({ data, req, operation, originalDoc }) => {
        if (!data) return data

        /*
         * Only re-derive when the role relationship is part of this write.
         *
         * Without this guard, saving any unrelated field (a name, an avatar) re-runs the
         * resolution with an empty selection and resets the user to the default role — a real
         * bug the reference project hit and documented.
         */
        if (operation === 'update' && !('roleSelection' in data)) {
          return { ...data, role: originalDoc?.role }
        }

        const resolved = await resolveRoleKey({
          payload: req.payload,
          selectedRole: data.roleSelection as RoleRelationshipValue,
        })
        if (resolved) return { ...data, role: resolved }

        if (operation === 'create') {
          /*
           * The founding account must be a superadmin.
           *
           * Payload's `first-register` endpoint accepts only email and password, so no role can
           * be selected. Without this the first account lands on the least-privileged role and
           * nobody can administer the system — including granting themselves the rights to fix
           * it. Every later account with no selection defaults to least privilege, which is the
           * safe direction to fail in.
           */
          const { totalDocs } = await req.payload.count({
            collection: 'users',
            overrideAccess: true,
            req,
          })
          return { ...data, role: totalDocs === 0 ? 'superadmin' : 'editor' }
        }

        return { ...data, role: originalDoc?.role ?? 'editor' }
      },
    ],
  },
  fields: [
    { name: 'name', type: 'text' },
    {
      name: 'roleSelection',
      label: 'Role',
      type: 'relationship',
      relationTo: 'role-management',
      admin: {
        description: 'Selecting a role sets the role key used by every access check.',
      },
    },
    {
      name: 'role',
      label: 'Role Key',
      type: 'text',
      index: true,
      admin: {
        readOnly: true,
        position: 'sidebar',
        description: 'Derived from the selected role. Never submitted directly.',
      },
      access: {
        /*
         * This key is what every access check reads, so it is never accepted from a client —
         * not even from an administrator. It is computed below. Closing both operations means
         * a crafted request cannot escalate its own privileges by posting `role: "superadmin"`.
         */
        create: () => false,
        update: () => false,
      },
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
      admin: { position: 'sidebar' },
    },
  ],
}
