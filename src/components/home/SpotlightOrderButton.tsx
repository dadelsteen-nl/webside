'use client'

import { useCart } from '@payloadcms/plugin-ecommerce/client/react'
import { useState } from 'react'

import { useRouter } from '@/i18n/navigation'
import { cn } from '@/utilities/cn'

import { ArrowIcon, buttonStyles } from './primitives'

type Props = {
  productId: number
  label: string
}

/** Adds the featured product (no variants) to the cart and goes to the cart page. */
export function SpotlightOrderButton({ label, productId }: Props) {
  const { addItem } = useCart()
  const router = useRouter()
  const [pending, setPending] = useState(false)

  return (
    <button
      aria-busy={pending}
      className={cn(buttonStyles.base, buttonStyles.ink, pending && 'opacity-70')}
      disabled={pending}
      onClick={async () => {
        setPending(true)
        try {
          await addItem({ product: productId })
          router.push('/cart')
        } finally {
          setPending(false)
        }
      }}
      type="button"
    >
      {label}
      <ArrowIcon />
    </button>
  )
}
