import { cn } from '@/utilities/cn'
import React from 'react'

/** Dadelsteen emblem: date palm growing from a date stone (transparent PNG, 240×256). */
export function LogoIcon({ className }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- tiny static asset, already sized
    <img
      alt=""
      aria-hidden="true"
      className={cn('h-7 w-auto select-none', className)}
      decoding="async"
      draggable={false}
      height={256}
      src="/brand/dadelsteen-emblem.png"
      width={240}
    />
  )
}

/** Full lockup: emblem + DADELSTEEN wordmark in the display serif. */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-3 text-current', className)}>
      <LogoIcon className="h-9 md:h-10" />
      <span className="font-display text-[1.15rem] font-light tracking-[0.28em] uppercase">
        Dadelsteen
      </span>
    </span>
  )
}
