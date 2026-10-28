'use client'

import NextImage from 'next/image'
import { useEffect, useRef } from 'react'

import type { HomeMedia } from './types'

type Props = {
  video?: HomeMedia | null
  poster?: HomeMedia | null
  label: string
}

/**
 * Full-bleed hero background: muted loop video → poster image (the section itself is ink).
 * Under prefers-reduced-motion the video is paused on its poster frame.
 */
export function HeroMedia({ label, poster, video }: Props) {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const apply = () => {
      if (mq.matches) {
        el.pause()
        el.currentTime = 0
      } else {
        void el.play().catch(() => {
          // Autoplay can be refused (e.g. low-power mode); the poster stays visible.
        })
      }
    }
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  if (video?.url) {
    return (
      <video
        aria-label={label}
        autoPlay
        className="absolute inset-0 h-full w-full object-cover"
        loop
        muted
        playsInline
        poster={poster?.url ?? undefined}
        preload="metadata"
        ref={ref}
      >
        <source src={video.url} type={video.mimeType ?? 'video/mp4'} />
      </video>
    )
  }

  if (poster?.url) {
    return (
      <NextImage
        alt={poster.alt || label}
        className="object-cover"
        fill
        priority
        sizes="100vw"
        src={poster.url}
      />
    )
  }

  return null
}
