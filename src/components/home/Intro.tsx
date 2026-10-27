'use client'

import { motion, useScroll, useTransform, type MotionValue } from 'motion/react'
import { useTranslations } from 'next-intl'
import { useRef } from 'react'

import { LogoIcon } from '@/components/icons/logo'
import { useReducedMotionSafe } from '@/components/ui/motion'

import { SectionLabel } from './primitives'

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
  const opacity = useTransform(progress, [start, end], [0.16, 1])

  return (
    <motion.span
      className={word.em ? 'font-light italic text-bronze' : undefined}
      style={{ opacity }}
    >
      {word.text}{' '}
    </motion.span>
  )
}

export function Intro() {
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
    <section aria-labelledby="home-intro-label" className="bg-sand py-28 md:py-40 lg:py-52">
      <div className="container grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-3">
          <SectionLabel as="h2" className="font-sans" id="home-intro-label">
            {t('label')}
          </SectionLabel>
        </div>
        <div className="lg:col-span-9">
          <p
            className="font-display text-[clamp(1.75rem,3.9vw,3.75rem)] font-light leading-[1.14] tracking-[-0.02em] text-ink"
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
          <div className="mt-14 flex items-center gap-4 text-olive-grey">
            <LogoIcon className="h-7 w-5 text-bronze" />
            <span className="font-sans text-xs uppercase tracking-[0.22em]">{t('signature')}</span>
          </div>
        </div>
      </div>
    </section>
  )
}
