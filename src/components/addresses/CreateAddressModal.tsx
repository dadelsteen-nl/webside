'use client'

import type { Address } from '@/payload-types'
import type { DefaultDocumentIDType } from 'payload'

import { useTranslations } from 'next-intl'
import React, { useState } from 'react'

import { AddressForm } from '@/components/forms/AddressForm'
import { btn } from '@/components/shop/ui'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { cn } from '@/utilities/cn'

type Props = {
  addressID?: DefaultDocumentIDType
  initialData?: Partial<Omit<Address, 'country'>> & { country?: string }
  variant?: 'primary' | 'link'
  callback?: (address: Partial<Address>) => void
  skipSubmission?: boolean
  disabled?: boolean
}

/** Opens the address form in a dialog, for adding (default) or editing (`addressID`). */
export const CreateAddressModal: React.FC<Props> = ({
  addressID,
  callback,
  disabled,
  initialData,
  skipSubmission,
  variant = 'primary',
}) => {
  const t = useTranslations('checkout.account.addresses')
  const [open, setOpen] = useState(false)
  const editing = Boolean(addressID)

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild disabled={disabled}>
        <button className={variant === 'link' ? btn.link : cn(btn.outlineBronze)} type="button">
          {editing ? t('edit') : t('add')}
        </button>
      </DialogTrigger>
      <DialogContent className="max-h-[90svh] overflow-y-auto rounded-none border-ink/10 bg-sand p-6 sm:max-w-xl md:p-8">
        <DialogHeader className="border-b border-ink/10 pb-5">
          <DialogTitle className="font-display text-2xl font-light text-ink">
            {editing ? t('editTitle') : t('addTitle')}
          </DialogTitle>
          <DialogDescription className="text-sm text-olive-grey">{t('modalText')}</DialogDescription>
        </DialogHeader>
        <AddressForm
          addressID={addressID}
          callback={(data) => {
            setOpen(false)
            callback?.(data)
          }}
          initialData={initialData}
          skipSubmission={skipSubmission}
        />
      </DialogContent>
    </Dialog>
  )
}
