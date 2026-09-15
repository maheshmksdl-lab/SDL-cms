import type { Block } from 'payload'

import { sectionSettings, sectionHeadFields } from './shared/sectionSettings'
import { linkField } from '../fields/link'
import { iconOptions, aiEngineeringMockOptions } from '../lib/registry-options'

/**
 * Blocks used by the service-detail pages.
 *
 * All of them share one skeleton — hero → narrative → capabilities → value → extra → CTA — which
 * is why so few blocks cover so many pages. Differences between them are content, not structure.
 */

/**
 * ai-transformation.html `.ai-narrative` — a lead paragraph then a stack of body paragraphs.
 *
 * `pills` and `quote` are additive: the four "engineering family" sub-service pages
 * (web-application-, cloud-, mobile-, quality-engineering) extend this same shape with a row of
 * icon+label chips and a closing pull-quote (their `.wae-shift-pillars` / `.wae-shift-quote`
 * pattern). Both are optional and render nothing on the five pages that don't set them.
 */
export const NarrativeBlock: Block = {
  slug: 'narrative',
  labels: { singular: 'Narrative', plural: 'Narratives' },
  admin: { group: 'Page sections' },
  fields: [
    { name: 'kicker', type: 'text' },
    { name: 'lead', type: 'textarea', admin: { description: 'The larger opening paragraph.' } },
    {
      name: 'paragraphs',
      type: 'array',
      labels: { singular: 'Paragraph', plural: 'Paragraphs' },
      fields: [{ name: 'text', type: 'textarea', required: true }],
    },
    {
      name: 'pills',
      type: 'array',
      labels: { singular: 'Pill', plural: 'Pills' },
      admin: {
        description:
          'Optional icon + label chips under the copy, e.g. "Fast", "Secure", "Scalable" (the sub-service pages\' pattern).',
      },
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'iconKey', type: 'select', options: iconOptions },
      ],
    },
    {
      name: 'quote',
      type: 'textarea',
      admin: { description: 'Optional closing pull-quote under the pills.' },
    },
    linkField({ name: 'cta', label: 'Closing link (optional, e.g. "Explore digital engineering")' }),
    sectionSettings,
  ],
}

/**
 * The capability list on every service page — `.ai-cap-grid`, `.bt-cap-grid`, and so on.
 *
 * `tech` is only used by the sub-service pages, and `tagline` only by business-transformation,
 * so both are optional rather than being separate blocks.
 *
 * `variant: row` is digital-engineering's own presentation (`.de-cap-row`): a numbered list where
 * each item links to its own sub-service page, plus an optional trailing "cross-cutting
 * capabilities" pill row (`crossCutting`). Every other page uses `grid` (the default) and neither
 * `link` nor `crossCutting` — both are additive and change nothing there.
 */
export const CapabilityDetailBlock: Block = {
  slug: 'capability-detail',
  labels: { singular: 'Capability detail', plural: 'Capability details' },
  admin: { group: 'Page sections' },
  fields: [
    {
      name: 'variant',
      type: 'select',
      defaultValue: 'grid',
      options: [
        { label: 'Grid of cards', value: 'grid' },
        { label: 'Numbered rows, each linking out (digital engineering)', value: 'row' },
        { label: 'Numbered cards with a gradient shape (AI transformation)', value: 'numbered' },
        { label: 'Expandable accordion rows (business transformation)', value: 'accordion' },
        { label: 'Tabbed selector (digital experience)', value: 'tabs' },
        { label: 'Bento tile grid (growth transformation)', value: 'bento' },
      ],
    },
    ...sectionHeadFields,
    {
      name: 'intro',
      type: 'array',
      labels: { singular: 'Intro paragraph', plural: 'Intro paragraphs' },
      fields: [{ name: 'text', type: 'textarea', required: true }],
    },
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'tagline', type: 'text' },
        { name: 'desc', label: 'Description', type: 'textarea' },
        { name: 'iconKey', type: 'select', options: iconOptions },
        {
          name: 'tech',
          type: 'text',
          hasMany: true,
          admin: { description: 'Technology chips, where the page shows them.' },
        },
        linkField({ name: 'link', label: 'Links to', withLabel: false, required: false }),
      ],
    },
    {
      name: 'crossCutting',
      label: 'Cross-cutting capabilities',
      type: 'group',
      admin: {
        description:
          'Optional trailing pill row under the list, e.g. "Cross-cutting engineering capabilities".',
      },
      fields: [
        { name: 'label', type: 'text' },
        { name: 'pills', type: 'text', hasMany: true },
      ],
    },
    sectionSettings,
  ],
}

