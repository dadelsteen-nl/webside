'use client'

import { AnimatePresence, motion } from 'motion/react'
import NextImage from 'next/image'
import { useCallback, useEffect, useId, useRef, useState } from 'react'

import { EASE_LUXE } from '@/components/ui/motion'
import { cn } from '@/utilities/cn'

import type { HomeHotspot, HomeMedia } from './types'

import { MirrorSilhouette, PlaceholderPanel } from './Placeholder'

type Props = {
  image?: HomeMedia | null
  imageAlt: string
  hotspots: HomeHotspot[]
  hint: string
  closeLabel: string
}

/**
 * Product image with pulsing hotspot markers. Each marker is a real button
 * (aria-expanded / aria-controls) that opens a small detail card. Hover opens
 * on fine pointers; click/tap/Enter toggles; Escape or outside click closes.
 */
export function Hotspots({ closeLabel, hint, hotspots, image, imageAlt }: Props) {
  const [active, setActive] = useState<number | null>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '')

  const close = useCallback(() => setActive(null), [])

  useEffect(() => {
    if (active === null) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close()
    const onPointer = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) close()
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('pointerdown', onPointer)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('pointerdown', onPointer)
    }
  }, [active, close])

  return (
    <div className="relative" ref={rootRef}>
      <div className="relative aspect-[4/5] w-full">
        <div className="absolute inset-0 overflow-hidden">
        {image?.url ? (
          <NextImage
            alt={image.alt || imageAlt}
            className="object-cover"
            fill
            sizes="(min-width: 1024px) 58vw, 100vw"
            src={image.url}
          />
        ) : (
          <PlaceholderPanel className="absolute inset-0" tone="stone">
            <div className="absolute inset-[6%]">
              <MirrorSilhouette />
            </div>
          </PlaceholderPanel>
        )}
        </div>

        {hotspots.map((spot, i) => {
          const open = active === i
          const cardId = `${uid}-hotspot-${i}`
          const alignRight = spot.x > 55
          const alignBottom = spot.y > 70
          return (
            <div
              className={cn('absolute', open ? 'z-30' : 'z-10')}
              key={`${spot.title}-${i}`}
              onMouseEnter={(e) => {
                if (window.matchMedia('(hover: hover)').matches) setActive(i)
                e.stopPropagation()
              }}
              onMouseLeave={() => {
                if (window.matchMedia('(hover: hover)').matches) setActive((cur) => (cur === i ? null : cur))
              }}
              style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
            >
              <button
                aria-controls={cardId}
                aria-expanded={open}
                className="group relative -ml-5 -mt-5 flex size-10 items-center justify-center rounded-full focus-visible:ring-offset-0"
                onClick={() => setActive(open ? null : i)}
                type="button"
              >
                <span className="sr-only">{spot.title}</span>
                <span
                  aria-hidden="true"
                  className={cn(
                    'absolute inset-1 rounded-full bg-bronze/40',
                    !open && 'animate-[home-pulse_2.6s_var(--ease-luxe)_infinite]',
                  )}
                />
                <span
                  aria-hidden="true"
                  className={cn(
                    'relative flex size-4 items-center justify-center rounded-full border border-cream bg-bronze shadow-[0_0_0_4px_rgba(250,247,242,0.25)] transition-transform duration-500 ease-[var(--ease-luxe)]',
                    open ? 'scale-125' : 'group-hover:scale-110',
                  )}
                >
                  <span
                    className={cn(
                      'h-px w-2 bg-cream transition-transform duration-500',
                      open ? 'rotate-0' : '',
                    )}
                  />
                  <span
                    className={cn(
                      'absolute h-2 w-px bg-cream transition-transform duration-500 ease-[var(--ease-luxe)]',
                      open ? 'scale-y-0' : '',
                    )}
                  />
                </span>
              </button>

              <AnimatePresence>
                {open && (
                  <motion.div
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      'absolute w-[min(17rem,70vw)] border border-ink/10 bg-cream/95 p-5 text-left shadow-[0_24px_60px_-24px_rgba(26,26,26,0.35)] backdrop-blur-sm',
                      alignRight ? 'right-6' : 'left-6',
                      alignBottom ? 'bottom-2' : 'top-2',
                    )}
                    exit={{ opacity: 0, y: 6 }}
                    id={cardId}
                    initial={{ opacity: 0, y: 8 }}
                    role="region"
                    aria-label={spot.title}
                    transition={{ duration: 0.5, ease: EASE_LUXE }}
                  >
                    <p className="font-display text-lg font-light leading-snug text-ink">{spot.title}</p>
                    {spot.text ? (
                      <p className="mt-2 text-[0.8125rem] leading-relaxed text-olive-grey">{spot.text}</p>
                    ) : null}
                    <button
                      className="mt-4 font-sans text-[0.625rem] uppercase tracking-[0.22em] text-bronze-deep underline-offset-4 hover:underline"
                      onClick={close}
                      type="button"
                    >
                      {closeLabel}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
      <p className="mt-4 font-sans text-[0.6875rem] uppercase tracking-[0.22em] text-olive-grey">{hint}</p>
    </div>
  )
}
