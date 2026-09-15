import 'dotenv/config'
import type { Payload } from 'payload'

/**
 * Boots a real Payload instance for the integration suite, or reports that no database is
 * reachable so the tests can skip themselves rather than fail a bare checkout.
 *
 * CI starts the runner's own PostgreSQL and these run for real; locally they run once your
 * PostgreSQL server is up and `DATABASE_URI` points at it.
 */

let cached: Payload | null = null
let unavailableReason: string | null = null

export async function getTestPayload(): Promise<Payload | null> {
  if (cached) return cached
  if (unavailableReason) return null

  if (!process.env.DATABASE_URI) {
    unavailableReason = 'DATABASE_URI is not set'
    return null
  }

  try {
    const { getPayload } = await import('payload')
    const config = (await import('../../payload.config')).default
    cached = await getPayload({ config })
    return cached
  } catch (error) {
    unavailableReason = error instanceof Error ? error.message : String(error)
    console.warn(`\n[integration] skipping — could not connect to the database: ${unavailableReason}\n`)
    return null
  }
}

export function reason(): string {
  return unavailableReason ?? 'unknown'
}

/** Creates a doc, runs the assertion, always deletes the doc. */
export async function withDoc<T>(
  payload: Payload,
  collection: string,
  data: Record<string, unknown>,
  fn: (id: number | string) => Promise<T>,
): Promise<T> {
  const created = await payload.create({
    collection: collection as never,
    data: data as never,
    overrideAccess: true,
  })
  try {
    return await fn((created as { id: number }).id)
  } finally {
    await payload.delete({ collection: collection as never, id: (created as { id: number }).id, overrideAccess: true })
  }
}
