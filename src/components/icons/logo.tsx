import { cn } from '@/utilities/cn'
import React from 'react'

/**
 * Dadelsteen monogram: an elongated date-stone (seed) with a single groove,
 * read as a stylised "D". Uses currentColor so it adapts to its context.
 */
export function LogoIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 36"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      className={cn('h-6 w-4', props.className)}
    >
      <path
        d="M12 1.25C5.9 1.25 2.75 9.3 2.75 18S5.9 34.75 12 34.75 21.25 26.7 21.25 18 18.1 1.25 12 1.25Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M12 6.5c-2 3.4-2.9 7.3-2.9 11.5s.9 8.1 2.9 11.5"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.25"
      />
    </svg>
  )
}

/** Full lockup: monogram + DADELSTEEN wordmark in the display serif. */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-2.5 text-current', className)}>
      <LogoIcon className="h-7 w-[1.15rem] text-bronze" />
      <span className="font-display text-[1.15rem] font-light tracking-[0.28em] uppercase">
        Dadelsteen
      </span>
    </span>
  )
}
