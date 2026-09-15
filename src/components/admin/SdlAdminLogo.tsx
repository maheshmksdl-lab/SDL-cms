import React from 'react'

import { withCmsBasePath } from './adminBasePath'

type LogoProps = {
  className?: string
}

/**
 * Payload's `graphics.Logo` — the brand card above the login form.
 *
 * The same lockup as the EFTMRA admin's login card: the mark in a deep-to-highlight gradient tile,
 * the name, and a small uppercase prompt. The reference styles it with Tailwind utilities; the SDL
 * CMS has no Tailwind, so the identical values are written inline.
 */
export function SdlAdminLogo({ className }: LogoProps) {
  return (
    <div
      className={['sdl-admin-logo', className].filter(Boolean).join(' ')}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        borderRadius: 16,
        border: '1px solid rgba(43,73,219,0.12)',
        background: 'rgba(255,255,255,0.9)',
        padding: '8px 12px',
        boxShadow: 'var(--shadow-admin-soft)',
        backdropFilter: 'blur(12px)',
        width: 'fit-content',
      }}
    >
      <div
        style={{
          display: 'flex',
          width: 48,
          height: 48,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 14,
          background: 'linear-gradient(135deg, var(--color-admin-brand-deep), var(--color-admin-highlight))',
          boxShadow: '0 12px 24px rgba(34,57,176,0.2)',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- a static SVG mark from /public */}
        <img
          src={withCmsBasePath('/sdl-mark.svg')}
          alt="Social DNA Labs"
          width={38}
          height={38}
          style={{ borderRadius: 9, objectFit: 'contain', background: '#ffffff', padding: 4 }}
        />
      </div>
      <div style={{ lineHeight: 1 }}>
        <div
          style={{
            fontSize: '1.02rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '-0.01em',
            color: 'var(--color-admin-brand)',
          }}
        >
          Social DNA Labs
        </div>
        <div
          style={{
            marginTop: 4,
            fontSize: '0.7rem',
            fontWeight: 700,
            letterSpacing: '0.18em',
            color: 'var(--color-admin-ink)',
          }}
        >
          Login to your account
        </div>
      </div>
    </div>
  )
}

export default SdlAdminLogo
