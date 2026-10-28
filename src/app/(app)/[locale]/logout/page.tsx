import type { Metadata } from 'next'

import { getTranslations, setRequestLocale } from 'next-intl/server'

import { type Locale } from '@/i18n/routing'

import { LogoutPage } from './LogoutPage'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = (await params) as { locale: Locale }
  const t = await getTranslations({ locale, namespace: 'checkout.meta' })
  return { robots: { index: false }, title: t('logout') }
}

export default async function Logout({ params }: Props) {
  const { locale } = (await params) as { locale: Locale }
  setRequestLocale(locale)
  return <LogoutPage />
}
