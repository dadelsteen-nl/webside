'use client'

import { motion } from 'motion/react'
import { useTranslations } from 'next-intl'
import { useEffect, useRef } from 'react'

import { EASE_LUXE, useReducedMotionSafe } from '@/components/ui/motion'

export function FormSuccess({
  onReset,
  text,
  title,
}: {
  title: string
  text: string
  onReset?: () => void
}) {
  const t = useTranslations('forms.success')
  const reduce = useReducedMotionSafe()
  const headingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    headingRef.current?.focus()
  }, [])

  const fade = (delay: number) =>
    reduce
      ? {}
      : {
          animate: { opacity: 1, y: 0 },
          initial: { opacity: 0, y: 16 },
          transition: { delay, duration: 1, ease: EASE_LUXE },
        }

  return (
    <div aria-live="polite" className="py-6" role="status">
      <svg aria-hidden="true" className="h-16 w-16 text-bronze" fill="none" viewBox="0 0 64 64">
        <motion.circle
          cx="32"
          cy="32"
          r="30"
          stroke="currentColor"
          strokeWidth="1"
          {...(reduce
            ? {}
            : {
                animate: { pathLength: 1 },
                initial: { pathLength: 0 },
                transition: { duration: 1.2, ease: EASE_LUXE },
              })}
        />
        <motion.path
          d="M21 33.5 28.5 41 44 24"
          stroke="currentColor"
          strokeWidth="1.4"
          {...(reduce
            ? {}
            : {
                animate: { pathLength: 1 },
                initial: { pathLength: 0 },
                transition: { delay: 0.7, duration: 0.8, ease: EASE_LUXE },
              })}
        />
      </svg>
      <motion.p
        className="mt-8 flex items-center gap-3 font-sans text-[0.6875rem] font-medium uppercase tracking-[0.28em] text-olive-grey"
        {...fade(0.4)}
      >
        <span aria-hidden="true" className="h-px w-8 bg-bronze" />
        {t('eyebrow')}
      </motion.p>
      <motion.h3
        className="mt-5 font-display text-[clamp(1.75rem,3vw,2.5rem)] font-light leading-tight tracking-[-0.02em] outline-none"
        ref={headingRef}
        tabIndex={-1}
        {...fade(0.55)}
      >
        {title}
      </motion.h3>
      <motion.p className="mt-4 max-w-md leading-relaxed text-olive-grey" {...fade(0.7)}>
        {text}
      </motion.p>
      {onReset ? (
        <motion.button
          className="mt-10 font-sans text-xs font-medium uppercase tracking-[0.18em] text-ink underline decoration-bronze underline-offset-8 transition-colors hover:text-bronze-deep"
          onClick={onReset}
          type="button"
          {...fade(0.85)}
        >
          {t('again')}
        </motion.button>
      ) : null}
    </div>
  )
}
