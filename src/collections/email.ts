import type { CollectionConfig } from 'payload'

/**
 * Email accounts and templates.
 *
 * Copied from the EFTMRA reference — both are entirely domain-neutral, and the provider list
 * plus the API-key/SMTP split have already been proven in production there.
 *
 * One change: the reference stores provider credentials in the database. Here an account names
 * the ENVIRONMENT VARIABLE holding its credential instead, so the secret never lands in a
 * backup, a staging clone, or an admin screen-share.
 */

export const EmailAccounts: CollectionConfig = {
  slug: 'email-accounts',
  labels: { singular: 'Email account', plural: 'Email accounts' },
  admin: {
    useAsTitle: 'label',
    defaultColumns: ['label', 'provider', 'authMode', 'fromEmail', 'useAsDefault', 'enabled'],
    group: 'Settings',
    description: 'Delivery providers used for form notifications and CMS email.',
  },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'label', type: 'text', required: true, admin: { width: '40%' } },
        {
          name: 'provider',
          type: 'select',
          defaultValue: 'resend',
          required: true,
          options: [
            { label: 'Resend', value: 'resend' },
            { label: 'SendGrid', value: 'sendgrid' },
            { label: 'Postmark', value: 'postmark' },
            { label: 'SparkPost', value: 'sparkpost' },
            { label: 'Gmail', value: 'gmail' },
            { label: 'Outlook / Microsoft 365', value: 'outlook' },
            { label: 'Custom SMTP', value: 'nodemailer' },
          ],
          admin: { width: '30%' },
        },
        {
          name: 'authMode',
          type: 'select',
          defaultValue: 'api-key',
          required: true,
          options: [
            { label: 'API key', value: 'api-key' },
            { label: 'SMTP account', value: 'smtp' },
          ],
          admin: { width: '30%' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'useAsDefault', type: 'checkbox', defaultValue: false, admin: { width: '50%' } },
        { name: 'enabled', type: 'checkbox', defaultValue: true, admin: { width: '50%' } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'fromName', type: 'text', admin: { width: '50%' } },
        { name: 'fromEmail', type: 'email', admin: { width: '50%' } },
      ],
    },
    {
      name: 'envKeyName',
      type: 'text',
      admin: {
        description:
          'Name of the environment variable holding this credential, e.g. RESEND_API_KEY. The value itself is never stored here.',
      },
    },
    {
      type: 'collapsible',
      label: 'SMTP details',
      admin: { condition: (_, s) => s?.authMode === 'smtp', initCollapsed: true },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'host', type: 'text', admin: { width: '60%' } },
            { name: 'port', type: 'number', defaultValue: 587, admin: { width: '20%' } },
            { name: 'secure', type: 'checkbox', defaultValue: false, admin: { width: '20%' } },
          ],
        },
        { name: 'username', type: 'text' },
      ],
    },
  ],
}

export const EmailTemplates: CollectionConfig = {
  slug: 'email-templates',
  labels: { singular: 'Email template', plural: 'Email templates' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'templateType', 'enabled', 'updatedAt'],
    group: 'Settings',
    description: 'Reusable subjects and bodies. Insert values with {{variableName}}.',
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: { description: 'Stable key the code looks up, e.g. contact-form-notification.' },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'templateType',
          type: 'select',
          defaultValue: 'notification',
          required: true,
          options: [
            { label: 'Notification', value: 'notification' },
            { label: 'Confirmation', value: 'confirmation' },
            { label: 'Operational', value: 'operational' },
          ],
          admin: { width: '50%' },
        },
        { name: 'enabled', type: 'checkbox', defaultValue: true, admin: { width: '50%' } },
      ],
    },
    { name: 'description', type: 'textarea', admin: { description: 'Internal note for editors.' } },
    {
      name: 'availableVariables',
      type: 'textarea',
      admin: { description: 'Reference for editors, e.g. submitterName, submitterEmail, formName.' },
    },
    { name: 'subject', type: 'text', required: true },
    { name: 'html', type: 'textarea', admin: { description: 'HTML body.' } },
    { name: 'text', type: 'textarea', admin: { description: 'Plain-text fallback.' } },
  ],
}
