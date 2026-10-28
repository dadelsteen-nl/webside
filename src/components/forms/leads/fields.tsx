'use client'

import { AnimatePresence, motion } from 'motion/react'
import { useTranslations } from 'next-intl'
import { type ComponentProps, type ReactNode, useId } from 'react'
import type { UseFormRegisterReturn } from 'react-hook-form'

import { EASE_LUXE } from '@/components/ui/motion'
import { Link } from '@/i18n/navigation'
import { cn } from '@/utilities/cn'

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
export const PHONE_PATTERN = /^\+?[\d\s().-]{6,20}$/

export function FieldError({ id, message }: { id: string; message?: string }) {
  return (
    <AnimatePresence initial={false}>
      {message ? (
        <motion.p
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-[0.8125rem] leading-snug text-[#9a3b2a]"
          exit={{ opacity: 0, y: -4 }}
          id={id}
          initial={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.4, ease: EASE_LUXE }}
        >
          {message}
        </motion.p>
      ) : null}
    </AnimatePresence>
  )
}

type TextFieldProps = {
  label: string
  registration: UseFormRegisterReturn
  error?: string
  optional?: boolean
  multiline?: boolean
  /** Keep the label raised (e.g. for date inputs that always show a native placeholder). */
  floatLabel?: boolean
  className?: string
} & Omit<ComponentProps<'input'>, 'name' | 'className' | 'ref' | 'onChange' | 'onBlur'>

/** Underline input with a floating label and an animated bronze focus line. */
export function TextField({
  className,
  error,
  floatLabel,
  label,
  multiline,
  optional,
  registration,
  ...rest
}: TextFieldProps) {
  const t = useTranslations('forms')
  const id = useId()
  const errorId = `${id}-error`

  const inputClass = cn(
    'peer block w-full rounded-none border-0 border-b bg-transparent px-0 pt-7 pb-2.5 font-sans text-base text-ink outline-none transition-colors duration-500',
    'placeholder:text-transparent focus:border-ink',
    error ? 'border-[#9a3b2a]' : 'border-ink/25 hover:border-ink/50',
    multiline && 'min-h-32 resize-y leading-relaxed',
  )

  const labelClass = cn(
    'pointer-events-none absolute left-0 origin-left font-sans text-olive-grey transition-all duration-500 ease-[var(--ease-luxe)]',
    floatLabel
      ? 'top-1 text-[0.6875rem] uppercase tracking-[0.2em]'
      : [
          'top-7 text-base',
          'peer-focus:top-1 peer-focus:text-[0.6875rem] peer-focus:uppercase peer-focus:tracking-[0.2em] peer-focus:text-ink',
          'peer-[:not(:placeholder-shown)]:top-1 peer-[:not(:placeholder-shown)]:text-[0.6875rem] peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:tracking-[0.2em]',
        ],
  )

  const shared = {
    'aria-describedby': error ? errorId : undefined,
    'aria-invalid': error ? true : undefined,
    className: inputClass,
    id,
    placeholder: ' ',
    ...registration,
  }

  return (
    <div className={cn('relative', className)}>
      {multiline ? (
        <textarea {...shared} rows={4} />
      ) : (
        <input {...shared} {...rest} />
      )}
      <label className={labelClass} htmlFor={id}>
        {label}
        {optional ? <span className="ml-2 normal-case tracking-normal text-olive-grey/70">({t('optional')})</span> : null}
      </label>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-0 h-px w-full origin-left scale-x-0 bg-bronze transition-transform duration-700 ease-[var(--ease-luxe)] peer-focus:scale-x-100"
        style={{ bottom: multiline ? 6 : 0 }}
      />
      <FieldError id={errorId} message={error} />
    </div>
  )
}

export type TileOption = { value: string; label: string; hint?: string }

/** Radio group rendered as selectable tiles. */
export function TileGroup({
  className,
  columns = 3,
  error,
  legend,
  options,
  registration,
  size = 'md',
}: {
  legend: string
  options: TileOption[]
  registration: UseFormRegisterReturn
  error?: string
  columns?: 2 | 3 | 4
  size?: 'sm' | 'md'
  className?: string
}) {
  const id = useId()
  const errorId = `${id}-error`
  return (
    <fieldset
      aria-describedby={error ? errorId : undefined}
      className={cn('min-w-0', className)}
    >
      <legend className="mb-4 font-sans text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-olive-grey">
        {legend}
      </legend>
      <div
        className={cn(
          'grid gap-2.5',
          columns === 2 && 'grid-cols-2',
          columns === 3 && 'grid-cols-1 sm:grid-cols-3',
          columns === 4 && 'grid-cols-2 md:grid-cols-4',
          size === 'sm' && columns === 3 && 'grid-cols-3',
        )}
      >
        {options.map((opt) => (
          <label
            className={cn(
              'group relative flex cursor-pointer flex-col justify-center border border-ink/15 bg-cream/60 transition-[background-color,border-color,color] duration-500 ease-[var(--ease-luxe)]',
              'hover:border-ink/40 has-checked:border-ink has-checked:bg-ink has-checked:text-cream',
              'has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-bronze',
              size === 'sm' ? 'min-h-12 px-4 py-3 text-center' : 'min-h-20 px-5 py-4',
            )}
            key={opt.value}
          >
            <input className="sr-only" type="radio" value={opt.value} {...registration} />
            <span className={cn('font-sans text-sm', size === 'md' && 'font-medium')}>{opt.label}</span>
            {opt.hint ? (
              <span className="mt-1 text-[0.8125rem] leading-snug text-olive-grey transition-colors duration-500 group-has-checked:text-cream/70">
                {opt.hint}
              </span>
            ) : null}
            <span
              aria-hidden="true"
              className="absolute top-3 right-3 h-1.5 w-1.5 scale-0 rounded-full bg-bronze transition-transform duration-500 group-has-checked:scale-100"
            />
          </label>
        ))}
      </div>
      <FieldError id={errorId} message={error} />
    </fieldset>
  )
}

