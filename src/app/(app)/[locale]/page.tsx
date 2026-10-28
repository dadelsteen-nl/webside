import type { Metadata } from 'next'
import { hasLocale } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'

import { Audiences } from '@/components/home/Audiences'
import { CostCalculator } from '@/components/home/CostCalculator'
import { FALLBACK_IMBODY_PRICE, getHomeData, HOME_PRODUCT_SLUG } from '@/components/home/data'
import { DemoCta } from '@/components/home/DemoCta'
import { FaqPreview } from '@/components/home/FaqPreview'
import { Gallery } from '@/components/home/Gallery'
import { Hero } from '@/components/home/Hero'
import { HomeStyles } from '@/components/home/HomeStyles'
import { HowItWorks } from '@/components/home/HowItWorks'
import { Included } from '@/components/home/Included'
import { Intro } from '@/components/home/Intro'
import { HomeJsonLd } from '@/components/home/JsonLd'
import { JournalPreview } from '@/components/home/JournalPreview'
import { Spotlight } from '@/components/home/Spotlight'
import { Technology } from '@/components/home/Technology'
import { Testimonials } from '@/components/home/Testimonials'
import { TrustStrip } from '@/components/home/TrustStrip'
import type { HomeTestimonial } from '@/components/home/types'
import { routing } from '@/i18n/routing'

type Args = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) return {}
  const t = await getTranslations({ locale, namespace: 'home.meta' })

  return {
    alternates: {
      canonical: `/${locale}`,
      languages: Object.fromEntries(routing.locales.map((l) => [l === 'nl' ? 'nl-NL' : 'en', `/${l}`])),
    },
    description: t('description'),
    openGraph: {
      description: t('description'),
      locale: locale === 'nl' ? 'nl_NL' : 'en_GB',
      siteName: 'Dadelsteen',
      title: t('title'),
      type: 'website',
    },
    title: { absolute: `Dadelsteen — ${t('title')}` },
  }
}

export default async function HomePage({ params }: Args) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)

  const [data, tTestimonials] = await Promise.all([
    getHomeData(locale),
    getTranslations({ locale, namespace: 'home.testimonials' }),
  ])

  const productSlug = data.product?.slug ?? HOME_PRODUCT_SLUG
  // Seeded sample quotes are marked "(voorbeeld)" / "(sample)"; only real ones are shown
  const realTestimonials = data.testimonials.filter((tm) => !/voorbeeld|sample/i.test(tm.role ?? ''))
  const testimonials = realTestimonials.length
    ? realTestimonials
    : (tTestimonials.raw('items') as HomeTestimonial[])

  return (
    <>
      <HomeStyles />
      <HomeJsonLd locale={locale} sameAs={data.socialLinks} />
      <Hero
        poster={data.hero.poster}
        productSlug={productSlug}
        subtitle={data.hero.subtitle}
        title={data.hero.title}
        video={data.hero.video}
      />
      <TrustStrip />
      <Spotlight
        canOrderDirect={data.canOrderDirect}
        hotspots={data.hotspots}
        image={data.hotspotImage}
        product={data.product}
        productSlug={productSlug}
      />
      <Intro productSlug={productSlug} />
      <Included />
      <Technology />
      <HowItWorks />
      <Audiences productSlug={productSlug} />
      <CostCalculator
        defaults={data.calc}
        imbodyPrice={data.product?.priceEUR ?? FALLBACK_IMBODY_PRICE}
      />
      <Testimonials items={testimonials} />
      <Gallery items={data.gallery} />
      <FaqPreview items={data.faqs} />
      <JournalPreview posts={data.posts} />
      <DemoCta whatsappNumber={data.whatsappNumber} />
    </>
  )
}
