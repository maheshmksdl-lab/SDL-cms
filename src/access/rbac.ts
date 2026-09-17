/**
 * Role-based access control.
 *
 * Adapted from the EFTMRA reference (`src/access/rbac.ts`, 984 lines) with every
 * practitioner- and trainer-specific helper removed and the module set regenerated for SDL.
 *
 * The model is a `role × module × operation` matrix:
 *   - `defaultRolePermissions` is the compiled-in baseline.
 *   - The `role-module-visibility` global and the `role-management` collection override it
 *     at runtime, so an administrator can change permissions without a deploy.
 *   - Results are cached per request, because access functions run many times per operation.
 *
 * These functions are the SECURITY BOUNDARY. `admin.hidden` only removes UI.
 */
import type { Access, AccessArgs as PayloadAccessArgs, Where } from 'payload'

export const ADMIN_ONLY_ROLES = ['admin', 'superadmin'] as const

export type Role = string

export type ModuleKey =
  | 'pages'
  | 'insights'
  | 'insight-categories'
  | 'services'
  | 'products'
  | 'case-studies'
  | 'clients'
  | 'testimonials'
  | 'media'
  | 'forms'
  | 'leads'
  | 'redirects'
  | 'users'
  | 'role-management'
  | 'email-accounts'
  | 'email-templates'
  | 'header'
  | 'footer'
  | 'site-settings'
  | 'email-settings'

export type CrudOperation = 'create' | 'read' | 'update' | 'delete'
export type ModulePermissions = Record<CrudOperation, boolean>
type RolePermissions = Record<Role, Record<ModuleKey, ModulePermissions>>

type PermissionRow = {
  module?: ModuleKey | null
  role?: string | null
} & Partial<Record<CrudOperation, boolean | null>>

type AccessArgs = PayloadAccessArgs

const roleRank: Record<string, number> = {
  // A non-human service identity: the web app's `preview@` API-key user. Read-only, and ranked
  // below every editorial role so a `hasRole` gate can never admit it.
  preview: 0,
  editor: 1,
  manager: 2,
  siteadmin: 3,
  admin: 4,
  superadmin: 5,
}

export const moduleOptions: { label: string; value: ModuleKey }[] = [
  { label: 'Pages', value: 'pages' },
  { label: 'Insights', value: 'insights' },
  { label: 'Insight Categories', value: 'insight-categories' },
  { label: 'Services', value: 'services' },
  { label: 'Products', value: 'products' },
  { label: 'Case Studies', value: 'case-studies' },
  { label: 'Clients', value: 'clients' },
  { label: 'Testimonials', value: 'testimonials' },
  { label: 'Media', value: 'media' },
  { label: 'Forms', value: 'forms' },
  { label: 'Leads', value: 'leads' },
  { label: 'Redirects', value: 'redirects' },
  { label: 'Users', value: 'users' },
  { label: 'Role Management', value: 'role-management' },
  { label: 'Email Accounts', value: 'email-accounts' },
  { label: 'Email Templates', value: 'email-templates' },
  { label: 'Header', value: 'header' },
  { label: 'Footer', value: 'footer' },
  { label: 'Site Settings', value: 'site-settings' },
  { label: 'Email Settings', value: 'email-settings' },
]

const ALL_MODULES = moduleOptions.map(({ value }) => value)

/** Content an editor can write, but not the site's structure or configuration. */
const EDITOR_MODULES: ModuleKey[] = [
  'pages', 'insights', 'insight-categories', 'media', 'testimonials', 'case-studies',
]

/** A manager also owns the marketing surface: services, clients, forms and the nav. */
const MANAGER_MODULES: ModuleKey[] = [
  ...EDITOR_MODULES, 'services', 'products', 'clients', 'forms', 'leads', 'header', 'footer', 'redirects',
]

/** A site admin additionally operates the system: users, roles, email and settings. */
const SITEADMIN_MODULES: ModuleKey[] = [
  ...MANAGER_MODULES, 'users', 'role-management',
  'email-accounts', 'email-templates', 'site-settings', 'email-settings',
]

/** Everything the public site renders — what the `preview@` service user needs to read drafts. */
const PREVIEW_MODULES: ModuleKey[] = [
  'pages', 'insights', 'insight-categories', 'services', 'products', 'case-studies',
  'clients', 'testimonials', 'media', 'forms', 'redirects', 'header', 'footer', 'site-settings',
]

export const defaultModuleVisibility: Record<string, ModuleKey[]> = {
  preview: PREVIEW_MODULES,
  editor: EDITOR_MODULES,
  manager: MANAGER_MODULES,
  siteadmin: SITEADMIN_MODULES,
  admin: ALL_MODULES,
  superadmin: ALL_MODULES,
}

