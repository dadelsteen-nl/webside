'use client'

import { useAddresses } from '@payloadcms/plugin-ecommerce/client/react'
import { useTranslations } from 'next-intl'
import React from 'react'

import { AddressItem } from '@/components/addresses/AddressItem'

export const AddressListing: React.FC = () => {
  const t = useTranslations('checkout.account.addresses')
  const { addresses } = useAddresses()

  if (!addresses?.length) {
    return <p className="border-y border-ink/10 py-8 text-sm text-olive-grey">{t('none')}</p>
  }

  return (
    <ul className="grid gap-5 sm:grid-cols-2">
      {addresses.map((address) => (
        <li key={address.id}>
          <AddressItem address={address} />
        </li>
      ))}
    </ul>
  )
}
