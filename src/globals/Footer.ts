import type { GlobalConfig } from 'payload'

import { linkField } from '../fields/link'

/**
 * Footer.
 *
 * Maps almost one-to-one onto the reference's Footer global, which in turn maps onto the
 * design's `FOOTER_COLS`. The one deliberate removal is the reference's `backgroundColor` and
 * `textColor` free-text fields: the design's footer is fixed, and a colour picker there is a
 * way for an editor to break it with no way to tell they have.
 */
export const Footer: GlobalConfig = {
  slug: 'footer',
  label: 'Footer',
  admin: {
    group: 'Site',
    description: 'Footer columns, tagline and social links.',
  },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'logo', type: 'upload', relationTo: 'media', admin: { width: '50%' } },
        { name: 'logoAlt', type: 'text', defaultValue: 'Social DNA Labs', admin: { width: '50%' } },
      ],
    },
    {
      name: 'tagline',
      type: 'textarea',
      admin: { description: 'The line under the logo.' },
    },
    {
      name: 'columns',
      type: 'array',
      labels: { singular: 'Column', plural: 'Columns' },
      fields: [
        { name: 'title', type: 'text', required: true },
        {
          name: 'links',
          type: 'array',
          fields: [linkField({ name: 'link', label: 'Link' })],
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'copyrightText',
          type: 'text',
          defaultValue: '© {year} Social DNA Labs',
          admin: { width: '50%', description: '{year} is replaced with the current year.' },
        },
        {
          name: 'bottomRightText',
          type: 'text',
          admin: { width: '50%', description: 'e.g. "Business impact, by design."' },
        },
      ],
    },
    {
      name: 'socialLinks',
      type: 'array',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'platform',
              type: 'select',
              required: true,
              options: [
                { label: 'LinkedIn', value: 'linkedin' },
                { label: 'X / Twitter', value: 'twitter' },
                { label: 'YouTube', value: 'youtube' },
                { label: 'Instagram', value: 'instagram' },
                { label: 'Facebook', value: 'facebook' },
              ],
              admin: { width: '40%' },
            },
            { name: 'url', type: 'text', required: true, admin: { width: '60%' } },
          ],
        },
      ],
    },
  ],
}
