import type { Metadata } from 'next'

import { getTranslations, setRequestLocale } from 'next-intl/server'

import { CategoryTabs, type ShopFilter } from '@/components/CategoryTabs'
import { FlagshipCard } from '@/components/shop/FlagshipCard'
import { ProductCard } from '@/components/shop/ProductCard'
import { Eyebrow, emRich } from '@/components/shop/ui'
import { type Locale } from '@/i18n/routing'
import { getProducts } from '@/lib/data'
import { buildAlternates } from '@/lib/seo'

type Props = {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ type?: string | string[] }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = (await params) as { locale: Locale }
  const t = await getTranslations({ locale, namespace: 'shop.meta' })
  return {
    title: t('title'),
    description: t('description'),
    alternates: buildAlternates('/shop', undefined, locale),
    openGraph: { title: t('title'), description: t('description') },
  }
}

export default async function ShopPage({ params, searchParams }: Props) {
  const { locale } = (await params) as { locale: Locale }
  setRequestLocale(locale)

  const { type } = await searchParams
  const filter: ShopFilter = type === 'device' || type === 'accessory' ? type : 'all'

  const [t, products] = await Promise.all([
    getTranslations({ locale, namespace: 'shop.shop' }),
    getProducts({ locale }),
  ])

  const devices = products.filter((p) => p.productType === 'device')
  const accessories = products.filter((p) => p.productType === 'accessory')
  const [flagship, ...otherDevices] = devices
  const showDevices = filter !== 'accessory'
  const showAccessories = filter !== 'device'
  const visibleCount =
    (showDevices ? devices.length : 0) + (showAccessories ? accessories.length : 0)

  return (
    <div className="pb-24 md:pb-32">
      <header className="container pt-16 pb-12 md:pt-24 md:pb-16">
        <Eyebrow>{t('eyebrow')}</Eyebrow>
        <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:items-end">
          <h1 className="font-display text-5xl font-light leading-[1.02] text-ink md:text-7xl lg:col-span-7">
            {t.rich('title', emRich)}
          </h1>
          <p className="max-w-md text-base leading-relaxed text-olive-grey lg:col-span-4 lg:col-start-9">
            {t('intro')}
          </p>
        </div>
      </header>

      <div className="container">
        <div className="flex items-end justify-between gap-6">
          <div className="min-w-0 grow">
            <CategoryTabs active={filter} />
          </div>
          <p className="hidden shrink-0 border-b border-ink/10 py-4 font-sans text-[0.6875rem] uppercase tracking-[0.18em] text-olive-grey sm:block">
            {t('count', { count: visibleCount })}
          </p>
        </div>

        {visibleCount === 0 ? (
          <p className="py-24 text-center text-olive-grey">{t('empty')}</p>
        ) : null}

        {showDevices && flagship ? (
          <section aria-label={t('devicesTitle')} className="mt-12 md:mt-16">
            <FlagshipCard product={flagship} />
            {otherDevices.length ? (
              <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {otherDevices.map((product) => (
                  <li key={product.id}>
                    <ProductCard product={product} />
                  </li>
                ))}
              </ul>
            ) : null}
          </section>
        ) : null}

        {showAccessories && accessories.length ? (
          <section aria-labelledby="shop-accessories" className="mt-20 md:mt-28">
            <div className="mb-10 grid gap-4 md:grid-cols-12 md:items-end">
              <h2
                className="font-display text-4xl font-light text-ink md:col-span-6 md:text-5xl"
                id="shop-accessories"
              >
                {t('accessoriesTitle')}
              </h2>
              <p className="max-w-md text-sm leading-relaxed text-olive-grey md:col-span-5 md:col-start-8">
                {t('accessoriesIntro')}
              </p>
            </div>
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-6">
              {accessories.map((product, i) => {
                // Fill every row on lg: leftover cards take half a row each instead of leaving gaps
                const rest = accessories.length % 3
                const wide = (rest === 2 && i < 2) || (rest === 1 && accessories.length >= 4 && i < 4)
                return (
                  <li className={wide ? 'lg:col-span-3' : 'lg:col-span-2'} key={product.id}>
                    <ProductCard product={product} wide={wide} />
                  </li>
                )
              })}
            </ul>
          </section>
        ) : null}
      </div>
    </div>
  )
}
