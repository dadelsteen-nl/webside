import type { ReactNode } from 'react'

import { cn } from '@/utilities/cn'

/** Tiny uppercase tracked eyebrow, e.g. "01 — Technologie". */
export function SectionLabel({
  as: Tag = 'p',
  children,
  className,
  id,
  tone = 'dark',
}: {
  as?: 'p' | 'h2'
  children: ReactNode
  className?: string
  id?: string
  tone?: 'dark' | 'light'
}) {
  return (
    <Tag
      id={id}
      className={cn(
        'flex items-center gap-3 font-sans text-[0.6875rem] font-medium uppercase tracking-[0.28em]',
        tone === 'dark' ? 'text-olive-grey' : 'text-cream/70',
        className,
      )}
    >
      <span aria-hidden="true" className={cn('h-px w-8', tone === 'dark' ? 'bg-bronze' : 'bg-cream/50')} />
      {children}
    </Tag>
  )
}

/** Shared button-like link styles (uppercase, wide tracking). */
export const buttonStyles = {
  base: 'group inline-flex min-h-12 items-center justify-center gap-3 rounded-[var(--radius)] px-7 font-sans text-xs font-medium uppercase tracking-[0.18em] transition-[background-color,color,border-color] duration-500 ease-[var(--ease-luxe)]',
  ink: 'bg-ink text-cream hover:bg-bronze-deep',
  cream: 'bg-cream text-ink hover:bg-stone',
  outlineLight: 'border border-cream/60 text-cream hover:border-cream hover:bg-cream/10',
  outlineBronze: 'border border-bronze text-ink hover:bg-bronze hover:text-cream',
}

/** Arrow glyph that nudges on hover of a parent `.group`. */
export function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={cn(
        'h-3 w-5 shrink-0 transition-transform duration-500 ease-[var(--ease-luxe)] group-hover:translate-x-1',
        className,
      )}
      fill="none"
      viewBox="0 0 20 12"
    >
      <path d="M0 6h18M13 1l5 5-5 5" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  )
}

/** Renders `<em>` tags from translation strings as bronze italic emphasis. */
export const emphasis = {
  em: (chunks: ReactNode) => <em className="font-light italic text-bronze">{chunks}</em>,
}
