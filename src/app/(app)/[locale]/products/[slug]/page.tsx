import type { Media, Product } from '@/payload-types'
import type { Metadata } from 'next'

import configPromise from '@payload-config'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import React from 'react'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { Media as MediaComponent } from '@/components/Media'
import { FeatureIcon } from '@/components/product/FeatureIcon'
import { Gallery } from '@/components/product/Gallery'
import { ProductHotspots } from '@/components/product/Hotspots'
import { ProductDescription } from '@/components/product/ProductDescription'
import { RichText } from '@/components/RichText'
import { ProductCard } from '@/components/shop/ProductCard'
import { asMedia, getProductImage, getProductPrice, isInStock } from '@/components/shop/productUtils'
import { Eyebrow } from '@/components/shop/ui'
import { Link } from '@/i18n/navigation'
import { type Locale } from '@/i18n/routing'
import { JsonLd, absoluteUrl, breadcrumbJsonLd, buildAlternates, localizedUrl } from '@/lib/seo'

type Args = {
  params: Promise<{ locale: string; slug: string }>
}

const queryProductBySlug = async ({ locale, slug }: { locale: Locale; slug: string }) => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'products',
    depth: 3,
    draft,
    limit: 1,
    locale,
    overrideAccess: draft,
    pagination: false,
    where: {
      and: [{ slug: { equals: slug } }, ...(draft ? [] : [{ _status: { equals: 'published' } }])],
    },
    populate: {
      variants: { title: true, priceInEUR: true, inventory: true, options: true },
    },
  })

  return result.docs?.[0] || null
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { locale, slug } = (await params) as { locale: Locale; slug: string }
  const product = await queryProductBySlug({ locale, slug })
  if (!product) return {}

  const image = asMedia(product.meta?.image) || getProductImage(product)
  const canIndex = product._status === 'published'
  const description = product.meta?.description || product.shortDescription || ''

  return {
    title: product.meta?.title || product.title,
    description,
    alternates: buildAlternates('/products/[slug]', { slug: product.slug }, locale),
    openGraph: {
      title: product.meta?.title || product.title,
      description,
      url: localizedUrl('/products/[slug]', locale, { slug: product.slug }),
      ...(image?.url
        ? {
            images: [
              {
                alt: image.alt,
                height: image.height ?? undefined,
                url: absoluteUrl(image.url),
                width: image.width ?? undefined,
              },
            ],
          }
        : {}),
    },
    robots: { follow: canIndex, index: canIndex },
  }
}

