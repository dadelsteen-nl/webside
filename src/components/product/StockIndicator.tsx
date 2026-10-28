'use client'

import { useTranslations } from 'next-intl'

import { cn } from '@/utilities/cn'

/** Calm stock line: in stock / low stock / sold out. */
export function StockIndicator({ stock }: { stock: number | null | undefined }) {
  const t = useTranslations('shop.product')
  const qty = stock || 0
  const label = qty <= 0 ? t('outOfStock') : qty < 5 ? t('lowStock', { count: qty }) : t('inStock')
  return (
    <p className="flex items-center gap-2.5 text-sm text-olive-grey">
      <span
        aria-hidden="true"
        className={cn('size-1.5 rounded-full', qty <= 0 ? 'bg-error' : qty < 5 ? 'bg-warning' : 'bg-success')}
      />
      {label}
    </p>
  )
}
