import { hasLocale } from 'next-intl'
import { getRequestConfig } from 'next-intl/server'

import { routing } from './routing'

// Each namespace lives in its own file: messages/{locale}/{namespace}.json
export const namespaces = [
  'common',
  'nav',
  'home',
  'shop',
  'checkout',
  'forms',
  'pages',
  'blog',
  'legal',
] as const

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale

  const entries = await Promise.all(
    namespaces.map(async (ns) => [ns, (await import(`../../messages/${locale}/${ns}.json`)).default]),
  )

  return {
    locale,
    messages: Object.fromEntries(entries),
  }
})
