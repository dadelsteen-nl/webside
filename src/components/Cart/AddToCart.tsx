'use client'

import type { Product, Variant } from '@/payload-types'

import { useCart } from '@payloadcms/plugin-ecommerce/client/react'
import { useTranslations } from 'next-intl'
import React, { useCallback, useMemo, useState } from 'react'
import { toast } from 'sonner'

import { btn } from '@/components/shop/ui'
import { cn } from '@/utilities/cn'

import { openCart } from './events'

type Props = {
  product: Product
  variant?: Variant
  quantity?: number
  className?: string
}

/** Adds the product (and selected variant) to the cart, then opens the cart drawer. */
export function AddToCart({ className, product, quantity = 1, variant }: Props) {
  const t = useTranslations('shop.product')
  const { addItem, cart, isLoading } = useCart()
  const [pending, setPending] = useState(false)

  const stock = product.enableVariants ? (variant?.inventory ?? 0) : (product.inventory ?? 0)

  const inCart = useMemo(() => {
    const existing = cart?.items?.find((item) => {
      const productID = typeof item.product === 'object' ? item.product?.id : item.product
      const variantID =
        item.variant && typeof item.variant === 'object' ? item.variant.id : item.variant
      return productID === product.id && (!product.enableVariants || variantID === variant?.id)
    })
    return existing?.quantity || 0
  }, [cart?.items, product.enableVariants, product.id, variant?.id])

  const disabled =
    (product.enableVariants && !variant) || stock <= 0 || inCart + quantity > stock

  const onClick = useCallback(async () => {
    setPending(true)
    try {
      await addItem({ product: product.id, ...(variant ? { variant: variant.id } : {}) }, quantity)
      toast.success(t('added'))
      openCart()
    } catch (err) {
      console.error(err)
      toast.error(t('addError'))
    } finally {
      setPending(false)
    }
  }, [addItem, product.id, quantity, t, variant])

  const label =
    product.enableVariants && !variant
      ? t('selectOption')
      : stock <= 0
        ? t('outOfStock')
        : pending
          ? t('adding')
          : t('addToCart')

  return (
    <button
      className={cn(btn.ink, 'w-full', className)}
      disabled={disabled || isLoading || pending}
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  )
}
