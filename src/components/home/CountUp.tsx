'use client'

import { animate, useInView } from 'motion/react'
import { useEffect, useRef, useState } from 'react'

import { useReducedMotionSafe } from '@/components/ui/motion'

type Props = {
  /** Final display value, e.g. "120 kg", "1,4 m²", "400+", "43\"" */
  value: string
  className?: string
  /** When provided, animates each time this flips to true (pinned panels). Otherwise on first in-view. */
  active?: boolean
}

const NUM = /^(\d+(?:[.,]\d+)?)(.*)$/s

/**
 * Renders the FINAL value in HTML (SSR, no-JS, crawlers) and only enhances
 * with a short count-up animation once visible.
 */
export function CountUp({ active, className, value }: Props) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { amount: 0.6, once: true })
  const reduce = useReducedMotionSafe()
  const [display, setDisplay] = useState(value)

  const match = value.match(NUM)
  const trigger = active === undefined ? inView : active

  useEffect(() => {
    if (!match || reduce || !trigger) {
      setDisplay(value)
      return
    }
    const raw = match[1]!
    const sep = raw.includes(',') ? ',' : '.'
    const decimals = raw.split(/[.,]/)[1]?.length ?? 0
    const target = parseFloat(raw.replace(',', '.'))
    const suffix = match[2] ?? ''

    const controls = animate(0, target, {
      duration: 1.6,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(`${v.toFixed(decimals).replace('.', sep)}${suffix}`),
      onComplete: () => setDisplay(value),
    })
    return () => controls.stop()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger, reduce, value])

  return (
    <span className={className} ref={ref}>
      <span aria-hidden="true">{display}</span>
      <span className="sr-only">{value}</span>
    </span>
  )
}
