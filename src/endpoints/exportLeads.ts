import type { Endpoint, PayloadRequest, Where } from 'payload'

/**
 * Byte-order mark.
 *
 * Excel reads a CSV as the system codepage unless the file starts with one, so without this an
 * accented name in an enquiry arrives mangled. Built from its code point rather than typed
 * literally — a literal BOM in source is invisible and trips the irregular-whitespace lint.
 */
const BOM = String.fromCharCode(0xfeff)

/**
 * CSV export of leads.
 *
 *   GET /api/leads/export?form=contact&status=new&from=2026-01-01
 *
 * ── Access control, and a trap worth knowing about ──
 *
 * Payload's Local API defaults to **`overrideAccess: true`**. Passing `req` alone does NOT make
 * a `payload.find()` respect the permission matrix — it identifies the caller but still bypasses
 * their permissions.
 *
 * An earlier version of this file relied on that assumption and leaked every lead — email
 * addresses and message bodies — to unauthenticated callers, while `/api/leads` itself correctly
 * returned 403. Custom endpoints are not covered by the collection's access rules unless they
 * ask to be.
 *
 * So this handler does both: refuses anonymous callers outright, and sets
 * `overrideAccess: false` so the same matrix that governs the collection governs the export.
 */

/**
 * RFC 4180 quoting, plus one addition.
 *
 * A value beginning `=`, `+`, `-` or `@` is executed as a formula when the file is opened in
 * Excel or Sheets — so an enquiry whose name is `=HYPERLINK(...)` becomes a live link in
 * whoever opens the export. Prefixing with an apostrophe neutralises it without changing what
 * the reader sees.
 */
function csvCell(value: unknown): string {
  if (value === null || value === undefined) return ''
  let str = String(value)
  if (/^[=+\-@\t\r]/.test(str)) str = `'${str}`
  if (/["\n\r,]/.test(str)) str = `"${str.replace(/"/g, '""')}"`
  return str
}

export const exportLeadsEndpoint: Endpoint = {
  path: '/export',
  method: 'get',
  handler: async (req: PayloadRequest) => {
    // First gate: no identity, no export. Cheap, and independent of the matrix below.
    if (!req.user) {
      return Response.json({ error: 'Authentication required.' }, { status: 401 })
    }

    const params = req.searchParams
    const where: Where = {}

    const formSlug = params.get('form')
    if (formSlug) {
      const forms = await req.payload.find({
        collection: 'forms',
        where: { slug: { equals: formSlug } },
        limit: 1,
        depth: 0,
        req,
        overrideAccess: false,
      })
      const form = forms.docs[0]
      if (!form) {
        return Response.json({ error: `No form with slug "${formSlug}".` }, { status: 404 })
      }
      where.form = { equals: form.id }
    }

    const status = params.get('status')
    if (status) where.status = { equals: status }

    const from = params.get('from')
    if (from) where.createdAt = { greater_than_equal: from }

    let result
    try {
      result = await req.payload.find({
        collection: 'leads',
        where: Object.keys(where).length ? where : undefined,
        limit: 10000,
        depth: 1,
        sort: '-createdAt',
        req,
        // Without this the Local API bypasses the permission matrix entirely. See the header.
        overrideAccess: false,
      })
    } catch {
      return Response.json({ error: 'You do not have permission to export leads.' }, { status: 403 })
    }

    /*
     * Every submission field across the result set becomes a column. Forms differ, and a form's
     * fields change over time, so the header cannot be derived from the current definition
     * without silently dropping data from older leads.
     */
    const dataKeys = new Set<string>()
    for (const lead of result.docs) {
      const data = (lead as { submissionData?: Record<string, unknown> }).submissionData
      if (data) Object.keys(data).forEach((k) => dataKeys.add(k))
    }
    const columns = [...dataKeys].sort()

    const header = ['Submitted', 'Form', 'Status', 'Email', ...columns, 'Page', 'Referrer']
    const rows = result.docs.map((lead) => {
      const l = lead as {
        createdAt?: string
        form?: { name?: string } | number
        status?: string
        submittedEmail?: string
        submissionData?: Record<string, unknown>
        source?: { pathname?: string; referrer?: string }
      }
      return [
        l.createdAt,
        typeof l.form === 'object' ? l.form?.name : l.form,
        l.status,
        l.submittedEmail,
        ...columns.map((key) => l.submissionData?.[key]),
        l.source?.pathname,
        l.source?.referrer,
      ].map(csvCell)
    })

    const csv = [header.map(csvCell).join(','), ...rows.map((r) => r.join(','))].join('\r\n')
    const filename = `leads-${new Date().toISOString().slice(0, 10)}.csv`

    return new Response(`${BOM}${csv}`, {
      // The BOM makes Excel read it as UTF-8; without it, accented names arrive mangled.
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-store',
      },
    })
  },
}
