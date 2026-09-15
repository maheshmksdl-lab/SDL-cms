import React from 'react'
import type { ServerProps } from 'payload'

type AvatarProps = ServerProps & {
  user?: {
    avatar?: { url?: string | null } | number | null
    email?: string | null
    name?: string | null
  } | null
}

const SIZE = 32

/**
 * The account avatar in the admin header — the user's uploaded avatar, or their initials in the
 * brand colour. From the EFTMRA admin, reading SDL's `avatar` field.
 */
export default function UserAvatar({ user }: AvatarProps) {
  const containerStyle: React.CSSProperties = {
    width: SIZE,
    height: SIZE,
    borderRadius: '50%',
    overflow: 'hidden',
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }

  const avatarUrl = user?.avatar && typeof user.avatar === 'object' ? user.avatar.url : null

  if (avatarUrl) {
    return (
      <div style={containerStyle}>
        {/* eslint-disable-next-line @next/next/no-img-element -- a 32px avatar from the media library */}
        <img
          src={avatarUrl}
          alt={user?.name ?? user?.email ?? 'Avatar'}
          style={{ width: SIZE, height: SIZE, objectFit: 'cover', display: 'block' }}
        />
      </div>
    )
  }

  const initials = user?.name
    ? user.name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((word) => word[0]?.toUpperCase() ?? '')
        .join('')
    : (user?.email?.[0]?.toUpperCase() ?? '?')

  return (
    <div style={{ ...containerStyle, background: '#2b49db', color: '#fff', fontSize: '0.85em', fontWeight: 700 }}>
      {initials}
    </div>
  )
}
