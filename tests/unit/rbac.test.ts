import { describe, expect, it } from 'vitest'

import {
  defaultModuleVisibility, defaultRolePermissions, moduleOptions, type ModuleKey,
} from '../../src/access/rbac'

/**
 * The compiled-in RBAC baseline. The live role × module × CRUD matrix is asserted against a
 * running Payload instance in the integration suite; this locks down the defaults it starts from
 * and the invariants the plan states in §4.13 / §5.7.
 */

const ALL: ModuleKey[] = moduleOptions.map((o) => o.value)

describe('defaultRolePermissions', () => {
  it('has an entry for every built-in role and every module', () => {
    for (const role of ['preview', 'editor', 'manager', 'siteadmin', 'admin', 'superadmin']) {
      expect(defaultRolePermissions[role]).toBeDefined()
      for (const m of ALL) expect(defaultRolePermissions[role]![m]).toBeDefined()
    }
  })

  it('gives admin and superadmin full access to everything', () => {
    for (const role of ['admin', 'superadmin']) {
      for (const m of ALL) {
        expect(defaultRolePermissions[role]![m]).toEqual({
          create: true, read: true, update: true, delete: true,
        })
      }
    }
  })

  it('lets editors create and update content but never delete it (plan §4.13)', () => {
    const pages = defaultRolePermissions.editor!.pages
    expect(pages).toMatchObject({ create: true, read: true, update: true, delete: false })
  })

  it('does not let an editor touch users, roles or settings at all', () => {
    for (const m of ['users', 'role-management', 'site-settings', 'email-settings'] as ModuleKey[]) {
      expect(defaultRolePermissions.editor![m]).toEqual({
        create: false, read: false, update: false, delete: false,
      })
    }
  })

  it('lets a manager read and annotate leads but not delete them', () => {
    expect(defaultRolePermissions.manager!.leads).toEqual({
      create: false, read: true, update: true, delete: false,
    })
  })

  it('lets a site admin delete leads, but globals stay read/update only', () => {
    expect(defaultRolePermissions.siteadmin!.leads.delete).toBe(true)
    for (const g of ['header', 'footer', 'site-settings', 'email-settings'] as ModuleKey[]) {
      expect(defaultRolePermissions.siteadmin![g]).toMatchObject({ create: false, delete: false })
    }
  })

  it('makes the preview service identity strictly read-only', () => {
    const preview = defaultRolePermissions.preview!
    for (const m of ALL) {
      expect(preview[m].create).toBe(false)
      expect(preview[m].update).toBe(false)
      expect(preview[m].delete).toBe(false)
    }
    // …and it can read what the public site renders.
    expect(preview.pages.read).toBe(true)
    expect(preview.insights.read).toBe(true)
    expect(preview.users.read).toBe(false)
  })
})

describe('defaultModuleVisibility', () => {
  it('is a strict superset chain: editor ⊆ manager ⊆ siteadmin ⊆ all', () => {
    const editor = new Set(defaultModuleVisibility.editor)
    const manager = new Set(defaultModuleVisibility.manager)
    const siteadmin = new Set(defaultModuleVisibility.siteadmin)

    for (const m of editor) expect(manager.has(m)).toBe(true)
    for (const m of manager) expect(siteadmin.has(m)).toBe(true)
    expect(defaultModuleVisibility.admin).toEqual(ALL)
  })
})
