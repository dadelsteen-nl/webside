'use client'

import { motion } from 'motion/react'
import { useReducedMotionSafe } from './useReducedMotionSafe'
import type { ElementType, ReactNode } from 'react'

export const EASE_LUXE = [0.22, 1, 0.36, 1] as const

type RevealProps = {
  children: ReactNode
  className?: string
  /** Delay in seconds */
  delay?: number
  /** Duration in seconds */
  duration?: number
  /** Vertical travel in px */
  y?: number
  /** Render as a different element (div by default) */
  as?: 'div' | 'section' | 'li' | 'article' | 'figure' | 'span' | 'p'
  /** Portion of the element that must be visible before revealing */
  amount?: number
  once?: boolean
  /** 'inView' (default) reveals on scroll, 'mount' right after hydration */
  trigger?: 'inView' | 'mount'
}

/**
 * Fade-up on enter viewport. Under reduced motion it renders statically.
 */
export function Reveal({
  as = 'div',
  amount = 0.25,
  children,
  className,
  delay = 0,
  duration = 1,
  once = true,
  trigger = 'inView',
  y = 28,
}: RevealProps) {
  const reduce = useReducedMotionSafe()
  const Component = motion[as] as typeof motion.div

  if (reduce) {
    const Static = as as ElementType
    return <Static className={className}>{children}</Static>
  }

  return (
    <Component
      className={className}
      initial={{ opacity: 0, y }}
      transition={{ delay, duration, ease: EASE_LUXE }}
      {...(trigger === 'mount'
        ? { animate: { opacity: 1, y: 0 } }
        : { viewport: { amount, once }, whileInView: { opacity: 1, y: 0 } })}
    >
      {children}
    </Component>
  )
}