export function ConsentField({ error, registration }: { registration: UseFormRegisterReturn; error?: string }) {
  const t = useTranslations('forms')
  const id = useId()
  const errorId = `${id}-error`
  return (
    <div>
      <div className="flex items-start gap-3.5">
        <span className="relative mt-0.5 inline-flex h-5 w-5 shrink-0">
          <input
            aria-describedby={error ? errorId : undefined}
            aria-invalid={error ? true : undefined}
            className={cn(
              'peer h-5 w-5 cursor-pointer appearance-none rounded-[2px] border bg-cream transition-colors duration-300 checked:border-ink checked:bg-ink',
              'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bronze',
              error ? 'border-[#9a3b2a]' : 'border-ink/40',
            )}
            id={id}
            type="checkbox"
            {...registration}
          />
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 m-auto h-3 w-3 text-cream opacity-0 transition-opacity duration-300 peer-checked:opacity-100"
            fill="none"
            viewBox="0 0 12 12"
          >
            <path d="M2 6.5 4.8 9 10 3" stroke="currentColor" strokeWidth="1.6" />
          </svg>
        </span>
        <label className="text-sm leading-relaxed text-olive-grey" htmlFor={id}>
          {t.rich('consent', {
            link: (chunks: ReactNode) => (
              <Link
                className="text-ink underline decoration-bronze/60 underline-offset-4 transition-colors hover:decoration-ink"
                href="/privacy"
                target="_blank"
              >
                {chunks}
              </Link>
            ),
          })}
        </label>
      </div>
      <FieldError id={errorId} message={error} />
    </div>
  )
}

/** Hidden from humans and assistive tech; bots tend to fill every field. */
export function Honeypot({ registration }: { registration: UseFormRegisterReturn }) {
  const t = useTranslations('forms')
  return (
    <div aria-hidden="true" className="absolute -left-[10000px] h-px w-px overflow-hidden">
      <label>
        {t('website')}
        <input autoComplete="off" tabIndex={-1} type="text" {...registration} />
      </label>
    </div>
  )
}

export function SubmitButton({ children, pending }: { children: ReactNode; pending: boolean }) {
  const t = useTranslations('forms')
  return (
    <button
      aria-busy={pending || undefined}
      className="group inline-flex min-h-14 w-full items-center justify-center gap-4 rounded-[var(--radius)] bg-ink px-9 font-sans text-xs font-medium uppercase tracking-[0.18em] text-cream transition-colors duration-500 ease-[var(--ease-luxe)] hover:bg-bronze-deep disabled:cursor-wait disabled:opacity-80 sm:w-auto"
      disabled={pending}
      type="submit"
    >
      {pending ? (
        <>
          <span className="inline-flex gap-1" aria-hidden="true">
            {[0, 1, 2].map((i) => (
              <motion.span
                animate={{ opacity: [0.25, 1, 0.25] }}
                className="h-1 w-1 rounded-full bg-cream"
                key={i}
                transition={{ delay: i * 0.18, duration: 1.2, repeat: Infinity }}
              />
            ))}
          </span>
          {t('submitting')}
        </>
      ) : (
        <>
          {children}
          <svg
            aria-hidden="true"
            className="h-3 w-5 transition-transform duration-500 ease-[var(--ease-luxe)] group-hover:translate-x-1"
            fill="none"
            viewBox="0 0 20 12"
          >
            <path d="M0 6h18M13 1l5 5-5 5" stroke="currentColor" strokeWidth="1.2" />
          </svg>
        </>
      )}
    </button>
  )
}

export function FormAlert({ message }: { message?: string }) {
  const t = useTranslations('forms.errors')
  return (
    <AnimatePresence initial={false}>
      {message ? (
        <motion.div
          animate={{ opacity: 1, height: 'auto' }}
          className="overflow-hidden"
          exit={{ opacity: 0, height: 0 }}
          initial={{ opacity: 0, height: 0 }}
          role="alert"
          transition={{ duration: 0.5, ease: EASE_LUXE }}
        >
          <div className="border-l-2 border-[#9a3b2a] bg-cream px-5 py-4">
            <p className="font-sans text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-[#9a3b2a]">
              {t('title')}
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-ink">{message}</p>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