/** `.ai-value-grid`, `.gt-bento` — "the value is in what changes". */
export const ValueGridBlock: Block = {
  slug: 'value-grid',
  labels: { singular: 'Value grid', plural: 'Value grids' },
  admin: { group: 'Page sections' },
  fields: [
    {
      name: 'variant',
      type: 'select',
      defaultValue: 'dark',
      options: [
        { label: 'Dark band', value: 'dark' },
        { label: 'Light', value: 'light' },
        { label: 'Bento (growth page)', value: 'bento' },
        { label: 'Icon cards (engineering sub-service pages)', value: 'icon-cards' },
        { label: 'Dark accent-icon cards (digital engineering)', value: 'de-accent-cards' },
        { label: 'Timeline (business transformation, Zoho, Salesforce)', value: 'bt-timeline' },
        { label: 'Two-column checklist (digital experience)', value: 'dx-checklist' },
        { label: 'Big-number stat rows (growth transformation)', value: 'gt-stat-rows' },
      ],
    },
    {
      name: 'columns',
      type: 'select',
      defaultValue: 'two',
      options: [
        { label: 'Two columns', value: 'two' },
        { label: 'One column', value: 'one' },
      ],
      admin: {
        condition: (_, siblingData) => siblingData?.variant === 'bt-timeline',
        description: 'The Zoho page runs every item down one rail; the other timeline pages split them across two.',
      },
    },
    {
      name: 'mockKey',
      label: 'Icon set',
      type: 'select',
      options: aiEngineeringMockOptions,
      admin: {
        condition: (_, siblingData) => siblingData?.variant === 'icon-cards',
        description:
          'The per-item icon glyphs and accent-colour cycle are bespoke, illustrative code, keyed the same way as the AI-engineering block on this same page.',
      },
    },
    ...sectionHeadFields,
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'desc', label: 'Description', type: 'textarea' },
        { name: 'iconKey', type: 'select', options: iconOptions },
      ],
    },
    sectionSettings,
  ],
}

/**
 * `.ai-case` — challenge / what we built / impact, beside an illustrative mock.
 *
 * The mock is code, keyed by name. Either reference a Case Study record or write the content
 * inline; referencing is preferred so one study can appear on several pages.
 */
