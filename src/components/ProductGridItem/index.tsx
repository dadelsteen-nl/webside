import type { Product } from '@/payload-types'

import { ProductCard } from '@/components/shop/ProductCard'
import React from 'react'

type Props = {
  product: Partial<Product>
}

/** Kept for compatibility with template imports; renders the brand product card. */
export const ProductGridItem: React.FC<Props> = ({ product }) => <ProductCard product={product} />
