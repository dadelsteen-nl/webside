import NextImage from 'next/image'

import { brand } from '@/lib/brandMedia'
import { cn } from '@/utilities/cn'

/** One photo per technology feature, in the order of `home.tech.items`. */
const photos = [brand.mirrorCoach, brand.resistance, brand.barRow, brand.stretch, brand.minimalRoom]

export function TechVisual({
  className,
  index,
  sizes = '(min-width: 1024px) 45vw, (min-width: 768px) 50vw, 100vw',
}: {
  className?: string
  index: number
  sizes?: string
}) {
  const photo = photos[index % photos.length]!
  return (
    <div className={cn('relative h-full w-full bg-ink', className)}>
      <NextImage alt={photo.alt} className="object-cover" fill sizes={sizes} src={photo.url} />
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink/35 via-transparent to-transparent" />
    </div>
  )
}
