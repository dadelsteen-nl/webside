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

/**
 * Full lockup as on the business card: emblem + "Dadelsteen" in a bold sans (espresso brown),
 * optionally with the "Sterk in herstel, vitaal in beweging" tagline in palm green.
 * `tone="light"` is for dark (forest) backgrounds.
 */
export function Logo({
  className,
  tagline,
  tone = 'dark',
}: {
  className?: string
  tagline?: string
  tone?: 'dark' | 'light'
}) {
  return (
    <span className={cn('inline-flex items-center gap-3', className)}>
      <LogoIcon className={tagline ? 'h-12 md:h-14' : 'h-9 md:h-10'} />
      <span className="flex flex-col">
        <span
          className={cn(
            'font-sans text-[1.25rem] leading-none font-bold tracking-[-0.01em] md:text-[1.4rem]',
            tone === 'dark' ? 'text-ink' : 'text-cream',
          )}
        >
          Dadelsteen
        </span>
        {tagline ? (
          <span
            className={cn(
              'mt-1.5 font-sans text-[0.5625rem] font-semibold tracking-[0.14em] uppercase',
              tone === 'dark' ? 'text-palm' : 'text-clay',
            )}
          >
            {tagline}
          </span>
        ) : null}
      </span>
    </span>
  )
}
