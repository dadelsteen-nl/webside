import { useId, type ReactNode } from 'react'

import { cn } from '@/utilities/cn'

const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.1  0 0 0 0 0.09  0 0 0 0 0.07  0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")"

const tones = {
  sand: 'bg-[radial-gradient(120%_90%_at_30%_20%,#faf7f2_0%,#efe6da_45%,#e4dacb_100%)]',
  stone: 'bg-[radial-gradient(120%_90%_at_70%_15%,#efe7dc_0%,#e4dacb_40%,#cfc1ad_100%)]',
  dusk: 'bg-[radial-gradient(130%_100%_at_50%_0%,#4a443b_0%,#2a2722_45%,#1a1a1a_100%)]',
  bronze: 'bg-[radial-gradient(120%_100%_at_20%_10%,#d9c3a0_0%,#b08d57_55%,#8c6d3f_100%)]',
} as const

export type PlaceholderTone = keyof typeof tones

/** Grain overlay; place inside a `relative` parent. */
export function Grain({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn('pointer-events-none absolute inset-0 opacity-[0.18] mix-blend-multiply', className)}
      style={{ backgroundImage: GRAIN }}
    />
  )
}

/** Gradient panel with subtle grain, used wherever media is missing. */
export function PlaceholderPanel({
  children,
  className,
  tone = 'sand',
}: {
  children?: ReactNode
  className?: string
  tone?: PlaceholderTone
}) {
  return (
    <div aria-hidden="true" className={cn('relative overflow-hidden', tones[tone], className)}>
      <Grain />
      {children}
    </div>
  )
}

/**
 * Stylised imbody smart mirror. ViewBox is 4:5 (320×400) so hotspot
 * percentages map 1:1 onto a 4:5 container.
 */
export function MirrorSilhouette({ className, dark = false }: { className?: string; dark?: boolean }) {
  const frame = dark ? '#e4dacb' : '#1a1a1a'
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const id = (name: string) => `${name}-${uid}`
  return (
    <svg
      aria-hidden="true"
      className={cn('h-full w-full', className)}
      fill="none"
      preserveAspectRatio="xMidYMid meet"
      viewBox="0 0 320 400"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={id('ds-screen')} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#3a362f" />
          <stop offset="0.55" stopColor="#24221e" />
          <stop offset="1" stopColor="#151514" />
        </linearGradient>
        <linearGradient id={id('ds-sheen')} x1="0" x2="1" y1="0" y2="0.6">
          <stop offset="0" stopColor="#faf7f2" stopOpacity="0" />
          <stop offset="0.45" stopColor="#faf7f2" stopOpacity="0.14" />
          <stop offset="0.6" stopColor="#faf7f2" stopOpacity="0" />
        </linearGradient>
        <radialGradient cx="0.5" cy="0.5" id={id('ds-shadow')} r="0.5">
          <stop offset="0" stopColor="#1a1a1a" stopOpacity="0.28" />
          <stop offset="1" stopColor="#1a1a1a" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* floor shadow */}
      <ellipse cx="160" cy="366" fill={`url(#${id('ds-shadow')})`} rx="120" ry="14" />

      {/* base / motor housing */}
      <rect fill={frame} height="16" opacity="0.92" rx="3" width="132" x="94" y="344" />
      <rect fill="#b08d57" height="1.5" opacity="0.8" width="60" x="130" y="351" />

      {/* frame */}
      <rect fill={frame} height="322" rx="10" width="124" x="98" y="22" />
      {/* screen */}
      <rect fill={`url(#${id('ds-screen')})`} height="282" rx="4" width="104" x="108" y="50" />
      {/* abstract figure on screen */}
      <g opacity="0.55" stroke="#b08d57" strokeLinecap="round" strokeWidth="1.4">
        <circle cx="160" cy="128" r="11" />
        <path d="M160 140v62M160 156l-28 22M160 156l28 22M160 202l-18 52M160 202l18 52" />
      </g>
      {/* tracking points */}
      <g fill="#e4dacb" opacity="0.7">
        <circle cx="160" cy="156" r="1.6" />
        <circle cx="132" cy="178" r="1.6" />
        <circle cx="188" cy="178" r="1.6" />
        <circle cx="160" cy="202" r="1.6" />
        <circle cx="142" cy="254" r="1.6" />
        <circle cx="178" cy="254" r="1.6" />
      </g>
      {/* UI hints */}
      <rect fill="#e4dacb" height="2" opacity="0.35" rx="1" width="34" x="120" y="300" />
      <rect fill="#b08d57" height="2" opacity="0.9" rx="1" width="20" x="120" y="300" />
      <text
        fill="#e4dacb"
        fontFamily="Georgia, serif"
        fontSize="13"
        fontWeight="300"
        opacity="0.75"
        x="120"
        y="292"
      >
        42 kg
      </text>
      {/* sheen */}
      <rect fill={`url(#${id('ds-sheen')})`} height="282" rx="4" width="104" x="108" y="50" />
      {/* camera */}
      <circle cx="160" cy="36" fill="#2b2925" r="4" />
      <circle cx="160" cy="36" fill="#b08d57" opacity="0.6" r="1.4" />

      {/* cable arms */}
      <g stroke={frame} strokeLinecap="round">
        <path d="M98 226 L74 236" strokeWidth="6" />
        <path d="M222 226 L246 236" strokeWidth="6" />
      </g>
      <g stroke="#6e6a5e" strokeWidth="1">
        <path d="M74 236 L70 262" />
        <path d="M246 236 L250 262" />
      </g>
      <g fill="#b08d57">
        <rect height="4" rx="2" width="16" x="62" y="262" />
        <rect height="4" rx="2" width="16" x="242" y="262" />
      </g>
    </svg>
  )
}

