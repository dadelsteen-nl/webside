import type { Order } from '@/payload-types'

import { getTranslations } from 'next-intl/server'

import { formatPrice, intlLocale } from '@/components/Price/format'
import { ArrowIcon } from '@/components/shop/ui'
import { Link } from '@/i18n/navigation'

/** Order rows for the account pages: number, date, item count, status and total. */
export async function OrderList({ locale, orders }: { locale: string; orders: Order[] }) {
  const t = await getTranslations({ locale, namespace: 'checkout' })
  const dateFmt = new Intl.DateTimeFormat(intlLocale(locale), { dateStyle: 'medium' })

  if (!orders.length) {
    return <p className="border-y border-ink/10 py-8 text-sm text-olive-grey">{t('account.orders.none')}</p>
  }

  return (
    <ul className="divide-y divide-ink/10 border-y border-ink/10">
      {orders.map((order) => {
        const count = (order.items ?? []).reduce((sum, item) => sum + (item.quantity || 0), 0)
        const status = order.status ?? 'processing'
        return (
          <li key={order.id}>
            <Link
              className="group grid grid-cols-2 items-center gap-x-6 gap-y-2 py-5 transition-colors hover:bg-cream/60 sm:grid-cols-[1fr_auto_auto_auto] sm:px-2"
              href={{ params: { id: String(order.id) }, pathname: '/orders/[id]' }}
            >
              <span>
                <span className="block font-display text-xl font-light text-ink">#{order.id}</span>
                <span className="text-xs text-olive-grey">
                  {dateFmt.format(new Date(order.createdAt))} · {t('account.orders.items', { count })}
                </span>
              </span>
              <span className="justify-self-end sm:justify-self-auto">
                <span className="inline-flex border border-ink/15 px-3 py-1 font-sans text-[0.625rem] uppercase tracking-[0.18em] text-ink">
                  {t(`order.statuses.${status}`)}
                </span>
              </span>
              <span className="text-sm text-ink">
                {typeof order.amount === 'number' ? formatPrice(order.amount, locale) : null}
              </span>
              <span className="inline-flex items-center justify-self-end gap-2 font-sans text-[0.625rem] uppercase tracking-[0.2em] text-olive-grey group-hover:text-ink">
                {t('account.orders.view')}
                <ArrowIcon className="text-bronze" />
              </span>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
