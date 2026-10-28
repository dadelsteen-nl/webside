import type { Metadata } from 'next'
import { hasLocale } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'

import {
  AboutCta,
  AboutHero,
  AboutRole,
  AboutStory,
  AboutValues,
  AboutWork,
} from '@/components/pages/about/AboutSections'
import { buildPageMetadata } from '@/components/pages/metadata'
import { routing } from '@/i18n/routing'
import { getSiteSettings } from '@/lib/data'

type Args = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) return {}
  return buildPageMetadata({ href: '/about', locale, namespace: 'pages.about.meta' })
}

export default async function AboutPage({ params }: Args) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)

  const settings = await getSiteSettings(locale)

  return (
    <>
      <AboutHero />
      <AboutStory />
      <AboutValues />
      <AboutWork />
      <AboutRole settings={settings} />
      <AboutCta />
    </>
  )
}
