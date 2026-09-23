/**
 * Aligns the "Let's talk" popup's field labels/placeholders/required-ness with the reference
 * design (Name*, Work email*, Company*, Phone (optional), "What are you looking to achieve?*").
 *
 * The popup (LetsTalkModal, LETS_TALK_FORM_SLUG = 'contact-us') and the /contact-us page's own
 * embedded form both render the SAME Form document (slug `contact-us`, id 3 — confirmed via the
 * ContactOfficesBlock's `form: 3` on the /contact-us page), so this one edit fixes both surfaces
 * consistently. That form's labels had drifted from the reference (`Email` not `Work email`,
 * no placeholders, `Phone` required, the closing textarea labelled "Brief message of your
 * requirements" and optional) — this script only touches `label`/`placeholder`/`required` on
 * each field. Field `name` keys (name/email/company/phone/message) are left untouched, since
 * those are what Leads records and any export/processing key off of.
 *
 *   pnpm update:lets-talk-labels              against .env (local)
 *   pnpm update:lets-talk-labels:prod         against .env.production
 *   DRY_RUN=true pnpm update:lets-talk-labels:prod
 *
 * Safe to re-run: idempotent — re-running once the fields already match is a no-op.
 */
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config.js'

const DRY_RUN = process.env.DRY_RUN === 'true'

const TARGET_FIELDS: Record<string, { label: string; placeholder: string; required: boolean }> = {
  name: { label: 'Name', placeholder: 'Your name', required: true },
  email: { label: 'Work email', placeholder: 'you@company.com', required: true },
  company: { label: 'Company', placeholder: 'Your company', required: true },
  phone: { label: 'Phone', placeholder: '+1', required: false },
  message: {
    label: 'What are you looking to achieve?',
    placeholder: 'A little about the challenge or opportunity…',
    required: true,
  },
}

type Loose = Record<string, unknown>

async function main() {
  const payload = await getPayload({ config })

  console.log(`\n  target: ${process.env.NEXT_PUBLIC_SERVER_URL}`)
  console.log(`  mode:   ${DRY_RUN ? 'DRY RUN — nothing will be written' : 'WRITE'}\n`)

  const found = await payload.find({
    collection: 'forms',
    where: { slug: { equals: 'contact-us' } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  const doc = found.docs[0] as (Loose & { id: number; fields?: Loose[] }) | undefined
  if (!doc) {
    console.log('  ✗ no Form found with slug "contact-us" — nothing to do')
    process.exit(0)
  }

  const fields = doc.fields ?? []
  let changed = 0
  const newFields = fields.map((field) => {
    const target = TARGET_FIELDS[field.name as string]
    if (!target) return field
    const diffs: string[] = []
    if (field.label !== target.label) diffs.push(`label "${field.label}" -> "${target.label}"`)
    if (field.placeholder !== target.placeholder) diffs.push(`placeholder "${field.placeholder}" -> "${target.placeholder}"`)
    if (field.required !== target.required) diffs.push(`required ${field.required} -> ${target.required}`)
    if (!diffs.length) return field
    console.log(`  · ${field.name}: ${diffs.join(', ')}`)
    changed += 1
    return { ...field, label: target.label, placeholder: target.placeholder, required: target.required }
  })

  if (!changed) {
    console.log('  · contact-us form fields already match the reference — nothing to do')
    process.exit(0)
  }

  console.log(`\n  ${DRY_RUN ? 'would update' : 'updating'} ${changed} field(s) on Form "contact-us" (id ${doc.id})`)
  if (!DRY_RUN) {
    await payload.update({
      collection: 'forms',
      id: doc.id,
      data: { fields: newFields } as never,
      overrideAccess: true,
    })
  }

  console.log('')
  process.exit(0)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
