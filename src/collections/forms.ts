import type { CollectionConfig } from 'payload'

import { exportLeadsEndpoint } from '../endpoints/exportLeads'
import { sendLeadEmails } from '../hooks/leadEmails'

/**
 * Forms and Leads.
 *
 * The reference's Leads collection is form-specific (`name`, `email`, `message`, `siteSlug`) and
 * recovers the recipient by scanning the message body for a line beginning "trainer email:".
 * That approach breaks the moment a second form exists, so the schema here is generic: a Form
 * defines its own fields, and a Lead stores the submission against it.
 */

/** The definition a public form renders from, and validates against on the server. */
export const Forms: CollectionConfig = {
  slug: 'forms',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'updatedAt'],
    group: 'Content',
    description: 'Field definitions, success copy and where submissions are sent.',
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: { description: 'Stable key the website posts to, e.g. "contact".' },
    },
    {
      name: 'fields',
      type: 'array',
      minRows: 1,
      labels: { singular: 'Field', plural: 'Fields' },
      admin: {
        description:
          'The server validates submissions against this list. A value for a field not listed here is rejected.',
      },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'label', type: 'text', required: true, admin: { width: '50%' } },
            {
              name: 'name',
              type: 'text',
              required: true,
              admin: { width: '50%', description: 'Key stored on the lead. Lowercase, no spaces.' },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'type',
              type: 'select',
              defaultValue: 'text',
              options: [
                { label: 'Text', value: 'text' },
                { label: 'Email', value: 'email' },
                { label: 'Phone', value: 'tel' },
                { label: 'Long text', value: 'textarea' },
                { label: 'Dropdown', value: 'select' },
              ],
              admin: { width: '34%' },
            },
            { name: 'required', type: 'checkbox', defaultValue: false, admin: { width: '33%' } },
            {
              name: 'width',
              type: 'select',
              defaultValue: 'full',
              options: [
                { label: 'Full row', value: 'full' },
                { label: 'Half row', value: 'half' },
              ],
              admin: { width: '33%' },
            },
          ],
        },
        { name: 'placeholder', type: 'text' },
        {
          name: 'options',
          type: 'text',
          hasMany: true,
          admin: {
            condition: (_, s) => s?.type === 'select',
            description: 'Choices for the dropdown.',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'submitLabel', type: 'text', defaultValue: 'Send', admin: { width: '50%' } },
        {
          name: 'cardTitle',
          type: 'text',
          admin: { width: '50%', description: 'Heading on the form card, e.g. "Let’s talk".' },
        },
      ],
    },
    {
      name: 'success',
      type: 'group',
      fields: [
        { name: 'title', type: 'text', defaultValue: 'Thanks — message received.' },
        { name: 'body', type: 'text' },
      ],
    },
    { name: 'fineprint', type: 'text' },
    {
      name: 'recipients',
      type: 'text',
      hasMany: true,
      admin: { description: 'Who is notified. Falls back to the address in Email Settings.' },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'notificationTemplate',
          type: 'relationship',
          relationTo: 'email-templates',
          admin: { width: '50%', description: 'Sent to the recipients above.' },
        },
        {
          name: 'confirmationTemplate',
          type: 'relationship',
          relationTo: 'email-templates',
          admin: { width: '50%', description: 'Sent to the person who submitted.' },
        },
      ],
    },
  ],
}

/** A submission. Stored before any email is attempted — see the plan §8.4. */
export const Leads: CollectionConfig = {
  slug: 'leads',
  admin: {
    useAsTitle: 'submittedEmail',
    defaultColumns: ['submittedEmail', 'form', 'status', 'createdAt'],
    group: 'Content',
    description: 'Form submissions. Records of real enquiries — archive rather than delete.',
  },
  defaultSort: '-createdAt',
  // GET /api/leads/export?form=contact&status=new&from=2026-01-01
  endpoints: [exportLeadsEndpoint],
  hooks: {
    // Runs AFTER the lead is written. Neither send can fail the request — see the hook.
    afterChange: [sendLeadEmails],
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'form',
          type: 'relationship',
          relationTo: 'forms',
          required: true,
          admin: { width: '50%', readOnly: true },
        },
        {
          name: 'status',
          type: 'select',
          defaultValue: 'new',
          options: [
            { label: 'New', value: 'new' },
            { label: 'Contacted', value: 'contacted' },
            { label: 'Qualified', value: 'qualified' },
            { label: 'Archived', value: 'archived' },
          ],
          admin: { width: '50%' },
        },
      ],
    },
    {
      name: 'submittedEmail',
      type: 'email',
      index: true,
      admin: { readOnly: true, description: 'Lifted from the submission for searching and sorting.' },
    },
    {
      name: 'submissionData',
      type: 'json',
      admin: {
        readOnly: true,
        description: 'Every submitted value, keyed by field name.',
      },
    },
    {
      name: 'source',
      type: 'group',
      admin: { readOnly: true },
      fields: [
        { name: 'pathname', type: 'text' },
        { name: 'referrer', type: 'text' },
        {
          name: 'utm',
          type: 'group',
          fields: [
            { name: 'source', type: 'text' },
            { name: 'medium', type: 'text' },
            { name: 'campaign', type: 'text' },
            { name: 'term', type: 'text' },
            { name: 'content', type: 'text' },
          ],
        },
      ],
    },
    {
      name: 'meta',
      type: 'group',
      admin: { readOnly: true },
      fields: [
        {
          name: 'ipHash',
          type: 'text',
          admin: { description: 'Hashed, never the raw address — enough to rate-limit, not to identify.' },
        },
        { name: 'userAgent', type: 'text' },
        { name: 'recaptchaScore', type: 'number' },
      ],
    },
    {
      name: 'notes',
      type: 'array',
      fields: [
        { name: 'body', type: 'textarea', required: true },
        {
          name: 'author',
          type: 'relationship',
          relationTo: 'users',
          admin: { readOnly: true },
          hooks: {
            beforeChange: [({ value, req, operation }) => (operation === 'create' ? (req.user?.id ?? value) : value)],
          },
        },
      ],
    },
  ],
}
