import type { Media as MediaType, Product, Variant } from '@/payload-types'

import { asMedia } from '@/components/shop/productUtils'

/** Resolves the display image for a cart/order line (variant image if available). */
export const lineImage = (product: Product, variant?: Variant | null): MediaType | undefined => {
  let image = asMedia(product.gallery?.[0]?.image) || asMedia(product.meta?.image)
  if (variant) {
    const match = product.gallery?.find((g) => {
      if (!g.variantOption) return false
      const optionID = typeof g.variantOption === 'object' ? g.variantOption.id : g.variantOption
      return variant.options?.some((o) => (typeof o === 'object' ? o.id : o) === optionID)
    })
    image = asMedia(match?.image) || image
  }
  return image
}

export const variantLabel = (variant?: Variant | null) =>
  variant?.options
    ?.map((o) => (typeof o === 'object' ? o.label : null))
    .filter(Boolean)
    .join(', ')