const noAccess: ModulePermissions = { create: false, read: false, update: false, delete: false }

function permissions(ops: CrudOperation[]): ModulePermissions {
  return {
    create: ops.includes('create'),
    read: ops.includes('read'),
    update: ops.includes('update'),
    delete: ops.includes('delete'),
  }
}

function matrixFor(
  visible: ModuleKey[],
  ops: CrudOperation[],
  overrides: Partial<Record<ModuleKey, CrudOperation[]>> = {},
): Record<ModuleKey, ModulePermissions> {
  return Object.fromEntries(
    ALL_MODULES.map((m) => {
      if (overrides[m]) return [m, permissions(overrides[m]!)]
      return [m, visible.includes(m) ? permissions(ops) : noAccess]
    }),
  ) as Record<ModuleKey, ModulePermissions>
}

const FULL: CrudOperation[] = ['create', 'read', 'update', 'delete']

export const defaultRolePermissions: RolePermissions = {
  // Read-only, everywhere the public site reads. Never create/update/delete — this identity
  // only exists so the web app can fetch drafts during preview.
  preview: matrixFor(PREVIEW_MODULES, ['read']),

  /*
   * Editors deliberately cannot DELETE. Removing a page or an article is not an editorial
   * act — it breaks live URLs and inbound links. Unpublishing achieves the editorial intent
   * and is reversible, so the destructive operation stays with manager and above.
   */
  editor: matrixFor(EDITOR_MODULES, ['create', 'read', 'update']),

  manager: matrixFor(MANAGER_MODULES, FULL, {
    // Leads are records of real enquiries: readable and annotatable, never deletable here.
    leads: ['read', 'update'],
  }),

  siteadmin: matrixFor(SITEADMIN_MODULES, FULL, {
    leads: ['read', 'update', 'delete'],
    // Globals have no create/delete — Payload manages the single document.
    header: ['read', 'update'],
    footer: ['read', 'update'],
    'site-settings': ['read', 'update'],
    'email-settings': ['read', 'update'],
  }),

  admin: matrixFor(ALL_MODULES, FULL),
  superadmin: matrixFor(ALL_MODULES, FULL),
}

// ── Runtime resolution ───────────────────────────────────────────────────────

type AccessUserWithRole = NonNullable<PayloadAccessArgs['req']['user']> & { role?: Role | null }

function getRole(args: AccessArgs): Role | null {
  const user = args.req.user as AccessUserWithRole | null
  const role = user?.role
  return typeof role === 'string' && role ? role : null
}

/*
 * Per-request caches.
 *
 * An access function runs many times within a single operation (once per collection touched,
 * plus once per related document at depth). Without this, each call re-queries the permission
 * global and the role collection. Keyed by the request object, so it cannot leak between
 * requests and needs no invalidation.
 */
const permissionCache = new WeakMap<object, RolePermissions>()
const visibilityCache = new WeakMap<object, Record<string, Set<ModuleKey>>>()

function rowsToPermissions(rows: PermissionRow[]): RolePermissions {
  const result: RolePermissions = JSON.parse(JSON.stringify(defaultRolePermissions))

  for (const row of rows) {
    const role = row.role
    const moduleKey = row.module
    if (!role || !moduleKey) continue
    if (!result[role]) {
      result[role] = matrixFor([], []) // an unknown role starts closed
    }
    const current = result[role]![moduleKey]
    if (!current) continue
    for (const op of ['create', 'read', 'update', 'delete'] as CrudOperation[]) {
      if (typeof row[op] === 'boolean') current[op] = row[op] as boolean
    }
  }

  return result
}

async function getRolePermissions(args: AccessArgs): Promise<RolePermissions> {
  const { req } = args
  const cached = permissionCache.get(req as unknown as object)
  if (cached) return cached

  let resolved: RolePermissions = defaultRolePermissions
  try {
    const global = (await req.payload.findGlobal({
      slug: 'role-module-visibility',
      depth: 0,
      overrideAccess: true,
      req,
    })) as { permissions?: PermissionRow[] | null }

    if (Array.isArray(global?.permissions) && global.permissions.length) {
      resolved = rowsToPermissions(global.permissions)
    }
  } catch {
    // A missing or unreadable global must not lock everyone out — fall back to the
    // compiled-in defaults, which are the same values the global is seeded with.
    resolved = defaultRolePermissions
  }

  permissionCache.set(req as unknown as object, resolved)
  return resolved
}

