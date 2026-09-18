/**
 * Adds the Contact Us page to a database that already has content.
 *
 *   pnpm add:contact                  against .env (local)
 *   pnpm add:contact:prod             against .env.production
 *   DRY_RUN=true pnpm add:contact:prod
 *
 * Creates the "contact-us" form and the /contact-us page if they are missing, and points the
 * footer's "Contact us" link at the page. An existing form or page is never overwritten, so this
 * is safe to re-run after editors have changed either. See src/seeds/contactPage.ts.
 *
 * Needs the `contact-offices` block's tables, so run `pnpm migrate` (or `migrate:prod`) first.
 */
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config.js'

import { seedContactPage } from '../src/seeds/contactPage'

const DRY_RUN = process.env.DRY_RUN === 'true'

async function main() {
  const payload = await getPayload({ config })

  console.log(`\n  target: ${process.env.NEXT_PUBLIC_SERVER_URL}`)
  console.log(`  mode:   ${DRY_RUN ? 'DRY RUN — nothing will be written' : 'WRITE'}\n`)

  await seedContactPage(payload, { dryRun: DRY_RUN })

  console.log('')
  process.exit(0)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
