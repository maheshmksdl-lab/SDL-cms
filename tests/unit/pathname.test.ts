import { describe, expect, it } from 'vitest'

import { joinPathname } from '../../src/hooks/computePathname'

/**
 * `pathname` is what the frontend resolves a request against in a single indexed lookup, so its
 * computation has to be exactly right — a stray slash 404s a page. The descendant-rewrite and
 * cycle guard are exercised in the integration suite against a real DB.
 */
describe('joinPathname', () => {
  it('maps the reserved "home" slug to "/"', () => {
    expect(joinPathname(null, 'home')).toBe('/')
    expect(joinPathname('/anything', 'home')).toBe('/')
  })

  it('prefixes a top-level page with a single slash', () => {
    expect(joinPathname(null, 'services')).toBe('/services')
    expect(joinPathname('/', 'services')).toBe('/services')
  })

  it('nests under the parent pathname', () => {
    expect(joinPathname('/services', 'ai-transformation')).toBe('/services/ai-transformation')
  })

  it('nests two levels deep', () => {
    expect(
      joinPathname('/services/digital-engineering', 'web-application-engineering'),
    ).toBe('/services/digital-engineering/web-application-engineering')
  })

  it('never produces a double slash from a "/" parent', () => {
    expect(joinPathname('/', 'x')).toBe('/x')
    expect(joinPathname('', 'x')).toBe('/x')
  })
})
