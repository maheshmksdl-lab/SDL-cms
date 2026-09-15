import type { Block } from 'payload'

import { sectionSettings, sectionHeadFields } from './shared/sectionSettings'
import { linkField } from '../fields/link'
import { iconOptions, motifOptions } from '../lib/registry-options'

/**
 * Blocks that appear on the home page and the services overview.
 * Each maps to one component in web/components/sections/.
 */

/** index.html `.sdl-explain` — "From potential to impact." */
export const ApproachStepsBlock: Block = {
  slug: 'approach-steps',
  labels: { singular: 'Approach steps', plural: 'Approach steps' },
  admin: { group: 'Page sections' },
  fields: [
    ...sectionHeadFields,
    {
      name: 'steps',
      type: 'array',
      minRows: 2,
      maxRows: 6,
      admin: { description: 'Rendered left to right with arrows between them.' },
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'desc', label: 'Description', type: 'text' },
        {
          name: 'iconKey',
          type: 'select',
          options: iconOptions,
          admin: { description: 'Artwork lives in the frontend icon registry.' },
        },
      ],
    },
    {
      name: 'note',
      type: 'group',
      admin: { description: 'The closing line, e.g. "Technology is powerful. Purpose makes it valuable."' },
      fields: [
        { name: 'strong', type: 'text' },
        { name: 'accent', type: 'text', admin: { description: 'Rendered in the accent colour.' } },
      ],
    },
    sectionSettings,
  ],
}

/**
 * index.html `.sdl-pillars` and services.html `.svc-caps` — the same content, two layouts.
 *
 * `source: auto` pulls from the Services collection, so publishing a new service updates the
 * home page, the services page and the nav without anyone editing a block.
 */
export const CapabilityCardsBlock: Block = {
  slug: 'capability-cards',
  labels: { singular: 'Capability cards', plural: 'Capability cards' },
  admin: { group: 'Page sections' },
  fields: [
    {
      name: 'variant',
      type: 'select',
      defaultValue: 'grid-motif',
      options: [
        { label: 'Motif grid (home page)', value: 'grid-motif' },
        { label: 'Detailed list (services page)', value: 'list-detailed' },
      ],
    },
    ...sectionHeadFields,
    {
      name: 'source',
      type: 'select',
      defaultValue: 'auto',
      options: [
        { label: 'All published services', value: 'auto' },
        { label: 'Chosen manually', value: 'manual' },
        { label: 'Written for this page', value: 'inline' },
      ],
    },
    {
      name: 'services',
      type: 'relationship',
      relationTo: 'services',
      hasMany: true,
      admin: { condition: (_, s) => s?.source === 'manual' },
    },
    {
      name: 'items',
      label: 'Cards',
      type: 'array',
      admin: {
        condition: (_, s) => s?.source === 'inline',
        description:
          'Cards written for this page only. The services page uses these — its copy for each capability is longer than the home page card.',
      },
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'tagline', type: 'text' },
        { name: 'shortDesc', label: 'Description', type: 'textarea' },
        { name: 'tags', type: 'text', hasMany: true },
        { name: 'motifKey', type: 'select', options: motifOptions },
        linkField({ name: 'cta', label: 'Card link' }),
      ],
    },
    {
      name: 'limit',
      type: 'number',
      defaultValue: 6,
      admin: { condition: (_, s) => s?.source === 'auto' || !s?.source },
    },
    linkField({ name: 'footerLink', label: 'Footer link' }),
    sectionSettings,
  ],
}

/** index.html `.sdl-invest-card` — the 01→05 ladder. */
export const InvestmentLadderBlock: Block = {
  slug: 'investment-ladder',
  labels: { singular: 'Investment ladder', plural: 'Investment ladders' },
  admin: { group: 'Page sections' },
  fields: [
    ...sectionHeadFields,
    {
      name: 'steps',
      type: 'array',
      minRows: 2,
      maxRows: 6,
      admin: { description: 'Numbers are generated from position — 01, 02, 03…' },
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'caption', type: 'text' },
      ],
    },
    {
      name: 'closing',
      type: 'group',
      fields: [
        { name: 'line1', type: 'text' },
        { name: 'line2', type: 'text' },
      ],
    },
    sectionSettings,
  ],
}

/** index.html `.sdl-ai-grid` — copy on the left, title plus a numbered process on the right. */
export const SplitFeatureBlock: Block = {
  slug: 'split-feature',
  labels: { singular: 'Split feature', plural: 'Split features' },
  admin: { group: 'Page sections' },
  fields: [
    {
      name: 'left',
      type: 'group',
      fields: [
        { name: 'kicker', type: 'text' },
        { name: 'body', type: 'textarea' },
        linkField({ name: 'cta', label: 'Button' }),
      ],
    },
    {
      name: 'right',
      type: 'group',
      fields: [
        { name: 'title', type: 'text' },
        { name: 'body', type: 'textarea' },
        {
          name: 'processItems',
          type: 'array',
          maxRows: 6,
          admin: { description: 'Numbers are generated from position.' },
          fields: [
            { name: 'title', type: 'text', required: true },
            { name: 'desc', label: 'Description', type: 'text' },
          ],
        },
      ],
    },
    sectionSettings,
  ],
}

