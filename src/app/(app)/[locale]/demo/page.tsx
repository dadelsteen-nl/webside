import type { Metadata } from 'next'
import { hasLocale } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'

import { buildPageMetadata } from '@/components/pages/metadata'
import { DemoExpect, DemoFaq, DemoFormSection, DemoHero, DemoOptions } from '@/components/pages/demo/DemoSections'
import { routing } from '@/i18n/routing'

type Args = {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ type?: string | string[] }>
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) return {}
  return buildPageMetadata({ href: '/demo', locale, namespace: 'pages.demo.meta' })
}

export default async function DemoPage({ params, searchParams }: Args) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)

  const { type } = await searchParams
  const audience = (Array.isArray(type) ? type[0] : type) === 'business' ? 'business' : 'private'

  return (
    <>
      <DemoHero />
      <DemoOptions />
      <DemoExpect />
      <DemoFormSection audience={audience} />
      <DemoFaq />
    </>
  )
}
