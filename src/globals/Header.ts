import type { GlobalConfig } from 'payload'

import { linkField } from '../fields/link'
import { iconOptions } from '../lib/registry-options'

/**
 * Header — the sticky bar and its mega menu.
 *
 * Replaces the `MENUS` array that the design repeats byte-identically across eight of the nine
 * pages. Structurally close to the EFTMRA reference's Header global; the additions are `key`
 * (the mobile accordion is keyed by it), a per-item `iconKey`, and a real logo upload in place
 * of the reference's logo text.
 */
export const Header: GlobalConfig = {
  slug: 'header',
  label: 'Header',
  admin: {
    group: 'Site',
    description: 'Logo, navigation and the header call to action.',
  },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'logo', type: 'upload', relationTo: 'media', admin: { width: '50%' } },
        {
          name: 'logoAlt',
          type: 'text',
          defaultValue: 'Social DNA Labs',
          admin: { width: '50%', description: 'Read aloud in place of the logo.' },
        },
      ],
    },
    linkField({ name: 'cta', label: 'Header button' }),
    {
      name: 'megaMenuEnabled',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description:
          'Off makes every top-level item a plain link. The design ships this switch as MEGA_MENU_ENABLED.',
      },
    },
    {
      name: 'menuItems',
      type: 'array',
      labels: { singular: 'Menu item', plural: 'Menu items' },
      admin: { description: 'Top-level navigation, left to right.' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'label', type: 'text', required: true, admin: { width: '50%' } },
            {
              name: 'key',
              type: 'text',
              required: true,
              admin: {
                width: '50%',
                description: 'Short identifier, e.g. "services". Used by the mobile accordion.',
              },
            },
          ],
        },
        linkField({
          name: 'link',
          label: 'Top-level destination',
          withLabel: false,
        }),
        {
          name: 'subItems',
          type: 'array',
          labels: { singular: 'Submenu item', plural: 'Submenu items' },
          admin: { description: 'Leave empty for a plain link with no dropdown.' },
          fields: [
            { name: 'title', type: 'text', required: true },
            { name: 'desc', label: 'Description', type: 'text' },
            {
              name: 'iconKey',
              type: 'select',
              options: iconOptions,
              admin: { description: 'Artwork comes from the frontend icon registry.' },
            },
            linkField({ name: 'link', label: 'Destination', withLabel: false }),
          ],
        },
        linkField({ name: 'submenuCTA', label: 'Submenu footer link' }),
      ],
    },
  ],
}
