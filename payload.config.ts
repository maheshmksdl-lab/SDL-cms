import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { buildConfig, type CollectionConfig, type GlobalConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

import {
  canCreate, canDelete, canRead, canReadRoleManagement, canReadUsersOrSelf,
  canUpdate, canUpdateUsersOrSelf, formSubmissionCreate, publicRead, publishedOnly, type ModuleKey,
} from './src/access/rbac'

import { Users } from './src/collections/Users'
import { Media } from './src/collections/Media'
import { RoleManagement } from './src/collections/RoleManagement'
import { Pages } from './src/collections/Pages'
import {
  CaseStudies, Clients, InsightCategories, Insights, Products, Redirects, Services, Testimonials,
} from './src/collections/content'
import { Forms, Leads } from './src/collections/forms'
import { EmailAccounts, EmailTemplates } from './src/collections/email'

import {
  revalidateCollection, revalidateCollectionDelete, revalidateGlobal, tagsFor,
} from './src/hooks/revalidate'
import { healthEndpoint } from './src/endpoints/health'

import { RoleModuleVisibility } from './src/globals/RoleModuleVisibility'
import { Header } from './src/globals/Header'
import { Footer } from './src/globals/Footer'
import { SiteSettings } from './src/globals/SiteSettings'
import { EmailSettings } from './src/globals/EmailSettings'

const dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * Postgres pool settings, with the TLS trust anchor the managed database needs.
 *
 * Aiven signs each service certificate with a PER-PROJECT CA that is in no system trust store,
 * so verification only succeeds if that CA is supplied explicitly. It ships in `certs/`, read
 * relative to this file — never an absolute path, which would resolve on one machine and not on
 * the deployment host.
 *
 * Two behaviours here are not obvious, and both were verified against the live database:
 *
 *   1. ANY `sslmode` in the connection string makes pg-connection-string construct its own
 *      `ssl` object, and THAT wins over the one passed below — the CA is silently ignored and
 *      the connection dies with "self-signed certificate in certificate chain". Measured:
 *      `sslmode=require` and `sslmode=verify-full` both fail, no `sslmode` succeeds. So the
 *      parameter is stripped here, making this correct whatever the environment happens to set.
 *   2. `sslrootcert` is stripped for the same precedence reason, and because pg resolves it with
 *      `fs.readFileSync` at connect time — a path valid on a developer machine throws on Linux.
 *
 * TLS is attached only for remote hosts: local development runs a plain Postgres with SSL
 * disabled, which refuses the handshake outright ("The server does not support SSL connections").
 */
function postgresPool() {
  // Dashboard-pasted values often keep the quotes from a .env file; strip them and whitespace.
  const raw = (process.env.DATABASE_URI || '').trim().replace(/^(['"])(.*)\1$/, '$2').trim()
  if (!raw) return { connectionString: '' }

  let url: URL
  try {
    url = new URL(raw)
  } catch {
    // Passing it through untouched would let an embedded sslmode override the CA below and fail
    // later with a misleading certificate error — fail here with the real cause instead.
    throw new Error('DATABASE_URI is not a valid postgres:// URL (check for stray characters)')
  }

  // Every one of these makes pg build its own ssl config, which replaces the one passed below.
  for (const param of ['ssl', 'sslmode', 'sslrootcert', 'sslcert', 'sslkey', 'uselibpqcompat']) {
    url.searchParams.delete(param)
  }

  if (/^(localhost|127\.0\.0\.1|\[::1\]|::1)$/.test(url.hostname)) {
    return { connectionString: url.toString() }
  }

  return {
    connectionString: url.toString(),
    ssl: {
      ca: fs.readFileSync(path.resolve(dirname, 'certs/aiven-ca.pem')),
      rejectUnauthorized: true,
    },
    /*
     * Serverless pool sizing. Remote means Vercel, where every concurrent invocation is a
     * SEPARATE process with its own pool — so the pool size multiplies by the number of live
     * instances, and node-postgres defaults to `max: 10` each. A handful of concurrent requests
     * therefore exhausts a managed Postgres connection limit.
     *
     * Measured against production before this was set: 12 parallel requests to
     * /api/pages?depth=2 returned 500 four times while the same request sequentially returned
     * 200 every time, and a direct psql connection was refused with "remaining connection slots
     * are reserved for roles with the SUPERUSER attribute". It also broke `next build` on the
     * web app, whose three workers fetch concurrently.
     *
     * One connection per invocation is the right shape: a serverless function handles a single
     * request at a time, so a larger pool buys nothing and only starves other instances. The
     * short idle timeout matters just as much — Vercel freezes rather than terminates instances,
     * so without it their connections stay checked out long after the request finishes.
     *
     * Two, not one: @payloadcms/db-postgres `connect()` checks out a client with `pool.connect()`
     * to attach an error listener and never releases it. With `max: 1` that permanently holds the
     * only slot, and every query then fails with "timeout exceeded when trying to connect".
     */
    max: 2,
    idleTimeoutMillis: 10_000,
    connectionTimeoutMillis: 15_000,
  }
}

// ── Origin helpers (copied from the EFTMRA reference — it parses these correctly) ──

export function normalizeOrigin(raw: string): string | null {
  const trimmed = raw.trim().replace(/\/$/, '')
  if (!trimmed) return null
  try {
    return new URL(/^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`).origin
  } catch {
    return null
  }
}

export function parseOriginList(value?: string): string[] {
  return (value ?? '')
    .split(',')
    .map((entry) => normalizeOrigin(entry))
    .filter((entry): entry is string => Boolean(entry))
}

const cmsBasePath = (process.env.NEXT_PUBLIC_CMS_BASE_PATH || '').replace(/\/$/, '')

/** Every collection's list view: Payload's own, inside the wrapper the admin theme styles. */
const sdlListView = { path: './src/components/admin/SdlListView.tsx', exportName: 'default' } as const

const serverOrigin = normalizeOrigin(process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3001')
const webOrigin = normalizeOrigin(process.env.WEB_URL || 'http://localhost:3000')

/**
 * The origins this deployment is actually reachable on, according to the platform itself.
 *
 * `VERCEL_PROJECT_PRODUCTION_URL` is the project's canonical production domain (a custom domain
 * once one is attached); `VERCEL_URL` is this specific deployment. Neither is set off-Vercel.
 *
 * These exist because of a real lockout. `NEXT_PUBLIC_SERVER_URL` was set to a deployment URL
 * that no longer existed (`sdl-cms-ten.vercel.app`) while the admin was served from
 * `sdl-cms.vercel.app`. The csrf allowlist is built from that variable, and Payload's
 * `extractJWT` DISCARDS the auth cookie outright when the request's `Origin` is not on the
 * list — so every editor was silently anonymous. Reads are public here, so the admin loaded and
 * looked fine; every save failed with "You are not allowed to perform this action."
 *
 * Trusting the platform's own answer for the CMS's origin means a stale or mistyped
 * `NEXT_PUBLIC_SERVER_URL` can no longer lock anyone out of the admin panel.
 */
const platformOrigins = [
  process.env.VERCEL_PROJECT_PRODUCTION_URL,
  process.env.VERCEL_URL,
]
  .filter((host): host is string => Boolean(host))
  .map((host) => normalizeOrigin(host))
  .filter((origin): origin is string => Boolean(origin))

function allowedOrigins(value?: string): string[] {
  const configured = parseOriginList(value)
  const defaults = [serverOrigin, webOrigin, ...platformOrigins].filter((o): o is string =>
    Boolean(o),
  )
  return [...new Set([...configured, ...defaults])]
}

/*
 * A mismatch here is not fatal any more — the allowlist above covers it — but it still means
 * every media `url` Payload emits points at the wrong host, which breaks images on the public
 * site. That is invisible from inside the CMS, so say so at boot.
 */
if (platformOrigins.length && serverOrigin && !platformOrigins.includes(serverOrigin)) {
  console.warn(
    `[payload] NEXT_PUBLIC_SERVER_URL is ${serverOrigin}, but this deployment serves ` +
      `${platformOrigins.join(', ')}. Media URLs will point at ${serverOrigin} and will not load. ` +
      `Set NEXT_PUBLIC_SERVER_URL to the domain this CMS is actually served from.`,
  )
}

/**
 * The single seam wiring every collection to RBAC, cache invalidation and shared admin
 * behaviour.
 *
 * A collection added straight to the `collections` array bypasses all of this. Always wrap.
 */
function withAccess(
  collection: CollectionConfig,
  access: NonNullable<CollectionConfig['access']>,
  moduleKey: ModuleKey,
  /** Cache tags to invalidate on the website when a document changes. */
  revalidateTagsFor?: (doc: Record<string, unknown>) => string[],
): CollectionConfig {
  const existingHidden = collection.admin?.hidden

  /*
   * Appended, never replaced. Pages already carries rewriteDescendantPathnames on afterChange,
   * and clobbering it here would silently break the pathname cascade.
   */
  const hooks: CollectionConfig['hooks'] = revalidateTagsFor
    ? {
        ...collection.hooks,
        afterChange: [...(collection.hooks?.afterChange ?? []), revalidateCollection(revalidateTagsFor)],
        afterDelete: [
          ...(collection.hooks?.afterDelete ?? []),
          revalidateCollectionDelete(revalidateTagsFor),
        ],
      }
    : collection.hooks

  return {
    ...collection,
    hooks,
    access: { ...collection.access, ...access },
    admin: {
      ...collection.admin,
      // The REST "API" tab in the document view exposes the raw endpoint URL. It is noise for
      // editors and a small information leak; the frontend uses documented queries, not this.
      hideAPIURL: true,
      hidden: (args) => {
        const role = (args.user as unknown as { role?: string } | null)?.role
        if (role === 'admin' || role === 'superadmin') return false
        if (typeof existingHidden === 'function') return existingHidden(args)
        return Boolean(existingHidden)
      },
      custom: { ...collection.admin?.custom, moduleKey },
      components: {
        ...collection.admin?.components,
        views: {
          ...collection.admin?.components?.views,
          list: { ...collection.admin?.components?.views?.list, Component: sdlListView },
        },
      },
    },
  }
}

function globalWithAccess(
  global: GlobalConfig,
  access: NonNullable<GlobalConfig['access']>,
  moduleKey: ModuleKey,
  /** Set for globals the website renders — header, footer, site settings. */
  revalidateTag?: string,
): GlobalConfig {
  return {
    ...global,
    hooks: revalidateTag
      ? {
          ...global.hooks,
          afterChange: [...(global.hooks?.afterChange ?? []), revalidateGlobal(revalidateTag)],
        }
      : global.hooks,
    access: { ...global.access, ...access },
    admin: { ...global.admin, hideAPIURL: true, custom: { ...global.admin?.custom, moduleKey } },
  }
}

/** Standard CRUD wiring for a module. Used by everything that needs no special rule. */
const crud = (m: ModuleKey) => ({
  create: canCreate(m),
  update: canUpdate(m),
  delete: canDelete(m),
})

const collections: CollectionConfig[] = [
  // ── Content ───────────────────────────────────────────────────────────────
  // publishedOnly: anonymous readers are constrained to published documents by a Where
  // clause, so drafts never leave the API; a signed-in editor sees drafts, which is what
  // makes preview work.
  withAccess(Pages, { read: publishedOnly('pages'), ...crud('pages') }, 'pages', tagsFor.pages),
  withAccess(Insights, { read: publishedOnly('insights'), ...crud('insights') }, 'insights', tagsFor.insights),
  withAccess(Services, { read: publishedOnly('services'), ...crud('services') }, 'services', tagsFor.simple('services')),
  withAccess(CaseStudies, { read: publishedOnly('case-studies'), ...crud('case-studies') }, 'case-studies', tagsFor.simple('case-studies')),

  withAccess(InsightCategories, { read: publicRead('insight-categories'), ...crud('insight-categories') }, 'insight-categories', tagsFor.simple('insight-categories')),
  withAccess(Products, { read: publicRead('products'), ...crud('products') }, 'products', tagsFor.simple('products')),
  withAccess(Clients, { read: publicRead('clients'), ...crud('clients') }, 'clients', tagsFor.simple('clients')),
  withAccess(Testimonials, { read: publicRead('testimonials'), ...crud('testimonials') }, 'testimonials', tagsFor.simple('testimonials')),
  withAccess(Redirects, { read: publicRead('redirects'), ...crud('redirects') }, 'redirects', tagsFor.simple('redirects')),
  // Media has no tag of its own: an image is always rendered by a page, and that page's tag
  // is what needs clearing. `pages` covers every consumer.
  withAccess(Media, { read: publicRead('media'), ...crud('media') }, 'media', tagsFor.simple('pages')),

  // ── Forms ─────────────────────────────────────────────────────────────────
  // The form DEFINITION is public so the frontend can render and validate against it.
  withAccess(Forms, { read: publicRead('forms'), ...crud('forms') }, 'forms', tagsFor.forms),
  // The only anonymous write on the whole API, and only through the website's form route,
  // which proves itself with the shared secret (see formSubmissionCreate).
  withAccess(Leads, {
    read: canRead('leads'),
    create: formSubmissionCreate('leads'),
    update: canUpdate('leads'),
    delete: canDelete('leads'),
  }, 'leads'),

  // ── Settings ──────────────────────────────────────────────────────────────
  withAccess(Users, {
    read: canReadUsersOrSelf(),
    create: canCreate('users'),
    update: canUpdateUsersOrSelf(),
    delete: canDelete('users'),
  }, 'users'),
  withAccess(RoleManagement, { read: canReadRoleManagement() }, 'role-management'),
  withAccess(EmailAccounts, { read: canRead('email-accounts'), ...crud('email-accounts') }, 'email-accounts'),
  withAccess(EmailTemplates, { read: canRead('email-templates'), ...crud('email-templates') }, 'email-templates'),
]

const globals: GlobalConfig[] = [
  // Header, footer and site settings are read by every public page render.
  globalWithAccess(Header, { read: publicRead('header'), update: canUpdate('header') }, 'header', 'global:header'),
  globalWithAccess(Footer, { read: publicRead('footer'), update: canUpdate('footer') }, 'footer', 'global:footer'),
  globalWithAccess(SiteSettings, { read: publicRead('site-settings'), update: canUpdate('site-settings') }, 'site-settings', 'global:site-settings'),

  // These two are configuration, never public.
  globalWithAccess(EmailSettings, { read: canRead('email-settings'), update: canUpdate('email-settings') }, 'email-settings'),
  globalWithAccess(RoleModuleVisibility, {
    read: canRead('role-management'),
    update: canUpdate('role-management'),
  }, 'role-management'),
]

export default buildConfig({
  /*
   * The admin UI is the EFTMRA Payload admin's, ported (plan: match the reference dashboard):
   * its theme lives in app/(payload)/admin-*.css, its components in src/components/admin/.
   */
  admin: {
    user: Users.slug,
    avatar: {
      Component: { path: './src/components/admin/UserAvatar.tsx', exportName: 'default' },
    },
    meta: {
      titleSuffix: ' — SDL CMS',
      icons: [
        { rel: 'icon', type: 'image/svg+xml', url: `${cmsBasePath}/sdl-mark.svg` },
        { rel: 'apple-touch-icon', type: 'image/svg+xml', url: `${cmsBasePath}/sdl-mark.svg` },
      ],
    },
    theme: 'light',
    components: {
      // The brand strip and rail/expand toggle at the head of the sidebar.
      beforeNav: [{ path: './src/components/admin/SdlAdminNav.tsx', exportName: 'default' }],
      // A Dashboard shortcut above the grouped collections.
      beforeNavLinks: [{ path: './src/components/admin/SdlAdminDashboardLink.tsx', exportName: 'default' }],
      views: {
        dashboard: {
          Component: { path: './src/components/admin/SdlDashboard.tsx', exportName: 'default' },
        },
      },
      graphics: {
        Icon: { path: './src/components/admin/SdlAdminIcon.tsx', exportName: 'default' },
        Logo: { path: './src/components/admin/SdlAdminLogo.tsx', exportName: 'default' },
      },
    },
  },

  collections,
  globals,

  // GET /api/health — DB-connectivity probe for uptime monitoring (plan §8.8).
  endpoints: [healthEndpoint],

  editor: lexicalEditor({}),
  secret: process.env.PAYLOAD_SECRET || '',
  sharp,

  db: postgresAdapter({
    pool: postgresPool(),
    /*
     * Schema changes ship as reviewed migration files, never as an implicit push. This is the
     * setting that makes `payload migrate` meaningful rather than advisory.
     */
    push: false,
  }),

  serverURL: serverOrigin || 'http://localhost:3001',

  cors: allowedOrigins(process.env.PAYLOAD_CORS_ORIGINS),
  csrf: allowedOrigins(process.env.PAYLOAD_CSRF_ORIGINS),

  /*
   * REST covers every need of the frontend, and disabling GraphQL removes an entire attack
   * surface plus its schema-generation cost from every build. See plan §8.1.
   */
  graphQL: { disable: true },

  typescript: { outputFile: path.resolve(dirname, 'src/payload-types.ts') },
})
