import type { Metadata } from 'next'

import { getTranslations, setRequestLocale } from 'next-intl/server'

import { CartPageView } from '@/components/Cart/CartPageView'
import { type Locale } from '@/i18n/routing'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = (await params) as { locale: Locale }
  const t = await getTranslations({ locale, namespace: 'checkout.meta' })
  return { robots: { index: false }, title: t('cart') }
}

export default async function CartPage({ params }: Props) {
  const { locale } = (await params) as { locale: Locale }
  setRequestLocale(locale)
  return <CartPageView />
}
