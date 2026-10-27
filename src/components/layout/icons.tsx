import React from 'react'

/**
 * Minimal line-style brand glyphs (lucide v0.563 dropped/deprecated brand icons and never
 * shipped TikTok/WhatsApp). Drawn to match lucide's 24px grid and 1.5px stroke so they sit
 * comfortably next to lucide UI icons. All use currentColor.
 */
type IconProps = React.ComponentProps<'svg'>

const base = {
  'aria-hidden': true,
  fill: 'none',
  stroke: 'currentColor',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  strokeWidth: 1.5,
  viewBox: '0 0 24 24',
  xmlns: 'http://www.w3.org/2000/svg',
} as const

export function InstagramIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect height="17" rx="5" width="17" x="3.5" y="3.5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" fill="currentColor" r="0.6" stroke="none" />
    </svg>
  )
}

export function TikTokIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M14 3.5v11.25a3.75 3.75 0 1 1-3.75-3.75" />
      <path d="M14 3.5c.4 2.9 2.3 4.6 5.25 4.75" />
    </svg>
  )
}

export function FacebookIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M14.5 20.5v-7.25h2.6l.4-3h-3V8.4c0-.9.3-1.5 1.6-1.5h1.5V4.2a20 20 0 0 0-2.3-.1c-2.3 0-3.8 1.4-3.8 3.9v2.2H9v3h2.5v7.25" />
    </svg>
  )
}

export function LinkedInIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect height="17" rx="2.5" width="17" x="3.5" y="3.5" />
      <path d="M8 10.5V16" />
      <circle cx="8" cy="7.75" fill="currentColor" r="0.6" stroke="none" />
      <path d="M11.5 16v-5.5" />
      <path d="M11.5 13a2.5 2.5 0 0 1 5 0v3" />
    </svg>
  )
}

export function YouTubeIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect height="13" rx="3.5" width="19" x="2.5" y="5.5" />
      <path d="m10.25 9.25 4.5 2.75-4.5 2.75Z" />
    </svg>
  )
}

export function WhatsAppIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3.75 20.25 5 16.6A8.25 8.25 0 1 1 8 19.3Z" />
      <path d="M9.1 8.6c.2-.4.5-.5.8-.5h.5c.2 0 .4.1.5.4l.6 1.5c.1.2 0 .4-.1.6l-.5.6c.6 1.1 1.5 2 2.6 2.6l.6-.5c.2-.1.4-.2.6-.1l1.5.6c.3.1.4.3.4.5v.5c0 .3-.1.6-.5.8-.6.4-1.4.5-2.1.3a8 8 0 0 1-5.1-5.1c-.2-.7-.1-1.5.3-2.1Z" />
    </svg>
  )
}

export const socialIcons = {
  instagram: InstagramIcon,
  tiktok: TikTokIcon,
  facebook: FacebookIcon,
  linkedin: LinkedInIcon,
  youtube: YouTubeIcon,
} as const
