'use client'

import { forwardRef, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes } from 'react'

import { fieldClass, labelClass } from '@/components/shop/ui'
import { cn } from '@/utilities/cn'

type Base = { label: string; error?: string; hint?: string; className?: string }

/** Branded text input with label, hint and error, compatible with react-hook-form `register`. */
export const TextField = forwardRef<HTMLInputElement, Base & InputHTMLAttributes<HTMLInputElement>>(
  function TextField({ className, error, hint, id, label, ...rest }, ref) {
    return (
      <div className={className}>
        <label className={labelClass} htmlFor={id}>
          {label}
        </label>
        <input
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
          aria-invalid={error ? true : undefined}
          className={fieldClass}
          id={id}
          ref={ref}
          {...rest}
        />
        <FieldNote error={error} hint={hint} id={id} />
      </div>
    )
  },
)

export const SelectField = forwardRef<
  HTMLSelectElement,
  Base & SelectHTMLAttributes<HTMLSelectElement> & { children: ReactNode }
>(function SelectField({ children, className, error, hint, id, label, ...rest }, ref) {
  return (
    <div className={className}>
      <label className={labelClass} htmlFor={id}>
        {label}
      </label>
      <select
        aria-invalid={error ? true : undefined}
        className={fieldClass}
        id={id}
        ref={ref}
        {...rest}
      >
        {children}
      </select>
      <FieldNote error={error} hint={hint} id={id} />
    </div>
  )
})

function FieldNote({ error, hint, id }: { error?: string; hint?: string; id?: string }) {
  if (error) {
    return (
      <p className="mt-1.5 text-xs text-error" id={`${id}-error`}>
        {error}
      </p>
    )
  }
  if (hint) {
    return (
      <p className="mt-1.5 text-xs text-olive-grey" id={`${id}-hint`}>
        {hint}
      </p>
    )
  }
  return null
}

/** Inline notice for form-level success / error messages. */
export function Notice({ children, tone = 'info' }: { children: ReactNode; tone?: 'info' | 'error' | 'success' }) {
  return (
    <p
      className={cn(
        'border-l-2 bg-cream px-4 py-3 text-sm text-ink',
        tone === 'error' ? 'border-error' : tone === 'success' ? 'border-success' : 'border-bronze',
      )}
      role={tone === 'error' ? 'alert' : 'status'}
    >
      {children}
    </p>
  )
}
