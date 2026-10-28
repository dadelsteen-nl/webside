'use client'

import type { CartItem } from '@/components/Cart'

import { useCart } from '@payloadcms/plugin-ecommerce/client/react'
import { useTranslations } from 'next-intl'
import React from 'react'

import { Media } from '@/components/Media'
import { Price } from '@/components/Price'
import { QuantityStepper } from '@/components/product/QuantityStepper'
import { Link } from '@/i18n/navigation'
import { cn } from '@/utilities/cn'

import { lineImage, variantLabel } from './lineUtils'

export { lineImage, variantLabel } from './lineUtils'

type Props = {
  item: CartItem
  size?: 'sm' | 'md'
}

/** One cart line: image, title, options, stepper, line total and remove. */
export function CartLine({ item, size = 'sm' }: Props) {
  const t = useTranslations('shop.cart')
  const { decrementItem, incrementItem, isLoading, removeItem } = useCart()

  const product = item.product
  if (!product || typeof product !== 'object' || !product.slug) return null
  const variant = item.variant && typeof item.variant === 'object' ? item.variant : undefined

  const image = lineImage(product, variant)
  const unit = variant?.priceInEUR ?? product.priceInEUR
  const stock = variant ? variant.inventory : product.inventory
  const quantity = item.quantity || 0
  const itemID = item.id

  return (
    <div className={cn('flex gap-5', size === 'md' ? 'py-8' : 'py-6')}>
      <Link
        className={cn(
          'relative shrink-0 overflow-hidden bg-stone',
          size === 'md' ? 'h-36 w-28 sm:h-44 sm:w-36' : 'h-28 w-22',
        )}
        href={{ pathname: '/products/[slug]', params: { slug: product.slug } }}
        tabIndex={-1}
      >
        {image ? (
          <Media className="absolute inset-0" fill imgClassName="object-cover" resource={image} size="160px" />
        ) : null}
      </Link>

      <div className="flex min-w-0 grow flex-col">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <Link
              className={cn(
                'font-display font-light leading-tight text-ink transition-colors hover:text-bronze-deep',
                size === 'md' ? 'text-2xl' : 'text-lg',
              )}
              href={{ pathname: '/products/[slug]', params: { slug: product.slug } }}
            >
              {product.title}
            </Link>
            {variant ? (
              <p className="mt-1 text-xs uppercase tracking-[0.14em] text-olive-grey">
                {variantLabel(variant)}
              </p>
            ) : null}
            {typeof unit === 'number' && quantity > 1 ? (
              <Price
                amount={unit}
                as="p"
                className="mt-1 text-xs text-olive-grey"
              />
            ) : null}
          </div>
          {typeof unit === 'number' ? (
            <Price
              amount={unit * quantity}
              className={cn('shrink-0 font-sans text-ink', size === 'md' ? 'text-base' : 'text-sm')}
            />
          ) : null}
        </div>

        <div className="mt-auto flex items-center justify-between gap-4 pt-4">
          <QuantityStepper
            disabled={isLoading || !itemID}
            labels={{ decrease: t('decrease'), increase: t('increase'), quantity: t('quantity') }}
            max={typeof stock === 'number' ? stock : undefined}
            onDecrease={() => itemID && void decrementItem(itemID)}
            onIncrease={() => itemID && void incrementItem(itemID)}
            size="sm"
            value={quantity}
          />
          <button
            aria-label={t('removeItem', { title: product.title })}
            className="font-sans text-[0.625rem] uppercase tracking-[0.2em] text-olive-grey underline-offset-4 transition-colors hover:text-ink hover:underline disabled:opacity-40"
            disabled={isLoading || !itemID}
            onClick={() => itemID && void removeItem(itemID)}
            type="button"
          >
            {t('remove')}
          </button>
        </div>
      </div>
    </div>
  )
}
