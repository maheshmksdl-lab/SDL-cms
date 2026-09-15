import { describe, expect, it } from 'vitest'

import { interpolate, renderEmailTemplate } from '../../src/email/templates'

describe('interpolate', () => {
  it('substitutes {{name}} placeholders', () => {
    expect(interpolate('Hi {{name}}', { name: 'Sam' }, false)).toBe('Hi Sam')
    expect(interpolate('Hi {{ name }}', { name: 'Sam' }, false)).toBe('Hi Sam')
  })

  it('drops an unknown or nullish placeholder to empty', () => {
    expect(interpolate('a{{missing}}b', {}, false)).toBe('ab')
    expect(interpolate('a{{x}}b', { x: null }, false)).toBe('ab')
  })

  it('HTML-escapes values for the HTML body and leaves the text body raw', () => {
    const payload = { msg: '<script>alert(1)</script>' }
    expect(interpolate('{{msg}}', payload, true)).toBe('&lt;script&gt;alert(1)&lt;/script&gt;')
    expect(interpolate('{{msg}}', payload, false)).toBe('<script>alert(1)</script>')
  })
})

// A minimal fake request — enough for the template lookup path.
function fakeReq(docs: unknown[], throwOnFind = false) {
  return {
    payload: {
      find: throwOnFind
        ? async () => {
            throw new Error('db down')
          }
        : async () => ({ docs }),
      logger: { info: () => {}, warn: () => {}, error: () => {} },
    },
  } as never
}

describe('renderEmailTemplate', () => {
  const fallback = { subject: 'Fallback subject', html: '<p>{{name}}</p>', text: 'Hi {{name}}' }

  it('uses the stored template when one exists', async () => {
    const req = fakeReq([{ subject: 'Stored {{name}}', html: '<b>{{name}}</b>', text: 't', enabled: true }])
    const out = await renderEmailTemplate({ req, slug: 'x', variables: { name: 'Sam' }, fallback })
    expect(out.subject).toBe('Stored Sam')
    expect(out.html).toBe('<b>Sam</b>')
  })

  it('falls back to the inline copy when the template is missing', async () => {
    const out = await renderEmailTemplate({ req: fakeReq([]), slug: 'x', variables: { name: 'Sam' }, fallback })
    expect(out.subject).toBe('Fallback subject')
    expect(out.html).toBe('<p>Sam</p>')
  })

  it('falls back when the lookup itself throws — a lead must never be lost', async () => {
    const out = await renderEmailTemplate({
      req: fakeReq([], true),
      slug: 'x',
      variables: { name: 'Sam' },
      fallback,
    })
    expect(out.text).toBe('Hi Sam')
  })

  it('throws for a deliberately disabled template rather than falling back', async () => {
    const req = fakeReq([{ subject: 's', html: 'h', text: 't', enabled: false }])
    await expect(
      renderEmailTemplate({ req, slug: 'x', variables: {}, fallback }),
    ).rejects.toThrow(/disabled/)
  })
})