/** services.html `.svc-timeline` — the opportunity-to-impact process. */
export const ProcessTimelineBlock: Block = {
  slug: 'process-timeline',
  labels: { singular: 'Process timeline', plural: 'Process timelines' },
  admin: { group: 'Page sections' },
  fields: [
    ...sectionHeadFields,
    {
      name: 'steps',
      type: 'array',
      minRows: 2,
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'desc', label: 'Description', type: 'textarea' },
      ],
    },
    sectionSettings,
  ],
}

/** index.html `.sdl-proof` — narrative, callout and the client logo strip. */
export const ProofBlock: Block = {
  slug: 'proof',
  labels: { singular: 'Proof', plural: 'Proof' },
  admin: { group: 'Page sections' },
  fields: [
    ...sectionHeadFields,
    { name: 'text', type: 'textarea' },
    { name: 'callout', type: 'textarea', admin: { description: 'The emphasised pull-quote line.' } },
    linkField({ name: 'clientsLink', label: 'Clients link' }),
    { name: 'blockTitle', type: 'text', admin: { description: 'Heading above the logo strip.' } },
    {
      name: 'source',
      type: 'select',
      defaultValue: 'auto',
      options: [
        { label: 'Featured clients', value: 'auto' },
        { label: 'Chosen manually', value: 'manual' },
      ],
    },
    {
      name: 'clients',
      type: 'relationship',
      relationTo: 'clients',
      hasMany: true,
      admin: { condition: (_, s) => s?.source === 'manual' },
    },
    sectionSettings,
  ],
}

/** index.html testimonial cards. */
export const TestimonialsBlock: Block = {
  slug: 'testimonials',
  labels: { singular: 'Testimonials', plural: 'Testimonials' },
  admin: { group: 'Page sections' },
  fields: [
    ...sectionHeadFields,
    {
      name: 'source',
      type: 'select',
      defaultValue: 'auto',
      options: [
        { label: 'Featured testimonials', value: 'auto' },
        { label: 'Chosen manually', value: 'manual' },
      ],
    },
    {
      name: 'testimonials',
      type: 'relationship',
      relationTo: 'testimonials',
      hasMany: true,
      admin: { condition: (_, s) => s?.source === 'manual' },
    },
    { name: 'limit', type: 'number', defaultValue: 2 },
    linkField({ name: 'cta', label: 'Link below the cards' }),
    sectionSettings,
  ],
}

/** index.html + services.html `.sdl-insights-scroll` — the horizontally scrolling carousel. */
export const InsightsCarouselBlock: Block = {
  slug: 'insights-carousel',
  labels: { singular: 'Insights carousel', plural: 'Insights carousels' },
  admin: { group: 'Page sections' },
  fields: [
    ...sectionHeadFields,
    {
      name: 'source',
      type: 'select',
      defaultValue: 'latest',
      options: [
        { label: 'Latest published', value: 'latest' },
        { label: 'By category', value: 'category' },
        { label: 'Chosen manually', value: 'manual' },
      ],
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'insight-categories',
      admin: { condition: (_, s) => s?.source === 'category' },
    },
    {
      name: 'insights',
      type: 'relationship',
      relationTo: 'insights',
      hasMany: true,
      admin: { condition: (_, s) => s?.source === 'manual' },
    },
    {
      name: 'limit',
      type: 'number',
      defaultValue: 6,
      admin: { condition: (_, s) => s?.source !== 'manual' },
    },
    { name: 'footerText', type: 'text', admin: { description: 'e.g. "Swipe through the latest thinking".' } },
    linkField({ name: 'cta', label: 'Footer link' }),
    sectionSettings,
  ],
}

/** index.html + services.html `.sdl-contact-section`. */
export const ContactFormBlock: Block = {
  slug: 'contact-form',
  labels: { singular: 'Contact form', plural: 'Contact forms' },
  admin: { group: 'Page sections' },
  fields: [
    {
      name: 'variant',
      type: 'select',
      defaultValue: 'pill',
      options: [
        { label: 'Pill note (home page)', value: 'pill' },
        { label: 'Callout card (services page)', value: 'callout' },
      ],
    },
    { name: 'kicker', type: 'text' },
    {
      name: 'headingLines',
      type: 'array',
      maxRows: 3,
      admin: { description: 'One row per line. Accent text renders in the brand blue.' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'before', type: 'text', admin: { width: '50%' } },
            { name: 'accent', type: 'text', admin: { width: '50%' } },
          ],
        },
      ],
    },
    { name: 'sub', type: 'textarea' },
    {
      name: 'pillText',
      type: 'text',
      admin: { condition: (_, s) => s?.variant === 'pill' },
    },
    {
      name: 'callout',
      type: 'group',
      admin: { condition: (_, s) => s?.variant === 'callout' },
      fields: [
        { name: 'title', type: 'text' },
        { name: 'desc', label: 'Description', type: 'text' },
        linkField({ name: 'cta', label: 'Button' }),
      ],
    },
    {
      name: 'form',
      type: 'relationship',
      relationTo: 'forms',
      required: true,
      admin: { description: 'Fields, validation and success copy all come from the form.' },
    },
    sectionSettings,
  ],
}

/** The motif key belongs to a Service, but is listed here so the option list has one home. */
export const motifSelectOptions = motifOptions
