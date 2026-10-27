'use client'

import useEmblaCarousel from 'embla-carousel-react'
import { useTranslations } from 'next-intl'
import NextImage from 'next/image'
import { useCallback, useEffect, useState } from 'react'

import { Reveal } from '@/components/ui/motion'
import { cn } from '@/utilities/cn'

import type { HomeTestimonial } from './types'

import { SectionLabel } from './primitives'

type Props = {
  items: HomeTestimonial[]
  /** True when showing static illustrative copy instead of CMS testimonials */
  isPlaceholder?: boolean
}

function Stars({ label, rating }: { rating: number; label: string }) {
  return (
    <p aria-label={label} className="flex gap-1.5 text-bronze" role="img">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg aria-hidden="true" className={cn('size-3.5', i >= rating && 'opacity-25')} key={i} viewBox="0 0 20 20">
          <path
            d="M10 1.5l2.6 5.5 6 .8-4.4 4.1 1.1 5.9L10 15l-5.3 2.8 1.1-5.9L1.4 7.8l6-.8z"
            fill="currentColor"
          />
        </svg>
      ))}
    </p>
  )
}

export function Testimonials({ isPlaceholder, items }: Props) {
  const t = useTranslations('home.testimonials')
  const [emblaRef, embla] = useEmblaCarousel({ align: 'start', duration: 38, loop: items.length > 1 })
  const [selected, setSelected] = useState(0)

  const onSelect = useCallback(() => {
    if (embla) setSelected(embla.selectedScrollSnap())
  }, [embla])

  useEffect(() => {
    if (!embla) return
    onSelect()
    embla.on('select', onSelect).on('reInit', onSelect)
    return () => {
      embla.off('select', onSelect).off('reInit', onSelect)
    }
  }, [embla, onSelect])

  if (!items.length) return null

  return (
    <section aria-labelledby="home-testimonials-title" className="overflow-hidden bg-stone/50 py-24 md:py-36">
      <div className="container">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <Reveal>
            <SectionLabel>{t('label')}</SectionLabel>
            <h2
              className="mt-8 max-w-[18ch] text-[clamp(2.25rem,4.6vw,4.25rem)] font-light leading-[1.02] tracking-[-0.025em] text-ink"
              id="home-testimonials-title"
            >
              {t('title')}
            </h2>
          </Reveal>
          {items.length > 1 ? (
            <div className="flex gap-3">
              <button
                aria-label={t('prev')}
                className="flex size-12 items-center justify-center rounded-full border border-ink/20 text-ink transition-colors duration-500 hover:border-bronze hover:bg-bronze hover:text-cream"
                onClick={() => embla?.scrollPrev()}
                type="button"
              >
                <svg aria-hidden="true" className="h-3 w-5 rotate-180" fill="none" viewBox="0 0 20 12">
                  <path d="M0 6h18M13 1l5 5-5 5" stroke="currentColor" strokeWidth="1.2" />
                </svg>
              </button>
              <button
                aria-label={t('next')}
                className="flex size-12 items-center justify-center rounded-full border border-ink/20 text-ink transition-colors duration-500 hover:border-bronze hover:bg-bronze hover:text-cream"
                onClick={() => embla?.scrollNext()}
                type="button"
              >
                <svg aria-hidden="true" className="h-3 w-5" fill="none" viewBox="0 0 20 12">
                  <path d="M0 6h18M13 1l5 5-5 5" stroke="currentColor" strokeWidth="1.2" />
                </svg>
              </button>
            </div>
          ) : null}
        </div>

        <Reveal className="mt-16 md:mt-20" delay={0.1}>
          <div aria-roledescription="carousel" className="overflow-visible" ref={emblaRef} role="region" aria-label={t('title')}>
            <div className="flex">
              {items.map((item, i) => (
                <figure
                  aria-label={`${i + 1} / ${items.length}`}
                  aria-roledescription="slide"
                  className={cn(
                    'min-w-0 shrink-0 grow-0 basis-full pr-6 transition-opacity duration-700 ease-[var(--ease-luxe)] md:basis-[78%] md:pr-16 lg:basis-[64%]',
                    i === selected ? 'opacity-100' : 'opacity-35',
                  )}
                  key={`${item.name}-${i}`}
                  role="group"
                >
                  <Stars label={t('rating', { rating: item.rating ?? 5 })} rating={item.rating ?? 5} />
                  <blockquote className="mt-8">
                    <p className="font-display text-[clamp(1.6rem,3.2vw,2.9rem)] font-light leading-[1.18] tracking-[-0.015em] text-ink">
                      <span aria-hidden="true" className="text-bronze">“</span>
                      {item.quote}
                      <span aria-hidden="true" className="text-bronze">”</span>
                    </p>
                  </blockquote>
                  <figcaption className="mt-10 flex items-center gap-4">
                    {item.photo?.url ? (
                      <span className="relative size-12 overflow-hidden rounded-full">
                        <NextImage alt="" className="object-cover" fill sizes="48px" src={item.photo.url} />
                      </span>
                    ) : (
                      <span aria-hidden="true" className="h-px w-10 bg-bronze" />
                    )}
                    <span>
                      <span className="block font-sans text-sm font-medium text-ink">{item.name}</span>
                      {item.role ? <span className="block text-xs text-olive-grey">{item.role}</span> : null}
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </Reveal>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-6">
          {items.length > 1 ? (
            <div className="flex gap-2">
              {items.map((_, i) => (
                <button
                  aria-current={i === selected}
                  aria-label={t('goTo', { index: i + 1 })}
                  className="group flex h-6 items-center"
                  key={i}
                  onClick={() => embla?.scrollTo(i)}
                  type="button"
                >
                  <span
                    className={cn(
                      'block h-px transition-[width,background-color] duration-700 ease-[var(--ease-luxe)]',
                      i === selected ? 'w-12 bg-bronze' : 'w-6 bg-ink/25 group-hover:bg-ink/50',
                    )}
                  />
                </button>
              ))}
            </div>
          ) : (
            <span />
          )}
          {isPlaceholder ? <p className="text-xs italic text-olive-grey">{t('placeholderNote')}</p> : null}
        </div>
      </div>
    </section>
  )
}
