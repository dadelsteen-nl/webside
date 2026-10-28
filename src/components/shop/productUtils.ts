import type { Media, Product, Variant } from '@/payload-types'

export const asMedia = (value: unknown): Media | undefined =>
  value && typeof value === 'object' && 'url' in (value as object) ? (value as Media) : undefined

/** First gallery image, falling back to the SEO image. */
/** Transparent product cut-outs are shown whole; photos fill their frame. */
export const mediaFit = (media?: Partial<Media> | null): string =>
  media?.mimeType === 'image/png' ? 'object-contain p-[6%]' : 'object-cover'

export const getProductImage = (product: Partial<Product>): Media | undefined =>
  asMedia(product.gallery?.[0]?.image) || asMedia(product.meta?.image)

export const getVariants = (product: Partial<Product>): Variant[] =>
  (product.variants?.docs || []).filter((v): v is Variant => Boolean(v) && typeof v === 'object')

/** Lowest price in cents (variants respected). */
export const getProductPrice = (product: Partial<Product>): number | undefined => {
  const variants = product.enableVariants ? getVariants(product) : []
  const prices = variants
    .map((v) => v.priceInEUR)
    .filter((p): p is number => typeof p === 'number')
  if (prices.length) return Math.min(...prices)
  return typeof product.priceInEUR === 'number' ? product.priceInEUR : undefined
}

export const isInStock = (product: Partial<Product>): boolean => {
  if (product.enableVariants) return getVariants(product).some((v) => (v.inventory || 0) > 0)
  return (product.inventory || 0) > 0
}
