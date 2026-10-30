'use client'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useTranslations } from 'next-intl'
import { useEffect, useRef, useState } from 'react'

import { Reveal } from '@/components/ui/motion'
import { cn } from '@/utilities/cn'

import { CountUp } from './CountUp'
import { SectionLabel } from './primitives'
import { TechVisual } from './TechVisual'

type Item = { title: string; text: string; stat: string; statLabel: string }

const pad = (n: number) => String(n).padStart(2, '0')

/**
 * ≥ lg (motion allowed): the stage pins for the length of the sequence and
 * the active feature follows scroll progress. Otherwise: stacked cards.
 * Both layouts are in the HTML; CSS decides which one shows (no layout shift).
 */
export function Technology() {
  const t = useTranslations('home.tech')
  const items = t.raw('items') as Item[]
  const stageRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const mm = gsap.matchMedia()
    mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
      const n = items.length
      const st = ScrollTrigger.create({
        end: () => `+=${window.innerHeight * (n - 0.4)}`,
        invalidateOnRefresh: true,
        onUpdate: (self) => setActive(Math.min(n - 1, Math.floor(self.progress * n))),
        pin: true,
        start: 'top top',
        trigger: stageRef.current,
      })
      return () => st.kill()
    })
    return () => mm.revert()
  }, [items.length])

  return (
    <section aria-labelledby="home-tech-title" className="bg-forest text-cream">
      <div className="container pb-16 pt-24 md:pt-36 lg:pb-8">
        <div className="grid gap-8 lg:grid-cols-12">
          <Reveal className="lg:col-span-6">
            <SectionLabel tone="light">{t('label')}</SectionLabel>
            <h2
              className="mt-8 text-[clamp(2.5rem,5.4vw,5rem)] font-light leading-[1] tracking-[-0.03em]"
              id="home-tech-title"
            >
              {t('title')}
            </h2>
          </Reveal>
          <Reveal className="lg:col-span-4 lg:col-start-9 lg:self-end" delay={0.1}>
            <p className="max-w-sm text-base leading-relaxed text-cream/65">{t('intro')}</p>
          </Reveal>
        </div>
      </div>

      {/* Stacked: mobile, tablet and reduced motion */}
      <ol className="container grid gap-16 pb-24 md:grid-cols-2 md:gap-x-10 md:gap-y-20 md:pb-36 lg:hidden lg:motion-reduce:grid">
        {items.map((item, i) => {
          // An odd last card spans both columns instead of leaving a hole
          const wide = items.length % 2 === 1 && i === items.length - 1
          return (
          <Reveal as="li" className={cn(wide && 'md:col-span-2')} key={item.title}>
            <div className={cn('aspect-[4/3] w-full overflow-hidden', wide && 'md:aspect-[21/9]')}>
              <TechVisual index={i} sizes={wide ? '100vw' : undefined} />
            </div>
            <div className="mt-8 flex items-baseline justify-between border-b border-cream/15 pb-4">
              <span className="font-display text-5xl font-light text-clay">{pad(i + 1)}</span>
              <span className="text-right">
                <CountUp className="block font-display text-3xl font-light tabular-nums" value={item.stat} />
                <span className="text-[0.6875rem] uppercase tracking-[0.18em] text-cream/55">{item.statLabel}</span>
              </span>
            </div>
            <h3 className="mt-6 text-2xl font-light leading-tight md:text-3xl">{item.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-cream/65 md:text-base">{item.text}</p>
          </Reveal>
          )
        })}
      </ol>

      {/* Pinned stage: lg+ with motion */}
      <div className="hidden lg:block lg:motion-reduce:hidden" ref={stageRef}>
        <div className="container grid h-[100svh] grid-cols-12 items-center gap-10 py-[8vh]">
          <div className="col-span-5 flex h-full flex-col justify-center">
            <div className="flex items-baseline gap-4">
              <span className="relative block h-[clamp(8rem,15vw,13rem)] w-[2ch] overflow-hidden font-display text-[clamp(8rem,15vw,13rem)] font-light leading-none text-clay">
                {items.map((_, i) => (
                  <span
                    aria-hidden="true"
                    className={cn(
                      'absolute inset-0 transition-[transform,opacity] duration-1000 ease-[var(--ease-luxe)]',
                      i === active ? 'translate-y-0 opacity-100' : i < active ? '-translate-y-full opacity-0' : 'translate-y-full opacity-0',
                    )}
                    key={i}
                  >
                    {pad(i + 1)}
                  </span>
                ))}
              </span>
              <span className="font-sans text-xs tracking-[0.2em] text-cream/45">/ {pad(items.length)}</span>
            </div>

            <div className="relative mt-10 min-h-[17rem]">
              {items.map((item, i) => (
                <div
                  aria-hidden={i !== active}
                  className={cn(
                    'absolute inset-0 transition-[opacity,transform] duration-1000 ease-[var(--ease-luxe)]',
                    i === active ? 'translate-y-0 opacity-100 delay-150' : 'pointer-events-none translate-y-4 opacity-0',
                  )}
                  key={item.title}
                >
                  <h3 className="max-w-md text-[clamp(1.75rem,2.6vw,2.5rem)] font-light leading-[1.08]">
                    {item.title}
                  </h3>
                  <p className="mt-5 max-w-md text-base leading-relaxed text-cream/65">{item.text}</p>
                  <div className="mt-8 flex items-end gap-5 border-t border-cream/15 pt-6">
                    <CountUp
                      active={i === active}
                      className="font-display text-5xl font-light tabular-nums"
                      value={item.stat}
                    />
                    <span className="pb-2 text-[0.6875rem] uppercase tracking-[0.18em] text-cream/55">
                      {item.statLabel}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div aria-hidden="true" className="mt-10 flex gap-2">
              {items.map((_, i) => (
                <span className="relative h-px w-12 overflow-hidden bg-cream/20" key={i}>
                  <span
                    className={cn(
                      'absolute inset-0 origin-left bg-clay transition-transform duration-700 ease-[var(--ease-luxe)]',
                      i <= active ? 'scale-x-100' : 'scale-x-0',
                    )}
                  />
                </span>
              ))}
            </div>
          </div>

          <div className="relative col-span-6 col-start-7 h-full max-h-[80svh] self-center">
            <div className="relative mx-auto aspect-[4/5] h-full max-w-full">
              {items.map((item, i) => (
                <div
                  aria-hidden="true"
                  className={cn(
                    'absolute inset-0 overflow-hidden transition-[opacity,clip-path] duration-[1200ms] ease-[var(--ease-luxe)]',
                    i === active ? 'opacity-100 [clip-path:inset(0_0_0_0)]' : 'opacity-0 [clip-path:inset(6%_6%_6%_6%)]',
                  )}
                  key={item.title}
                >
                  <TechVisual index={i} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
