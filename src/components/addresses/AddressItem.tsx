'use client'

import type { Address } from '@/payload-types'

import { useTranslations } from 'next-intl'
import React from 'react'

import { CreateAddressModal } from '@/components/addresses/CreateAddressModal'

type Props = {
  /** Partial: also used to display addresses stored on orders */
  address: Partial<Omit<Address, 'country'>> & { country?: string }
  hideActions?: boolean
}

export const AddressItem: React.FC<Props> = ({ address, hideActions = false }) => {
  const t = useTranslations('checkout.checkout.countries')
  if (!address) return null

  const country = address.country && t.has(address.country as never) ? t(address.country as never) : address.country
  const lines = [
    address.company,
    address.addressLine1,
    address.addressLine2,
    [address.postalCode, address.city].filter(Boolean).join(' '),
    country,
    address.phone,
  ].filter(Boolean)

  return (
    <div className="flex h-full flex-col border border-ink/10 bg-cream p-6">
      <p className="font-display text-xl font-light text-ink">
        {[address.firstName, address.lastName].filter(Boolean).join(' ')}
      </p>
      <address className="mt-3 grow text-sm not-italic leading-relaxed text-olive-grey">
        {lines.map((line) => (
          <span className="block" key={line}>
            {line}
          </span>
        ))}
      </address>
      {!hideActions && address.id ? (
        <div className="mt-6 border-t border-ink/10 pt-4">
          <CreateAddressModal addressID={address.id} initialData={address} variant="link" />
        </div>
      ) : null}
    </div>
  )
}