async function getModuleVisibility(args: AccessArgs): Promise<Record<string, Set<ModuleKey>>> {
  const { req } = args
  const cached = visibilityCache.get(req as unknown as object)
  if (cached) return cached

  const perms = await getRolePermissions(args)
  const visibility: Record<string, Set<ModuleKey>> = {}
  for (const [role, modules] of Object.entries(perms)) {
    visibility[role] = new Set(
      (Object.entries(modules) as [ModuleKey, ModulePermissions][])
        .filter(([, p]) => p.create || p.read || p.update || p.delete)
        .map(([m]) => m),
    )
  }

  visibilityCache.set(req as unknown as object, visibility)
  return visibility
}

export async function canAccessModule(args: AccessArgs, moduleKey: ModuleKey): Promise<boolean> {
  const role = getRole(args)
  if (!role) return false
  if (role === 'admin' || role === 'superadmin') return true
  const visibility = await getModuleVisibility(args)
  return Boolean(visibility[role]?.has(moduleKey))
}

async function canUseOperation(
  args: AccessArgs,
  moduleKey: ModuleKey,
  operation: CrudOperation,
): Promise<boolean> {
  const role = getRole(args)
  if (!role) return false
  if (role === 'admin' || role === 'superadmin') return true
  const perms = await getRolePermissions(args)
  return Boolean(perms[role]?.[moduleKey]?.[operation])
}

// ── Access-function factories ────────────────────────────────────────────────

export function hasRole(minimumRole: Role) {
  return ((args: AccessArgs) => {
    const role = getRole(args)
    return role ? (roleRank[role] ?? 0) >= (roleRank[minimumRole] ?? 0) : false
  }) satisfies Access
}

export function canCreate(moduleKey: ModuleKey) {
  return ((args: AccessArgs) => canUseOperation(args, moduleKey, 'create')) satisfies Access
}

export function canRead(moduleKey: ModuleKey) {
  return ((args: AccessArgs) => canUseOperation(args, moduleKey, 'read')) satisfies Access
}

export function canUpdate(moduleKey: ModuleKey) {
  return ((args: AccessArgs) => canUseOperation(args, moduleKey, 'update')) satisfies Access
}

export function canDelete(moduleKey: ModuleKey) {
  return ((args: AccessArgs) => canUseOperation(args, moduleKey, 'delete')) satisfies Access
}

/** Anonymous visitors read freely; a signed-in user is still subject to the matrix. */
export function publicRead(moduleKey?: ModuleKey) {
  return (async (args: AccessArgs) => {
    if (!args.req.user || !moduleKey) return true
    return canUseOperation(args, moduleKey, 'read')
  }) satisfies Access
}

/**
 * Public read of published documents only.
 *
 * Anonymous requests are constrained with a `Where` rather than a boolean, so drafts never
 * leave the API. A signed-in user with read permission sees drafts too, which is what makes
 * preview work.
 */
export function publishedOnly(moduleKey?: ModuleKey, statusField = '_status') {
  return (async (args: AccessArgs): Promise<boolean | Where> => {
    if (args.req.user && moduleKey && (await canUseOperation(args, moduleKey, 'read'))) {
      return true
    }
    return { [statusField]: { equals: 'published' } } as Where
  }) satisfies Access
}

/** Anonymous create, for public form submissions. */
export function publicCreate(moduleKey?: ModuleKey) {
  return (async (args: AccessArgs) => {
    if (!args.req.user) return true
    if (!moduleKey) return true
    return canUseOperation(args, moduleKey, 'create')
  }) satisfies Access
}

export function canReadUsersOrSelf() {
  return (async (args: AccessArgs): Promise<boolean | Where> => {
    if (await canUseOperation(args, 'users', 'read')) {
      // A site admin must not be able to enumerate or inspect admin accounts.
      if (getRole(args) === 'siteadmin') return { role: { not_in: [...ADMIN_ONLY_ROLES] } }
      return true
    }
    const userID = args.req.user?.id
    if (!userID) return false
    return { id: { equals: userID } }
  }) satisfies Access
}

export function canUpdateUsersOrSelf() {
  return (async (args: AccessArgs): Promise<boolean | Where> => {
    if (await canUseOperation(args, 'users', 'update')) {
      if (getRole(args) === 'siteadmin') return { role: { not_in: [...ADMIN_ONLY_ROLES] } }
      return true
    }
    // Fallback so staff can edit their own name or avatar.
    const userID = args.req.user?.id
    if (!userID) return false
    return { id: { equals: userID } }
  }) satisfies Access
}

export function canReadRoleManagement() {
  return (async (args: AccessArgs): Promise<boolean | Where> => {
    if (!(await canUseOperation(args, 'role-management', 'read'))) return false
    if (getRole(args) === 'siteadmin') return { value: { not_in: [...ADMIN_ONLY_ROLES] } }
    return true
  }) satisfies Access
}