export default async function ProductPage({ params }: Args) {
  const { locale, slug } = (await params) as { locale: Locale; slug: string }
  setRequestLocale(locale)

  const product = await queryProductBySlug({ locale, slug })
  if (!product) notFound()

  const t = await getTranslations({ locale, namespace: 'shop.product' })
  const tShop = await getTranslations({ locale, namespace: 'shop.meta' })

  const images = (product.gallery || [])
    .map((item) => asMedia(item.image))
    .filter((m): m is Media => Boolean(m))
  const hotspotImage = asMedia(product.hotspotImage)
  const hotspots = product.hotspots || []
  const video = asMedia(product.video)
  const related = (product.relatedProducts || []).filter(
    (p): p is Product => typeof p === 'object' && p !== null && p._status !== 'draft',
  )

  const url = localizedUrl('/products/[slug]', locale, { slug: product.slug })
  const price = getProductPrice(product)
  const jsonImage = images.map((m) => (m.url ? absoluteUrl(m.url) : null)).filter(Boolean)

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.meta?.description || product.shortDescription || undefined,
    image: jsonImage.length ? jsonImage : undefined,
    sku: product.slug,
    url,
    brand: { '@type': 'Brand', name: 'imbody' },
    ...(typeof price === 'number'
      ? {
          offers: {
            '@type': 'Offer',
            url,
            price: (price / 100).toFixed(2),
            priceCurrency: 'EUR',
            availability: isInStock(product)
              ? 'https://schema.org/InStock'
              : 'https://schema.org/OutOfStock',
            itemCondition: 'https://schema.org/NewCondition',
            seller: { '@type': 'Organization', name: 'Dadelsteen' },
          },
        }
      : {}),
  }

  return (
    <article className="pb-24 md:pb-32">
      <JsonLd
        data={[
          productJsonLd,
          breadcrumbJsonLd([
            { name: tShop('title'), url: localizedUrl('/shop', locale) },
            { name: product.title, url },
          ]),
        ]}
      />

      <div className="container pt-8 md:pt-12">
        <nav aria-label="Breadcrumb" className="mb-8 md:mb-12">
          <ol className="flex items-center gap-3 font-sans text-[0.6875rem] uppercase tracking-[0.2em] text-olive-grey">
            <li>
              <Link className="transition-colors hover:text-ink" href="/shop">
                {t('breadcrumbShop')}
              </Link>
            </li>
            <li aria-hidden="true" className="h-px w-6 bg-bronze" />
            <li aria-current="page" className="truncate text-ink">
              {product.title}
            </li>
          </ol>
        </nav>

        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <div className="lg:sticky lg:top-28">
              <Gallery images={images} title={product.title} />
            </div>
          </div>
          <div className="lg:col-span-5 lg:pt-4">
            <ProductDescription product={product} />
          </div>
        </div>
      </div>

      {product.features?.length ? (
        <section aria-labelledby="pdp-features" className="mt-24 bg-cream py-20 md:mt-32 md:py-28">
          <div className="container">
            <Eyebrow>{t('features.eyebrow')}</Eyebrow>
            <h2
              className="mt-6 max-w-2xl font-display text-4xl font-light leading-tight text-ink md:text-5xl"
              id="pdp-features"
            >
              {t('features.title')}
            </h2>
            <ul className="mt-14 grid gap-px bg-ink/10 sm:grid-cols-2 lg:grid-cols-4">
              {product.features.map((feature, i) => (
                <li className="flex flex-col gap-5 bg-cream p-8" key={feature.id || i}>
                  <FeatureIcon className="size-7 text-bronze" name={feature.icon} />
                  <h3 className="font-display text-2xl font-light text-ink">{feature.title}</h3>
                  {feature.text ? (
                    <p className="text-sm leading-relaxed text-olive-grey">{feature.text}</p>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {hotspotImage && hotspots.length ? (
        <section aria-labelledby="pdp-hotspots" className="container mt-24 md:mt-32">
          <div className="mb-10 grid gap-4 md:grid-cols-12 md:items-end">
            <div className="md:col-span-7">
              <Eyebrow>{t('hotspots.eyebrow')}</Eyebrow>
              <h2
                className="mt-6 font-display text-4xl font-light leading-tight text-ink md:text-5xl"
                id="pdp-hotspots"
              >
                {t('hotspots.title')}
              </h2>
            </div>
          </div>
          <ProductHotspots image={hotspotImage} spots={hotspots} />
        </section>
      ) : null}

      {product.specs?.length || product.description ? (
        <section className="container mt-24 grid gap-16 md:mt-32 lg:grid-cols-12">
          {product.description ? (
            <div className="lg:col-span-6">
              <Eyebrow>{t('description.eyebrow')}</Eyebrow>
              <RichText
                className="prose-lg mt-8 max-w-none text-olive-grey prose-headings:font-display prose-headings:font-light prose-headings:text-ink prose-strong:text-ink"
                data={product.description}
                enableGutter={false}
              />
            </div>
          ) : null}
          {product.specs?.length ? (
            <div className={product.description ? 'lg:col-span-5 lg:col-start-8' : 'lg:col-span-8'}>
              <Eyebrow>{t('specs.eyebrow')}</Eyebrow>
              <h2 className="mt-6 font-display text-4xl font-light text-ink">{t('specs.title')}</h2>
              <dl className="mt-10 border-t border-ink/15">
                {product.specs.map((spec, i) => (
                  <div
                    className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-6 border-b border-ink/10 py-4"
                    key={spec.id || i}
                  >
                    <dt className="font-sans text-[0.6875rem] uppercase tracking-[0.18em] text-olive-grey">
                      {spec.label}
                    </dt>
                    <dd className="text-sm text-ink">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ) : null}
        </section>
      ) : null}

      {video ? (
        <section className="container mt-24 md:mt-32">
          <Eyebrow>{t('video.eyebrow')}</Eyebrow>
          <div className="mt-8 overflow-hidden bg-stone">
            <MediaComponent resource={video} videoClassName="w-full" />
          </div>
        </section>
      ) : null}

      {product.layout?.length ? <RenderBlocks blocks={product.layout} /> : null}

      {related.length ? (
        <section aria-labelledby="pdp-related" className="container mt-24 md:mt-32">
          <Eyebrow>{t('related.eyebrow')}</Eyebrow>
          <h2
            className="mt-6 font-display text-4xl font-light text-ink md:text-5xl"
            id="pdp-related"
          >
            {t('related.title')}
          </h2>
          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.slice(0, 4).map((p) => (
              <li key={p.id}>
                <ProductCard product={p} sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 90vw" />
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </article>
  )
}
