import type { Order } from '@/payload-types'
import type { Metadata } from 'next'

import configPromise from '@payload-config'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { headers as getHeaders } from 'next/headers.js'
import { getPayload } from 'payload'

import { OrderList } from '@/components/account/OrderList'
import { AccountForm } from '@/components/forms/AccountForm'
import { btn } from '@/components/shop/ui'
import { getPathname, Link, redirect } from '@/i18n/navigation'
import { type Locale } from '@/i18n/routing'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = (await params) as { locale: Locale }
  const t = await getTranslations({ locale, namespace: 'checkout.meta' })
  return { robots: { index: false }, title: t('account') }
}

export default async function AccountPage({ params }: Props) {
  const { locale } = (await params) as { locale: Locale }
  setRequestLocale(locale)
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers: await getHeaders() })

  if (!user) {
    const back = getPathname({ href: '/account', locale })
    return redirect({ href: { pathname: '/login', query: { reason: 'login', redirect: back } }, locale })
  }

  let orders: Order[] = []
  try {
    const res = await payload.find({
      collection: 'orders',
      limit: 3,
      overrideAccess: false,
      pagination: false,
      sort: '-createdAt',
      user,
      where: { customer: { equals: user.id } },
    })
    orders = res.docs
  } catch {
    // Render without orders when the API is not reachable (e.g. during build)
  }

  const t = await getTranslations({ locale, namespace: 'checkout.account' })

  return (
    <div className="space-y-16">
      <section aria-labelledby="account-settings">
        <h1 className="font-display text-3xl font-light text-ink" id="account-settings">
          {t('settings.title')}
        </h1>
        <p className="mt-3 text-sm text-olive-grey">{t('settings.intro')}</p>
        <div className="mt-8 max-w-2xl border border-ink/10 bg-cream p-6 md:p-8">
          <AccountForm />
        </div>
      </section>

      <section aria-labelledby="account-orders">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-display text-3xl font-light text-ink" id="account-orders">
            {t('orders.recent')}
          </h2>
          {orders.length ? (
            <Link className={btn.link} href="/orders">
              {t('orders.viewAll')}
            </Link>
          ) : null}
        </div>
        <div className="mt-8">
          <OrderList locale={locale} orders={orders} />
        </div>
      </section>
    </div>
  )
}
