import type { CollectionBeforeChangeHook, CollectionAfterChangeHook, PayloadRequest } from 'payload'

/**
 * Maintains `pages.pathname`, the indexed URL each page is served at.
 *
 * The frontend resolves a request with ONE indexed lookup on this column rather than walking
 * the parent chain per request, which is why it is stored rather than computed at read time.
 * The cost of storing it is that it has to be kept true — hence the descendant rewrite below.
 */

const HOME_SLUG = 'home'

export function joinPathname(parentPathname: string | null | undefined, slug: string): string {
  if (slug === HOME_SLUG) return '/'
  const parent = parentPathname && parentPathname !== '/' ? parentPathname : ''
  return `${parent}/${slug}`
}

async function resolveParentPathname(
  req: PayloadRequest,
  parent: unknown,
): Promise<string | null> {
  if (!parent) return null
  if (typeof parent === 'object' && parent !== null && 'pathname' in parent) {
    return String((parent as { pathname?: string }).pathname ?? '') || null
  }

  const parentDoc = await req.payload.findByID({
    collection: 'pages',
    id: parent as string | number,
    depth: 0,
    overrideAccess: true,
    req,
  })
  return typeof parentDoc?.pathname === 'string' ? parentDoc.pathname : null
}

export const computePathname: CollectionBeforeChangeHook = async ({ data, req, originalDoc }) => {
  const slug = String(data?.slug ?? originalDoc?.slug ?? '').trim()
  if (!slug) return data

  const parent = 'parent' in (data ?? {}) ? data.parent : originalDoc?.parent

  /*
   * A page cannot be its own ancestor. Without this a cycle makes the pathname computation
   * and the breadcrumb walk non-terminating, and the admin UI offers the current page in its
   * own parent picker, so it is reachable in two clicks.
   */
  if (parent && originalDoc?.id && String(parent) === String(originalDoc.id)) {
    throw new Error('A page cannot be its own parent.')
  }

  const parentPathname = await resolveParentPathname(req, parent)
  return { ...data, pathname: joinPathname(parentPathname, slug) }
}

/**
 * Rewrites descendants when a page's own pathname changes.
 *
 * Renaming `/services` has to move `/services/ai-transformation` with it. Without this the
 * children keep a stale pathname and 404 — the kind of breakage that only shows up in
 * production, on the pages nobody thought to re-check.
 */
export const rewriteDescendantPathnames: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  req,
  context,
}) => {
  if (context?.skipDescendantRewrite) return doc
  if (!previousDoc || doc.pathname === previousDoc.pathname) return doc

  const children = await req.payload.find({
    collection: 'pages',
    where: { parent: { equals: doc.id } },
    depth: 0,
    limit: 500,
    overrideAccess: true,
    req,
  })

  for (const child of children.docs) {
    await req.payload.update({
      collection: 'pages',
      id: child.id,
      data: { pathname: joinPathname(doc.pathname as string, String(child.slug)) },
      overrideAccess: true,
      req,
      // The nested update recurses on its own; the flag stops it re-entering for this level.
      context: { skipDescendantRewrite: false },
    })
  }

  if (children.docs.length) {
    req.payload.logger.info(
      `pages: rewrote ${children.docs.length} descendant pathname(s) under ${doc.pathname}`,
    )
  }

  return doc
}
