import type { Field } from 'payload'

/**
 * The group every block spreads in.
 *
 * This is the mechanism behind "section ordering, section visibility, section-specific
 * configuration" without a code change:
 *
 *   ordering    — Payload's blocks field is drag-ordered; array order IS render order
 *   visibility  — `hidden` filters in RenderBlocks; the section stays editable
 *   anchors     — `anchorId` produces the id the design's in-page links target
 *   background  — maps onto the design's existing .sdl-section--* modifiers, no new CSS
 *   spacing     — maps onto .sdl-section--tight
 *
 * A block that omits this loses all five, silently. See cms/src/blocks/README.md.
 */
export const sectionSettings: Field = {
  name: 'settings',
  label: 'Section settings',
  type: 'group',
  admin: {
    className: 'sdl-materio-card',
    description: 'Applies to this section only.',
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'anchorId',
          type: 'text',
          admin: {
            width: '50%',
            description: 'Lets links jump here, e.g. "capabilities" → /services#capabilities.',
          },
          validate: (value: unknown) => {
            if (value == null || value === '') return true
            if (typeof value !== 'string' || !/^[a-z][a-z0-9-]*$/.test(value)) {
              return 'Use lowercase letters, numbers and hyphens only, starting with a letter.'
            }
            return true
          },
        },
        {
          name: 'hidden',
          label: 'Hide this section',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            width: '50%',
            description: 'Keeps the section and its content, but stops it rendering publicly.',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'background',
          type: 'select',
          defaultValue: 'default',
          options: [
            { label: 'Default (page ground)', value: 'default' },
            { label: 'White', value: 'white' },
            { label: 'Alt (tinted)', value: 'alt' },
            { label: 'Dark', value: 'dark' },
          ],
          admin: { width: '50%' },
        },
        {
          name: 'spacing',
          type: 'select',
          defaultValue: 'default',
          options: [
            { label: 'Default', value: 'default' },
            { label: 'Tight', value: 'tight' },
            { label: 'Flush (no padding)', value: 'flush' },
          ],
          admin: { width: '50%' },
        },
      ],
    },
    {
      name: 'reveal',
      label: 'Animate in on scroll',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description:
          'Uses the design’s scroll-reveal. Always disabled for visitors who prefer reduced motion.',
      },
    },
  ],
}

/**
 * Standard head fields. Most sections in the design open with a kicker, a title and an optional
 * sub-paragraph, so they are defined once rather than retyped per block.
 */
export const sectionHeadFields: Field[] = [
  {
    name: 'kicker',
    type: 'text',
    admin: { description: 'The small uppercase label above the title, e.g. "Capabilities".' },
  },
  { name: 'title', type: 'text' },
  { name: 'sub', label: 'Sub-heading', type: 'textarea' },
]
