/* Payload's admin shell. Generated-equivalent file — keep in step with @payloadcms/next. */
import type { ServerFunctionClient } from 'payload'
import config from '@payload-config'
import { handleServerFunctions, RootLayout } from '@payloadcms/next/layouts'
import { DM_Sans } from 'next/font/google'
import React from 'react'

/*
 * The admin theme, ported from the EFTMRA Payload admin. Order is load-bearing:
 *
 *   1. Payload's own styles
 *   2. admin-tokens.css     colour roles and Payload variable remaps — everything below uses them
 *   3. admin-theme.css      the shell: sidebar rail, header, lists, forms, dashboard shortcut
 *   4. admin-overrides.css  must beat admin-theme.css's hard-coded colours
 *   5. admin-dashboard.css  the dashboard view (inline in the reference, so last in its cascade)
 *   6. custom.scss          SDL-only additions
 */
import '@payloadcms/next/css'
import './admin-tokens.css'
import './admin-theme.css'
import './admin-overrides.css'
import './admin-dashboard.css'
import './custom.scss'

import { importMap } from './admin/importMap.js'

type Args = { children: React.ReactNode }

// DM Sans is the reference admin's face — chosen there for dense form UI legibility.
const dmSans = DM_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-dm-sans',
})

const serverFunction: ServerFunctionClient = async function (args) {
  'use server'
  return handleServerFunctions({ ...args, config, importMap })
}

const Layout = ({ children }: Args) => (
  <RootLayout
    config={config}
    htmlProps={{ className: dmSans.variable }}
    importMap={importMap}
    serverFunction={serverFunction}
  >
    {children}
  </RootLayout>
)

export default Layout
