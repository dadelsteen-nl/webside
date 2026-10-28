import type { Metadata } from 'next'

import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Suspense } from 'react'

import { AuthShell } from '@/components/account/AuthShell'
import { ForgotPasswordForm } from '@/components/forms/ForgotPasswordForm'
import { type Locale } from '@/i18n/routing'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = (await params) as { locale: Locale }
  const t = await getTranslations({ locale, namespace: 'checkout.meta' })
  return { robots: { index: false }, title: t('forgotPassword') }
}

export default async function ForgotPasswordPage({ params }: Props) {
  const { locale } = (await params) as { locale: Locale }
  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: 'checkout.auth.forgot' })
  return (
    <AuthShell eyebrow={t('eyebrow')} intro={t('intro')} title={t('title')}>
      <Suspense>
        <ForgotPasswordForm />
      </Suspense>
    </AuthShell>
  )
}
