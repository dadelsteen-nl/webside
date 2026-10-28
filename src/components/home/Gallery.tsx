import { getTranslations } from 'next-intl/server'
import NextImage from 'next/image'

import { Parallax, Reveal } from '@/components/ui/motion'
import { brand } from '@/lib/brandMedia'
import { cn } from '@/utilities/cn'

import type { HomeGalleryItem } from './types'

import { SectionLabel } from './primitives'

/** Bento rhythm, repeated every five items: fixed row heights on lg so nothing overlaps. */
const layout = [
  { aspect: 'aspect-[4/3]', cell: 'col-span-2 lg:col-span-7 lg:row-span-2' },
  { aspect: 'aspect-[4/5]', cell: 'col-span-1 lg:col-span-5' },
  { aspect: 'aspect-[4/5]', cell: 'col-span-1 lg:col-span-5' },
  { aspect: 'aspect-[4/5]', cell: 'col-span-1 lg:col-span-5' },
  { aspect: 'aspect-[4/5]', cell: 'col-span-1 lg:col-span-7' },
]
const defaultMedia = [brand.apartment, brand.livingRoom, brand.armsDetail, brand.duo, brand.bench]

export async function Gallery({ items }: { items?: HomeGalleryItem[] | null }) {
  const t = await getTranslations('home.gallery')
  const captions = t.raw('captions') as string[]
  const list: HomeGalleryItem[] = items?.length ? items : captions.map((caption, i) => ({ caption, media: defaultMedia[i % defaultMedia.length] }))

  return (
    <section aria-labelledby="home-gallery-title" className="bg-sand py-24 md:py-36">
      <div className="container">
        <Reveal>
          <SectionLabel>{t('label')}</SectionLabel>
          <h2
            className="mt-8 text-[clamp(2.25rem,4.6vw,4.25rem)] font-light leading-[1.02] tracking-[-0.025em] text-ink"
            id="home-gallery-title"
          >
            {t('title')}
          </h2>
        </Reveal>

        <ul className="mt-14 grid grid-cols-2 gap-3 sm:gap-5 md:mt-20 lg:auto-rows-[clamp(15rem,21vw,20rem)] lg:grid-cols-12 lg:gap-6">
          {list.map((item, i) => {
            const l = layout[i % layout.length]!
            const media = item.media
            const isVideo = media?.mimeType?.startsWith('video/')
            return (
              <Reveal as="li" className={cn(l.cell)} delay={(i % 3) * 0.08} key={`${item.caption}-${i}`}>
                <figure className="group relative h-full">
                  <div className={cn('relative overflow-hidden bg-stone lg:aspect-auto lg:h-full', l.aspect)}>
                    <Parallax className="absolute inset-x-0 -inset-y-[8%]" offset={28}>
                      {media?.url ? (
                        isVideo ? (
                          <video
                            aria-label={item.caption || media.alt}
                            autoPlay
                            className="h-full w-full object-cover"
                            loop
                            muted
                            playsInline
                            preload="metadata"
                            src={media.url}
                          />
                        ) : (
                          <NextImage
                            alt={media.alt || item.caption || ''}
                            className="object-cover transition-transform duration-[1400ms] ease-[var(--ease-luxe)] group-hover:scale-[1.03]"
                            fill
                            sizes={i % 5 === 0 ? '(min-width: 1024px) 58vw, 100vw' : '(min-width: 1024px) 40vw, 50vw'}
                            src={media.url}
                          />
                        )
                      ) : null}
                    </Parallax>
                    <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink/55 to-transparent" />
                  </div>
                  {item.caption ? (
                    <figcaption className="absolute bottom-4 left-4 flex items-center gap-3 font-sans text-[0.625rem] uppercase tracking-[0.2em] text-cream sm:bottom-5 sm:left-5 sm:text-[0.6875rem]">
                      <span className="font-display text-xs normal-case italic tracking-normal text-bronze">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      {item.caption}
                    </figcaption>
                  ) : null}
                </figure>
              </Reveal>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
