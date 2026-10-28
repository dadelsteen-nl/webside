import type { ReactNode } from 'react'

import configPromise from '@payload-config'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { headers as getHeaders } from 'next/headers.js'
import { getPayload } from 'payload'

import { AccountNav } from '@/components/AccountNav'
import { Eyebrow } from '@/components/shop/ui'
import { type Locale } from '@/i18n/routing'

type Props = { children: ReactNode; params: Promise<{ locale: string }> }

/** Logged-in customers get the account header and navigation; guests (order links) only the page. */
export default async function AccountLayout({ children, params }: Props) {
  const { locale } = (await params) as { locale: Locale }
  setRequestLocale(locale)
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers: await getHeaders() })

  if (!user) return <div className="container pt-10 md:pt-16">{children}</div>

  const t = await getTranslations({ locale, namespace: 'checkout.account' })
  const ta = await getTranslations({ locale, namespace: 'checkout.auth.login' })
  const name = user.name?.trim()

  return (
    <div className="container pb-24 pt-10 md:pb-32 md:pt-16">
      <Eyebrow>{t('eyebrow')}</Eyebrow>
      <p className="mt-6 font-display text-4xl font-light leading-tight text-ink md:text-5xl">
        {name ? t('greeting', { name }) : ta('eyebrow')}
      </p>
      <div className="mt-10 grid gap-10 md:mt-14 lg:grid-cols-12 lg:gap-16">
        <AccountNav className="lg:col-span-3" />
        <div className="min-w-0 lg:col-span-9">{children}</div>
      </div>
    </div>
  )
}
