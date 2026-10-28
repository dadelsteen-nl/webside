import type { Metadata } from 'next'

import configPromise from '@payload-config'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'
import { Suspense } from 'react'

import { AuthShell } from '@/components/account/AuthShell'
import { CreateAccountForm } from '@/components/forms/CreateAccountForm'
import { redirect } from '@/i18n/navigation'
import { type Locale } from '@/i18n/routing'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = (await params) as { locale: Locale }
  const t = await getTranslations({ locale, namespace: 'checkout.meta' })
  return { robots: { index: false }, title: t('createAccount') }
}

export default async function CreateAccountPage({ params }: Props) {
  const { locale } = (await params) as { locale: Locale }
  setRequestLocale(locale)
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers: await getHeaders() })
  if (user) redirect({ href: '/account', locale })

  const t = await getTranslations({ locale, namespace: 'checkout.auth.register' })
  return (
    <AuthShell eyebrow={t('eyebrow')} intro={t('intro')} title={t('title')}>
      <Suspense>
        <CreateAccountForm />
      </Suspense>
    </AuthShell>
  )
}
