import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import { AdminBar } from '@/components/AdminBar'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { consentDefaultsScript } from '@/components/layout/consentConfig'
import { CookieConsent } from '@/components/layout/CookieConsent'
import { getLayoutSiteSettings } from '@/components/layout/getSiteSettings'
import { resolveSocialLinks } from '@/components/layout/social'
import { SocialBar } from '@/components/layout/SocialBar'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { type Locale, routing } from '@/i18n/routing'
import { Providers } from '@/providers'
import { SmoothScroll } from '@/providers/SmoothScroll'
import { getServerSideURL } from '@/utilities/getURL'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Fraunces, Manrope } from 'next/font/google'
import { notFound } from 'next/navigation'
import React from 'react'
import './globals.css'

const fontDisplay = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
  axes: ['opsz', 'SOFT'],
})

const fontSans = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
})

const ogLocales: Record<Locale, string> = { nl: 'nl_NL', en: 'en_US' }

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale: raw } = await params
  const locale: Locale = hasLocale(routing.locales, raw) ? raw : routing.defaultLocale
  const t = await getTranslations({ locale, namespace: 'common.meta' })

  return {
    metadataBase: new URL(getServerSideURL()),
    title: {
      default: t('title'),
      template: '%s | Dadelsteen',
    },
    description: t('description'),
    applicationName: 'Dadelsteen',
    robots: { follow: true, index: true },
    // Site-wide hreflang defaults; pages should override `alternates` with their own localized paths.
    alternates: {
      languages: {
        nl: '/nl',
        en: '/en',
        'x-default': `/${routing.defaultLocale}`,
      },
    },
    openGraph: {
      type: 'website',
      siteName: 'Dadelsteen',
      title: t('title'),
      description: t('description'),
      locale: ogLocales[locale],
      alternateLocale: routing.locales.filter((l) => l !== locale).map((l) => ogLocales[l]),
    },
    twitter: { card: 'summary_large_image' },
    icons: {
      icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
    },
  }
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

type Args = {
  children: ReactNode
  params: Promise<{ locale: string }>
}

export default async function LocaleLayout({ children, params }: Args) {
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) notFound()

  setRequestLocale(locale)

  const [settings, tc] = await Promise.all([
    getLayoutSiteSettings(locale),
    getTranslations({ locale, namespace: 'common' }),
  ])

  return (
    <html
      className={[fontDisplay.variable, fontSans.variable].join(' ')}
      data-theme="light"
      lang={locale}
      suppressHydrationWarning
    >
      <head>
        {/* Google Consent Mode v2: deny by default until the visitor chooses. */}
        <script dangerouslySetInnerHTML={{ __html: consentDefaultsScript }} id="consent-defaults" />
      </head>
      <body>
        <NextIntlClientProvider>
          <Providers>
            <a
              className="sr-only fixed top-3 left-3 z-[100] bg-ink px-5 py-3 text-[0.6875rem] uppercase tracking-[0.2em] text-cream focus:not-sr-only"
              href="#main"
            >
              {tc('skipToContent')}
            </a>
            <SmoothScroll />
            <AdminBar />
            <LivePreviewListener />

            <Header />
            <main className="flex-1" id="main" tabIndex={-1}>
              {children}
            </main>
            <Footer />

            <SocialBar
              links={resolveSocialLinks(settings)}
              whatsappNumber={settings.whatsappNumber}
            />
            <CookieConsent />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
