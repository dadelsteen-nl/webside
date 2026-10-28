'use client'

import { useCart } from '@payloadcms/plugin-ecommerce/client/react'
import { useTranslations } from 'next-intl'

import { Price } from '@/components/Price'
import { ArrowIcon, btn, Eyebrow } from '@/components/shop/ui'
import { Link } from '@/i18n/navigation'
import { cn } from '@/utilities/cn'

import { CartLine } from './CartLine'

/** Full cart page: lines on the left, sticky summary on the right. */
export function CartPageView() {
  const t = useTranslations('shop.cart')
  const { cart, isLoading } = useCart()
  const items = cart?.items ?? []

  return (
    <div className="container pb-24 pt-12 md:pb-32 md:pt-20">
      <Eyebrow>{t('page.eyebrow')}</Eyebrow>
      <h1 className="mt-6 font-display text-5xl font-light leading-[1.02] text-ink md:text-7xl">{t('page.title')}</h1>

      {!items.length ? (
        <div className="mt-16 border-t border-ink/10 pt-16 text-center md:mt-20">
          <p className="font-display text-3xl font-light text-ink">
            {isLoading && !cart ? '…' : t('emptyTitle')}
          </p>
          <p className="mx-auto mt-4 max-w-sm text-olive-grey">{t('emptyText')}</p>
          <Link className={cn(btn.ink, 'mt-10')} href="/shop">
            {t('toShop')}
            <ArrowIcon />
          </Link>
        </div>
      ) : (
        <div className="mt-12 grid gap-12 md:mt-16 lg:grid-cols-12 lg:gap-16">
          <ul className="divide-y divide-ink/10 border-y border-ink/10 lg:col-span-7">
            {items.map((item, i) => (
              <li key={item.id ?? i}>
                <CartLine item={item} size="md" />
              </li>
            ))}
          </ul>

          <aside className="lg:col-span-5">
            <div className="border border-ink/10 bg-cream p-8 lg:sticky lg:top-28">
              <h2 className="font-display text-2xl font-light text-ink">{t('page.summary')}</h2>
              <dl className="mt-6 space-y-3 border-t border-ink/10 pt-6 text-sm">
                <div className="flex justify-between text-olive-grey">
                  <dt>{t('delivery')}</dt>
                  <dd>{t('free')}</dd>
                </div>
                <div className="flex items-baseline justify-between border-t border-ink/10 pt-4">
                  <dt className="text-ink">
                    {t('subtotal')} <span className="text-xs text-olive-grey">{t('inclVat')}</span>
                  </dt>
                  <dd>
                    {typeof cart?.subtotal === 'number' ? (
                      <Price amount={cart.subtotal} className="font-display text-3xl font-light text-ink" />
                    ) : null}
                  </dd>
                </div>
              </dl>
              <Link className={cn(btn.ink, 'mt-8 w-full')} href="/checkout">
                {t('checkout')}
                <ArrowIcon />
              </Link>
              <p className="mt-4 text-center text-xs text-olive-grey">{t('page.secure')}</p>
              <Link className={cn(btn.link, 'mt-6 flex justify-center')} href="/shop">
                {t('page.continue')}
              </Link>
            </div>
          </aside>
        </div>
      )}
    </div>
  )
}
