import type { GlobalConfig } from 'payload'

/**
 * Site settings.
 *
 * The tabbed, collapsible-card layout is copied from the EFTMRA reference (renamed to the sdl-
 * prefix) because it produces a genuinely good editor experience for a long settings form.
 *
 * One deliberate change: the reference stores `recaptchaSecretKey` in the DATABASE and also
 * tells operators to set it in .env. Two sources of truth for a secret is a defect — it is
 * unclear which one is live, and the database copy ends up in every backup and staging clone.
 * Here, secrets live only in the environment and these fields are read-only status indicators.
 */
export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  admin: {
    group: 'Settings',
    description: 'Identity, SEO defaults, analytics and maintenance mode.',
  },
  fields: [
    {
      type: 'tabs',
      admin: { className: 'sdl-settings-tabs' },
      tabs: [
        {
          label: 'General',
          fields: [
            {
              type: 'collapsible',
              label: 'Site identity',
              admin: { className: 'sdl-materio-card', initCollapsed: false },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'siteName',
                      type: 'text',
                      defaultValue: 'Social DNA Labs',
                      admin: { className: 'sdl-settings-field', width: '50%' },
                    },
                    {
                      name: 'siteTagline',
                      type: 'text',
                      admin: { className: 'sdl-settings-field', width: '50%' },
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    { name: 'supportEmail', type: 'email', admin: { className: 'sdl-settings-field', width: '50%' } },
                    { name: 'supportPhone', type: 'text', admin: { className: 'sdl-settings-field', width: '50%' } },
                  ],
                },
                {
                  name: 'siteUrl',
                  type: 'text',
                  admin: {
                    className: 'sdl-settings-field',
                    description: 'Canonical public URL, e.g. https://www.socialdnalabs.com. Used for canonicals and the sitemap.',
                  },
                },
              ],
            },
            {
              type: 'collapsible',
              label: 'Social profiles',
              admin: { className: 'sdl-materio-card', initCollapsed: true },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'linkedinUrl', type: 'text', admin: { className: 'sdl-settings-field', width: '50%' } },
                    { name: 'twitterUrl', type: 'text', admin: { className: 'sdl-settings-field', width: '50%' } },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    { name: 'youtubeUrl', type: 'text', admin: { className: 'sdl-settings-field', width: '50%' } },
                    { name: 'instagramUrl', type: 'text', admin: { className: 'sdl-settings-field', width: '50%' } },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'SEO defaults',
          fields: [
            {
              type: 'collapsible',
              label: 'Fallbacks',
              admin: {
                className: 'sdl-materio-card',
                initCollapsed: false,
                description: 'Used whenever a page leaves its own SEO fields empty.',
              },
              fields: [
                {
                  name: 'defaultMetaTitle',
                  type: 'text',
                  admin: { className: 'sdl-settings-field' },
                },
                {
                  name: 'defaultMetaDescription',
                  type: 'textarea',
                  admin: { className: 'sdl-settings-field' },
                },
                {
                  name: 'defaultOgImage',
                  type: 'upload',
                  relationTo: 'media',
                  admin: { className: 'sdl-settings-field', description: '1200×630.' },
                },
                {
                  name: 'robotsTxtAdditions',
                  type: 'textarea',
                  admin: {
                    className: 'sdl-settings-field',
                    description: 'Appended to the generated robots.txt.',
                  },
                },
              ],
            },
            {
              type: 'collapsible',
              label: 'Organisation (structured data)',
              admin: { className: 'sdl-materio-card', initCollapsed: true },
              fields: [
                { name: 'legalName', type: 'text', admin: { className: 'sdl-settings-field' } },
                { name: 'organisationLogo', type: 'upload', relationTo: 'media', admin: { className: 'sdl-settings-field' } },
              ],
            },
          ],
        },
        {
          label: 'Analytics',
          fields: [
            {
              type: 'collapsible',
              label: 'Measurement IDs',
              admin: {
                className: 'sdl-materio-card',
                initCollapsed: false,
                description: 'Public IDs only. These are safe to store here; secrets are not.',
              },
              fields: [
                {
                  name: 'googleAnalyticsId',
                  type: 'text',
                  admin: { className: 'sdl-settings-field', description: 'e.g. G-XXXXXXXXXX.' },
                },
                {
                  name: 'googleTagManagerId',
                  type: 'text',
                  admin: { className: 'sdl-settings-field', description: 'e.g. GTM-XXXXXXX.' },
                },
                { name: 'linkedinPartnerId', type: 'text', admin: { className: 'sdl-settings-field' } },
              ],
            },
          ],
        },
        {
          label: 'Forms',
          fields: [
            {
              type: 'collapsible',
              label: 'reCAPTCHA v3',
              admin: {
                className: 'sdl-materio-card',
                initCollapsed: false,
                description:
                  'The site key and secret live in the web app’s environment variables — NEXT_PUBLIC_RECAPTCHA_SITE_KEY and RECAPTCHA_SECRET_KEY — never in this database.',
              },
              fields: [
                {
                  name: 'recaptchaEnabled',
                  type: 'checkbox',
                  defaultValue: false,
                  admin: {
                    className: 'sdl-settings-field',
                    description: 'When on, every public form requires a valid token.',
                  },
                },
                {
                  name: 'recaptchaMinScore',
                  type: 'number',
                  defaultValue: 0.5,
                  min: 0,
                  max: 1,
                  admin: {
                    className: 'sdl-settings-field',
                    step: 0.1,
                    description: '0.0 is likely a bot, 1.0 likely a person. Submissions below this are rejected.',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Maintenance',
          fields: [
            {
              type: 'collapsible',
              label: 'Maintenance mode',
              admin: { className: 'sdl-materio-card', initCollapsed: false },
              fields: [
                {
                  name: 'maintenanceMode',
                  type: 'checkbox',
                  defaultValue: false,
                  admin: {
                    className: 'sdl-settings-field',
                    description: 'Shows a maintenance page to visitors and blocks search indexing.',
                  },
                },
                {
                  name: 'maintenanceMessage',
                  type: 'textarea',
                  defaultValue: 'We are currently performing scheduled maintenance. We will be back shortly.',
                  admin: { className: 'sdl-settings-field' },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
