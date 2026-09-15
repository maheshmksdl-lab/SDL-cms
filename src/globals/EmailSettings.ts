import type { GlobalConfig } from 'payload'

/**
 * Email settings.
 *
 * The `enabled` switch is carried over from the reference deliberately: turning it off stores
 * submissions without sending anything, which is what makes a staging environment safe to point
 * at real data.
 */
export const EmailSettings: GlobalConfig = {
  slug: 'email-settings',
  label: 'Email Settings',
  admin: {
    group: 'Settings',
    description: 'Sender identity and delivery behaviour.',
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
              label: 'Delivery',
              admin: { className: 'sdl-materio-card', initCollapsed: false },
              fields: [
                {
                  name: 'enabled',
                  type: 'checkbox',
                  defaultValue: true,
                  admin: {
                    className: 'sdl-settings-field',
                    description:
                      'Off stores submissions without sending any email. Use this on staging.',
                  },
                },
                {
                  name: 'account',
                  type: 'relationship',
                  relationTo: 'email-accounts',
                  admin: {
                    className: 'sdl-settings-field',
                    description: 'Leave empty to use whichever account is marked as default.',
                  },
                },
              ],
            },
            {
              type: 'collapsible',
              label: 'Sender and recipients',
              admin: { className: 'sdl-materio-card', initCollapsed: false },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'fromName',
                      type: 'text',
                      defaultValue: 'Social DNA Labs',
                      admin: { className: 'sdl-settings-field', width: '50%' },
                    },
                    {
                      name: 'fromEmail',
                      type: 'email',
                      admin: { className: 'sdl-settings-field', width: '50%' },
                    },
                  ],
                },
                {
                  name: 'primaryNotificationEmail',
                  type: 'email',
                  admin: {
                    className: 'sdl-settings-field',
                    description: 'Default recipient when a form names none of its own.',
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