export const CaseStudyBlock: Block = {
  slug: 'case-study',
  labels: { singular: 'Case study', plural: 'Case studies' },
  admin: { group: 'Page sections' },
  fields: [
    ...sectionHeadFields,
    {
      name: 'source',
      type: 'select',
      defaultValue: 'reference',
      options: [
        { label: 'Reference a case study', value: 'reference' },
        { label: 'Write inline', value: 'inline' },
      ],
    },
    {
      name: 'study',
      type: 'relationship',
      relationTo: 'case-studies',
      admin: { condition: (_, s) => s?.source === 'reference' },
    },
    {
      name: 'inline',
      type: 'group',
      admin: { condition: (_, s) => s?.source === 'inline' },
      fields: [
        { name: 'caseTitle', type: 'text' },
        { name: 'tag', type: 'text', admin: { description: 'The corner label, e.g. "Sample case study".' } },
        {
          name: 'blocks',
          type: 'array',
          fields: [
            { name: 'label', type: 'text', required: true },
            { name: 'text', type: 'textarea', required: true },
          ],
        },
      ],
    },
    {
      name: 'mockKey',
      label: 'Illustration',
      type: 'select',
      options: [
        { label: 'AI transformation', value: 'ai-transformation' },
        { label: 'Business transformation', value: 'business-transformation' },
        { label: 'Digital experience', value: 'digital-experience' },
        { label: 'Growth transformation', value: 'growth-transformation' },
        { label: 'Digital engineering', value: 'digital-engineering' },
        { label: 'Web & application engineering', value: 'web-application-engineering' },
        { label: 'Cloud engineering', value: 'cloud-engineering' },
        { label: 'Mobile engineering', value: 'mobile-engineering' },
        { label: 'Quality engineering', value: 'quality-engineering' },
        { label: 'Zoho consulting & implementation', value: 'zoho-consulting-implementation' },
        { label: 'Salesforce implementation', value: 'salesforce-implementation' },
      ],
      admin: {
        description:
          'The mock UI beside the copy is bespoke, illustrative markup, keyed the same way as the EVOQ and AI-engineering mocks. Leave unset for a plain placeholder.',
      },
    },
    linkField({ name: 'cta', label: 'Link below the study' }),
    sectionSettings,
  ],
}

/** digital-engineering.html `.de-tech-*` — grouped technology lists with metrics. */
export const TechGroupsBlock: Block = {
  slug: 'tech-groups',
  labels: { singular: 'Technology groups', plural: 'Technology groups' },
  admin: { group: 'Page sections' },
  fields: [
    ...sectionHeadFields,
    {
      name: 'intro',
      type: 'array',
      labels: { singular: 'Intro paragraph', plural: 'Intro paragraphs' },
      fields: [{ name: 'text', type: 'textarea', required: true }],
    },
    {
      name: 'groups',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'desc', label: 'Description', type: 'textarea' },
        { name: 'list', type: 'text', hasMany: true, admin: { description: 'Technology names.' } },
        { name: 'iconKey', type: 'select', options: iconOptions },
        {
          name: 'mockType',
          type: 'select',
          defaultValue: 'ui',
          options: [
            { label: 'Interface', value: 'ui' },
            { label: 'Server', value: 'server' },
            { label: 'Code', value: 'code' },
            { label: 'Split', value: 'split' },
            { label: 'CMS', value: 'cms' },
            { label: 'Graph', value: 'graph' },
          ],
          admin: {
            description:
              'Matches web/lib/registries/mocks.ts techMockTypes — keep both lists in step.',
          },
        },
        {
          name: 'metric',
          type: 'group',
          fields: [
            { name: 'value', type: 'text', admin: { description: 'e.g. "40% faster".' } },
            { name: 'label', type: 'text', admin: { description: 'e.g. "page load times".' } },
          ],
        },
        { name: 'checklist', type: 'text', hasMany: true },
      ],
    },
    sectionSettings,
  ],
}

/** `.ai-cta-section` and its equivalents — the closing card on every service page. */
export const CtaBannerBlock: Block = {
  slug: 'cta-banner',
  labels: { singular: 'CTA banner', plural: 'CTA banners' },
  admin: { group: 'Page sections' },
  fields: [
    {
      name: 'variant',
      type: 'select',
      defaultValue: 'card',
      options: [
        { label: 'Card', value: 'card' },
        { label: 'Full width', value: 'full' },
      ],
    },
    {
      name: 'titleAsHeading',
      label: 'Render title as <h2>',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description:
          'On (the four engineering sub-service pages): the design marks up this title as a real heading. Off (every other page carrying this block): the design uses a styled, non-heading div.',
      },
    },
    { name: 'kicker', type: 'text' },
    { name: 'title', type: 'text' },
    { name: 'sub', type: 'textarea' },
    linkField({ name: 'cta', label: 'Button' }),
    sectionSettings,
  ],
}

