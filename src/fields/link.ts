import type { Field } from 'payload'

/**
 * A link that survives a slug change.
 *
 * The design stores every destination as a raw href (`ai-transformation.html`, `#contact`).
 * Storing those verbatim would mean a page rename silently breaks every link pointing at it —
 * across the nav, the footer, and every card on every page.
 *
 * An `internal` link therefore holds a relationship, and the frontend resolves it to the
 * page's current `pathname` at render time. `external` and `anchor` cover the rest.
 */

type LinkOptions = {
  name?: string
  label?: string
  /** Adds a `label` text field. Off for pure destinations (e.g. a card's whole-tile link). */
  withLabel?: boolean
  required?: boolean
}

export function linkField({
  name = 'link',
  label = 'Link',
  withLabel = true,
  required = false,
}: LinkOptions = {}): Field {
  return {
    name,
    label,
    type: 'group',
    fields: [
      ...(withLabel
        ? [
            {
              name: 'label',
              type: 'text' as const,
              required,
              admin: { description: 'The visible text, e.g. "Explore AI transformation".' },
            },
          ]
        : []),
      {
        name: 'type',
        type: 'select',
        defaultValue: 'internal',
        options: [
          { label: 'Page on this site', value: 'internal' },
          { label: 'External URL', value: 'external' },
          { label: 'Section on this page', value: 'anchor' },
        ],
        admin: { width: '33%' },
      },
      {
        name: 'page',
        type: 'relationship',
        relationTo: 'pages',
        admin: {
          width: '67%',
          condition: (_, siblingData) => siblingData?.type === 'internal',
          description: 'Resolved to the page’s current URL, so renaming the page cannot break this link.',
        },
      },
      {
        name: 'url',
        type: 'text',
        admin: {
          width: '67%',
          condition: (_, siblingData) => siblingData?.type === 'external',
          description: 'Include the protocol, e.g. https://example.com.',
        },
      },
      {
        name: 'anchor',
        type: 'text',
        admin: {
          width: '67%',
          condition: (_, siblingData) => siblingData?.type === 'anchor',
          description: 'A section’s anchor ID, without the #. For example: contact',
        },
      },
      {
        name: 'newTab',
        type: 'checkbox',
        defaultValue: false,
        admin: {
          condition: (_, siblingData) => siblingData?.type === 'external',
        },
      },
    ],
  }
}

/** The design's CTA shape: a label and a destination, both optional. */
export const ctaField = (name = 'cta', label = 'Call to action'): Field =>
  linkField({ name, label, withLabel: true })
