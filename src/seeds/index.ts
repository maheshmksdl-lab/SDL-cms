/**
 * Seed entry point. Idempotent — safe to re-run against an existing database.
 *
 *   pnpm seed              roles, RBAC matrix, email templates, contact form, preview user,
 *                          and the design content (globals + collections + fourteen pages)
 *   SEED_DESIGN=false pnpm seed     skip the design content
 */
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../../payload.config'

import { seedRoles } from './roles'
import { seedRoleModuleVisibility } from './roleModuleVisibility'
import { seedForms } from './forms'
import { seedPreviewUser } from './previewUser'
import { seedDesign } from './design'

async function main() {
  const payload = await getPayload({ config })

  payload.logger.info('Seeding roles…')
  await seedRoles(payload)

  payload.logger.info('Seeding the RBAC matrix…')
  await seedRoleModuleVisibility(payload)

  payload.logger.info('Seeding email templates and the contact form…')
  await seedForms(payload)

  payload.logger.info('Seeding the preview service user…')
  await seedPreviewUser(payload)

  if (process.env.SEED_DESIGN !== 'false') {
    payload.logger.info('Seeding design content (globals, collections, pages)…')
    await seedDesign(payload)
  }

  payload.logger.info('Seed complete.')
  process.exit(0)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
