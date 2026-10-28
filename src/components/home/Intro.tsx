'use client'

import { motion, useScroll, useTransform, type MotionValue } from 'motion/react'
import { useTranslations } from 'next-intl'
import NextImage from 'next/image'
import { useRef } from 'react'

import { LogoIcon } from '@/components/icons/logo'
import { Reveal, useReducedMotionSafe } from '@/components/ui/motion'
import { Link } from '@/i18n/navigation'
import { brand } from '@/lib/brandMedia'

import { ArrowIcon, SectionLabel } from './primitives'

type Word = { text: string; em?: boolean }

function ScrollWord({
  index,
  progress,
  total,
  word,
}: {
  index: number
  progress: MotionValue<number>
  total: number
  word: Word
}) {
  const start = index / total
  const end = Math.min(1, start + 1.5 / total)
  const opacity = useTransform(progress, [start, end], [0.32, 1])

  return (
    <motion.span
      className={word.em ? 'font-light italic text-bronze' : undefined}
      style={{ opacity }}
    >
      {word.text}{' '}
    </motion.span>
  )
}

export function Intro({ productSlug }: { productSlug: string }) {
  const t = useTranslations('home.intro')
  const ref = useRef<HTMLParagraphElement>(null)
  const reduce = useReducedMotionSafe()
  const { scrollYProgress } = useScroll({ offset: ['start 0.85', 'end 0.45'], target: ref })

  const words: Word[] = [
    ...t('before').split(/\s+/).map((text) => ({ text })),
    { em: true, text: t('emphasis') },
    ...t('after').split(/\s+/).map((text) => ({ text })),
  ].filter((w) => w.text)

  return (
    <section aria-labelledby="home-intro-label" className="bg-sand py-24 md:py-36">
      <div className="container grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-5">
          <figure className="relative aspect-[4/5] overflow-hidden bg-stone">
            <NextImage
              alt={brand.minimalRoom.alt}
              className="object-cover"
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              src={brand.minimalRoom.url}
            />
            <figcaption className="absolute bottom-5 left-5 bg-cream/90 px-4 py-2 font-sans text-[0.625rem] uppercase tracking-[0.2em] text-ink backdrop-blur-sm">
              {t('caption')}
            </figcaption>
          </figure>
        </Reveal>

        <div className="lg:col-span-7">
          <SectionLabel as="h2" className="font-sans" id="home-intro-label">
            {t('label')}
          </SectionLabel>
          <p
            className="mt-8 font-display text-[clamp(1.625rem,2.9vw,2.875rem)] font-light leading-[1.2] tracking-[-0.015em] text-ink"
            ref={ref}
          >
            {reduce
              ? words.map((w, i) => (
                  <span className={w.em ? 'italic text-bronze' : undefined} key={i}>
                    {w.text}{' '}
                  </span>
                ))
              : words.map((w, i) => (
                  <ScrollWord index={i} key={i} progress={scrollYProgress} total={words.length} word={w} />
                ))}
          </p>
          <div className="mt-12 flex flex-col gap-8 border-t border-ink/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4 text-olive-grey">
              <LogoIcon className="h-7 w-5 shrink-0 text-bronze" />
              <span className="font-sans text-xs uppercase tracking-[0.22em]">{t('signature')}</span>
            </div>
            <Link
              className="group inline-flex items-center gap-3 font-sans text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-ink"
              href={{ params: { slug: productSlug }, pathname: '/products/[slug]' }}
            >
              <span className="border-b border-bronze pb-1">{t('cta')}</span>
              <ArrowIcon className="text-bronze" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