/**
 * "AI-enabled engineering" — shared across digital-engineering and its four sub-service pages
 * (web-application-, cloud-, mobile-, quality-engineering): kicker/title/body/pills on the left,
 * a bespoke animated step-through mockup on the right (a terminal prompt, a generated diff,
 * automated checks, then metrics or a review — one code editor-style scene per page).
 *
 * The mockup's exact markup is illustrative, per-page code — like the EVOQ product mocks, it
 * lives in a registry keyed by `mockKey`, not in this field set. What IS real, editable content
 * is the kicker, title, body copy and the pill tags.
 */
export const AiEngineeringBlock: Block = {
  slug: 'ai-engineering',
  labels: { singular: 'AI-enabled engineering', plural: 'AI-enabled engineering' },
  admin: { group: 'Page sections' },
  fields: [
    { name: 'kicker', type: 'text' },
    { name: 'title', type: 'text' },
    {
      name: 'paragraphs',
      type: 'array',
      labels: { singular: 'Paragraph', plural: 'Paragraphs' },
      fields: [{ name: 'text', type: 'textarea', required: true }],
    },
    {
      name: 'tags',
      type: 'text',
      hasMany: true,
      admin: { description: 'The pill row under the copy, e.g. "AI-assisted development".' },
    },
    {
      name: 'mockKey',
      label: 'Mockup',
      type: 'select',
      options: aiEngineeringMockOptions,
      admin: {
        description: 'The illustrative animated panel. Options come from the frontend registry.',
      },
    },
    sectionSettings,
  ],
}

/**
 * business-transformation.html `.bt-platform-*` — "SaaS & business platforms": a row of partner
 * platforms, each a logo lockup (with an optional partner badge), a title, a description and a
 * link to that platform's own page.
 */
export const PlatformRowBlock: Block = {
  slug: 'platform-row',
  labels: { singular: 'Platform row', plural: 'Platform rows' },
  admin: { group: 'Page sections' },
  fields: [
    ...sectionHeadFields,
    {
      name: 'platforms',
      type: 'array',
      minRows: 1,
      maxRows: 4,
      labels: { singular: 'Platform', plural: 'Platforms' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'logo', type: 'upload', relationTo: 'media', required: true, admin: { width: '50%' } },
            {
              name: 'logoSize',
              type: 'select',
              defaultValue: 'default',
              options: [
                { label: 'Standard height (52px)', value: 'default' },
                { label: 'Compact height (46px)', value: 'compact' },
              ],
              admin: { width: '50%', description: 'The design sets the Salesforce mark slightly smaller.' },
            },
          ],
        },
        {
          name: 'badge',
          type: 'text',
          admin: { description: 'Optional badge under the logo, e.g. "Official Zoho Consulting Partner".' },
        },
        { name: 'title', type: 'text', required: true },
        { name: 'desc', label: 'Description', type: 'textarea' },
        linkField({ name: 'link', label: 'Link' }),
      ],
    },
    sectionSettings,
  ],
}

/**
 * zoho-consulting-implementation.html `.zh-apps-*` (and Salesforce's capability grid) — a
 * bordered grid of categories, each a title over a dot-separated list.
 */
export const CategoryGridBlock: Block = {
  slug: 'category-grid',
  labels: { singular: 'Category grid', plural: 'Category grids' },
  admin: { group: 'Page sections' },
  fields: [
    ...sectionHeadFields,
    {
      name: 'categories',
      type: 'array',
      minRows: 1,
      labels: { singular: 'Category', plural: 'Categories' },
      fields: [
        { name: 'title', type: 'text', required: true },
        {
          name: 'list',
          type: 'text',
          admin: { description: 'Shown as written, e.g. "Zoho CRM · Zoho SalesIQ · Zoho Bigin".' },
        },
      ],
    },
    sectionSettings,
  ],
}
