'use client'

import { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { useAuth, useField, useFormFields } from '@payloadcms/ui'

import { withCmsBasePath } from './adminBasePath'

/**
 * The Role Permissions matrix.
 *
 * Ported from the EFTMRA reference (`src/components/admin/RolePermissionsMatrix.tsx`), which
 * replaces Payload's default rendering of a 100+ row array field — a column of collapsed
 * "Permission 37" strips that cannot be scanned or compared — with a role × module grid.
 *
 * Structure: a module list on the left scrolls the grid on the right, one column per role, and
 * each cell carries the four CRUD switches for that role in that module.
 *
 * Three deliberate differences from the reference:
 *
 *  1. It drives the `permissions` array this project already had, rather than the reference's
 *     parallel `rolePermissions` + four per-role arrays. One array stays the single source of
 *     truth, and the `normalize()` hooks on the global keep it complete.
 *  2. Admin and Super Admin are not columns. `canUseOperation` short-circuits to true for both
 *     before it ever reads the matrix, so a switch for them would change nothing — which is
 *     what the global's own description already promises editors.
 *  3. Styles live in `app/(payload)/admin-role-permissions.css` with the rest of the admin
 *     theme, not in a `<style jsx>` block, and use the SDL tokens.
 */

type CrudOperation = 'create' | 'read' | 'update' | 'delete'

type ModuleOption = { label: string; value: string }

type RoleDefaults = Record<string, Record<string, Record<CrudOperation, boolean>>>

type PermissionRow = {
  id?: string | null
  module?: string | null
  role?: string | null
} & Partial<Record<CrudOperation, boolean | null>>

type ManagedRole = { active?: boolean | null; label?: string | null; value?: string | null }

type Props = {
  field?: {
    admin?: {
      custom?: {
        defaultPermissions?: RoleDefaults
        modules?: ModuleOption[]
      }
    }
  }
}

const ROLE_LABELS: Record<string, string> = {
  preview: 'Preview',
  editor: 'Editor',
  manager: 'Manager',
  siteadmin: 'Site Admin',
  admin: 'Admin',
  superadmin: 'Super Admin',
}

/** Roles that bypass the matrix entirely, so showing them would imply control that is not there. */
const UNGOVERNED_ROLES = new Set(['admin', 'superadmin'])

const OPERATIONS: { label: string; shortLabel: string; value: CrudOperation }[] = [
  { label: 'Create', shortLabel: 'C', value: 'create' },
  { label: 'Read', shortLabel: 'R', value: 'read' },
  { label: 'Update', shortLabel: 'U', value: 'update' },
  { label: 'Delete', shortLabel: 'D', value: 'delete' },
]

/**
 * `preview` is the web app's API-key service identity, not a person. rbac.ts states the rule —
 * "Read-only […] Never create/update/delete" — but nothing enforced it, and a stray click here
 * would have handed the public site's credentials write access to the whole CMS.
 */
function isLocked(role: string, operation: CrudOperation) {
  return role === 'preview' && operation !== 'read'
}

function moduleSectionId(moduleValue: string) {
  return `sdl-rbac-module-${moduleValue}`
}

function PermissionToggle({
  label,
  shortLabel,
  path,
  locked,
}: {
  label: string
  shortLabel: string
  path: string
  locked: boolean
}) {
  const { value, setValue } = useField<boolean>({ path })

  // A locked permission is not merely un-clickable: if one was stored as true before the lock
  // existed, it has to be driven back to false or the matrix would show a state it forbids.
  useEffect(() => {
    if (locked && value) setValue(false)
  }, [locked, setValue, value])

  return (
    <label className="sdl-role-permissions__toggle" data-locked={locked ? 'true' : undefined}>
      <span className="sdl-role-permissions__toggle-text">
        <span className="sdl-role-permissions__toggle-short" aria-hidden="true">
          {shortLabel}
        </span>
        {label}
      </span>
      <input
        type="checkbox"
        checked={locked ? false : Boolean(value)}
        disabled={locked}
        onChange={(event) => setValue(event.target.checked)}
      />
      <span className="sdl-role-permissions__switch" aria-hidden="true" />
    </label>
  )
}

export default function SdlRolePermissionsMatrix({ field }: Props) {
  const modules = useMemo(() => field?.admin?.custom?.modules ?? [], [field])
  const defaults = field?.admin?.custom?.defaultPermissions
  const { user } = useAuth()
  const viewerRole = (user as { role?: string } | null)?.role

  const { value: permissionsValue, setValue: setPermissionsValue } = useField<PermissionRow[]>({
    path: 'permissions',
  })

  const [managedRoles, setManagedRoles] = useState<ManagedRole[] | null>(null)
  const [activeModule, setActiveModule] = useState(modules[0]?.value ?? '')
  const scrollRef = useRef<HTMLDivElement | null>(null)

  /*
   * Read the row index for every (role, module) straight out of form state.
   *
   * Going through form state rather than the array's own value is what makes the checkbox paths
   * below reliable: Payload stores an array field's rows as individual `permissions.N.*` entries,
   * and the value returned for the parent path is not guaranteed to be the row array itself.
   * A joined string is returned rather than a Map so the selector result compares by value —
   * returning a fresh object here re-renders the whole grid on every keystroke in the form.
   */
  const rowKeys = useFormFields(([fields]) => {
    if (!fields) return ''
    const keys: string[] = []
    for (const path of Object.keys(fields)) {
      const match = /^permissions\.(\d+)\.role$/.exec(path)
      if (!match) continue
      const index = match[1]
      const role = fields[`permissions.${index}.role`]?.value
      const moduleValue = fields[`permissions.${index}.module`]?.value
      if (typeof role === 'string' && typeof moduleValue === 'string') {
        keys.push(`${role}:${moduleValue}:${index}`)
      }
    }
    return keys.join('|')
  })

  const indexByKey = useMemo(() => {
    const map = new Map<string, number>()
    if (!rowKeys) return map
    for (const entry of rowKeys.split('|')) {
      const parts = entry.split(':')
      const index = Number(parts.pop())
      if (Number.isNaN(index)) continue
      map.set(parts.join(':'), index)
    }
    return map
  }, [rowKeys])

  // Custom roles live in `role-management`; without them a role added there would never appear.
  useEffect(() => {
    const controller = new AbortController()

    fetch(withCmsBasePath('/api/role-management?depth=0&limit=100&sort=sortOrder'), {
      credentials: 'include',
      signal: controller.signal,
    })
      .then((response) => (response.ok ? response.json() : { docs: [] }))
      .then((data: { docs?: ManagedRole[] }) =>
        setManagedRoles(Array.isArray(data.docs) ? data.docs : []),
      )
      .catch((error: Error) => {
        // An aborted fetch is the effect cleaning up, not a failure worth reacting to.
        if (error.name !== 'AbortError') setManagedRoles([])
      })

    return () => controller.abort()
  }, [])

  const roleOptions = useMemo(() => {
    const fromDefaults = Object.keys(defaults ?? {}).map((value) => ({ value, label: '' }))
    const fromRegistry = (managedRoles ?? [])
      .filter((role) => role.active !== false && role.value)
      .map((role) => ({ value: String(role.value), label: role.label?.trim() ?? '' }))

    const byValue = new Map<string, string>()
    for (const { value, label } of [...fromDefaults, ...fromRegistry]) {
      if (UNGOVERNED_ROLES.has(value)) continue
      // A siteadmin must not even see that the privileged roles exist, matching the same rule in
      // rbac.ts and the role-management collection's read access.
      if (viewerRole === 'siteadmin' && UNGOVERNED_ROLES.has(value)) continue
      if (label || !byValue.has(value)) byValue.set(value, label || ROLE_LABELS[value] || value)
    }

    return [...byValue].map(([value, label]) => ({ value, label }))
  }, [defaults, managedRoles, viewerRole])

  /*
   * Give a newly registered role a full set of rows.
   *
   * The global's `normalize()` rebuilds rows for the compiled-in roles plus any role already
   * present in the stored data — a role just created in `role-management` is in neither, so
   * without this it would render as a column of empty cells that can never be filled.
   */
  useEffect(() => {
    if (!roleOptions.length || !modules.length || managedRoles === null) return

    const rows = Array.isArray(permissionsValue) ? permissionsValue : []
    if (!rows.length) return

    const present = new Set(
      rows.filter((row) => row.role && row.module).map((row) => `${row.role}:${row.module}`),
    )

    const additions: PermissionRow[] = []
    for (const role of roleOptions) {
      for (const moduleOption of modules) {
        if (present.has(`${role.value}:${moduleOption.value}`)) continue
        const seed = defaults?.[role.value]?.[moduleOption.value]
        additions.push({
          role: role.value,
          module: moduleOption.value,
          create: Boolean(seed?.create),
          read: Boolean(seed?.read),
          update: Boolean(seed?.update),
          delete: Boolean(seed?.delete),
        })
      }
    }

    if (additions.length) setPermissionsValue([...rows, ...additions])
  }, [defaults, managedRoles, modules, permissionsValue, roleOptions, setPermissionsValue])

  useEffect(() => {
    if (!activeModule && modules[0]?.value) setActiveModule(modules[0].value)
  }, [activeModule, modules])

  function scrollToModule(moduleValue: string) {
    setActiveModule(moduleValue)
    const container = scrollRef.current
    const row = container?.querySelector<HTMLElement>(`#${moduleSectionId(moduleValue)}`)
    if (container && row) {
      container.scrollTo({ behavior: 'smooth', top: Math.max(row.offsetTop - 55, 0) })
    }
  }

  function syncActiveModuleToScroll() {
    const container = scrollRef.current
    if (!container) return

    const rows = Array.from(container.querySelectorAll<HTMLElement>('[data-module-value]'))
    const current = rows.reduce<HTMLElement | null>(
      (found, row) => (row.offsetTop <= container.scrollTop + 64 ? row : found),
      rows[0] ?? null,
    )

    const moduleValue = current?.dataset.moduleValue
    if (moduleValue && moduleValue !== activeModule) setActiveModule(moduleValue)
  }

  function pathFor(role: string, moduleValue: string, operation: CrudOperation) {
    const index = indexByKey.get(`${role}:${moduleValue}`)
    return index === undefined ? '' : `permissions.${index}.${operation}`
  }

  if (!modules.length || !roleOptions.length) return null

  return (
    <div className="sdl-role-permissions">
      <aside className="sdl-role-permissions__nav" aria-label="Modules">
        <div className="sdl-role-permissions__nav-title">Modules</div>
        <div className="sdl-role-permissions__module-list">
          {modules.map((moduleOption) => (
            <a
              key={moduleOption.value}
              href={`#${moduleSectionId(moduleOption.value)}`}
              aria-current={moduleOption.value === activeModule ? 'true' : undefined}
              className={`sdl-role-permissions__module${
                moduleOption.value === activeModule ? ' is-active' : ''
              }`}
              onClick={(event) => {
                event.preventDefault()
                scrollToModule(moduleOption.value)
              }}
            >
              {moduleOption.label}
            </a>
          ))}
        </div>
      </aside>

      <main className="sdl-role-permissions__panel">
        <div className="sdl-role-permissions__panel-header">
          <div>
            <span>Permissions</span>
            <strong>All Modules</strong>
          </div>
          <div className="sdl-role-permissions__role-count">
            {roleOptions.length} {roleOptions.length === 1 ? 'role' : 'roles'}
          </div>
        </div>

        <div
          className="sdl-role-permissions__table-scroll"
          onScroll={syncActiveModuleToScroll}
          ref={scrollRef}
          style={{ '--sdl-role-count': roleOptions.length } as CSSProperties}
        >
          <table className="sdl-role-permissions__table">
            <thead>
              <tr>
                {roleOptions.map((role) => (
                  <th key={role.value} scope="col">
                    <span className="sdl-role-permissions__role-title">{role.label}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {modules.map((moduleOption) => (
                <Fragment key={moduleOption.value}>
                  <tr data-module-value={moduleOption.value} id={moduleSectionId(moduleOption.value)}>
                    <th
                      className="sdl-role-permissions__module-cell"
                      colSpan={roleOptions.length}
                      scope="rowgroup"
                    >
                      <span className="sdl-role-permissions__module-label">
                        {moduleOption.label}
                      </span>
                    </th>
                  </tr>
                  <tr onMouseEnter={() => setActiveModule(moduleOption.value)}>
                    {roleOptions.map((role) => (
                      <td key={role.value}>
                        <div className="sdl-role-permissions__toggles">
                          {OPERATIONS.map((operation) => {
                            const path = pathFor(role.value, moduleOption.value, operation.value)
                            if (!path) return null
                            return (
                              <PermissionToggle
                                key={operation.value}
                                label={operation.label}
                                shortLabel={operation.shortLabel}
                                path={path}
                                locked={isLocked(role.value, operation.value)}
                              />
                            )
                          })}
                        </div>
                      </td>
                    ))}
                  </tr>
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}
