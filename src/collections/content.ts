import type { CollectionConfig } from 'payload'

import { seoFields } from '../fields/seo'
import { linkField } from '../fields/link'
import { iconOptions, motifOptions } from '../lib/registry-options'

/**
 * The collections the page-builder blocks pull from.
 *
 * These exist so that publishing a service or an article updates every page that lists it,
 * with no block edited by hand — the difference between a CMS and a page editor.
 */

const slugValidate = (value: unknown) => {
  if (typeof value !== 'string' || !value.trim()) return 'A slug is required.'
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) {
    return 'Use lowercase letters, numbers and single hyphens only.'
  }
  return true
}

/** The five service pillars. Feeds the nav, the home grid, the services page and the footer. */
export const Services: CollectionConfig = {
  slug: 'services',
  versions: { drafts: true },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'order', '_status', 'updatedAt'],
    group: 'Content',
    description: 'The service pillars. Ordering here controls the order everywhere they appear.',
  },
  defaultSort: 'order',
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true, validate: slugValidate },
    { name: 'tagline', type: 'text', admin: { description: 'Revealed on hover, e.g. "Put AI to work where it matters."' } },
    { name: 'shortDesc', label: 'Short description', type: 'textarea' },
    {
      name: 'tags',
      type: 'text',
      hasMany: true,
      admin: { description: 'The chips on the card, e.g. "AI strategy & consulting".' },
    },
    {
      type: 'row',
      fields: [
        { name: 'iconKey', type: 'select', options: iconOptions, admin: { width: '50%' } },
        {
          name: 'motifKey',
          type: 'select',
          options: motifOptions,
          admin: { width: '50%', description: 'The large glyph on the home-page card.' },
        },
      ],
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 100,
      admin: { position: 'sidebar', description: 'Lower numbers appear first.' },
    },
    {
      name: 'page',
      type: 'relationship',
      relationTo: 'pages',
      admin: { position: 'sidebar', description: 'The detail page this service links to.' },
    },
    linkField({ name: 'cta', label: 'Card link' }),
  ],
}

/** Insight categories — "AI / Technology", "Growth / Digital", and so on. */
export const InsightCategories: CollectionConfig = {
  slug: 'insight-categories',
  labels: { singular: 'Insight category', plural: 'Insight categories' },
  admin: {
    useAsTitle: 'label',
    defaultColumns: ['label', 'order'],
    group: 'Content',
  },
  defaultSort: 'order',
  fields: [
    { name: 'label', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true, validate: slugValidate },
    { name: 'order', type: 'number', defaultValue: 100 },
  ],
}

/**
 * Products — the EVOQ application modules, as a filter facet on the insights index.
 *
 * A collection rather than a select on `insights` because the list is editorial and changes
 * without a deploy: a new EVOQ module should appear as a filter the moment it is published,
 * exactly as a new service pillar does. It mirrors InsightCategories' shape for that reason.
 */
export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'label',
    defaultColumns: ['label', 'order', 'updatedAt'],
    group: 'Content',
    description: 'Product modules. Used as a filter on the insights index.',
  },
  defaultSort: 'order',
  fields: [
    { name: 'label', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true, validate: slugValidate },
    { name: 'shortDesc', label: 'Short description', type: 'textarea' },
    { name: 'order', type: 'number', defaultValue: 100 },
  ],
}

/**
 * Insights — blogs, case studies, whitepapers and featured projects in one collection.
 *
 * ASSUMPTION, pending the client answer to Appendix C question 3: the nav lists these as four
 * separate things, but the design renders them through one card shape with a category badge, and
 * their fields are identical. One collection with a `kind` plus a category is therefore the
 * model. If they later need genuinely different fields, `kind` is the seam to split on.
 */
