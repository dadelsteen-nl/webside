'use client'

import type { Media as MediaType } from '@/payload-types'

import useEmblaCarousel from 'embla-carousel-react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import React, { useCallback, useEffect, useState } from 'react'

import { Media } from '@/components/Media'
import { cn } from '@/utilities/cn'
import { mediaFit } from '@/components/shop/productUtils'

type Props = {
  images: MediaType[]
  title: string
}

/** Product gallery: swipeable main image (embla) with thumbnail strip. */
export const Gallery: React.FC<Props> = ({ images, title }) => {
  const t = useTranslations('shop.product.gallery')
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, duration: 30 })
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (!emblaApi) return
    const onSelect = () => setCurrent(emblaApi.selectedScrollSnap())
    onSelect()
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)
    return () => {
      emblaApi.off('select', onSelect)
      emblaApi.off('reInit', onSelect)
    }
  }, [emblaApi])

  const scrollTo = useCallback((i: number) => emblaApi?.scrollTo(i), [emblaApi])

  if (!images.length) {
    return <div aria-hidden="true" className="aspect-[4/5] w-full bg-stone" />
  }

  const multiple = images.length > 1

  return (
    <div aria-label={t('label')} className="flex flex-col gap-4" role="region">
      <div className="relative bg-stone">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex touch-pan-y">
            {images.map((image, i) => (
              <div
                aria-label={`${i + 1} / ${images.length}`}
                aria-roledescription="slide"
                className="relative aspect-[4/5] min-w-0 flex-[0_0_100%]"
                key={`${image.id}-${i}`}
                role="group"
              >
                <Media
                  className="absolute inset-0"
                  fill
                  imgClassName={mediaFit(image)}
                  priority={i === 0}
                  resource={image}
                  size="(min-width: 1024px) 55vw, 100vw"
                />
              </div>
            ))}
          </div>
        </div>

        {multiple ? (
          <div className="pointer-events-none absolute inset-x-4 bottom-4 flex items-center justify-between">
            <span className="pointer-events-auto bg-cream/85 px-3 py-1.5 font-sans text-[0.625rem] uppercase tracking-[0.2em] text-ink backdrop-blur-sm">
              {String(current + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
            </span>
            <div className="pointer-events-auto flex gap-2">
              <button
                aria-label={t('previous')}
                className="flex size-10 items-center justify-center bg-cream/85 text-ink backdrop-blur-sm transition-colors duration-500 hover:bg-cream disabled:opacity-40"
                disabled={current === 0}
                onClick={() => emblaApi?.scrollPrev()}
                type="button"
              >
                <ChevronLeft className="size-4" strokeWidth={1.25} />
              </button>
              <button
                aria-label={t('next')}
                className="flex size-10 items-center justify-center bg-cream/85 text-ink backdrop-blur-sm transition-colors duration-500 hover:bg-cream disabled:opacity-40"
                disabled={current === images.length - 1}
                onClick={() => emblaApi?.scrollNext()}
                type="button"
              >
                <ChevronRight className="size-4" strokeWidth={1.25} />
              </button>
            </div>
          </div>
        ) : null}
      </div>

      {multiple ? (
        <ul className="grid grid-cols-5 gap-3">
          {images.map((image, i) => (
            <li key={`thumb-${image.id}-${i}`}>
              <button
                aria-current={i === current ? 'true' : undefined}
                aria-label={t('show', { index: i + 1 })}
                className={cn(
                  'relative block aspect-square w-full overflow-hidden bg-stone outline outline-1 outline-offset-2 transition-[outline-color,opacity] duration-500',
                  i === current ? 'outline-bronze' : 'outline-transparent opacity-70 hover:opacity-100',
                )}
                onClick={() => scrollTo(i)}
                type="button"
              >
                <Media
                  alt={`${title} ${i + 1}`}
                  className="absolute inset-0"
                  fill
                  imgClassName={mediaFit(image)}
                  resource={image}
                  size="120px"
                />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
