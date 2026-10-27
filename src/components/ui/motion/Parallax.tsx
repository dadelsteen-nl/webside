'use client'

import { motion, useScroll, useTransform } from 'motion/react'
import { useRef, type ReactNode } from 'react'

import { useReducedMotionSafe } from './useReducedMotionSafe'

type ParallaxProps = {
  children: ReactNode
  className?: string
  /** Max travel in px (positive moves content up while scrolling down). */
  offset?: number
}

/** Subtle vertical parallax while the element crosses the viewport. */
export function Parallax({ children, className, offset = 60 }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotionSafe()
  const { scrollYProgress } = useScroll({ offset: ['start end', 'end start'], target: ref })
  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset])

  return (
    <div className={className} ref={ref}>
      <motion.div className="relative h-full w-full will-change-transform" style={reduce ? undefined : { y }}>
        {children}
      </motion.div>
    </div>
  )
}
