import { useId } from 'react'

import { cn } from '@/utilities/cn'

import { MirrorSilhouette, PlaceholderPanel } from './Placeholder'

/** Abstract visual for each technology feature (no media required). */
export function TechVisual({ className, index }: { className?: string; index: number }) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '')
  return (
    <PlaceholderPanel className={cn('h-full w-full', className)} tone="dusk">
      <div className="absolute left-1/2 top-1/2 size-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-bronze/15 blur-[90px]" />
      <div className="absolute inset-[8%]">{art(index, uid)}</div>
    </PlaceholderPanel>
  )
}

function art(index: number, uid: string) {
  const stroke = '#e4dacb'
  switch (index % 5) {
    case 0:
      return <MirrorSilhouette dark />
    case 1:
      return (
        <svg className="h-full w-full" fill="none" viewBox="0 0 320 400">
          <circle cx="160" cy="200" r="120" stroke={stroke} strokeOpacity="0.15" strokeWidth="1" />
          <path
            d="M75.1 284.9A120 120 0 1 1 244.9 284.9"
            stroke={stroke}
            strokeOpacity="0.25"
            strokeWidth="10"
            strokeLinecap="round"
          />
          <path
            d="M75.1 284.9A120 120 0 0 1 225 99"
            stroke="#b08d57"
            strokeWidth="10"
            strokeLinecap="round"
          />
          {Array.from({ length: 25 }).map((_, i) => {
            const a = (-225 + (270 / 24) * i) * (Math.PI / 180)
            const r1 = 138
            const r2 = i % 6 === 0 ? 150 : 144
            return (
              <line
                key={i}
                stroke={stroke}
                strokeOpacity={i % 6 === 0 ? 0.6 : 0.25}
                x1={160 + r1 * Math.cos(a)}
                x2={160 + r2 * Math.cos(a)}
                y1={200 + r1 * Math.sin(a)}
                y2={200 + r2 * Math.sin(a)}
              />
            )
          })}
          <text
            fill="#faf7f2"
            fontFamily="Georgia, serif"
            fontSize="64"
            fontWeight="300"
            textAnchor="middle"
            x="160"
            y="214"
          >
            120
          </text>
          <text fill="#b08d57" fontFamily="sans-serif" fontSize="11" letterSpacing="4" textAnchor="middle" x="160" y="240">
            KG
          </text>
        </svg>
      )
    case 2:
      return (
        <svg className="h-full w-full" fill="none" viewBox="0 0 320 400">
          {[
            'M30 80 H290',
            'M30 150 C110 150 120 110 160 110 S250 150 290 150',
            'M30 220 C60 190 90 250 120 220 S180 190 210 220 S270 250 290 220',
            'M30 300 L290 260',
            'M30 370 H90 V350 H150 V330 H210 V310 H290',
          ].map((d, i) => (
            <g key={d}>
              <path
                d={d}
                stroke={i === 2 ? '#b08d57' : stroke}
                strokeOpacity={i === 2 ? 1 : 0.45}
                strokeWidth={i === 2 ? 2 : 1.2}
              />
              <text fill={stroke} fillOpacity="0.5" fontFamily="sans-serif" fontSize="9" letterSpacing="2" x="30" y={[66, 96, 186, 250, 300][i]}>
                {`0${i + 1}`}
              </text>
            </g>
          ))}
        </svg>
      )
    case 3:
      return (
        <svg className="h-full w-full" fill="none" viewBox="0 0 320 400">
          <defs>
            <linearGradient id={`tv-glass-${uid}`} x1="0" x2="1" y1="0" y2="1">
              <stop offset="0" stopColor="#faf7f2" stopOpacity="0.16" />
              <stop offset="0.5" stopColor="#faf7f2" stopOpacity="0.02" />
              <stop offset="1" stopColor="#faf7f2" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          <rect fill={`url(#tv-glass-${uid})`} height="340" rx="8" stroke={stroke} strokeOpacity="0.5" width="200" x="60" y="30" />
          <path d="M60 370 L260 30" stroke={stroke} strokeDasharray="2 6" strokeOpacity="0.5" />
          <text fill="#faf7f2" fontFamily="Georgia, serif" fontSize="44" fontWeight="300" x="180" y="350">
            43″
          </text>
          <circle cx="120" cy="150" r="16" stroke="#b08d57" />
          <path d="M120 166v70M120 186l-26 24M120 186l26 24M120 236l-16 48M120 236l16 48" stroke="#b08d57" strokeLinecap="round" />
        </svg>
      )
    default:
      return (
        <svg className="h-full w-full" fill="none" viewBox="0 0 320 400">
          <path d="M160 120 L280 190 L160 260 L40 190 Z" fill="#faf7f2" fillOpacity="0.05" stroke={stroke} strokeOpacity="0.5" />
          <path d="M120 150 L176 182 L176 200 L120 168 Z" fill="#b08d57" fillOpacity="0.7" />
          <path d="M40 210 L160 280 L280 210" stroke={stroke} strokeDasharray="3 5" strokeOpacity="0.4" />
          <path d="M40 300 L160 370" stroke="#b08d57" strokeOpacity="0.8" />
          <path d="M160 370 L280 300" stroke="#b08d57" strokeOpacity="0.8" />
          <circle cx="160" cy="370" fill="#b08d57" r="2.5" />
        </svg>
      )
  }
}
