import type { Product, ThreeItemGridBlock as ThreeItemGridBlockProps } from '@/payload-types'

import { GridTileImage } from '@/components/Grid/tile'
import { Link } from '@/i18n/navigation'
import { getProductImage, getProductPrice } from '@/components/shop/productUtils'
import React from 'react'
import type { DefaultDocumentIDType } from 'payload'

type Props = { item: Product; priority?: boolean; size: 'full' | 'half' }

export const ThreeItemGridItem: React.FC<Props> = ({ item, size }) => {
  return (
    <div
      className={size === 'full' ? 'md:col-span-4 md:row-span-2' : 'md:col-span-2 md:row-span-1'}
    >
      <Link className="relative block aspect-square h-full w-full" href={{ pathname: '/products/[slug]', params: { slug: item.slug } }}>
        <GridTileImage
          label={{
            amount: getProductPrice(item) ?? 0,
            position: size === 'full' ? 'center' : 'bottom',
            title: item.title,
          }}
          media={getProductImage(item)}
        />
      </Link>
    </div>
  )
}

export const ThreeItemGridBlock: React.FC<
  ThreeItemGridBlockProps & {
    id?: DefaultDocumentIDType
    className?: string
  }
> = async ({ products }) => {
  if (!products || !products[0] || !products[1] || !products[2]) return null

  const [firstProduct, secondProduct, thirdProduct] = products

  return (
    <section className="container grid gap-4 pb-4 md:grid-cols-6 md:grid-rows-2">
      <ThreeItemGridItem item={firstProduct as Product} priority size="full" />
      <ThreeItemGridItem item={secondProduct as Product} priority size="half" />
      <ThreeItemGridItem item={thirdProduct as Product} size="half" />
    </section>
  )
}
