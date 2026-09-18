import type { Block, Field } from 'payload'

import { sectionSettings, sectionHeadFields } from './shared/sectionSettings'
import { linkField } from '../fields/link'

/**
 * Blocks for the Clients and Testimonials pages.
 *
 * Both pages share one shape — a plain centered intro banner, a tab switcher between the two
 * pages, a content grid, then a closing CTA — so four small blocks cover both rather than one
 * page-specific block each. See web/components/sections/company-sections.tsx.
 */

/** A plain centered banner: no visual, no buttons — just a heading and a sub-line. */
export const PageIntroBlock: Block = {
  slug: 'page-intro',
  labels: { singular: 'Page intro', plural: 'Page intros' },
  admin: { group: 'Page sections' },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'sub', label: 'Sub-heading', type: 'textarea' },
    sectionSettings,
  ],
}

/**
 * The "Clients | Testimonials" pill switcher both pages render above their grid.
 *
 * Real page links, not client-side tab state — Clients and Testimonials are separate CMS pages,
 * so switching "tabs" is a navigation. Destinations are editable here (rather than hardcoded)
 * so a slug rename cannot strand the switcher, exactly like every other CMS link.
 */
const tabLinkFields: Field[] = [
  linkField({ name: 'clientsTab', label: 'Clients tab destination', withLabel: false }),
  linkField({ name: 'testimonialsTab', label: 'Testimonials tab destination', withLabel: false }),
]

/** index-of-clients grid — "Trusted by Industry Leaders" and the full logo wall. */
export const ClientsGridBlock: Block = {
  slug: 'clients-grid',
  labels: { singular: 'Clients grid', plural: 'Clients grids' },
  admin: { group: 'Page sections' },
  fields: [
    ...sectionHeadFields,
    ...tabLinkFields,
    {
      name: 'source',
      type: 'select',
      defaultValue: 'auto',
      options: [
        { label: 'All clients', value: 'auto' },
        { label: 'Chosen manually', value: 'manual' },
      ],
    },
    {
      name: 'featuredOnly',
      label: 'Featured clients only',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        condition: (_, s) => s?.source !== 'manual',
        description: 'Off (default) shows every client. On shows only those marked "Featured".',
      },
    },
    {
      name: 'clients',
      type: 'relationship',
      relationTo: 'clients',
      hasMany: true,
      admin: { condition: (_, s) => s?.source === 'manual' },
    },
    {
      name: 'limit',
      type: 'number',
      defaultValue: 100,
      admin: { condition: (_, s) => s?.source !== 'manual' },
    },
    sectionSettings,
  ],
}

/** The testimonials index — "What Our Clients Say" and the full quote wall. */
export const TestimonialsGridBlock: Block = {
  slug: 'testimonials-grid',
  labels: { singular: 'Testimonials grid', plural: 'Testimonials grids' },
  admin: { group: 'Page sections' },
  fields: [
    ...sectionHeadFields,
    ...tabLinkFields,
    {
      name: 'source',
      type: 'select',
      defaultValue: 'auto',
      options: [
        { label: 'All testimonials', value: 'auto' },
        { label: 'Chosen manually', value: 'manual' },
      ],
    },
    {
      name: 'featuredOnly',
      label: 'Featured testimonials only',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        condition: (_, s) => s?.source !== 'manual',
        description: 'Off (default) shows every testimonial. On shows only those marked "Featured".',
      },
    },
    {
      name: 'testimonials',
      type: 'relationship',
      relationTo: 'testimonials',
      hasMany: true,
      admin: { condition: (_, s) => s?.source === 'manual' },
    },
    {
      name: 'limit',
      type: 'number',
      defaultValue: 100,
      admin: { condition: (_, s) => s?.source !== 'manual' },
    },
    sectionSettings,
  ],
}

/** The light closing card — "Ready to Join Our Success Stories?". */
export const SuccessCtaBlock: Block = {
  slug: 'success-cta',
  labels: { singular: 'Success CTA', plural: 'Success CTAs' },
  admin: { group: 'Page sections' },
  fields: [
    { name: 'title', type: 'text' },
    { name: 'sub', label: 'Sub-heading', type: 'textarea' },
    linkField({ name: 'cta', label: 'Button' }),
    sectionSettings,
  ],
}
