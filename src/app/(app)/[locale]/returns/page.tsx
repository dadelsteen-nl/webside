import type { Metadata } from 'next'

import { LegalPage, legalMetadata } from '@/components/legal/LegalPage'
import type { Locale } from '@/i18n/routing'

type Args = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { locale } = await params
  return legalMetadata('returns', '/returns', locale as Locale)
}

export default async function Page({ params }: Args) {
  const { locale } = await params
  return <LegalPage legalKey="returns" locale={locale as Locale} pathname="/returns" />
}
