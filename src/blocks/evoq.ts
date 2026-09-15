import type { Block } from 'payload'

import { sectionSettings, sectionHeadFields } from './shared/sectionSettings'
import { linkField } from '../fields/link'
import { iconOptions, productMockOptions } from '../lib/registry-options'

/**
 * Blocks specific to the EVOQ product page.
 *
 * The product mockups in the design are ~40 lines of markup each, built from container-query
 * units so they scale with the card. They stay in code, keyed by product name — an editor
 * picks a mock, they never author one.
 */

/**
 * evoq.html "Platform overview" — the dark section pairing the overview copy with the
 * architecture diagram: business teams converging on the EVOQ Applications hub, the shared
 * platform beneath it, and the integrations below that.
 *
 * The diagram is drawn as one SVG from these fields, so labels are editable while the geometry
 * that makes the connectors meet the nodes stays fixed.
 */
export const EvoqArchitectureBlock: Block = {
  slug: 'evoq-architecture',
  labels: { singular: 'EVOQ platform overview', plural: 'EVOQ platform overviews' },
  admin: { group: 'EVOQ' },
  fields: [
    ...sectionHeadFields,
    { name: 'lead', type: 'textarea', admin: { description: 'The large opening statement beside the diagram.' } },
    {
      name: 'paragraphs',
      type: 'array',
      labels: { singular: 'Paragraph', plural: 'Paragraphs' },
      fields: [{ name: 'text', type: 'textarea', required: true }],
    },
    {
      name: 'cards',
      type: 'array',
      maxRows: 4,
      admin: { description: 'The stacked layers: business teams, shared platform, integrations.' },
      fields: [
        { name: 'label', type: 'text', required: true },
        {
          name: 'items',
          type: 'array',
          fields: [
            { name: 'text', type: 'text', required: true },
            { name: 'iconKey', type: 'select', options: iconOptions },
          ],
        },
      ],
    },
    {
      name: 'hub',
      type: 'group',
      admin: { description: 'The highlighted centre card.' },
      fields: [
        { name: 'title', type: 'text' },
        { name: 'desc', label: 'Description', type: 'textarea' },
        { name: 'logo', type: 'upload', relationTo: 'media', admin: { description: 'The EVOQ mark beside the hub title.' } },
      ],
    },
    {
      name: 'moreLabel',
      type: 'text',
      admin: { description: 'The dashed chip after the integration logos, e.g. "+12".' },
    },
    {
      name: 'integrationBadges',
      type: 'array',
      admin: {
        description:
          'Third-party marks. iconUrl points at a logo CDN, as the design does — no upload needed.',
      },
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'iconUrl', type: 'text' },
      ],
    },
    sectionSettings,
  ],
}

/** evoq.html `.evoq-product-*` — the filterable product grid. */
export const ProductGridBlock: Block = {
  slug: 'product-grid',
  labels: { singular: 'Product grid', plural: 'Product grids' },
  admin: { group: 'EVOQ' },
  fields: [
    ...sectionHeadFields,
    {
      name: 'tabs',
      type: 'text',
      hasMany: true,
      defaultValue: ['All', 'Growth', 'Operations', 'People'],
      admin: { description: 'Filter tabs. The first should be the "show everything" option.' },
    },
    {
      name: 'products',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'title', type: 'text', required: true },
        {
          name: 'category',
          type: 'text',
          required: true,
          admin: { description: 'Must match one of the tabs above.' },
        },
        { name: 'desc', label: 'Description', type: 'textarea' },
        { name: 'iconKey', type: 'select', options: iconOptions },
        {
          name: 'mockKey',
          label: 'Mockup',
          type: 'select',
          options: productMockOptions,
          admin: { description: 'The illustrative panel. Options come from the frontend registry.' },
        },
        {
          name: 'photoUrl',
          type: 'text',
          admin: {
            description:
              'Optional photograph behind the panel (the design alternates photo and gradient cards). A full image URL.',
          },
        },
      ],
    },
    sectionSettings,
  ],
}

/** evoq.html `.evoq-industries-*`. */
export const IndustriesGridBlock: Block = {
  slug: 'industries-grid',
  labels: { singular: 'Industries grid', plural: 'Industries grids' },
  admin: { group: 'EVOQ' },
  fields: [
    ...sectionHeadFields,
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'desc', label: 'Description', type: 'textarea' },
        { name: 'image', type: 'upload', relationTo: 'media' },
        {
          name: 'imageUrl',
          type: 'text',
          admin: { description: 'A full image URL, used when no image is uploaded above.' },
        },
        { name: 'iconKey', type: 'select', options: iconOptions },
      ],
    },
    sectionSettings,
  ],
}

/**
 * evoq.html "Integrations" — copy beside a radar panel with partner logos floating over
 * concentric rings, a caption card, and a link below.
 */
export const IntegrationsShowcaseBlock: Block = {
  slug: 'integrations-showcase',
  labels: { singular: 'Integrations showcase', plural: 'Integrations showcases' },
  admin: { group: 'EVOQ' },
  fields: [
    ...sectionHeadFields,
    {
      name: 'paragraphs',
      type: 'array',
      labels: { singular: 'Paragraph', plural: 'Paragraphs' },
      fields: [{ name: 'text', type: 'textarea', required: true }],
    },
    {
      name: 'badges',
      type: 'array',
      labels: { singular: 'Badge', plural: 'Badges' },
      admin: {
        description:
          'Partner logos over the rings. Left and top are percentages of the panel; logos come from simpleicons.org, as the design does.',
      },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'name', type: 'text', required: true, admin: { width: '40%' } },
            {
              name: 'iconSlug',
              type: 'text',
              required: true,
              admin: { width: '35%', description: 'e.g. "quickbooks".' },
            },
            { name: 'large', type: 'checkbox', defaultValue: false, admin: { width: '25%' } },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'left', type: 'number', required: true, min: 0, max: 100, admin: { width: '50%' } },
            { name: 'top', type: 'number', required: true, min: 0, max: 100, admin: { width: '50%' } },
          ],
        },
      ],
    },
    { name: 'captionTitle', type: 'text' },
    { name: 'captionDesc', label: 'Caption description', type: 'text' },
    linkField({ name: 'cta', label: 'Link below the panel' }),
    sectionSettings,
  ],
}

/**
 * The escape hatch.
 *
 * Deliberately last and deliberately plain: reaching for it repeatedly is the signal that a
 * real block is missing, not that the editor needs more freedom.
 */
export const RichTextBlock: Block = {
  slug: 'rich-text',
  labels: { singular: 'Rich text', plural: 'Rich text' },
  admin: { group: 'Page sections' },
  fields: [
    { name: 'kicker', type: 'text' },
    { name: 'title', type: 'text' },
    { name: 'content', type: 'richText' },
    {
      name: 'width',
      type: 'select',
      defaultValue: 'narrow',
      options: [
        { label: 'Narrow (reading width)', value: 'narrow' },
        { label: 'Full container', value: 'full' },
      ],
    },
    sectionSettings,
  ],
}
