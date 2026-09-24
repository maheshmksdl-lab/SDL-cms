/**
 * Brings the Blog / Case study / Whitepaper Insights across from the legacy site.
 *
 *   pnpm migrate:insights              against .env (local)
 *   pnpm migrate:insights:prod         against .env.production
 *   DRY_RUN=true pnpm migrate:insights:prod
 *
 * `pnpm seed` runs the same step, so a fresh database needs nothing extra. This is for applying
 * it on its own to a database that already has content. See src/seeds/legacyInsights.ts.
 */
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config.js'

import { seedLegacyInsights } from '../src/seeds/legacyInsights'

const DRY_RUN = process.env.DRY_RUN === 'true'

async function main() {
  const payload = await getPayload({ config })

  console.log(`\n  target: ${process.env.NEXT_PUBLIC_SERVER_URL}`)
  console.log(`  mode:   ${DRY_RUN ? 'DRY RUN — nothing will be written' : 'WRITE'}\n`)

  await seedLegacyInsights(payload)

  process.exit(0)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
