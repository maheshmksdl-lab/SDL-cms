import type {
  CollectionAfterChangeHook, CollectionAfterDeleteHook,
  GlobalAfterChangeHook, PayloadRequest,
} from 'payload'

/**
 * Tells the website which cache tags to invalidate.
 *
 * Pulled forward from Phase 7 deliberately. Caching without invalidation is not "not done yet",
 * it is actively broken: during Phase 4 a `/` lookup was cached as empty before the home page
 * existed and kept 404ing for the full hour while the CMS held a published document at that
 * pathname. Shipping the cache without this hook reproduces that in production.
 *
 * The tag vocabulary must match web/lib/cms/tags.ts exactly — a typo here means a publish that
 * silently fails to appear.
 */

async function postTags(req: PayloadRequest, tags: string[]): Promise<void> {
  const webUrl = process.env.WEB_URL
  const secret = process.env.REVALIDATE_SECRET

  if (!webUrl || !secret) {
    req.payload.logger.warn(
      'revalidate: WEB_URL or REVALIDATE_SECRET is unset — the website will not be told about this change.',
    )
    return
  }

  const unique = [...new Set(tags)].filter(Boolean)
  if (!unique.length) return

  try {
    const response = await fetch(`${webUrl.replace(/\/$/, '')}/api/revalidate`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-revalidate-secret': secret },
      body: JSON.stringify({ tags: unique }),
    })

    if (!response.ok) {
      req.payload.logger.warn(`revalidate: website responded ${response.status}`)
      return
    }

    req.payload.logger.info(`revalidate: ${unique.join(', ')}`)
  } catch (error) {
    /*
     * Never fail a publish because the website is unreachable. The editor's change IS saved;
     * the site catches up when its revalidate window expires. Logged loudly so a persistently
     * broken webhook is visible rather than silently degrading to hour-old content.
     */
    req.payload.logger.warn(
      `revalidate: could not reach the website — ${error instanceof Error ? error.message : String(error)}`,
    )
  }
}

/**
 * Builds an afterChange hook.
 *
 * `previousDoc` is included so a RENAMED page invalidates its old pathname too — without that
 * the old URL keeps serving the page from cache after it has moved.
 */
export const revalidateCollection =
  (tagsFor: (doc: Record<string, unknown>) => string[]): CollectionAfterChangeHook =>
  async ({ doc, previousDoc, req }) => {
    await postTags(req, [
      ...tagsFor(doc as Record<string, unknown>),
      ...(previousDoc ? tagsFor(previousDoc as Record<string, unknown>) : []),
    ])
    return doc
  }

export const revalidateCollectionDelete =
  (tagsFor: (doc: Record<string, unknown>) => string[]): CollectionAfterDeleteHook =>
  async ({ doc, req }) => {
    await postTags(req, tagsFor(doc as Record<string, unknown>))
    return doc
  }

export const revalidateGlobal =
  (tag: string): GlobalAfterChangeHook =>
  async ({ doc, req }) => {
    // A header or footer change affects every rendered page, so the page tag goes too.
    await postTags(req, [tag, 'pages'])
    return doc
  }

/** Tag builders, one per collection. Keep in step with web/lib/cms/tags.ts. */
export const tagsFor = {
  pages: (doc: Record<string, unknown>) => {
    const pathname = typeof doc.pathname === 'string' ? doc.pathname : null
    return pathname ? [`page:${pathname}`, 'pages'] : ['pages']
  },
  insights: (doc: Record<string, unknown>) => {
    const slug = typeof doc.slug === 'string' ? doc.slug : null
    return slug ? [`insight:${slug}`, 'insights'] : ['insights']
  },
  forms: (doc: Record<string, unknown>) => {
    const slug = typeof doc.slug === 'string' ? doc.slug : null
    return slug ? [`form:${slug}`, 'forms'] : ['forms']
  },
  simple: (tag: string) => () => [tag],
}
