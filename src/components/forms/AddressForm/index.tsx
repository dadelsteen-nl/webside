'use client'

import type { Address, Config } from '@/payload-types'

import { useAddresses } from '@payloadcms/plugin-ecommerce/client/react'
import { useTranslations } from 'next-intl'
import React, { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { SelectField, TextField } from '@/components/account/fields'
import { btn } from '@/components/shop/ui'
import { cn } from '@/utilities/cn'

/** Countries we deliver to (matches the checkout). */
export const ADDRESS_COUNTRIES = ['NL', 'BE', 'DE', 'LU'] as const

type AddressFormValues = {
  firstName?: string | null
  lastName?: string | null
  company?: string | null
  addressLine1?: string | null
  addressLine2?: string | null
  city?: string | null
  postalCode?: string | null
  country?: string | null
  phone?: string | null
}

type Props = {
  addressID?: Config['db']['defaultIDType']
  initialData?: Partial<Omit<Address, 'country' | 'id' | 'updatedAt' | 'createdAt'>> & { country?: string }
  callback?: (data: Partial<Address>) => void
  /** If true, the form will not submit to the API. */
  skipSubmission?: boolean
}

export const AddressForm: React.FC<Props> = ({ addressID, callback, initialData, skipSubmission }) => {
  const t = useTranslations('checkout.checkout')
  const ta = useTranslations('checkout.account.addresses')
  const { createAddress, updateAddress } = useAddresses()

  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
  } = useForm<AddressFormValues>({ defaultValues: { country: 'NL', ...initialData } })

  const onSubmit = useCallback(
    async (data: AddressFormValues) => {
      const next = { ...initialData, ...data } as Partial<Address>
      try {
        if (!skipSubmission) {
          if (addressID) await updateAddress(addressID, next)
          else await createAddress(next)
          toast.success(ta('saved'))
        }
        callback?.(next)
      } catch {
        toast.error(ta('saveError'))
      }
    },
    [addressID, callback, createAddress, initialData, skipSubmission, ta, updateAddress],
  )

  const required = { required: t('address.required') }

  return (
    <form className="space-y-5" noValidate onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField autoComplete="given-name" error={errors.firstName?.message} id="firstName" label={t('address.firstName')} {...register('firstName', required)} />
        <TextField autoComplete="family-name" error={errors.lastName?.message} id="lastName" label={t('address.lastName')} {...register('lastName', required)} />
        <TextField autoComplete="address-line1" className="sm:col-span-2" error={errors.addressLine1?.message} id="addressLine1" label={t('address.addressLine1')} {...register('addressLine1', required)} />
        <TextField autoComplete="address-line2" className="sm:col-span-2" id="addressLine2" label={t('address.addressLine2')} {...register('addressLine2')} />
        <TextField autoComplete="postal-code" error={errors.postalCode?.message} id="postalCode" label={t('address.postalCode')} {...register('postalCode', required)} />
        <TextField autoComplete="address-level2" error={errors.city?.message} id="city" label={t('address.city')} {...register('city', required)} />
        <SelectField autoComplete="country" id="country" label={t('address.country')} {...register('country', required)}>
          {ADDRESS_COUNTRIES.map((c) => (
            <option key={c} value={c}>
              {t(`countries.${c}`)}
            </option>
          ))}
        </SelectField>
        <TextField autoComplete="tel" id="phone" label={t('address.phone')} type="tel" {...register('phone')} />
        <TextField autoComplete="organization" className="sm:col-span-2" id="company" label={t('address.company')} {...register('company')} />
      </div>
      <div className="flex justify-end border-t border-ink/10 pt-5">
        <button className={cn(btn.ink)} disabled={isSubmitting} type="submit">
          {ta('save')}
        </button>
      </div>
    </form>
  )
}
