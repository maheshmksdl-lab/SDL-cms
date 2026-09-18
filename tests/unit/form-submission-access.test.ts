import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { FORM_SECRET_HEADER, formSubmissionCreate } from '../../src/access/rbac'

/**
 * Anonymous lead creation: allowed only with the shared secret the website's form route sends.
 * Without it, POST /api/leads would be a way around the route's validation, rate limit,
 * honeypot and reCAPTCHA. Signed-in staff go through the role matrix instead, which the
 * integration suite covers.
 */

const SECRET = 'test-form-secret-0123456789'
let previous: string | undefined

beforeAll(() => {
  previous = process.env.REVALIDATE_SECRET
  process.env.REVALIDATE_SECRET = SECRET
})

afterAll(() => {
  if (previous === undefined) delete process.env.REVALIDATE_SECRET
  else process.env.REVALIDATE_SECRET = previous
})

const anonymous = (headers: Record<string, string> = {}) =>
  ({ req: { user: null, headers: new Headers(headers) } }) as never

const create = formSubmissionCreate('leads')

describe('formSubmissionCreate', () => {
  it('refuses an anonymous request without the secret', async () => {
    expect(await create(anonymous())).toBe(false)
  })

  it('refuses an anonymous request with the wrong secret', async () => {
    expect(await create(anonymous({ [FORM_SECRET_HEADER]: 'guess' }))).toBe(false)
    expect(await create(anonymous({ [FORM_SECRET_HEADER]: `${SECRET}x` }))).toBe(false)
  })

  it('accepts an anonymous request carrying the shared secret', async () => {
    expect(await create(anonymous({ [FORM_SECRET_HEADER]: SECRET }))).toBe(true)
  })

  it('refuses everything when no secret is configured, rather than falling open', async () => {
    delete process.env.REVALIDATE_SECRET
    try {
      expect(await create(anonymous({ [FORM_SECRET_HEADER]: '' }))).toBe(false)
      expect(await create(anonymous({ [FORM_SECRET_HEADER]: 'anything' }))).toBe(false)
    } finally {
      process.env.REVALIDATE_SECRET = SECRET
    }
  })
})
