import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

import { getPathname } from '@/i18n/navigation'
import { type AppPathname, type Locale, routing } from '@/i18n/routing'

type StaticPathname = Exclude<AppPathname, `${string}[${string}`>

const ogLocale: Record<Locale, string> = { en: 'en_US', nl: 'nl_NL' }

/** Localized title/description + canonical and hreflang alternates for a static page. */
export async function buildPageMetadata({
  href,
  locale,
  namespace,
}: {
  locale: Locale
  href: StaticPathname
  /** Namespace containing `title` and `description`, e.g. `pages.demo.meta`. */
  namespace: string
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace })
  const canonical = getPathname({ href, locale })
  const languages: Record<string, string> = Object.fromEntries(
    routing.locales.map((l) => [l, getPathname({ href, locale: l })]),
  )
  languages['x-default'] = getPathname({ href, locale: routing.defaultLocale })

  const title = t('title')
  const description = t('description')

  return {
    alternates: { canonical, languages },
    description,
    openGraph: {
      alternateLocale: routing.locales.filter((l) => l !== locale).map((l) => ogLocale[l]),
      description,
      locale: ogLocale[locale],
      siteName: 'Dadelsteen',
      title: `${title} | Dadelsteen`,
      type: 'website',
      url: canonical,
    },
    title,
  }
}
