import { defineConfig } from 'vitest/config'

/**
 * Unit tests only — pure logic that needs no database: the RBAC default matrix, pathname
 * computation, revalidation tag builders, email-template interpolation.
 *
 * The role × module × CRUD matrix asserted against a live Payload instance is the integration
 * suite (vitest.integration.config.mts), which needs DATABASE_URI.
 */
export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/unit/**/*.test.ts'],
  },
})
