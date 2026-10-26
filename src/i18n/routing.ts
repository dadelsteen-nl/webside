import { defineRouting } from 'next-intl/routing'

// Internal pathnames (= folder names under app/(app)/[locale]) mapped to localized URLs.
// Always link with the internal pathname via `Link` from '@/i18n/navigation'.
export const routing = defineRouting({
  locales: ['nl', 'en'],
  defaultLocale: 'nl',
  localePrefix: 'always',
  pathnames: {
    '/': '/',
    '/shop': '/shop',
    '/products/[slug]': { nl: '/producten/[slug]', en: '/products/[slug]' },
    '/demo': '/demo',
    '/business': { nl: '/zakelijk', en: '/business' },
    '/about': { nl: '/over-ons', en: '/about' },
    '/journal': '/journal',
    '/journal/[slug]': '/journal/[slug]',
    '/faq': '/faq',
    '/contact': '/contact',
    '/cart': { nl: '/winkelwagen', en: '/cart' },
    '/checkout': { nl: '/afrekenen', en: '/checkout' },
    '/checkout/confirm-order': { nl: '/afrekenen/bevestigen', en: '/checkout/confirm-order' },
    '/orders/[id]': { nl: '/bestellingen/[id]', en: '/orders/[id]' },
    '/privacy': '/privacy',
    '/terms': { nl: '/voorwaarden', en: '/terms' },
    '/cookies': '/cookies',
    '/returns': { nl: '/retourneren', en: '/returns' },
    '/account': '/account',
    '/account/addresses': { nl: '/account/adressen', en: '/account/addresses' },
    '/orders': { nl: '/bestellingen', en: '/orders' },
    '/login': { nl: '/inloggen', en: '/login' },
    '/logout': { nl: '/uitloggen', en: '/logout' },
    '/create-account': { nl: '/account-aanmaken', en: '/create-account' },
    '/forgot-password': { nl: '/wachtwoord-vergeten', en: '/forgot-password' },
    '/find-order': { nl: '/bestelling-zoeken', en: '/find-order' },
  },
})

export type Locale = (typeof routing.locales)[number]
export type AppPathname = keyof typeof routing.pathnames
