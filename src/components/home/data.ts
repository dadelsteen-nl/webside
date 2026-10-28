import type { Homepage, Media, Product, SiteSetting } from '@/payload-types'

import {
  type AppLocale,
  getFaqs,
  getHomepage,
  getPosts,
  getProductBySlug,
  getProducts,
  getSiteSettings,
  getTestimonials,
} from '@/lib/data'
import { brand, brandVideo } from '@/lib/brandMedia'

import type {
  CalcDefaults,
  HomeFaq,
  HomeGalleryItem,
  HomeHotspot,
  HomeMedia,
  HomePost,
  HomeProduct,
  HomeTestimonial,
} from './types'

export const HOME_PRODUCT_SLUG = 'imbody-pro-s'
export const FALLBACK_IMBODY_PRICE = 5499

export type HomeData = {
  hero: { title?: string | null; subtitle?: string | null; video?: HomeMedia | null; poster?: HomeMedia | null }
  product: HomeProduct | null
  canOrderDirect: boolean
  hotspotImage: HomeMedia | null
  hotspots: HomeHotspot[]
  gallery: HomeGalleryItem[]
  calc: CalcDefaults
  faqs: HomeFaq[]
  testimonials: HomeTestimonial[]
  posts: HomePost[]
  whatsappNumber: string | null
  socialLinks: string[]
}

/** Brand assets shown until real media is uploaded in the CMS. */
export const FALLBACK_HERO_VIDEO: HomeMedia = brandVideo.hero
export const FALLBACK_HERO_POSTER: HomeMedia = brandVideo.heroPoster
export const FALLBACK_DEVICE_IMAGE: HomeMedia = brand.front
export const FALLBACK_GALLERY: HomeMedia[] = [brand.apartment, brand.livingRoom, brand.armsDetail, brand.barRow, brand.studio]

export const toMedia = (m: unknown): HomeMedia | null => {
  if (!m || typeof m !== 'object') return null
  const media = m as Media
  if (!media.url) return null
  // Generated seed placeholders (see endpoints/seed) give way to the brand fallbacks
  if (media.alt?.startsWith('Placeholder:')) return null
  return {
    alt: media.alt ?? '',
    height: media.height,
    mimeType: media.mimeType,
    url: media.url,
    width: media.width,
  }
}

/** Highest-level price in whole euros; the ecommerce plugin stores cents. */
function productPriceEUR(product: Product): number | null {
  let cents = product.priceInEUR ?? null
  if (product.enableVariants && product.variants?.docs?.length) {
    const prices = product.variants.docs
      .map((v) => (typeof v === 'object' ? v.priceInEUR : null))
      .filter((p): p is number => typeof p === 'number' && p > 0)
    if (prices.length) cents = Math.min(...prices)
  }
  return typeof cents === 'number' && cents > 0 ? Math.round(cents / 100) : null
}

function toProduct(product: Product): HomeProduct {
  const galleryImage = product.gallery?.find((g) => typeof g.image === 'object')?.image
  return {
    description: product.shortDescription ?? null,
    id: product.id,
    image: toMedia(product.hotspotImage) ?? toMedia(galleryImage) ?? FALLBACK_DEVICE_IMAGE,
    priceEUR: productPriceEUR(product),
    slug: product.slug,
    title: product.title,
  }
}

/** Logs and swallows a failed optional fetch so the page renders with static fallbacks. */
async function settle<T>(label: string, p: Promise<T>): Promise<T | null> {
  try {
    return await p
  } catch (err) {
    console.error(`[home] failed to load ${label}:`, err)
    return null
  }
}

const num = (v: number | null | undefined, fallback: number) =>
  typeof v === 'number' && Number.isFinite(v) && v > 0 ? v : fallback

export async function getHomeData(locale: AppLocale): Promise<HomeData> {
  const [homepage, settings, faqs, testimonials, posts] = await Promise.all([
    settle<Homepage>('homepage global', getHomepage(locale)),
    settle<SiteSetting>('site settings', getSiteSettings(locale)),
    settle('faqs', getFaqs({ homeOnly: true, locale })),
    settle('testimonials', getTestimonials(locale)),
    settle('posts', getPosts({ limit: 3, locale })),
  ])

  // Featured product: homepage relation → imbody-pro-s → first device
  let featured: Product | null =
    homepage?.featuredProduct && typeof homepage.featuredProduct === 'object' ? homepage.featuredProduct : null
  if (!featured) featured = await settle('featured product', getProductBySlug(HOME_PRODUCT_SLUG, locale))
  if (!featured) featured = (await settle('devices', getProducts({ limit: 1, locale, type: 'device' })))?.[0] ?? null

  const productHotspots = featured?.hotspots?.length ? featured.hotspots : null
  const hotspots = (homepage?.hotspots?.length ? homepage.hotspots : productHotspots) ?? []

  return {
    calc: {
      gymMonthly: num(homepage?.calcGymMonthly, 60),
      sessionsPerMonth: num(homepage?.calcSessionsPerMonth, 4),
      trainerSession: num(homepage?.calcTrainerSession, 70),
      years: num(homepage?.calcYears, 5),
    },
    canOrderDirect: Boolean(featured && !featured.enableVariants && productPriceEUR(featured)),
    faqs: (faqs ?? []).map((f) => ({ answer: f.answer, question: f.question })),
    gallery: (homepage?.gallery ?? [])
      .map((g) => ({ caption: g.caption ?? null, media: toMedia(g.media) }))
      .filter((g) => g.media),
    hero: {
      poster: toMedia(homepage?.heroPoster) ?? FALLBACK_HERO_POSTER,
      subtitle: homepage?.heroSubtitle,
      title: homepage?.heroTitle,
      video: toMedia(homepage?.heroVideo) ?? FALLBACK_HERO_VIDEO,
    },
    hotspotImage: toMedia(homepage?.hotspotImage) ?? FALLBACK_DEVICE_IMAGE,
    hotspots: hotspots.map((h) => ({ text: h.text ?? null, title: h.title, x: h.x, y: h.y })),
    posts: (posts ?? [])
      .filter((p) => p.slug)
      .map((p) => ({
        excerpt: p.excerpt ?? null,
        image: toMedia(p.heroImage),
        publishedAt: p.publishedAt ?? null,
        slug: p.slug as string,
        title: p.title,
      })),
    product: featured ? toProduct(featured) : null,
    socialLinks: (settings?.socialLinks ?? []).map((s) => s.url).filter(Boolean),
    testimonials: (testimonials ?? []).map((tm) => ({
      name: tm.name,
      photo: toMedia(tm.photo),
      quote: tm.quote,
      rating: tm.rating ?? 5,
      role: tm.role ?? null,
    })),
    whatsappNumber: settings?.whatsappNumber ?? null,
  }
}
