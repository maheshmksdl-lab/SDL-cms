import type { Endpoint, PayloadRequest } from 'payload'

/**
 * GET /api/health — a liveness + DB-connectivity probe for uptime monitoring (plan §8.8).
 *
 * Runs a trivial query so the check fails if the database is unreachable, not just if the
 * process is down. No authentication: it returns no data, only status, and monitors need to
 * reach it without credentials.
 */
export const healthEndpoint: Endpoint = {
  path: '/health',
  method: 'get',
  handler: async (req: PayloadRequest) => {
    const startedAt = Date.now()
    try {
      // Cheapest possible round trip to Postgres.
      await req.payload.count({ collection: 'users', overrideAccess: true })
      return Response.json(
        { status: 'ok', db: 'ok', latencyMs: Date.now() - startedAt, at: new Date().toISOString() },
        { headers: { 'Cache-Control': 'no-store' } },
      )
    } catch (error) {
      req.payload.logger.error(`health check failed: ${error instanceof Error ? error.message : String(error)}`)
      return Response.json(
        { status: 'error', db: 'error', at: new Date().toISOString() },
        { status: 503, headers: { 'Cache-Control': 'no-store' } },
      )
    }
  },
}
