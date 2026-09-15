/**
 * Creates the local `sdl` role and database, matching `cms/.env`'s DATABASE_URI.
 *
 * The project runs against a locally installed PostgreSQL server (there is no Docker setup), so
 * this is the first step on a new machine. Idempotent — safe to re-run.
 *
 *   # connect as a superuser; it prompts for the password if the URL omits one
 *   pnpm setup:db "postgres://postgres@localhost:5432/postgres"
 *
 *   # or via env
 *   SUPERUSER_URL="postgres://postgres:secret@localhost:5432/postgres" pnpm setup:db
 *
 * Then: pnpm migrate && pnpm seed && pnpm dev
 */
import 'dotenv/config'
import readline from 'node:readline/promises'
import process from 'node:process'
import pg from 'pg'

const target = new URL(process.env.DATABASE_URI || 'postgres://sdl:sdl_local_dev@localhost:5432/sdl')
const wantRole = decodeURIComponent(target.username)
const wantPass = decodeURIComponent(target.password)
const wantDb = target.pathname.replace(/^\//, '')
const host = target.hostname
const port = target.port || '5432'

const superUrlRaw = process.argv[2] || process.env.SUPERUSER_URL || `postgres://postgres@${host}:${port}/postgres`
const superUrl = new URL(superUrlRaw)

if (!superUrl.password) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
  superUrl.password = await rl.question(`Password for ${superUrl.username}@${superUrl.hostname}: `)
  rl.close()
}

const client = new pg.Client({
  host: superUrl.hostname,
  port: Number(superUrl.port || 5432),
  user: decodeURIComponent(superUrl.username),
  password: superUrl.password,
  database: superUrl.pathname.replace(/^\//, '') || 'postgres',
})

const ident = (name: string) => '"' + name.replace(/"/g, '""') + '"'
const literal = (value: string) => "'" + value.replace(/'/g, "''") + "'"

try {
  await client.connect()

  const role = await client.query('SELECT 1 FROM pg_roles WHERE rolname = $1', [wantRole])
  if (role.rowCount) {
    await client.query(`ALTER ROLE ${ident(wantRole)} WITH LOGIN PASSWORD ${literal(wantPass)}`)
    console.log(`✓ role "${wantRole}" already exists — password reset to match .env`)
  } else {
    await client.query(`CREATE ROLE ${ident(wantRole)} WITH LOGIN PASSWORD ${literal(wantPass)}`)
    console.log(`✓ created role "${wantRole}"`)
  }

  const db = await client.query('SELECT 1 FROM pg_database WHERE datname = $1', [wantDb])
  if (db.rowCount) {
    console.log(`✓ database "${wantDb}" already exists`)
  } else {
    // CREATE DATABASE cannot run inside a transaction block — this client autocommits.
    await client.query(`CREATE DATABASE ${ident(wantDb)} OWNER ${ident(wantRole)}`)
    console.log(`✓ created database "${wantDb}" owned by "${wantRole}"`)
  }

  await client.query(`GRANT ALL PRIVILEGES ON DATABASE ${ident(wantDb)} TO ${ident(wantRole)}`)

  console.log('\nDone. Next:\n    pnpm migrate && pnpm seed && pnpm dev\n')
} catch (error) {
  console.error(`\n✗ ${error instanceof Error ? error.message : String(error)}\n`)
  console.error('If the password is wrong, find the one you set when installing PostgreSQL,')
  console.error('or reset it, then re-run:  pnpm setup:db "postgres://postgres@localhost:5432/postgres"\n')
  process.exitCode = 1
} finally {
  await client.end()
}
