/**
 * Adds the Clients and Testimonials pages to a database that already has content.
 *
 *   pnpm add:clients-testimonials                  against .env (local)
 *   pnpm add:clients-testimonials:prod              against .env.production
 *   DRY_RUN=true pnpm add:clients-testimonials:prod
 *
 * Creates the /clients and /testimonials pages if they are missing, points the header's
 * "Clients" submenu item and the footer's "Clients" link at /clients, and repoints the home
 * page's "View all clients" / "View all testimonials" CTAs at the two pages. Existing pages are
 * never overwritten, so this is safe to re-run after editors have changed either. See
 * src/seeds/clientsTestimonialsPages.ts.
 *
 * Needs the new blocks' tables, so run `pnpm migrate` (or `migrate:prod`) first.
 */
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config.js'

import { seedClientsTestimonialsPages } from '../src/seeds/clientsTestimonialsPages'

const DRY_RUN = process.env.DRY_RUN === 'true'

async function main() {
  const payload = await getPayload({ config })

  console.log(`\n  target: ${process.env.NEXT_PUBLIC_SERVER_URL}`)
  console.log(`  mode:   ${DRY_RUN ? 'DRY RUN — nothing will be written' : 'WRITE'}\n`)

  await seedClientsTestimonialsPages(payload, { dryRun: DRY_RUN })

  console.log('')
  process.exit(0)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
