import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'

const projectRoot = path.dirname(fileURLToPath(import.meta.url))

/**
 * Optional base path, e.g. serving the admin at /cms/admin behind a shared domain.
 * Empty string means the app owns its origin.
 */
const basePath = (process.env.NEXT_PUBLIC_CMS_BASE_PATH || '').replace(/\/$/, '')

const nextConfig: NextConfig = {
  ...(basePath ? { basePath, assetPrefix: basePath } : {}),

  /*
   * Turbopack is the default bundler in Next 16 for both `dev` and `build`.
   *
   * Historically `withPayload` injected a webpack config unconditionally, which made Next 16
   * builds fail with "a webpack config and no turbopack config". That was fixed upstream
   * (payload#14354); Turbopack build support landed in Payload 3.68.0 and full Next 16 support
   * in 3.73.0, so 3.88.0 is clear of it.
   *
   * One report of the Payload config resolving to null in production Turbopack builds is still
   * open (payload#15429, labelled invalid-reproduction, filed against 3.73.0 + a Next 16.2
   * canary). The Phase 0 spike verifies this on our pinned versions. If it reproduces, set the
   * build script to `next build --webpack` and record it in docs/DECISIONS.md — the public site
   * is unaffected either way, since it carries no Payload dependency.
   *
   * Turbopack options belong at the TOP LEVEL in Next 16, not under `experimental`.
   */
  turbopack: { root: projectRoot },

  /*
   * cacheComponents (Next 16's replacement for experimental.ppr / dynamicIO / useCache) is
   * deliberately NOT enabled. Payload's docs state full compatibility is not guaranteed, and it
   * is not a rename-only switch — it surfaces build errors for uncached data outside <Suspense>.
   * See plan §6.6.
   */

  async redirects() {
    if (basePath) return []

    return [
      { source: '/cms/admin', destination: '/admin', permanent: false },
      { source: '/cms/admin/:path*', destination: '/admin/:path*', permanent: false },
    ]
  },
}

export default withPayload(nextConfig)
