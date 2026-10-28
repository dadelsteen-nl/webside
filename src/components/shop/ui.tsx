import type { ReactNode } from 'react'

import { cn } from '@/utilities/cn'

/** Small uppercase tracked label with a bronze hairline, e.g. "— De collectie". */
export function Eyebrow({
  children,
  className,
  as: Tag = 'p',
}: {
  children: ReactNode
  className?: string
  as?: 'p' | 'span' | 'h2'
}) {
  return (
    <Tag
      className={cn(
        'flex items-center gap-3 font-sans text-[0.6875rem] font-medium uppercase tracking-[0.28em] text-olive-grey',
        className,
      )}
    >
      <span aria-hidden="true" className="h-px w-8 bg-bronze" />
      {children}
    </Tag>
  )
}

const base =
  'group inline-flex min-h-12 items-center justify-center gap-3 rounded-[var(--radius)] px-7 font-sans text-xs font-medium uppercase tracking-[0.18em] transition-[background-color,color,border-color,opacity] duration-500 ease-[var(--ease-luxe)] disabled:cursor-not-allowed disabled:opacity-50'

export const btn = {
  ink: cn(base, 'bg-ink text-cream hover:bg-bronze-deep'),
  bronze: cn(base, 'bg-bronze text-cream hover:bg-bronze-deep'),
  outline: cn(base, 'border border-ink/25 text-ink hover:border-ink hover:bg-ink hover:text-cream'),
  outlineBronze: cn(base, 'border border-bronze text-ink hover:bg-bronze hover:text-cream'),
  link: 'inline-flex items-center gap-2 font-sans text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-ink underline-offset-[6px] decoration-bronze hover:underline',
}

/** Renders `<em>` chunks from translations as italic bronze serif. */
export const emRich = {
  em: (chunks: ReactNode) => <em className="font-light italic text-bronze-deep">{chunks}</em>,
}

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

/** Shared input styling for checkout/account forms. */
export const fieldClass =
  'block h-12 w-full rounded-[var(--radius)] border border-ink/15 bg-cream px-4 font-sans text-sm text-ink placeholder:text-olive-grey/60 transition-colors duration-300 focus:border-bronze focus:outline-hidden focus-visible:ring-0 aria-invalid:border-error'

export const labelClass =
  'mb-2 block font-sans text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-olive-grey'
