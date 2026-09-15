/**
 * Rewrites the import line Payload's `migrate:create` generates.
 *
 * The template emits:
 *     import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'
 *
 * but `@payloadcms/db-postgres` exports those two as TYPES ONLY
 * (`export type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/drizzle/postgres'`).
 * Under Node ESM the value import throws at runtime before the migration ever executes:
 *
 *     SyntaxError: The requested module '@payloadcms/db-postgres'
 *                  does not provide an export named 'MigrateDownArgs'
 *
 * Splitting it into a type import and a value import fixes it. Wired to `postmigrate:create`
 * so every generated migration is corrected automatically — this is not a one-off repair.
 *
 * Remove once Payload's template is fixed upstream (checked against 3.88.0).
 */
import fs from 'node:fs'
import path from 'node:path'

const MIGRATIONS_DIR = path.resolve(process.cwd(), 'src/migrations')

const BROKEN = /^import \{([^}]*)\} from '(@payloadcms\/db-[a-z]+)'$/m

let fixed = 0

for (const file of fs.readdirSync(MIGRATIONS_DIR).filter((f) => f.endsWith('.ts') && f !== 'index.ts')) {
  const filePath = path.join(MIGRATIONS_DIR, file)
  const source = fs.readFileSync(filePath, 'utf8')
  const match = source.match(BROKEN)
  const importedNames = match?.[1]
  const moduleSpecifier = match?.[2]
  if (!match || !importedNames || !moduleSpecifier) continue

  const names = importedNames.split(',').map((n) => n.trim()).filter(Boolean)
  const typeNames = names.filter((n) => /^Migrate(Up|Down)Args$/.test(n))
  const valueNames = names.filter((n) => !typeNames.includes(n))
  if (!typeNames.length) continue

  const replacement = [
    `import type { ${typeNames.join(', ')} } from '${moduleSpecifier}'`,
    valueNames.length ? `import { ${valueNames.join(', ')} } from '${moduleSpecifier}'` : null,
  ]
    .filter(Boolean)
    .join('\n')

  fs.writeFileSync(filePath, source.replace(BROKEN, replacement), 'utf8')
  console.log(`  fixed imports in ${file}`)
  fixed++
}

console.log(fixed ? `Fixed ${fixed} migration file(s).` : 'No migration imports needed fixing.')
