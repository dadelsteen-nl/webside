import type { Metadata } from 'next'
import { hasLocale } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'

import {
  BusinessCta,
  BusinessFormSection,
  BusinessHero,
  BusinessProcess,
  BusinessSegments,
  BusinessWhy,
} from '@/components/pages/business/BusinessSections'
import { buildPageMetadata } from '@/components/pages/metadata'
import { routing } from '@/i18n/routing'

type Args = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) return {}
  return buildPageMetadata({ href: '/business', locale, namespace: 'pages.business.meta' })
}

export default async function BusinessPage({ params }: Args) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)

  return (
    <>
      <BusinessHero />
      <BusinessSegments />
      <BusinessWhy />
      <BusinessProcess />
      <BusinessFormSection />
      <BusinessCta />
    </>
  )
}
