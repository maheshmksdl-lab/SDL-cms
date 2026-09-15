import type { Payload } from 'payload'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { defaultRolePermissions, moduleOptions, type CrudOperation, type ModuleKey } from '../../src/access/rbac'
import { getTestPayload } from './helpers'

/**
 * The role × module × CRUD matrix, asserted against a live Payload instance (plan §9.1, §9.6).
 *
 * For each editorial role and each module, this drives a real API request as a user with that
 * role and asserts the effective read permission matches `defaultRolePermissions`.
 *
 * Skips itself when no database is reachable. Everything it creates — the users, and any role it
 * had to add because the database is unseeded (CI runs this before `pnpm seed`) — is deleted
 * afterwards, so it can run against a development database.
 */

let payload: Payload | null = null
type TestUser = { id: number; role: string; email: string }
const roleUsers = new Map<string, TestUser>()
const createdRoleIds: number[] = []

const TESTED_ROLES = ['editor', 'manager', 'siteadmin'] as const
const ROLE_LABELS: Record<(typeof TESTED_ROLES)[number], string> = {
  editor: 'Editor',
  manager: 'Manager',
  siteadmin: 'Site Admin',
}

const COLLECTION_FOR_MODULE: Partial<Record<ModuleKey, string>> = {
  pages: 'pages',
  insights: 'insights',
  services: 'services',
  'case-studies': 'case-studies',
  clients: 'clients',
  testimonials: 'testimonials',
  redirects: 'redirects',
  media: 'media',
  forms: 'forms',
  leads: 'leads',
  users: 'users',
}

/**
 * What a DENIED read looks like. It depends on each collection's read rule in payload.config.ts,
 * and only one of them is an error:
 *
 *   forbidden       canRead / publicRead — a signed-in user without read permission is refused.
 *   published-only  publishedOnly — the public site's content stays readable to anyone, so a
 *                   denial narrows the query to published documents rather than refusing it.
 *   self-only       canReadUsersOrSelf — staff can always read their own account.
 */
const DENIED_READ: Record<string, 'forbidden' | 'published-only' | 'self-only'> = {
  pages: 'published-only',
  insights: 'published-only',
  services: 'published-only',
  'case-studies': 'published-only',
  clients: 'forbidden',
  testimonials: 'forbidden',
  redirects: 'forbidden',
  media: 'forbidden',
  forms: 'forbidden',
  leads: 'forbidden',
  users: 'self-only',
}

beforeAll(async () => {
  payload = await getTestPayload()
  if (!payload) return

  for (const role of TESTED_ROLES) {
    // The role key is derived from `roleSelection` by the Users beforeChange hook — a `role`
    // posted directly is ignored by design — so each user is given the real role document.
    const existingRole = await payload.find({
      collection: 'role-management',
      where: { value: { equals: role } },
      overrideAccess: true,
      limit: 1,
    })
    let roleId = existingRole.docs[0]?.id as number | undefined
    if (!roleId) {
      const created = await payload.create({
        collection: 'role-management',
        data: { label: ROLE_LABELS[role] } as never,
        overrideAccess: true,
      })
      roleId = created.id as number
      createdRoleIds.push(roleId)
    }

    const email = `matrix-${role}@test.local`
    const stale = await payload.find({
      collection: 'users',
      where: { email: { equals: email } },
      overrideAccess: true,
    })
    for (const doc of stale.docs) {
      await payload.delete({ collection: 'users', id: doc.id, overrideAccess: true })
    }

    const user = await payload.create({
      collection: 'users',
      data: { email, password: 'test-Password-123', roleSelection: roleId } as never,
      overrideAccess: true,
    })
    roleUsers.set(role, user as unknown as TestUser)
  }
})

afterAll(async () => {
  if (!payload) return
  for (const user of roleUsers.values()) {
    await payload.delete({ collection: 'users', id: user.id, overrideAccess: true })
  }
  for (const id of createdRoleIds) {
    await payload.delete({ collection: 'role-management', id, overrideAccess: true })
  }
})

describe.skipIf(!process.env.DATABASE_URI)('RBAC read access', () => {
  it('boots a Payload instance', () => {
    expect(payload, 'no database — start PostgreSQL and point DATABASE_URI at it').not.toBeNull()
  })

  it('derives each test user’s role key from its role selection', () => {
    for (const role of TESTED_ROLES) {
      expect(roleUsers.get(role)?.role).toBe(role)
    }
  })

  for (const { value: moduleKey } of moduleOptions) {
    const collection = COLLECTION_FOR_MODULE[moduleKey]
    if (!collection) continue

    for (const role of TESTED_ROLES) {
      const expected = defaultRolePermissions[role]?.[moduleKey]?.read ?? false

      it(`${role} ${expected ? 'can' : 'cannot'} read ${moduleKey}`, async () => {
        if (!payload) return
        const user = roleUsers.get(role)
        expect(user, `no test user for ${role}`).toBeDefined()

        const find = (where?: Record<string, unknown>) =>
          payload!.find({
            collection: collection as never,
            limit: 100,
            overrideAccess: false,
            user: { ...user!, collection: 'users' } as never,
            ...(where ? { where: where as never } : {}),
          })

        if (expected) {
          await expect(find()).resolves.toBeDefined()
          return
        }

        switch (DENIED_READ[collection]) {
          case 'forbidden':
            await expect(find()).rejects.toThrow(/[Ff]orbidden|not allowed/)
            break
          case 'published-only': {
            // The access Where is ANDed with the query, so asking for drafts must find none.
            const drafts = await find({ _status: { not_equals: 'published' } })
            expect(drafts.docs).toHaveLength(0)
            break
          }
          case 'self-only': {
            const result = await find()
            expect(result.docs.map((doc) => (doc as { id: number }).id)).toEqual([user!.id])
            break
          }
          default:
            throw new Error(`no denied-read rule recorded for ${collection}`)
        }
      })
    }
  }
})

/** A cell-by-cell sanity check that runs with no DB — the matrix shape itself. */
describe('matrix shape (no DB required)', () => {
  it('every module in moduleOptions has a create/read/update/delete entry for every role', () => {
    const ops: CrudOperation[] = ['create', 'read', 'update', 'delete']
    for (const role of Object.keys(defaultRolePermissions)) {
      for (const { value } of moduleOptions) {
        for (const op of ops) {
          expect(typeof defaultRolePermissions[role]![value][op]).toBe('boolean')
        }
      }
    }
  })
})