/** Abstract interior scene: arched window, low sun, date-stone motif. */
export function SceneArt({ className, variant = 0 }: { className?: string; variant?: number }) {
  const v = variant % 4
  return (
    <svg
      aria-hidden="true"
      className={cn('h-full w-full', className)}
      fill="none"
      preserveAspectRatio="xMidYMid slice"
      viewBox="0 0 400 500"
      xmlns="http://www.w3.org/2000/svg"
    >
      {v === 0 && (
        <g>
          <path d="M120 500V210a80 80 0 0 1 160 0v290" fill="#faf7f2" opacity="0.55" />
          <circle cx="200" cy="250" fill="#b08d57" opacity="0.22" r="46" />
          <path d="M0 420h400" stroke="#6e6a5e" strokeOpacity="0.25" />
        </g>
      )}
      {v === 1 && (
        <g>
          <path
            d="M200 70c-62 0-94 82-94 180s32 180 94 180 94-82 94-180-32-180-94-180Z"
            stroke="#8c6d3f"
            strokeOpacity="0.45"
            strokeWidth="1.2"
          />
          <path
            d="M200 124c-22 37-31 80-31 126s9 89 31 126"
            stroke="#8c6d3f"
            strokeOpacity="0.45"
            strokeLinecap="round"
            strokeWidth="1.2"
          />
        </g>
      )}
      {v === 2 && (
        <g>
          <rect fill="#1a1a1a" height="300" opacity="0.08" width="120" x="140" y="100" />
          <path d="M60 0v500M340 0v500" stroke="#faf7f2" strokeOpacity="0.4" />
          <circle cx="300" cy="140" fill="#faf7f2" opacity="0.5" r="60" />
        </g>
      )}
      {v === 3 && (
        <g>
          <path d="M0 360c80-40 160-40 200 0s120 40 200 0v140H0Z" fill="#faf7f2" opacity="0.35" />
          <circle cx="130" cy="180" fill="#b08d57" opacity="0.18" r="80" />
        </g>
      )}
    </svg>
  )
}
