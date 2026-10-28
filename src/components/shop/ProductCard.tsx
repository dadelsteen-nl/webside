import { useLocale, useTranslations } from 'next-intl'

import type { Product } from '@/payload-types'

import { Media } from '@/components/Media'
import { formatPrice } from '@/components/Price/format'
import { Link } from '@/i18n/navigation'
import { cn } from '@/utilities/cn'

import { ArrowIcon } from './ui'
import { getProductImage, getProductPrice, mediaFit } from './productUtils'

type Props = {
  product: Partial<Product>
  className?: string
  /** Hint for next/image */
  sizes?: string
  /** Landscape image for cards spanning a wider grid cell */
  wide?: boolean
}

/** Refined accessory card: image on stone, serif title, price incl. VAT. */
export function ProductCard({ className, product, sizes, wide }: Props) {
  const locale = useLocale()
  const t = useTranslations('shop.shop')
  const image = getProductImage(product)
  const price = getProductPrice(product)

  if (!product.slug) return null

  return (
    <Link
      className={cn(
        'group flex h-full flex-col bg-cream transition-shadow duration-700 ease-[var(--ease-luxe)] hover:shadow-[0_30px_60px_-40px_rgba(26,26,26,0.35)]',
        className,
      )}
      href={{ pathname: '/products/[slug]', params: { slug: product.slug } }}
    >
      <div className={cn('relative overflow-hidden bg-stone', wide ? 'aspect-[4/5] lg:aspect-[3/2]' : 'aspect-[4/5]')}>
        {image ? (
          <Media
            className="absolute inset-0"
            fill
            imgClassName={`${mediaFit(image)} transition-transform duration-[1200ms] ease-[var(--ease-luxe)] group-hover:scale-[1.04]`}
            resource={image}
            size={sizes || '(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw'}
          />
        ) : null}
        {product.badges?.[0]?.text ? (
          <span className="absolute left-4 top-4 bg-cream/90 px-3 py-1.5 font-sans text-[0.625rem] uppercase tracking-[0.2em] text-ink backdrop-blur-sm">
            {product.badges[0].text}
          </span>
        ) : null}
      </div>
      <div className="flex grow flex-col gap-3 border-t border-ink/10 p-6">
        <h3 className="font-display text-2xl font-light leading-tight text-ink">{product.title}</h3>
        {product.shortDescription ? (
          <p className="line-clamp-2 text-sm leading-relaxed text-olive-grey">
            {product.shortDescription}
          </p>
        ) : null}
        <div className="mt-auto flex items-end justify-between gap-4 pt-4">
          {typeof price === 'number' ? (
            <p className="font-sans text-sm text-ink">
              {formatPrice(price, locale)}{' '}
              <span className="text-[0.6875rem] uppercase tracking-[0.14em] text-olive-grey">
                {t('inclVat')}
              </span>
            </p>
          ) : (
            <span />
          )}
          <span className="inline-flex items-center gap-2 font-sans text-[0.625rem] uppercase tracking-[0.2em] text-bronze-deep">
            <span className="sr-only sm:not-sr-only">{t('view')}</span>
            <ArrowIcon />
          </span>
        </div>
      </div>
    </Link>
  )
}
