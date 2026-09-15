import { defineConfig } from 'vitest/config'

/**
 * Integration tests — these boot a real Payload instance against DATABASE_URI and exercise the
 * access-control matrix, the pathname hooks, and the lead → email flow (plan §9.1).
 *
 * They SKIP themselves when no database is reachable, so `pnpm test` in a bare checkout stays
 * green; CI runs them against the runner's own PostgreSQL, before `pnpm seed`.
 */
export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/integration/**/*.test.ts'],
    testTimeout: 60_000,
    hookTimeout: 120_000,
    fileParallelism: false,
  },
})
