'use client'

import { Minus, Plus } from 'lucide-react'
import React from 'react'

import { cn } from '@/utilities/cn'

type Props = {
  value: number
  onDecrease: () => void
  onIncrease: () => void
  min?: number
  max?: number
  disabled?: boolean
  labels: { decrease: string; increase: string; quantity: string }
  size?: 'sm' | 'md'
  className?: string
}

/** Hairline − n + stepper used on product page, cart drawer and cart page. */
export function QuantityStepper({
  className,
  disabled,
  labels,
  max,
  min = 1,
  onDecrease,
  onIncrease,
  size = 'md',
  value,
}: Props) {
  const h = size === 'sm' ? 'h-9' : 'h-12'
  const w = size === 'sm' ? 'w-9' : 'w-12'
  return (
    <div
      aria-label={labels.quantity}
      className={cn('inline-flex items-center border border-ink/15 bg-cream', h, className)}
      role="group"
    >
      <button
        aria-label={labels.decrease}
        className={cn(
          'flex h-full items-center justify-center text-ink transition-colors duration-300 hover:bg-stone/60 disabled:cursor-not-allowed disabled:opacity-35',
          w,
        )}
        disabled={disabled || value <= min}
        onClick={onDecrease}
        type="button"
      >
        <Minus className="size-3.5" strokeWidth={1.25} />
      </button>
      <span
        aria-live="polite"
        className={cn('min-w-8 text-center font-sans tabular-nums text-ink', size === 'sm' ? 'text-xs' : 'text-sm')}
      >
        {value}
      </span>
      <button
        aria-label={labels.increase}
        className={cn(
          'flex h-full items-center justify-center text-ink transition-colors duration-300 hover:bg-stone/60 disabled:cursor-not-allowed disabled:opacity-35',
          w,
        )}
        disabled={disabled || (typeof max === 'number' && value >= max)}
        onClick={onIncrease}
        type="button"
      >
        <Plus className="size-3.5" strokeWidth={1.25} />
      </button>
    </div>
  )
}
