import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'

import { ensureSuperAdmin } from '../seeds/superAdmin'

/**
 * Creates the default Super Admin from CMS_ADMIN_EMAIL (see src/seeds/superAdmin.ts).
 *
 * Data only — no schema change, so there is no companion .json snapshot; `migrate:create` diffs
 * against the latest one, which is still accurate.
 *
 * With CMS_ADMIN_EMAIL unset this logs a warning and completes, so environments that do not
 * configure an admin (CI, local clones) still migrate. Payload records the migration as run
 * either way; configure the variable later and run `pnpm seed` to create the account.
 *
 * Uses the Local API, so it writes the users and role-management tables as their collection
 * configs describe them at run time. If a later migration adds a REQUIRED column to either
 * table, a fresh database would reach this migration before that column exists — give such a
 * column a default, or move this call after it.
 */
export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  await ensureSuperAdmin(payload, req)
}

/**
 * Deliberately a no-op. Rolling back must never delete an administrator account — it may be the
 * only one left, and by then it can own content and sessions.
 */
export async function down({ payload }: MigrateDownArgs): Promise<void> {
  payload.logger.info('seed_default_superadmin: down is a no-op — the account is kept')
}
