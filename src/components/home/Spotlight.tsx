import { getLocale, getTranslations } from 'next-intl/server'

import { Reveal } from '@/components/ui/motion'
import { Link } from '@/i18n/navigation'
import { cn } from '@/utilities/cn'

import type { HomeHotspot, HomeMedia, HomeProduct } from './types'

import { Hotspots } from './Hotspots'
import { ArrowIcon, buttonStyles, SectionLabel } from './primitives'
import { SpotlightOrderButton } from './SpotlightOrderButton'
import { formatEUR } from './format'

type Props = {
  product: HomeProduct | null
  productSlug: string
  image?: HomeMedia | null
  hotspots?: HomeHotspot[] | null
  /** Whether the product can be added to cart directly (exists, no variants) */
  canOrderDirect?: boolean
}

export async function Spotlight({ canOrderDirect, hotspots, image, product, productSlug }: Props) {
  const t = await getTranslations('home.spotlight')
  const locale = await getLocale()

  const spots = hotspots?.length ? hotspots : (t.raw('hotspots') as HomeHotspot[])
  const specs = t.raw('specs') as { value: string; label: string }[]
  const name = product?.title || t('defaultName')
  const description = product?.description || t('defaultDescription')
  const price = product?.priceEUR

  return (
    <section aria-labelledby="home-spotlight-title" className="overflow-x-clip bg-stone/40 py-24 md:py-36">
      <div className="container grid gap-14 lg:grid-cols-12 lg:gap-10">
        <Reveal className="lg:col-span-7" y={40}>
          <Hotspots
            closeLabel={t('close')}
            hint={t('hint')}
            hotspots={spots}
            image={image ?? product?.image}
            imageAlt={t('imageAlt')}
          />
        </Reveal>

        <div className="flex flex-col justify-center lg:col-span-4 lg:col-start-9">
          <Reveal>
            <SectionLabel>{t('label')}</SectionLabel>
            <h2
              className="mt-8 text-[clamp(2.25rem,4.4vw,4rem)] font-light leading-[1.02] tracking-[-0.025em] text-ink"
              id="home-spotlight-title"
            >
              {t('title')}
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="mt-10 font-sans text-xs font-medium uppercase tracking-[0.22em] text-bronze-deep">
              {name}
            </p>
            <p className="mt-4 text-base leading-relaxed text-olive-grey">{description}</p>
          </Reveal>

          <Reveal delay={0.15}>
            <dl className="mt-10 grid grid-cols-3 border-y border-ink/10">
              {specs.map((spec, i) => (
                <div className={cn('py-5', i > 0 && 'border-l border-ink/10 pl-4')} key={spec.label}>
                  <dt className="sr-only">{spec.label}</dt>
                  <dd>
                    <span className="block font-display text-2xl font-light text-ink md:text-3xl">
                      {spec.value}
                    </span>
                    <span className="mt-1 block text-[0.6875rem] uppercase tracking-[0.16em] text-olive-grey">
                      {spec.label}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal delay={0.2}>
            {typeof price === 'number' && price > 0 ? (
              <p className="mt-10 flex items-baseline gap-2 text-ink">
                <span className="text-sm text-olive-grey">{t('priceFrom')}</span>
                <span className="font-display text-3xl font-light">{formatEUR(price, locale)}</span>
                <span className="text-sm text-olive-grey">{t('inclVat')}</span>
              </p>
            ) : null}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                className={cn(buttonStyles.base, buttonStyles.outlineBronze)}
                href={{ params: { slug: productSlug }, pathname: '/products/[slug]' }}
              >
                {t('ctaProduct')}
              </Link>
              {canOrderDirect && typeof product?.id === 'number' ? (
                <SpotlightOrderButton label={t('ctaCart')} productId={product.id} />
              ) : (
                <Link
                  className={cn(buttonStyles.base, buttonStyles.ink)}
                  href={{ params: { slug: productSlug }, pathname: '/products/[slug]' }}
                >
                  {t('ctaCart')}
                  <ArrowIcon />
                </Link>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