export const Insights: CollectionConfig = {
  slug: 'insights',
  versions: { drafts: true },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'kind', 'category', 'publishedAt', '_status'],
    group: 'Content',
    description: 'Articles, case studies and whitepapers. The carousel picks these up automatically.',
  },
  defaultSort: '-publishedAt',
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            { name: 'title', type: 'text', required: true },
            { name: 'excerpt', type: 'textarea', admin: { description: 'Used on cards and as the SEO fallback.' } },
            { name: 'body', type: 'richText' },
          ],
        },
        { label: 'SEO', fields: seoFields },
        {
          label: 'Settings',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'slug', type: 'text', required: true, unique: true, index: true, validate: slugValidate, admin: { width: '50%' } },
                {
                  name: 'kind',
                  type: 'select',
                  defaultValue: 'blog',
                  options: [
                    { label: 'Blog', value: 'blog' },
                    { label: 'Case study', value: 'case-study' },
                    { label: 'Whitepaper', value: 'whitepaper' },
                    { label: 'Featured project', value: 'featured-project' },
                  ],
                  admin: { width: '50%' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'category', type: 'relationship', relationTo: 'insight-categories', admin: { width: '50%' } },
                {
                  name: 'readTime',
                  type: 'text',
                  admin: { width: '50%', description: 'e.g. "6 min read". Shown on the card.' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'author',
                  type: 'text',
                  admin: { width: '50%', description: 'Shown on the article page byline.' },
                },
                {
                  name: 'swatch',
                  type: 'select',
                  defaultValue: 'accent',
                  options: [
                    { label: 'Blue (accent)', value: 'accent' },
                    { label: 'Green (success)', value: 'success' },
                    { label: 'Amber (attention)', value: 'attention' },
                  ],
                  admin: {
                    width: '50%',
                    description:
                      'The card colour when there is no thumbnail. The design cycles these (INSIGHT_COLORS).',
                  },
                },
              ],
            },
            {
              name: 'thumbnail',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description:
                  'Optional. Cards with no image fall back to the solid swatch above, as the design does.',
              },
            },
            /*
             * The two facet fields on the insights index, alongside `kind`.
             *
             * Relationships, not a select each: the sidebar's options ARE the published services
             * and products, so adding a service pillar adds a filter with no deploy. `hasMany`
             * because an article about commerce on mobile belongs under both.
             */
            {
              type: 'row',
              fields: [
                {
                  name: 'services',
                  type: 'relationship',
                  relationTo: 'services',
                  hasMany: true,
                  admin: { width: '50%', description: 'Filters this article under these service pillars.' },
                },
                {
                  name: 'products',
                  type: 'relationship',
                  relationTo: 'products',
                  hasMany: true,
                  admin: { width: '50%', description: 'Filters this article under these products.' },
                },
              ],
            },
            {
              name: 'tags',
              type: 'text',
              hasMany: true,
              admin: {
                description: 'Free-text labels shown in the article sidebar. Not a filter facet.',
              },
            },
            {
              type: 'row',
              fields: [
                { name: 'featured', type: 'checkbox', defaultValue: false, admin: { width: '50%' } },
                {
                  name: 'publishedAt',
                  type: 'date',
                  admin: { width: '50%', date: { pickerAppearance: 'dayAndTime' } },
                  hooks: {
                    beforeChange: [
                      ({ siblingData, value }) =>
                        value ?? (siblingData?._status === 'published' ? new Date().toISOString() : value),
                    ],
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}

/** Case studies, referenced by the case-study block so one study can appear on several pages. */
export const CaseStudies: CollectionConfig = {
  slug: 'case-studies',
  versions: { drafts: true },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'client', '_status', 'updatedAt'],
    group: 'Content',
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true, validate: slugValidate },
    { name: 'client', type: 'text' },
    { name: 'tag', type: 'text', admin: { description: 'Corner label, e.g. "Sample case study".' } },
    {
      name: 'blocks',
      type: 'array',
      labels: { singular: 'Section', plural: 'Sections' },
      defaultValue: [
        { label: 'Challenge', text: '' },
        { label: 'What we built', text: '' },
        { label: 'Impact', text: '' },
      ],
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'text', type: 'textarea', required: true },
      ],
    },
    {
      name: 'mockKey',
      type: 'text',
      admin: { description: 'Which illustrative mock to render. Blank shows no illustration.' },
    },
    linkField({ name: 'cta', label: 'Read-more link' }),
  ],
}

/** Client logos for the proof strip. */
export const Clients: CollectionConfig = {
  slug: 'clients',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'featured', 'order'],
    group: 'Content',
  },
  defaultSort: 'order',
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'logo', type: 'upload', relationTo: 'media', required: true },
    { name: 'url', type: 'text' },
    {
      type: 'row',
      fields: [
        { name: 'featured', type: 'checkbox', defaultValue: true, admin: { width: '50%' } },
        { name: 'order', type: 'number', defaultValue: 100, admin: { width: '50%' } },
      ],
    },
  ],
}

/** Testimonial quotes. */
export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'role', 'featured', 'order'],
    group: 'Content',
  },
  defaultSort: 'order',
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'role',
      type: 'text',
      admin: { description: 'The design uses this as a short headline, e.g. "Great flexibility!".' },
    },
    { name: 'avatar', type: 'upload', relationTo: 'media' },
    { name: 'quote', type: 'textarea', required: true },
    {
      type: 'row',
      fields: [
        { name: 'featured', type: 'checkbox', defaultValue: true, admin: { width: '50%' } },
        { name: 'order', type: 'number', defaultValue: 100, admin: { width: '50%' } },
      ],
    },
  ],
}

/** 301/302 map, so a renamed page does not leave a dead inbound link. */
export const Redirects: CollectionConfig = {
  slug: 'redirects',
  admin: {
    useAsTitle: 'from',
    defaultColumns: ['from', 'to', 'type'],
    group: 'Settings',
    description: 'Send an old URL to a new one.',
  },
  fields: [
    {
      name: 'from',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: { description: 'The old path, starting with a slash. e.g. /old-services' },
    },
    { name: 'to', type: 'text', required: true, admin: { description: 'A path or a full URL.' } },
    {
      name: 'type',
      type: 'select',
      defaultValue: '301',
      options: [
        { label: 'Permanent (301)', value: '301' },
        { label: 'Temporary (302)', value: '302' },
      ],
    },
  ],
}
