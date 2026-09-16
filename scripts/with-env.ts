/**
 * Runs a command with a specific env file loaded first.
 *
 * Two problems this solves, both of which bite when targeting production from a developer
 * machine:
 *
 *   1. Payload's CLI picks its env file from NODE_ENV — it calls Next's `loadEnvConfig` with
 *      `dev = NODE_ENV !== 'production'`, so `.env.production` is only read when NODE_ENV is
 *      already set. The POSIX way to arrange that, `NODE_ENV=production pnpm migrate`, is a
 *      syntax error in PowerShell, which is the shell this project is developed in.
 *   2. `tsx src/seeds/index.ts` and the other scripts use `import 'dotenv/config'`, which loads
 *      `.env` and ignores NODE_ENV entirely. Seeding "production" that way silently writes to
 *      the LOCAL database — it has happened here. Naming the env file explicitly removes the
 *      ambiguity: what you type is what gets loaded.
 *
 *   pnpm migrate:status:prod
 *   tsx scripts/with-env.ts .env.production npx payload migrate
 *
 * Values are never printed — only the count of variables loaded — because these files hold the
 * database password and PAYLOAD_SECRET.
 */
import { spawn } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import dotenv from 'dotenv'

const [envFile, command, ...args] = process.argv.slice(2)

if (!envFile || !command) {
  console.error('usage: tsx scripts/with-env.ts <env-file> <command> [...args]')
  console.error('   e.g. tsx scripts/with-env.ts .env.production npx payload migrate:status')
  process.exit(1)
}

const envPath = path.resolve(process.cwd(), envFile)

if (!fs.existsSync(envPath)) {
  console.error(`with-env: ${envFile} not found (looked in ${path.dirname(envPath)})`)
  process.exit(1)
}

const parsed = dotenv.parse(fs.readFileSync(envPath))

/*
 * A value already present in the shell wins, matching dotenv's own precedence. That keeps
 * one-off overrides working — `$env:DATABASE_URI=...; pnpm migrate:prod` — without editing the
 * file.
 */
let applied = 0
for (const [key, value] of Object.entries(parsed)) {
  if (process.env[key] === undefined) {
    process.env[key] = value
    applied += 1
  }
}

console.log(
  `with-env: ${envFile} → ${applied} variable(s) set` +
    (applied === Object.keys(parsed).length ? '' : `, ${Object.keys(parsed).length - applied} already in the shell`),
)

/*
 * `shell: true` is required on Windows: `npx`, `payload` and the rest of node_modules/.bin are
 * .cmd shims, which CreateProcess cannot execute directly.
 */
const child = spawn(command, args, { stdio: 'inherit', env: process.env, shell: true })

child.on('error', (error: Error) => {
  console.error(`with-env: could not run "${command}": ${error.message}`)
  process.exit(1)
})

child.on('exit', (code: number | null) => {
  process.exit(code ?? 1)
})
