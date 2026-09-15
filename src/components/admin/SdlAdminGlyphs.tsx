import React from 'react'

type IconProps = {
  className?: string
  fill?: string
}

/** The house glyph Payload shows as the admin icon (breadcrumb, collapsed nav). From the EFTMRA admin. */
export function HomeGlyph({ className, fill }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 10.8 12 4l8 6.8v7.7c0 1.1-.9 2-2 2h-3.2v-5.6H9.2v5.6H6c-1.1 0-2-.9-2-2v-7.7Z" fill={fill || 'currentColor'} />
      <path
        d="M2.8 11.2 12 3.4l9.2 7.8"
        stroke={fill || 'currentColor'}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
