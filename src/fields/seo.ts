import type { Field } from 'payload'

/**
 * SEO fields, shared by every publicly-addressable collection.
 *
 * Written by hand rather than via @payloadcms/plugin-seo: the plugin injects a `meta` group with
 * its own preview widgets, which is more UI than this needs, and it makes the three-level
 * fallback in the frontend (page → collection default → site settings) harder to reason about.
 * Every field here is optional by design — an empty value falls back, it does not render blank.
 */
export const seoFields: Field[] = [
  {
    name: 'seo',
    type: 'group',
    label: false,
    fields: [
      {
        name: 'title',
        type: 'text',
        admin: {
          description:
            'Overrides the page title in search results and browser tabs. Falls back to the page title. Aim for under 60 characters.',
        },
      },
      {
        name: 'description',
        type: 'textarea',
        admin: {
          description:
            'The snippet under the link in search results. Falls back to the site default. Aim for 120–160 characters.',
        },
      },
      {
        name: 'image',
        type: 'upload',
        relationTo: 'media',
        admin: {
          description:
            'Shown when the page is shared on social media. Falls back to the site default. 1200×630 works everywhere.',
        },
      },
      {
        type: 'row',
        fields: [
          {
            name: 'noIndex',
            label: 'Hide from search engines',
            type: 'checkbox',
            defaultValue: false,
            admin: {
              width: '50%',
              description: 'Adds noindex. The page stays publicly reachable by anyone with the URL.',
            },
          },
          {
            name: 'canonicalOverride',
            type: 'text',
            admin: {
              width: '50%',
              description:
                'Only when this page duplicates content that lives elsewhere. Leave empty otherwise.',
            },
          },
        ],
      },
    ],
  },
]
