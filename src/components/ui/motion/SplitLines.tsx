'use client'

import { motion } from 'motion/react'
import type { ReactNode } from 'react'

import { cn } from '@/utilities/cn'

import { EASE_LUXE } from './Reveal'
import { useReducedMotionSafe } from './useReducedMotionSafe'

type SplitLinesProps = {
  /** Each entry is one visual line (masked and slid up individually). */
  lines: ReactNode[]
  className?: string
  lineClassName?: string
  /** Base delay in seconds */
  delay?: number
  /** Seconds between lines */
  stagger?: number
  duration?: number
  /** 'mount' animates immediately on load (hero), 'inView' when scrolled into view */
  trigger?: 'mount' | 'inView'
}

/**
 * Masked line-by-line reveal. Lines are block spans so the parent heading
 * keeps its semantics (render inside an h1/h2/p).
 */
export function SplitLines({
  className,
  delay = 0,
  duration = 1.2,
  lineClassName,
  lines,
  stagger = 0.12,
  trigger = 'inView',
}: SplitLinesProps) {
  const reduce = useReducedMotionSafe()

  return (
    <span className={cn('block', className)}>
      {lines.map((line, i) => (
        <span className="block overflow-hidden pb-[0.08em] -mb-[0.08em]" key={i}>
          {reduce ? (
            <span className={cn('block', lineClassName)}>{line}</span>
          ) : (
            <motion.span
              className={cn('block will-change-transform', lineClassName)}
              initial={{ y: '105%' }}
              transition={{ delay: delay + i * stagger, duration, ease: EASE_LUXE }}
              {...(trigger === 'mount'
                ? { animate: { y: '0%' } }
                : { viewport: { amount: 0.6, once: true }, whileInView: { y: '0%' } })}
            >
              {line}
            </motion.span>
          )}
        </span>
      ))}
    </span>
  )
}

type StaggerTextProps = {
  text: string
  className?: string
  delay?: number
  stagger?: number
}

/** Word-by-word fade-up when the text enters the viewport. */
export function StaggerText({ className, delay = 0, stagger = 0.04, text }: StaggerTextProps) {
  const reduce = useReducedMotionSafe()
  const words = text.split(/\s+/).filter(Boolean)

  if (reduce) return <span className={className}>{text}</span>

  return (
    <motion.span
      className={className}
      initial="hidden"
      viewport={{ amount: 0.5, once: true }}
      whileInView="visible"
    >
      {words.map((word, i) => (
        <span className="inline-block overflow-hidden align-bottom" key={`${word}-${i}`}>
          <motion.span
            className="inline-block"
            transition={{ delay: delay + i * stagger, duration: 0.9, ease: EASE_LUXE }}
            variants={{ hidden: { opacity: 0, y: '60%' }, visible: { opacity: 1, y: '0%' } }}
          >
            {word}
          </motion.span>
          {i < words.length - 1 ? ' ' : null}
        </span>
      ))}
    </motion.span>
  )
}
