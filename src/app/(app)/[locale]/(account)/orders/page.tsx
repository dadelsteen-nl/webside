import type { Order } from '@/payload-types'
import type { Metadata } from 'next'

import configPromise from '@payload-config'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'

import { OrderList } from '@/components/account/OrderList'
import { getPathname, redirect } from '@/i18n/navigation'
import { type Locale } from '@/i18n/routing'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = (await params) as { locale: Locale }
  const t = await getTranslations({ locale, namespace: 'checkout.meta' })
  return { robots: { index: false }, title: t('orders') }
}

export default async function OrdersPage({ params }: Props) {
  const { locale } = (await params) as { locale: Locale }
  setRequestLocale(locale)
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers: await getHeaders() })

  if (!user) {
    const back = getPathname({ href: '/orders', locale })
    return redirect({ href: { pathname: '/login', query: { reason: 'login', redirect: back } }, locale })
  }

  let orders: Order[] = []
  try {
    const res = await payload.find({
      collection: 'orders',
      limit: 0,
      overrideAccess: false,
      pagination: false,
      sort: '-createdAt',
      user,
      where: { customer: { equals: user.id } },
    })
    orders = res.docs
  } catch {
    // Render the empty state when the API is not reachable
  }

  const t = await getTranslations({ locale, namespace: 'checkout.account.orders' })

  return (
    <section>
      <h1 className="font-display text-3xl font-light text-ink">{t('title')}</h1>
      <div className="mt-8">
        <OrderList locale={locale} orders={orders} />
      </div>
    </section>
  )
}
