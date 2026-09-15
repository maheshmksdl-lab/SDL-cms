import type { CollectionConfig } from 'payload'

import { layoutBlocks } from '../blocks'
import { computePathname, rewriteDescendantPathnames } from '../hooks/computePathname'
import { seoFields } from '../fields/seo'

/**
 * Pages — every URL on the site.
 *
 * Adapted from the EFTMRA reference. Kept: drafts, the blocks-based `layout`, publishedOnly
 * read access. Changed: a flat `slug` becomes `slug` + `parent` + a computed `pathname`, an SEO
 * tab is added, and the multi-site `siteField`/`enforceSiteField` machinery is dropped.
 */
export const Pages: CollectionConfig = {
  slug: 'pages',
  versions: {
    drafts: {
      autosave: { interval: 800 },
      schedulePublish: true,
    },
    maxPerDoc: 25,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'pathname', 'template', '_status', 'updatedAt'],
    group: 'Content',
    description: 'Every page on the site, built from reusable sections.',
    livePreview: {
      url: ({ data }) =>
        `${process.env.WEB_URL}/api/preview?secret=${process.env.PREVIEW_SECRET}&path=${
          data?.pathname ?? '/'
        }`,
      // Matches the breakpoints the design actually uses, so editors check the real cases.
      breakpoints: [
        { label: 'Mobile', name: 'mobile', width: 375, height: 812 },
        { label: 'Tablet', name: 'tablet', width: 768, height: 1024 },
        { label: 'Desktop', name: 'desktop', width: 1440, height: 900 },
      ],
    },
    preview: ({ pathname }) =>
      `${process.env.WEB_URL}/api/preview?secret=${process.env.PREVIEW_SECRET}&path=${pathname ?? '/'}`,
  },
  hooks: {
    beforeChange: [computePathname],
    afterChange: [rewriteDescendantPathnames],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            { name: 'title', type: 'text', required: true },
            {
              name: 'layout',
              type: 'blocks',
              blocks: layoutBlocks,
              admin: {
                description:
                  'Drag to reorder. Order here is the order on the page. Each section can be hidden without deleting it.',
              },
            },
          ],
        },
        {
          label: 'SEO',
          fields: seoFields,
        },
        {
          label: 'Settings',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'slug',
                  type: 'text',
                  required: true,
                  index: true,
                  admin: {
                    width: '50%',
                    description: 'The last part of the URL. Use "home" for the front page.',
                  },
                  validate: (value: unknown) => {
                    if (typeof value !== 'string' || !value.trim()) return 'A slug is required.'
                    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) {
                      return 'Use lowercase letters, numbers and single hyphens only.'
                    }
                    return true
                  },
                },
                {
                  name: 'parent',
                  type: 'relationship',
                  relationTo: 'pages',
                  admin: {
                    width: '50%',
                    description: 'Nests this page under another, e.g. Services → AI transformation.',
                  },
                  filterOptions: ({ id }) => (id ? { id: { not_equals: id } } : true),
                },
              ],
            },
            {
              name: 'pathname',
              type: 'text',
              index: true,
              unique: true,
              admin: {
                readOnly: true,
                position: 'sidebar',
                description: 'The URL this page is served at. Computed from parent and slug.',
              },
            },
            {
              name: 'template',
              type: 'select',
              defaultValue: 'service',
              options: [
                { label: 'Service / standard', value: 'service' },
                { label: 'Home', value: 'home' },
                { label: 'Services overview', value: 'services' },
                { label: 'Sub-service (compact type scale)', value: 'sub-service' },
              ],
              admin: {
                position: 'sidebar',
                description:
                  'Sets the page’s type scale. The design uses four; this picks which one applies.',
              },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'headerVariant',
                  type: 'select',
                  defaultValue: 'default',
                  options: [
                    { label: 'Default', value: 'default' },
                    { label: 'Transparent (overlays the hero)', value: 'transparent' },
                  ],
                  admin: {
                    width: '50%',
                    description:
                      'Transparent lets a full-bleed hero show through the sticky header until the page is scrolled.',
                  },
                },
                {
                  name: 'hideFooter',
                  type: 'checkbox',
                  defaultValue: false,
                  admin: {
                    width: '50%',
                    description: 'For focused landing pages that should not offer the full footer.',
                  },
                },
              ],
            },
            {
              name: 'publishedAt',
              type: 'date',
              admin: {
                position: 'sidebar',
                date: { pickerAppearance: 'dayAndTime' },
              },
              hooks: {
                beforeChange: [
                  ({ siblingData, value }) =>
                    // Stamp on first publish, then leave alone so the date reflects when the
                    // page went live rather than when it was last touched.
                    value ?? (siblingData?._status === 'published' ? new Date().toISOString() : value),
                ],
              },
            },
          ],
        },
      ],
    },
  ],
}
