'use client'

import { useLocale } from 'next-intl'
import React from 'react'

import { formatPrice } from './format'

export { formatPrice, intlLocale } from './format'

type BaseProps = {
  className?: string
  as?: 'span' | 'p'
}

type PriceFixed = {
  amount: number
  currencyCode?: string
  highestAmount?: never
  lowestAmount?: never
}

type PriceRange = {
  amount?: never
  currencyCode?: string
  highestAmount: number
  lowestAmount: number
}

type Props = BaseProps & (PriceFixed | PriceRange)

/** Formats a price in cents for the active locale, e.g. "€ 5.499,00" (nl) / "€5,499.00" (en). */
export const Price = ({
  amount,
  className,
  highestAmount,
  lowestAmount,
  currencyCode = 'EUR',
  as = 'p',
}: Props) => {
  const locale = useLocale()
  const Element = as

  let text: string | null = null
  if (typeof amount === 'number') {
    text = formatPrice(amount, locale, currencyCode)
  } else if (highestAmount && highestAmount !== lowestAmount) {
    text = `${formatPrice(lowestAmount, locale, currencyCode)} – ${formatPrice(highestAmount, locale, currencyCode)}`
  } else if (lowestAmount) {
    text = formatPrice(lowestAmount, locale, currencyCode)
  }

  if (text === null) return null

  return (
    <Element className={className} suppressHydrationWarning>
      {text}
    </Element>
  )
}
