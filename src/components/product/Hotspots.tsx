'use client'

import type { Media as MediaType } from '@/payload-types'

import { AnimatePresence, motion } from 'motion/react'
import { useTranslations } from 'next-intl'
import React, { useCallback, useEffect, useId, useRef, useState } from 'react'

import { Media } from '@/components/Media'
import { EASE_LUXE } from '@/components/ui/motion'
import { cn } from '@/utilities/cn'

type Spot = { x: number; y: number; title: string; text?: string | null }

/**
 * Image with positioned hotspot buttons. Each marker is a real button (aria-expanded /
 * aria-controls) opening a small card; Escape or outside click closes.
 */
export function ProductHotspots({ image, spots }: { image: MediaType; spots: Spot[] }) {
  const t = useTranslations('shop.product.hotspots')
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

  // A transparent cut-out is shown whole and the spots refer to the image itself
  const cutout = image.mimeType === 'image/png' && Boolean(image.width && image.height)

  return (
    <div ref={rootRef}>
      <div className="relative aspect-[4/5] w-full bg-stone md:aspect-[16/10]">
        {cutout ? (
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(50%_60%_at_50%_45%,rgba(163,86,42,0.18),transparent_70%)]"
          />
        ) : null}
        <div
          className={cn('absolute', cutout ? 'inset-y-[5%] left-1/2 -translate-x-1/2' : 'inset-0')}
          style={cutout ? { aspectRatio: `${image.width} / ${image.height}` } : undefined}
        >
        <div className={cn('absolute inset-0', !cutout && 'overflow-hidden')}>
          <Media
            className="absolute inset-0"
            fill
            imgClassName={cutout ? 'object-contain drop-shadow-[0_40px_50px_rgba(46,31,22,0.25)]' : 'object-cover'}
            resource={image}
            size={cutout ? '(min-width: 1024px) 30vw, 70vw' : '(min-width: 1024px) 80vw, 100vw'}
          />
        </div>

        {spots.map((spot, i) => {
          const open = active === i
          const cardId = `${uid}-spot-${i}`
          return (
            <div
              className={cn('absolute', open ? 'z-30' : 'z-10')}
              key={`${spot.title}-${i}`}
              style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
            >
              <button
                aria-controls={cardId}
                aria-expanded={open}
                className="group relative -ml-5 -mt-5 flex size-10 items-center justify-center rounded-full"
                onClick={() => setActive(open ? null : i)}
                type="button"
              >
                <span className="sr-only">{spot.title}</span>
                {!open ? (
                  <span
                    aria-hidden="true"
                    className="absolute inset-1.5 animate-ping rounded-full bg-bronze/40 [animation-duration:2.4s] motion-reduce:hidden"
                  />
                ) : null}
                <span
                  aria-hidden="true"
                  className={cn(
                    'relative flex size-4 items-center justify-center rounded-full border border-cream bg-bronze shadow-[0_0_0_4px_rgba(250,247,242,0.3)] transition-transform duration-500 ease-[var(--ease-luxe)]',
                    open ? 'rotate-45 scale-125' : 'group-hover:scale-110',
                  )}
                >
                  <span className="h-px w-2 bg-cream" />
                  <span className="absolute h-2 w-px bg-cream" />
                </span>
              </button>

              <AnimatePresence>
                {open ? (
                  <motion.div
                    animate={{ opacity: 1, y: 0 }}
                    aria-label={spot.title}
                    className={cn(
                      'absolute w-[min(17rem,70vw)] border border-ink/10 bg-cream/95 p-5 text-left shadow-[0_24px_60px_-24px_rgba(46,31,22,0.35)] backdrop-blur-sm',
                      spot.x > 55 ? 'right-6' : 'left-6',
                      spot.y > 65 ? 'bottom-2' : 'top-2',
                    )}
                    exit={{ opacity: 0, y: 6 }}
                    id={cardId}
                    initial={{ opacity: 0, y: 8 }}
                    role="region"
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
                      {t('close')}
                    </button>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          )
        })}
        </div>
      </div>
      <p className="mt-4 font-sans text-[0.6875rem] uppercase tracking-[0.22em] text-olive-grey">
        {t('hint')}
      </p>
    </div>
  )
}
