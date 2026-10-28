import type { Metadata } from 'next'

import { getTranslations, setRequestLocale } from 'next-intl/server'

import { MollieCheckout } from '@/components/checkout/MollieCheckout'
import { type Locale } from '@/i18n/routing'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = (await params) as { locale: Locale }
  const t = await getTranslations({ locale, namespace: 'checkout.meta' })
  return { robots: { index: false }, title: t('checkout') }
}

export default async function CheckoutPage({ params }: Props) {
  const { locale } = (await params) as { locale: Locale }
  setRequestLocale(locale)
  return <MollieCheckout />
}
