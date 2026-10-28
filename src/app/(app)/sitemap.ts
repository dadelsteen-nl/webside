import type { MetadataRoute } from 'next'

import { type AppPathname, type Locale, routing } from '@/i18n/routing'
import { getPosts, getProducts } from '@/lib/data'
import { localizedUrl } from '@/lib/seo/alternates'

export const dynamic = 'force-dynamic'

const STATIC_ROUTES: AppPathname[] = [
  '/',
  '/shop',
  '/demo',
  '/business',
  '/about',
  '/journal',
  '/faq',
  '/contact',
  '/privacy',
  '/terms',
  '/cookies',
  '/returns',
]

type Params = Record<string, string>
type Doc = { id: number | string; slug?: string | null; updatedAt?: string | null }

function staticEntries(pathname: AppPathname): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(
    routing.locales.map((l) => [l, localizedUrl(pathname, l)]),
  ) as Record<Locale, string>
  return routing.locales.map((l) => ({
    url: localizedUrl(pathname, l),
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: pathname === '/' ? 1 : 0.7,
    alternates: { languages },
  }))
}

/** Docs have localized slugs: pair the locales by id so hreflang points to the right URL. */
function docEntries(
  pathname: AppPathname,
  byLocale: Record<Locale, Doc[]>,
  priority: number,
  changeFrequency: 'weekly' | 'monthly',
): MetadataRoute.Sitemap {
  const out: MetadataRoute.Sitemap = []
  for (const locale of routing.locales) {
    for (const doc of byLocale[locale]) {
      if (!doc.slug) continue
      const languages: Record<string, string> = {}
      for (const l of routing.locales) {
        const match = byLocale[l].find((d) => d.id === doc.id)
        if (match?.slug) languages[l] = localizedUrl(pathname, l, { slug: match.slug } as Params)
      }
      out.push({
        url: localizedUrl(pathname, locale, { slug: doc.slug }),
        lastModified: doc.updatedAt ?? undefined,
        changeFrequency,
        priority,
        alternates: { languages },
      })
    }
  }
  return out
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const locales = routing.locales
  const [products, posts] = await Promise.all([
    Promise.all(locales.map((locale) => getProducts({ locale }).catch(() => []))),
    Promise.all(locales.map((locale) => getPosts({ locale, limit: 200 }).catch(() => []))),
  ])
  const toMap = (lists: Doc[][]) =>
    Object.fromEntries(locales.map((l, i) => [l, lists[i]])) as Record<Locale, Doc[]>

  return [
    ...STATIC_ROUTES.flatMap(staticEntries),
    ...docEntries('/products/[slug]', toMap(products), 0.9, 'weekly'),
    ...docEntries('/journal/[slug]', toMap(posts), 0.6, 'monthly'),
  ]
}
