import type { Metadata } from 'next'

import configPromise from '@payload-config'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { headers as getHeaders } from 'next/headers.js'
import { getPayload } from 'payload'

import { AddressListing } from '@/components/addresses/AddressListing'
import { CreateAddressModal } from '@/components/addresses/CreateAddressModal'
import { getPathname, redirect } from '@/i18n/navigation'
import { type Locale } from '@/i18n/routing'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = (await params) as { locale: Locale }
  const t = await getTranslations({ locale, namespace: 'checkout.meta' })
  return { robots: { index: false }, title: t('addresses') }
}

export default async function AddressesPage({ params }: Props) {
  const { locale } = (await params) as { locale: Locale }
  setRequestLocale(locale)
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers: await getHeaders() })

  if (!user) {
    const back = getPathname({ href: '/account/addresses', locale })
    return redirect({ href: { pathname: '/login', query: { reason: 'login', redirect: back } }, locale })
  }

  const t = await getTranslations({ locale, namespace: 'checkout.account.addresses' })

  return (
    <section>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-light text-ink">{t('title')}</h1>
          <p className="mt-3 text-sm text-olive-grey">{t('intro')}</p>
        </div>
        <CreateAddressModal />
      </div>
      <div className="mt-8">
        <AddressListing />
      </div>
    </section>
  )
}
