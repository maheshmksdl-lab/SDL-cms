import type { Block } from 'payload'

import { sectionSettings } from './shared/sectionSettings'
import { linkField } from '../fields/link'
import { heroVisualOptions } from '../lib/registry-options'

/**
 * Hero — every page opens with one.
 *
 * The design's hero copy is a stack of lines, each mixing plain and accent-coloured text:
 *
 *     <div><span class="accent">AI</span> accelerates.</div>
 *     <div>Experience <span class="accent">directs.</span></div>
 *
 * So `headingLines` is an array, and each line carries the text before the accent, the accent
 * text itself, and the text after. That reproduces the markup exactly while keeping the copy
 * editable — a single rich-text field could not, because the accent span is structural.
 *
 * The visual is a KEY, not an asset: every hero visual in the design is bespoke code (a seeded
 * particle canvas, a grain-filtered orb, a DNA helix). See web/lib/registries/visuals.ts.
 */
export const HeroBlock: Block = {
  slug: 'hero',
  labels: { singular: 'Hero', plural: 'Heroes' },
  admin: { group: 'Page sections' },
  fields: [
    {
      name: 'kicker',
      type: 'text',
      admin: { description: 'Small label above the heading, e.g. "AI transformation".' },
    },
    {
      name: 'headingLines',
      type: 'array',
      minRows: 1,
      maxRows: 4,
      labels: { singular: 'Line', plural: 'Lines' },
      admin: {
        description: 'One row per visual line. The accent text renders in the brand blue.',
      },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'before', type: 'text', admin: { width: '33%' } },
            {
              name: 'accent',
              type: 'text',
              admin: { width: '34%', description: 'Rendered in the accent colour.' },
            },
            { name: 'after', type: 'text', admin: { width: '33%' } },
          ],
        },
      ],
    },
    { name: 'sub', label: 'Sub-heading', type: 'textarea' },
    linkField({ name: 'primaryCTA', label: 'Primary button' }),
    linkField({ name: 'secondaryCTA', label: 'Secondary link' }),
    {
      name: 'trustStrip',
      type: 'group',
      admin: { description: 'The small proof line under the buttons. Used on the services page.' },
      fields: [
        { name: 'strong', type: 'text', admin: { description: 'Bolded, e.g. "15+ years".' } },
        { name: 'rest', type: 'text' },
        { name: 'second', type: 'text', admin: { description: 'After the separating dot.' } },
      ],
    },
    {
      name: 'visualKey',
      label: 'Visual',
      type: 'select',
      defaultValue: 'none',
      options: heroVisualOptions,
      admin: {
        description:
          'Each visual is bespoke code, not an uploaded image. Options come from the frontend registry.',
      },
    },
    {
      name: 'visualImage',
      label: 'Visual image',
      type: 'upload',
      relationTo: 'media',
      admin: {
        condition: (_, siblingData) =>
          ['evoq-suite', 'zh-logo-card', 'sf-logo-card'].includes(siblingData?.visualKey),
        description:
          'The artwork three visuals display: EVOQ’s composed team photo, or the partner logo on the Zoho and Salesforce cards.',
      },
    },
    sectionSettings,
  ],
}
