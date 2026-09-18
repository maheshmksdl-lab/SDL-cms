import type { Block } from 'payload'

import { sectionSettings } from './shared/sectionSettings'

/**
 * The Contact Us page's section: office details on the left, an introduction and the enquiry
 * form on the right.
 *
 * Distinct from `contact-form` (the home and services pages' closing section) because the two
 * share nothing but the form: this one carries per-office addresses, emails and phone numbers and
 * lays the form on an SDL-blue panel rather than a card. The form itself is still a Forms record,
 * so its fields, validation and success copy are edited in exactly one place, and submissions
 * land in Leads through the same pipeline as every other form on the site.
 */
export const ContactOfficesBlock: Block = {
  slug: 'contact-offices',
  labels: { singular: 'Contact page: offices & form', plural: 'Contact page: offices & form' },
  admin: { group: 'Page sections' },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'heading',
          type: 'text',
          required: true,
          defaultValue: 'Get in touch',
          admin: { width: '70%' },
        },
        {
          name: 'headingLevel',
          type: 'select',
          defaultValue: 'h1',
          options: [
            { label: 'H1 — the page title', value: 'h1' },
            { label: 'H2', value: 'h2' },
          ],
          admin: {
            width: '30%',
            description: 'H1 when this section opens the page, as it does on Contact Us.',
          },
        },
      ],
    },
    {
      name: 'sub',
      label: 'Sub-heading',
      type: 'textarea',
      admin: { description: 'Line breaks are kept, so each line can be its own sentence.' },
    },
    {
      name: 'offices',
      type: 'array',
      labels: { singular: 'Office', plural: 'Offices' },
      admin: { description: 'One entry per location, shown in this order with a rule between.' },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'region',
              type: 'text',
              required: true,
              admin: { width: '50%', description: 'e.g. "India". Displayed in capitals.' },
            },
            {
              name: 'addressLabel',
              type: 'text',
              defaultValue: 'Address',
              admin: { width: '50%' },
            },
          ],
        },
        { name: 'address', type: 'textarea' },
        {
          type: 'row',
          fields: [
            { name: 'email', type: 'email', admin: { width: '50%' } },
            {
              name: 'phone',
              type: 'text',
              admin: {
                width: '50%',
                description: 'Shown as typed, e.g. "+91-9900931624"; dialled without the dashes.',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'intro',
      label: 'Form introduction',
      type: 'textarea',
      admin: { description: 'The line beside the arrow, above the form.' },
    },
    {
      name: 'form',
      type: 'relationship',
      relationTo: 'forms',
      required: true,
      admin: {
        description:
          'Fields, labels, submit text and the success message all come from this form. Submissions appear under Leads.',
      },
    },
    sectionSettings,
  ],
}
