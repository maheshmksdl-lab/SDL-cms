import React from 'react'

import { HomeGlyph } from './SdlAdminGlyphs'

type IconProps = {
  className?: string
  fill?: string
}

/** Payload's `graphics.Icon` — the small mark in the breadcrumb and the collapsed nav. */
export function SdlAdminIcon({ className, fill }: IconProps) {
  return <HomeGlyph className={['sdl-admin-icon', className].filter(Boolean).join(' ')} fill={fill} />
}

export default SdlAdminIcon
