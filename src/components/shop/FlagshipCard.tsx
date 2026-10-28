import { useLocale, useTranslations } from 'next-intl'

import type { Product } from '@/payload-types'

import { Media } from '@/components/Media'
import { formatPrice } from '@/components/Price/format'
import { Link } from '@/i18n/navigation'

import { ArrowIcon, Eyebrow, btn } from './ui'
import { getProductImage, getProductPrice, mediaFit } from './productUtils'

/** Large editorial feature card for the flagship device. */
export function FlagshipCard({ product }: { product: Product }) {
  const locale = useLocale()
  const t = useTranslations('shop.shop')
  const image = getProductImage(product)
  const price = getProductPrice(product)
  const href = { pathname: '/products/[slug]' as const, params: { slug: product.slug } }

  return (
    <article className="grid overflow-hidden bg-cream lg:grid-cols-12">
      <Link
        aria-label={product.title}
        className="group relative block aspect-[4/5] overflow-hidden bg-stone sm:aspect-[5/4] lg:col-span-7 lg:aspect-auto lg:min-h-[640px]"
        href={href}
      >
        {image ? (
          <Media
            className="absolute inset-0"
            fill
            imgClassName={`${mediaFit(image)} transition-transform duration-[1600ms] ease-[var(--ease-luxe)] group-hover:scale-[1.03]`}
            priority
            resource={image}
            size="(min-width: 1024px) 58vw, 100vw"
          />
        ) : null}
      </Link>

      <div className="flex flex-col justify-center gap-8 p-8 sm:p-12 lg:col-span-5 lg:p-16">
        <Eyebrow>{t('flagship.eyebrow')}</Eyebrow>
        <div className="flex flex-col gap-5">
          <h2 className="font-display text-5xl font-light leading-[1.02] text-ink md:text-6xl">
            {product.title}
          </h2>
          {product.shortDescription ? (
            <p className="max-w-md text-base leading-relaxed text-olive-grey">
              {product.shortDescription}
            </p>
          ) : null}
        </div>

        {product.badges?.length ? (
          <ul className="flex flex-col divide-y divide-ink/10 border-y border-ink/10">
            {product.badges.slice(0, 3).map((badge, i) => (
              <li className="flex items-center gap-3 py-3 text-sm text-ink" key={badge.id || i}>
                <span aria-hidden="true" className="size-1 rounded-full bg-bronze" />
                {badge.text}
              </li>
            ))}
          </ul>
        ) : null}

        {typeof price === 'number' ? (
          <p className="font-display text-3xl font-light text-ink">
            {formatPrice(price, locale)}{' '}
            <span className="font-sans text-[0.6875rem] uppercase tracking-[0.16em] text-olive-grey">
              {t('inclVat')}
            </span>
          </p>
        ) : null}

        <div className="flex flex-wrap gap-3">
          <Link className={btn.ink} href={href}>
            {t('flagship.cta')}
            <ArrowIcon />
          </Link>
          <Link className={btn.outlineBronze} href="/demo">
            {t('flagship.demo')}
          </Link>
        </div>
      </div>
    </article>
  )
}
