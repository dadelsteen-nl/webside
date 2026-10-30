'use client'

import { useLocale, useTranslations } from 'next-intl'
import NextImage from 'next/image'

import { Reveal } from '@/components/ui/motion'
import { customerShots } from '@/lib/brandMedia'
import { cn } from '@/utilities/cn'

import type { HomeTestimonial } from './types'

import { SectionLabel } from './primitives'

type Props = {
  /** Featured quote(s); the first one is shown large */
  items: HomeTestimonial[]
}

function Stars({ className, label, rating }: { rating: number; label?: string; className?: string }) {
  return (
    <p aria-hidden={!label} aria-label={label} className={cn('flex gap-1 text-clay', className)} role={label ? 'img' : undefined}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg aria-hidden="true" className={cn('size-3.5', i >= Math.round(rating) && 'opacity-25')} key={i} viewBox="0 0 20 20">
          <path d="M10 1.5l2.6 5.5 6 .8-4.4 4.1 1.1 5.9L10 15l-5.3 2.8 1.1-5.9L1.4 7.8l6-.8z" fill="currentColor" />
        </svg>
      ))}
    </p>
  )
}

/**
 * Social proof: one featured quote plus a slow marquee of photos customers
 * sent in of their own setup. The marquee pauses on hover and stops under
 * reduced motion (then it scrolls horizontally by hand).
 */
export function Testimonials({ items }: Props) {
  const t = useTranslations('home.testimonials')
  const locale = useLocale() as 'nl' | 'en'
  const featured = items[0]
  const shots = [...customerShots, ...customerShots]

  return (
    <section aria-labelledby="home-testimonials-title" className="overflow-hidden bg-forest py-24 text-cream md:py-36">
      <div className="container">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-end">
          <Reveal className="lg:col-span-6">
            <SectionLabel tone="light">{t('label')}</SectionLabel>
            <h2
              className="mt-8 max-w-[16ch] text-[clamp(2.25rem,4.6vw,4.25rem)] font-light leading-[1.02] tracking-[-0.025em]"
              id="home-testimonials-title"
            >
              {t('title')}
            </h2>
            <div className="mt-10 flex items-center gap-5">
              <span className="font-display text-6xl font-light leading-none">{t('score')}</span>
              <span>
                <Stars label={t('rating', { rating: t('score') })} rating={5} />
                <span className="mt-2 block text-xs uppercase tracking-[0.18em] text-cream/55">{t('basedOn')}</span>
              </span>
            </div>
          </Reveal>

          {featured ? (
            <Reveal as="figure" className="lg:col-span-6" delay={0.1}>
              <blockquote>
                <p className="font-display text-[clamp(1.5rem,2.6vw,2.4rem)] font-light leading-[1.2] tracking-[-0.015em]">
                  <span aria-hidden="true" className="text-clay">“</span>
                  {featured.quote}
                  <span aria-hidden="true" className="text-clay">”</span>
                </p>
              </blockquote>
              <figcaption className="mt-8 flex items-center gap-4">
                <span aria-hidden="true" className="h-px w-10 bg-clay" />
                <span>
                  <span className="block font-sans text-sm font-medium">{featured.name}</span>
                  {featured.role ? <span className="block text-xs text-cream/55">{featured.role}</span> : null}
                </span>
              </figcaption>
            </Reveal>
          ) : null}
        </div>
      </div>

      <div className="mt-16 md:mt-24">
        <p className="container mb-6 font-sans text-[0.6875rem] uppercase tracking-[0.22em] text-cream/55">
          {t('shotsLabel')}
        </p>
        <div className="group overflow-x-auto motion-safe:overflow-hidden [scrollbar-width:none]">
          <ul className="flex w-max gap-4 px-4 motion-safe:animate-[home-marquee_110s_linear_infinite] group-hover:[animation-play-state:paused] md:gap-5 md:px-5">
            {shots.map((shot, i) => (
              <li
                aria-hidden={i >= customerShots.length}
                className="relative h-[22rem] w-[15rem] shrink-0 overflow-hidden md:h-[28rem] md:w-[19rem]"
                key={`${shot.url}-${i}`}
              >
                <NextImage
                  alt={i < customerShots.length ? shot.caption[locale] : ''}
                  className="object-cover"
                  fill
                  sizes="(min-width: 768px) 304px, 240px"
                  src={shot.url}
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-forest-deep/90 via-forest-deep/40 to-transparent p-5 pt-16">
                  <p className="font-display text-lg font-light leading-snug">{shot.caption[locale]}</p>
                  <Stars className="mt-2" rating={5} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
