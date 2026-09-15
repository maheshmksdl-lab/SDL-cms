# SDL CMS

Payload CMS 3.88 on Next.js 16. Owns all content, media, users, roles, forms and site
configuration. Serves `/admin` and the REST API on **port 3001**.

## Structure

```
cms/
├─ payload.config.ts            Single wiring point — collections, globals, plugins, access
├─ next.config.ts               withPayload + Turbopack config
├─ app/(payload)/               Payload's mounted admin + API routes (generated shells), and the
│                               admin theme — admin-tokens/theme/overrides/dashboard.css
│  ├─ admin/[[...segments]]/
│  └─ api/[...slug]/
├─ src/
│  ├─ access/                   rbac.ts — role × module × CRUD engine
│  ├─ admin/                    Shared admin form-layout system
│  │  └─ form/
│  ├─ blocks/                   The 22 page-builder block definitions
│  │  └─ shared/                sectionSettings, link, ctaGroup — spread into every block
│  ├─ collections/              pages, insights, services, media, forms, leads, users, …
│  ├─ components/admin/         The admin UI ported from EFTMRA — sidebar nav, dashboard, login
│  │                            logo, avatar, list view (docs/DECISIONS.md #22)
│  ├─ email/                    Delivery adapters + template rendering
│  ├─ fields/                   Reusable field factories — slug, pathname, seo, iconKey
│  ├─ globals/                  header, footer, site-settings, email-settings, …
│  ├─ hooks/                    revalidate, computePathname, populatePublishedAt
│  ├─ lib/                      Registry option lists mirrored for admin selects
│  ├─ migrations/               Explicit migrations — push is off in production
│  └─ seeds/                    The 14 design pages as seed data
├─ media/                       Local uploads (dev only — gitignored)
├─ scripts/                     verify-env, audits, one-off maintenance
└─ tests/                       Unit + integration (access-control matrix)
```

> **Layout note.** `payload.config.ts` sits at the root and content code lives under `src/`,
> matching the team's existing EFTMRA project. `create-payload-app` scaffolds `src/app/(payload)`
> and `src/payload.config.ts` instead. Both are valid; this one was chosen for consistency with
> what the team already operates. Keep it consistent — do not mix the two.

## Commands

```bash
pnpm dev                  # :3001 — regenerates types and importMap first
pnpm build                # production build (see bundler note below)
pnpm start                # serve the production build

pnpm generate:types       # → src/payload-types.ts (CI copies this into web/lib/)
pnpm generate:importmap   # → app/(payload)/admin/importMap.js

pnpm migrate              # apply migrations
pnpm migrate:create       # scaffold a new migration
pnpm migrate:status

pnpm lint                 # ESLint CLI — `next lint` no longer exists in Next 16
pnpm typecheck
pnpm test
pnpm test:integration     # RBAC matrix against a real Payload instance

pnpm setup:db             # create the `sdl` role + database in your local PostgreSQL
```

## Troubleshooting

**`There was an error initializing Payload` / `password authentication failed for user "sdl"`**

Every `/api/*` route returns 500 and the web app can't render a page. The CMS cannot reach its
database. The project has no Docker setup — the CMS uses a PostgreSQL server installed on your
machine, at whatever `DATABASE_URI` in `cms/.env` says (the example is
`postgres://sdl:sdl_local_dev@localhost:5432/sdl`).

1. Check PostgreSQL is running, and on the port `DATABASE_URI` names. A second install often
   takes 5433 instead of 5432. The port is in `<PGDATA>/postgresql.conf`.
2. Create the role and database if they don't exist:

```bash
# creates the sdl role + sdl database in your server (idempotent).
# Give it a superuser connection; it prompts for the password if the URL omits one.
cd cms
pnpm setup:db "postgres://postgres@localhost:5432/postgres"   # prompts for the postgres password

pnpm migrate && pnpm seed && pnpm dev
```

Forgotten the `postgres` superuser password? Temporarily set `local`/`host` lines in
`<PGDATA>/pg_hba.conf` to `trust`, restart PostgreSQL, `ALTER USER postgres PASSWORD '…'`, then
put the lines back.

Alternatively, point `cms/.env`'s `DATABASE_URI` at any database you *can* reach and run
`pnpm migrate && pnpm seed`.

## Conventions

**Every collection goes through `withAccess()`.** It is the single seam wiring RBAC, the shared
admin form layout, the custom list view and role-based `admin.hidden`. A collection added straight
to the config array bypasses all four — a real bug the reference project documents.

```ts
withAccess(Pages, {
  read:   publishedOnly('pages'),
  create: canCreate('pages'),
  update: canUpdate('pages'),
  delete: canDelete('pages'),
}, 'pages')
```

**`access` is the security boundary, `admin.hidden` is not.** `hidden` only removes UI. Anything
that must actually be denied belongs in `access`.

**Every block spreads `sectionSettings`.** That group is what gives editors anchor IDs, background
and spacing variants, per-section visibility and reveal control without a code change.

**SVG never enters the database.** Blocks store a string key; `src/lib/` mirrors the frontend's
registries so admin `select` options cannot drift from the code that renders them.

**Migrations are explicit.** The Postgres adapter runs with `push: false` in production. Schema
changes ship as reviewed migration files, and each image derivative added to `Media` is six real
columns plus an index.

## Version pinning — read before upgrading

`next`, `react`, `react-dom` and every `@payloadcms/*` package are pinned **exactly**. Payload
accepts only specific Next ranges:

```
@payloadcms/next@3.88.0 → next ">=15.2.9 <15.3.0 || >=15.3.9 <15.4.0 || >=15.4.11 <15.5.0 || >=16.2.6 <17.0.0"
```

Check the range before every upgrade:

```bash
npm view @payloadcms/next@<version> peerDependencies
```

Two further traps, both of which resolve to a broken install if you take `latest`:

- **`graphql` must stay on 16.x.** Payload's peer is `^16.8.1`; graphql 17 is the published latest.
- **`typescript` stays on 5.9.x.** TypeScript 7 (the native port) is the published latest and is
  not validated against Payload or Next 16 tooling.

## Bundler

Next 16 uses Turbopack for `dev` and `build` by default. Payload supports this from 3.68.0
(Turbopack builds) and 3.73.0 (full Next 16), so 3.88.0 is clear of the old
`withPayload`-injects-webpack failure.

One production-build report remains open upstream (payload#15429). The Phase 0 spike verifies it on
our pinned versions. If it reproduces, switch `build` to `next build --webpack` and record it in
`docs/DECISIONS.md`. See plan §3.1c.
