'use client'

import { useCart } from '@payloadcms/plugin-ecommerce/client/react'
import { useTranslations } from 'next-intl'
import { useEffect, useMemo, useState } from 'react'

import { Price } from '@/components/Price'
import { ArrowIcon, btn } from '@/components/shop/ui'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Link, usePathname } from '@/i18n/navigation'
import { cn } from '@/utilities/cn'

import { CartLine } from './CartLine'
import { OPEN_CART_EVENT } from './events'
import { OpenCartButton } from './OpenCart'

/** Slide-in cart drawer. Opens from the header button or via `openCart()` after add-to-cart. */
export function CartModal() {
  const t = useTranslations('shop.cart')
  const { cart } = useCart()
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  useEffect(() => {
    const open = () => setIsOpen(true)
    window.addEventListener(OPEN_CART_EVENT, open)
    return () => window.removeEventListener(OPEN_CART_EVENT, open)
  }, [])

  const items = cart?.items ?? []
  const totalQuantity = useMemo(
    () => items.reduce((sum, item) => sum + (item.quantity || 0), 0) || undefined,
    [items],
  )

  return (
    <Sheet onOpenChange={setIsOpen} open={isOpen}>
      <SheetTrigger asChild>
        <OpenCartButton label={t('label')} quantity={totalQuantity} />
      </SheetTrigger>

      <SheetContent className="w-full gap-0 border-ink/10 bg-sand p-0 sm:max-w-[28rem] [&>button:last-child]:top-7 [&>button:last-child]:right-6">
        <SheetHeader className="border-b border-ink/10 px-6 py-6 md:px-8">
          <SheetTitle className="font-display text-2xl font-light text-ink">
            {t('title')}
            {totalQuantity ? <span className="ml-2 font-sans text-sm text-olive-grey">({totalQuantity})</span> : null}
          </SheetTitle>
          <SheetDescription className="sr-only">{t('description')}</SheetDescription>
        </SheetHeader>

        {!items.length ? (
          <div className="flex grow flex-col items-center justify-center px-8 text-center">
            <p className="font-display text-2xl font-light text-ink">{t('emptyTitle')}</p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-olive-grey">{t('emptyText')}</p>
            <Link className={cn(btn.ink, 'mt-8')} href="/shop">
              {t('toShop')}
              <ArrowIcon />
            </Link>
          </div>
        ) : (
          <>
            <ul className="grow divide-y divide-ink/10 overflow-y-auto px-6 md:px-8">
              {items.map((item, i) => (
                <li key={item.id ?? i}>
                  <CartLine item={item} />
                </li>
              ))}
            </ul>

            <div className="border-t border-ink/10 bg-cream px-6 py-6 md:px-8">
              <dl className="space-y-2 text-sm">
                <div className="flex items-center justify-between text-olive-grey">
                  <dt>{t('delivery')}</dt>
                  <dd>{t('free')}</dd>
                </div>
                <div className="flex items-baseline justify-between">
                  <dt className="text-ink">
                    {t('subtotal')} <span className="text-xs text-olive-grey">{t('inclVat')}</span>
                  </dt>
                  <dd>
                    {typeof cart?.subtotal === 'number' ? (
                      <Price amount={cart.subtotal} className="font-display text-2xl font-light text-ink" />
                    ) : null}
                  </dd>
                </div>
              </dl>
              <Link className={cn(btn.ink, 'mt-6 w-full')} href="/checkout">
                {t('checkout')}
                <ArrowIcon />
              </Link>
              <Link className={cn(btn.link, 'mt-4 flex w-full justify-center')} href="/cart">
                {t('viewCart')}
              </Link>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
