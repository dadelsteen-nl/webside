import configPromise from '@payload-config'
import { getPayload } from 'payload'

import type { Faq, Homepage, Post, Product, SiteSetting, Testimonial } from '@/payload-types'
import { getCachedGlobal } from '@/utilities/getGlobals'

// Server-only helpers (use from Server Components / route handlers).
export type AppLocale = 'nl' | 'en'

const getClient = () => getPayload({ config: configPromise })

export async function getProducts({
  locale,
  type,
  limit = 100,
}: {
  locale: AppLocale
  type?: 'device' | 'accessory'
  limit?: number
}): Promise<Product[]> {
  const payload = await getClient()
  const res = await payload.find({
    collection: 'products',
    locale,
    depth: 2,
    limit,
    pagination: false,
    where: {
      _status: { equals: 'published' },
      ...(type ? { productType: { equals: type } } : {}),
    },
    sort: 'createdAt',
  })
  return res.docs
}

export async function getProductBySlug(slug: string, locale: AppLocale): Promise<Product | null> {
  const payload = await getClient()
  const res = await payload.find({
    collection: 'products',
    locale,
    depth: 2,
    limit: 1,
    pagination: false,
    where: { slug: { equals: slug }, _status: { equals: 'published' } },
  })
  return res.docs[0] ?? null
}

export async function getFaqs({
  locale,
  homeOnly,
  category,
}: {
  locale: AppLocale
  homeOnly?: boolean
  category?: Faq['category']
}): Promise<Faq[]> {
  const payload = await getClient()
  const res = await payload.find({
    collection: 'faqs',
    locale,
    depth: 0,
    limit: 200,
    pagination: false,
    sort: 'order',
    where: {
      ...(homeOnly ? { showOnHome: { equals: true } } : {}),
      ...(category ? { category: { equals: category } } : {}),
    },
  })
  return res.docs
}

export async function getTestimonials(
  locale: AppLocale,
  audience?: 'home' | 'business',
): Promise<Testimonial[]> {
  const payload = await getClient()
  const res = await payload.find({
    collection: 'testimonials',
    locale,
    depth: 1,
    limit: 50,
    pagination: false,
    where: {
      published: { equals: true },
      ...(audience ? { audience: { equals: audience } } : {}),
    },
  })
  return res.docs
}

export async function getPosts({
  locale,
  limit = 12,
}: {
  locale: AppLocale
  limit?: number
}): Promise<Post[]> {
  const payload = await getClient()
  const res = await payload.find({
    collection: 'posts',
    locale,
    depth: 1,
    limit,
    pagination: false,
    sort: '-publishedAt',
    where: { _status: { equals: 'published' } },
  })
  return res.docs
}

export async function getPostBySlug(slug: string, locale: AppLocale): Promise<Post | null> {
  const payload = await getClient()
  const res = await payload.find({
    collection: 'posts',
    locale,
    depth: 2,
    limit: 1,
    pagination: false,
    where: { slug: { equals: slug }, _status: { equals: 'published' } },
  })
  return res.docs[0] ?? null
}

export async function getSiteSettings(locale: AppLocale): Promise<SiteSetting> {
  return getCachedGlobal('site-settings', 1, locale)()
}

export async function getHomepage(locale: AppLocale): Promise<Homepage> {
  return getCachedGlobal('homepage', 2, locale)()
}
