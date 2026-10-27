'use client'

import { useEffect, useState } from 'react'

/**
 * Hydration-safe prefers-reduced-motion: always `false` during SSR and the
 * first client render, then reflects (and follows) the user preference.
 */
export function useReducedMotionSafe(): boolean {
  const [reduce, setReduce] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduce(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  return reduce
}
