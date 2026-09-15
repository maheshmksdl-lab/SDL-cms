import { NextResponse, type NextRequest } from 'next/server'

/**
 * CMS edge restriction (Next 16's `proxy.ts`, the rename of `middleware.ts`). Node runtime only.
 *
 * The RBAC layer in src/access/rbac.ts is the security boundary for *data*. This is a second,
 * coarser gate on the *admin surface*: when ADMIN_IP_ALLOWLIST is set, only those IPs (or CIDR
 * ranges) may reach `/admin`. The REST API (`/api/*`) stays open — the public site reads
 * published content through it, and every endpoint is access-checked.
 *
 * A CDN/WAF allowlist in front of the CMS host is the primary control (plan §8.3); this makes
 * the same policy hold even when a request reaches the app directly.
 *
 * Leave ADMIN_IP_ALLOWLIST unset in development — the gate is then a no-op.
 */

const ALLOWLIST = (process.env.ADMIN_IP_ALLOWLIST || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)

function ipToLong(ip: string): number | null {
  const parts = ip.split('.')
  if (parts.length !== 4) return null
  let out = 0
  for (const part of parts) {
    const n = Number(part)
    if (!Number.isInteger(n) || n < 0 || n > 255) return null
    out = (out << 8) + n
  }
  return out >>> 0
}

function ipMatches(ip: string, rule: string): boolean {
  if (rule === ip) return true
  if (!rule.includes('/')) return false

  const [range, bitsRaw] = rule.split('/')
  const bits = Number(bitsRaw)
  const ipLong = ipToLong(ip)
  const rangeLong = ipToLong(range ?? '')
  if (ipLong === null || rangeLong === null || !Number.isInteger(bits) || bits < 0 || bits > 32) {
    return false
  }
  const mask = bits === 0 ? 0 : (0xffffffff << (32 - bits)) >>> 0
  return (ipLong & mask) === (rangeLong & mask)
}

function clientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0]!.trim()
  return request.headers.get('x-real-ip')?.trim() || ''
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (ALLOWLIST.length && pathname.startsWith('/admin')) {
    const ip = clientIp(request)
    const allowed = ip && ALLOWLIST.some((rule) => ipMatches(ip, rule))
    if (!allowed) {
      return new NextResponse('Forbidden', {
        status: 403,
        headers: { 'content-type': 'text/plain' },
      })
    }
  }

  const res = NextResponse.next()
  res.headers.set('X-Content-Type-Options', 'nosniff')
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  // The admin panel must never be framed by anyone.
  res.headers.set('X-Frame-Options', 'DENY')
  if (process.env.NODE_ENV !== 'development') {
    res.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains')
  }
  return res
}

export const config = {
  matcher: ['/admin/:path*', '/api/:path*'],
}
