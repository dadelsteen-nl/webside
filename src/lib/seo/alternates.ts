import { getPathname } from '@/i18n/navigation'
import { type AppPathname, type Locale, routing } from '@/i18n/routing'
import { getServerSideURL } from '@/utilities/getURL'

export type PathParams = Record<string, string>

export function absoluteUrl(path: string): string {
  return `${getServerSideURL().replace(/\/$/, '')}${path === '/' ? '' : path}`
}

/** Absolute, localized URL for an internal pathname, e.g. ('/terms', 'nl') -> https://x/nl/voorwaarden */
export function localizedUrl(pathname: AppPathname, locale: Locale, params?: PathParams): string {
  const href = (params ? { pathname, params } : pathname) as never
  return absoluteUrl(getPathname({ locale, href }))
}

/**
 * Metadata `alternates` for an internal pathname: canonical for `locale` (default nl),
 * hreflang for every locale plus x-default (default locale).
 * Usage: `alternates: buildAlternates('/journal/[slug]', { slug }, locale)`
 * If slugs differ per locale pass `paramsByLocale` as 4th arg.
 */
export function buildAlternates(
  pathname: AppPathname,
  params?: PathParams,
  locale: Locale = routing.defaultLocale,
  paramsByLocale?: Partial<Record<Locale, PathParams>>,
): {
  canonical: string
  languages: { nl: string; en: string; 'x-default': string }
} {
  const nl = localizedUrl(pathname, 'nl', paramsByLocale?.nl ?? params)
  const en = localizedUrl(pathname, 'en', paramsByLocale?.en ?? params)
  return {
    canonical: locale === 'en' ? en : nl,
    languages: { nl, en, 'x-default': routing.defaultLocale === 'nl' ? nl : en },
  }
}
