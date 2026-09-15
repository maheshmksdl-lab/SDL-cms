import { describe, expect, it } from 'vitest'

import { tagsFor } from '../../src/hooks/revalidate'

/**
 * The tag vocabulary MUST match web/lib/cms/tags.ts exactly — a mismatch means a publish that
 * silently fails to invalidate the page. These assert the shapes; the string values are checked
 * against the web side in web/tests/unit and by the parity of both files.
 */
describe('tagsFor', () => {
  it('pages: emits the pathname tag plus the collection tag', () => {
    expect(tagsFor.pages({ pathname: '/services/ai-transformation' })).toEqual([
      'page:/services/ai-transformation',
      'pages',
    ])
  })

  it('pages: falls back to just the collection tag with no pathname', () => {
    expect(tagsFor.pages({})).toEqual(['pages'])
  })

  it('insights: emits the slug tag plus the collection tag', () => {
    expect(tagsFor.insights({ slug: 'my-post' })).toEqual(['insight:my-post', 'insights'])
  })

  it('forms: emits the slug tag plus the collection tag', () => {
    expect(tagsFor.forms({ slug: 'contact' })).toEqual(['form:contact', 'forms'])
  })

  it('simple: emits exactly the one tag it was built with', () => {
    expect(tagsFor.simple('clients')()).toEqual(['clients'])
  })
})
