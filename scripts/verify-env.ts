/**
 * Fails the build when a required environment variable is missing, or when a production build
 * is pointed at a localhost URL.
 *
 * Pattern copied from the EFTMRA reference's `verify:deployment-env`. Run in CI before `build`
 * and in the release step before `migrate`. See plan §8.5.
 *
 *   pnpm verify:env              checks against NODE_ENV
 *   NODE_ENV=production pnpm verify:env
 */
import 'dotenv/config'

type Rule = {
  name: string
  required: 'always' | 'production'
  /** Extra check beyond "is set". Return a string to fail with that message. */
  check?: (value: string) => string | null
}

const isProduction = process.env.NODE_ENV === 'production'

const notLocalhostInProd: Rule['check'] = (value) =>
  isProduction && /localhost|127\.0\.0\.1|0\.0\.0\.0/.test(value)
    ? 'must not point at localhost in a production build'
    : null

const isHttpsInProd: Rule['check'] = (value) =>
  isProduction && !/^https:\/\//i.test(value) ? 'must be an https:// URL in production' : null

const RULES: Rule[] = [
  { name: 'DATABASE_URI', required: 'always', check: notLocalhostInProd },
  {
    name: 'PAYLOAD_SECRET',
    required: 'always',
    check: (v) => (v.length < 24 ? 'must be at least 24 characters (openssl rand -base64 32)' : null),
  },
  {
    name: 'NEXT_PUBLIC_SERVER_URL',
    required: 'always',
    check: (v) => notLocalhostInProd(v) ?? isHttpsInProd(v),
  },
  { name: 'WEB_URL', required: 'always', check: (v) => notLocalhostInProd(v) ?? isHttpsInProd(v) },
  {
    name: 'REVALIDATE_SECRET',
    required: 'always',
    check: (v) => (v.length < 16 ? 'must be at least 16 characters' : null),
  },
  {
    name: 'PREVIEW_SECRET',
    required: 'always',
    check: (v) => (v.length < 16 ? 'must be at least 16 characters' : null),
  },
  { name: 'PAYLOAD_CORS_ORIGINS', required: 'production', check: notLocalhostInProd },
  { name: 'PAYLOAD_CSRF_ORIGINS', required: 'production', check: notLocalhostInProd },
  // Object storage is a hard requirement in production — local media is lost on a move to a new
  // host and is not shared between instances (plan §8.6). If any S3_* is set, the whole set must be.
  {
    name: 'S3_BUCKET',
    required: 'production',
    check: () =>
      isProduction && !process.env.S3_BUCKET
        ? 'production must use object storage for media (plan §8.6) — set S3_BUCKET and its credentials'
        : null,
  },
]

const S3_GROUP = ['S3_BUCKET', 'S3_REGION', 'S3_ACCESS_KEY_ID', 'S3_SECRET_ACCESS_KEY']

const errors: string[] = []

for (const rule of RULES) {
  const value = process.env[rule.name]?.trim()
  const required = rule.required === 'always' || (rule.required === 'production' && isProduction)

  if (!value) {
    if (required) errors.push(`${rule.name} is not set`)
    continue
  }

  const problem = rule.check?.(value)
  if (problem) errors.push(`${rule.name} ${problem}`)
}

// Partial S3 configuration is worse than none — it fails at upload time, in production.
const s3Set = S3_GROUP.filter((k) => process.env[k]?.trim())
if (s3Set.length && s3Set.length < S3_GROUP.length) {
  const missing = S3_GROUP.filter((k) => !process.env[k]?.trim())
  errors.push(`S3 storage is partially configured — also set: ${missing.join(', ')}`)
}

if (errors.length) {
  console.error('\n  Environment check failed:\n')
  for (const e of errors) console.error(`    ✗ ${e}`)
  console.error(`\n  (NODE_ENV=${process.env.NODE_ENV ?? 'undefined'})\n`)
  process.exit(1)
}

console.log(`  ✓ environment OK (NODE_ENV=${process.env.NODE_ENV ?? 'development'})`)
