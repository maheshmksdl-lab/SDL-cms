'use client'

import React from 'react'
import { DefaultListView } from '@payloadcms/ui'
import type { ListViewClientProps } from 'payload'

/**
 * Every collection's list view: Payload's own, inside the wrapper the admin theme styles the table,
 * toolbar and pagination through (`.sdl-list-view` in admin-theme.css).
 *
 * The EFTMRA reference also wraps it in an MUI ThemeProvider, but Payload's list view renders no
 * MUI components, so the provider has no visual effect — only the wrapper does.
 */
export function SdlListView(props: ListViewClientProps) {
  return (
    <div className="sdl-list-view">
      <DefaultListView {...props} />
    </div>
  )
}

export default SdlListView
