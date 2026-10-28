import type { Metadata } from 'next'

import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Suspense } from 'react'

import { ConfirmOrder } from '@/components/checkout/ConfirmOrder'
import { type Locale } from '@/i18n/routing'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = (await params) as { locale: Locale }
  const t = await getTranslations({ locale, namespace: 'checkout.meta' })
  return { robots: { index: false }, title: t('confirm') }
}

export default async function ConfirmOrderPage({ params }: Props) {
  const { locale } = (await params) as { locale: Locale }
  setRequestLocale(locale)
  return (
    <Suspense>
      <ConfirmOrder />
    </Suspense>
  )
}
