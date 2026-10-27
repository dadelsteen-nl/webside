'use client'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ReactLenis, useLenis } from 'lenis/react'
import { usePathname } from 'next/navigation'
import React, { useEffect, useSyncExternalStore } from 'react'

gsap.registerPlugin(ScrollTrigger)

const REDUCED_QUERY = '(prefers-reduced-motion: reduce)'

function subscribeReduced(cb: () => void) {
  const mq = window.matchMedia(REDUCED_QUERY)
  mq.addEventListener('change', cb)
  return () => mq.removeEventListener('change', cb)
}

/** True when the visitor prefers reduced motion (SSR: true, so nothing animates before hydration). */
export function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeReduced,
    () => window.matchMedia(REDUCED_QUERY).matches,
    () => true,
  )
}

/**
 * Drives Lenis from GSAP's ticker and keeps ScrollTrigger in sync, so any section can use
 * ScrollTrigger as usual. Also resets scroll + refreshes triggers on route changes.
 */
function GsapLenisSync() {
  const lenis = useLenis()
  const pathname = usePathname()

  useEffect(() => {
    if (!lenis) return
    const onTick = (time: number) => lenis.raf(time * 1000)
    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add(onTick)
    gsap.ticker.lagSmoothing(0)
    return () => {
      lenis.off('scroll', ScrollTrigger.update)
      gsap.ticker.remove(onTick)
    }
  }, [lenis])

  // Radix dialogs/sheets (cart, etc.) lock scroll via `data-scroll-locked` on <body>; pause Lenis
  // while that is set so the page behind an overlay does not move.
  useEffect(() => {
    if (!lenis) return
    const body = document.body
    const sync = () => (body.hasAttribute('data-scroll-locked') ? lenis.stop() : lenis.start())
    const observer = new MutationObserver(sync)
    observer.observe(body, { attributes: true, attributeFilter: ['data-scroll-locked'] })
    return () => observer.disconnect()
  }, [lenis])

  useEffect(() => {
    if (!lenis) return
    if (!window.location.hash) lenis.scrollTo(0, { immediate: true, force: true })
    lenis.resize()
    ScrollTrigger.refresh()
  }, [pathname, lenis])

  return null
}

/**
 * Global Lenis smooth scroll (window-level, `root`). Rendered as a sibling of the page tree so
 * toggling reduced motion never remounts the app. Access the instance with `useLenis()` from
 * 'lenis/react'. Disabled entirely when `prefers-reduced-motion: reduce`.
 * Add `data-lenis-prevent` to scrollable overlays (modals, drawers) to keep native scrolling.
 */
export function SmoothScroll() {
  const reduced = usePrefersReducedMotion()
  if (reduced) return null

  return (
    <ReactLenis
      options={{
        autoRaf: false,
        lerp: 0.085,
        anchors: true,
        smoothWheel: true,
        // Let dialogs (cart sheet, menus) scroll natively.
        prevent: (node) => Boolean(node.closest?.('[role="dialog"]')),
      }}
      root
    >
      <GsapLenisSync />
    </ReactLenis>
  )
}
