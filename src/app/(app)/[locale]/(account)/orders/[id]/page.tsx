import type { Order } from '@/payload-types'
import type { Metadata } from 'next'

import configPromise from '@payload-config'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { headers as getHeaders } from 'next/headers.js'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'

import { lineImage, variantLabel } from '@/components/Cart/lineUtils'
import { Media } from '@/components/Media'
import { formatPrice, intlLocale } from '@/components/Price/format'
import { ArrowIcon, btn, Eyebrow } from '@/components/shop/ui'
import { Link } from '@/i18n/navigation'
import { type Locale } from '@/i18n/routing'
import { cn } from '@/utilities/cn'

export const dynamic = 'force-dynamic'

type PageProps = {
  params: Promise<{ id: string; locale: string }>
  searchParams: Promise<{ email?: string; accessToken?: string }>
}

export default async function OrderPage({ params, searchParams }: PageProps) {
  const { id, locale } = (await params) as { id: string; locale: Locale }
  setRequestLocale(locale)

  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })
  const { email = '', accessToken = '' } = await searchParams

  let order: Order | null = null

  try {
    const {
      docs: [orderResult],
    } = await payload.find({
      collection: 'orders',
      user,
      overrideAccess: !user,
      depth: 2,
      where: {
        and: [
          { id: { equals: id } },
          ...(user
            ? [{ customer: { equals: user.id } }]
            : [
                { accessToken: { equals: accessToken } },
                ...(email ? [{ customerEmail: { equals: email } }] : []),
              ]),
        ],
      },
      select: {
        amount: true,
        currency: true,
        items: true,
        customerEmail: true,
        customer: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        shippingAddress: true,
      },
    })

    const canAccessAsGuest =
      !user && email && accessToken && orderResult?.customerEmail && orderResult.customerEmail === email
    const canAccessAsUser =
      user &&
      orderResult?.customer &&
      (typeof orderResult.customer === 'object' ? orderResult.customer.id : orderResult.customer) === user.id

    if (orderResult && (canAccessAsGuest || canAccessAsUser)) order = orderResult
  } catch (error) {
    console.error(error)
  }

  if (!order) notFound()

  const t = await getTranslations({ locale, namespace: 'checkout.order' })
  const address = order.shippingAddress as Record<string, string | null | undefined> | null | undefined
  const date = new Intl.DateTimeFormat(intlLocale(locale), { dateStyle: 'long' }).format(new Date(order.createdAt))
  const status = order.status ?? 'processing'

  return (
    <div className="pb-24 pt-4 md:pb-32">
      <Eyebrow>{t('eyebrow', { id: order.id })}</Eyebrow>
      <h1 className="mt-6 font-display text-5xl font-light leading-[1.02] text-ink md:text-6xl">{t('thanksTitle')}</h1>
      {order.customerEmail ? (
        <p className="mt-5 max-w-xl text-olive-grey">{t('thanksText', { email: order.customerEmail })}</p>
      ) : null}

      <div className="mt-14 grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <h2 className="font-display text-2xl font-light text-ink">{t('items')}</h2>
          <ul className="mt-6 divide-y divide-ink/10 border-y border-ink/10">
            {order.items?.map((item, index) => {
              const product = item.product && typeof item.product === 'object' ? item.product : null
              if (!product) {
                return (
                  <li className="py-5 text-sm text-olive-grey" key={item.id ?? index}>
                    {t('unavailable')}
                  </li>
                )
              }
              const variant = item.variant && typeof item.variant === 'object' ? item.variant : undefined
              const image = lineImage(product, variant)
              const unit = variant?.priceInEUR ?? product.priceInEUR ?? 0
              return (
                <li className="flex gap-5 py-5" key={item.id ?? index}>
                  <div className="relative h-24 w-20 shrink-0 overflow-hidden bg-stone">
                    {image ? (
                      <Media className="absolute inset-0" fill imgClassName="object-cover" resource={image} size="96px" />
                    ) : null}
                  </div>
                  <div className="min-w-0 grow">
                    <p className="font-display text-xl font-light text-ink">{product.title}</p>
                    {variant ? <p className="mt-1 text-xs text-olive-grey">{variantLabel(variant)}</p> : null}
                    <p className="mt-1 text-xs text-olive-grey">{t('quantity', { count: item.quantity })}</p>
                  </div>
                  <p className="shrink-0 text-sm text-ink">{formatPrice(unit * item.quantity, locale)}</p>
                </li>
              )
            })}
          </ul>

          <div className="mt-14 bg-ink p-8 text-cream md:p-10">
            <h2 className="font-display text-2xl font-light">{t('nextSteps.title')}</h2>
            <ol className="mt-6 space-y-5">
              {(['step1', 'step2', 'step3'] as const).map((key, i) => (
                <li className="flex gap-4 text-sm leading-relaxed text-cream/75" key={key}>
                  <span className="font-display text-bronze">{String(i + 1).padStart(2, '0')}</span>
                  {t(`nextSteps.${key}`)}
                </li>
              ))}
            </ol>
          </div>
        </div>

        <aside className="lg:col-span-5">
          <div className="border border-ink/10 bg-cream p-8">
            <h2 className="font-display text-2xl font-light text-ink">{t('detailTitle')}</h2>
            <dl className="mt-6 space-y-4 border-t border-ink/10 pt-6 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-olive-grey">{t('date')}</dt>
                <dd className="text-ink">
                  <time dateTime={order.createdAt}>{date}</time>
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-olive-grey">{t('status')}</dt>
                <dd className="text-ink">{t(`statuses.${status}`)}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 border-t border-ink/10 pt-4">
                <dt className="text-ink">{t('total')}</dt>
                <dd className="font-display text-3xl font-light text-ink">
                  {typeof order.amount === 'number' ? formatPrice(order.amount, locale) : null}
                </dd>
              </div>
            </dl>

            {address?.addressLine1 ? (
              <div className="mt-8 border-t border-ink/10 pt-6">
                <h3 className="font-sans text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-olive-grey">
                  {t('shippingAddress')}
                </h3>
                <address className="mt-3 text-sm not-italic leading-relaxed text-ink">
                  {[
                    [address.firstName, address.lastName].filter(Boolean).join(' '),
                    address.company,
                    address.addressLine1,
                    address.addressLine2,
                    [address.postalCode, address.city].filter(Boolean).join(' '),
                    address.country,
                  ]
                    .filter(Boolean)
                    .map((line) => (
                      <span className="block" key={line}>
                        {line}
                      </span>
                    ))}
                </address>
              </div>
            ) : null}

            <div className="mt-8 flex flex-col gap-3">
              <Link className={cn(btn.ink, 'w-full')} href="/shop">
                {t('toShop')}
                <ArrowIcon />
              </Link>
              {user ? (
                <Link className={cn(btn.outline, 'w-full')} href="/orders">
                  {t('allOrders')}
                </Link>
              ) : null}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id, locale } = (await params) as { id: string; locale: Locale }
  const t = await getTranslations({ locale, namespace: 'checkout.meta' })
  return { robots: { index: false }, title: t('order', { id }) }
}
