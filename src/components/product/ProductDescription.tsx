'use client'

import type { Product, Variant } from '@/payload-types'

import { Check } from 'lucide-react'
import { useTranslations } from 'next-intl'
import React, { useEffect, useMemo, useState } from 'react'

import { AddToCart } from '@/components/Cart/AddToCart'
import { Price } from '@/components/Price'
import { btn } from '@/components/shop/ui'
import { Link } from '@/i18n/navigation'

import { QuantityStepper } from './QuantityStepper'
import { StockIndicator } from './StockIndicator'
import { VariantSelector, findVariant } from './VariantSelector'

/** Right column of the product page: badges, title, price, options, quantity, CTAs, USPs. */
export function ProductDescription({ product }: { product: Product }) {
  const t = useTranslations('shop.product')

  const variants = useMemo<Variant[]>(
    () =>
      (product.variants?.docs || []).filter(
        (v): v is Variant => Boolean(v) && typeof v === 'object',
      ),
    [product.variants?.docs],
  )
  const hasVariants = Boolean(product.enableVariants && variants.length)

  const [selection, setSelection] = useState<Record<string, string>>({})
  const [quantity, setQuantity] = useState(1)

  // Restore a ?variant= deep link once on mount.
  useEffect(() => {
    if (!hasVariants) return
    const id = new URLSearchParams(window.location.search).get('variant')
    const match = variants.find((v) => String(v.id) === id)
    if (!match) return
    const next: Record<string, string> = {}
    for (const option of match.options || []) {
      if (typeof option === 'object' && option) {
        const typeID = typeof option.variantType === 'object' ? option.variantType?.id : option.variantType
        if (typeID !== undefined && typeID !== null) next[String(typeID)] = String(option.id)
      }
    }
    setSelection(next)
  }, [hasVariants, variants])

  const variant = hasVariants ? findVariant(variants, selection) : undefined
  const stock = hasVariants ? (variant ? variant.inventory : undefined) : product.inventory

  useEffect(() => {
    if (!hasVariants) return
    const url = new URL(window.location.href)
    if (variant) url.searchParams.set('variant', String(variant.id))
    else url.searchParams.delete('variant')
    window.history.replaceState(null, '', url.toString())
  }, [hasVariants, variant])

  useEffect(() => {
    if (typeof stock === 'number' && stock > 0 && quantity > stock) setQuantity(stock)
  }, [quantity, stock])

  const prices = variants.map((v) => v.priceInEUR).filter((p): p is number => typeof p === 'number')

  const usps = [t('usps.delivery'), t('usps.warranty'), t('usps.returns'), t('usps.payment')]

  return (
    <div className="flex flex-col gap-8">
      {product.badges?.length ? (
        <ul className="flex flex-wrap gap-2">
          {product.badges.map((badge, i) => (
            <li
              className="border border-bronze/50 px-3 py-1.5 font-sans text-[0.625rem] uppercase tracking-[0.2em] text-bronze-deep"
              key={badge.id || i}
            >
              {badge.text}
            </li>
          ))}
        </ul>
      ) : null}

      <div className="flex flex-col gap-5">
        <h1 className="font-display text-5xl font-light leading-[1.02] text-ink md:text-6xl">
          {product.title}
        </h1>
        {product.shortDescription ? (
          <p className="max-w-lg text-base leading-relaxed text-olive-grey">
            {product.shortDescription}
          </p>
        ) : null}
      </div>

      <div className="flex items-baseline gap-3 border-y border-ink/10 py-6">
        {hasVariants && variant && typeof variant.priceInEUR === 'number' ? (
          <Price amount={variant.priceInEUR} className="font-display text-4xl font-light text-ink" />
        ) : hasVariants && prices.length ? (
          <Price
            className="font-display text-4xl font-light text-ink"
            highestAmount={Math.max(...prices)}
            lowestAmount={Math.min(...prices)}
          />
        ) : typeof product.priceInEUR === 'number' ? (
          <Price amount={product.priceInEUR} className="font-display text-4xl font-light text-ink" />
        ) : null}
        <span className="font-sans text-[0.6875rem] uppercase tracking-[0.16em] text-olive-grey">
          {t('inclVat')}
        </span>
      </div>

      {hasVariants ? (
        <VariantSelector
          onSelect={(typeID, optionID) => setSelection((s) => ({ ...s, [typeID]: optionID }))}
          product={product}
          selection={selection}
          variants={variants}
        />
      ) : null}

      <div className="flex flex-col gap-4">
        {!hasVariants || variant ? <StockIndicator stock={stock} /> : null}
        <div className="flex gap-3">
          <QuantityStepper
            disabled={typeof stock === 'number' && stock <= 0}
            labels={{ decrease: t('decrease'), increase: t('increase'), quantity: t('quantity') }}
            max={typeof stock === 'number' ? Math.max(stock, 1) : undefined}
            onDecrease={() => setQuantity((q) => Math.max(1, q - 1))}
            onIncrease={() => setQuantity((q) => q + 1)}
            value={quantity}
          />
          <AddToCart className="grow" product={product} quantity={quantity} variant={variant} />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Link className={btn.outlineBronze} href="/demo">
            {t('bookDemo')}
          </Link>
          {product.b2bAvailable ? (
            <Link className={btn.outline} href="/business">
              {t('businessQuote')}
            </Link>
          ) : null}
        </div>
      </div>

      <ul className="flex flex-col divide-y divide-ink/10 border-t border-ink/10">
        {usps.map((usp) => (
          <li className="flex items-start gap-3 py-3.5 text-sm text-ink" key={usp}>
            <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-bronze" strokeWidth={1.25} />
            {usp}
          </li>
        ))}
      </ul>
    </div>
  )
}
