import { getTranslations } from 'next-intl/server'
import NextImage from 'next/image'

import { Parallax, Reveal } from '@/components/ui/motion'
import { cn } from '@/utilities/cn'

import type { HomeGalleryItem } from './types'

import { PlaceholderPanel, type PlaceholderTone, SceneArt } from './Placeholder'
import { SectionLabel } from './primitives'

/** Editorial rhythm, repeated every five items. */
const layout = [
  { aspect: 'aspect-[4/5]', cell: 'col-span-2 lg:col-span-7 lg:row-span-2' },
  { aspect: 'aspect-[4/3]', cell: 'col-span-1 lg:col-span-5' },
  { aspect: 'aspect-[4/3]', cell: 'col-span-1 lg:col-span-4 lg:col-start-9' },
  { aspect: 'aspect-[3/4] lg:aspect-[4/5]', cell: 'col-span-1 lg:col-span-4 lg:col-start-2' },
  { aspect: 'aspect-[3/4] lg:aspect-[16/10]', cell: 'col-span-1 lg:col-span-6 lg:col-start-7 lg:-mt-24' },
]
const tones: PlaceholderTone[] = ['stone', 'sand', 'dusk', 'bronze', 'stone']

export async function Gallery({ items }: { items?: HomeGalleryItem[] | null }) {
  const t = await getTranslations('home.gallery')
  const captions = t.raw('captions') as string[]
  const list: HomeGalleryItem[] = items?.length ? items : captions.map((caption) => ({ caption }))

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

        <ul className="mt-14 grid grid-cols-2 gap-3 sm:gap-5 md:mt-20 lg:grid-cols-12 lg:gap-6">
          {list.map((item, i) => {
            const l = layout[i % layout.length]!
            const media = item.media
            const isVideo = media?.mimeType?.startsWith('video/')
            return (
              <Reveal as="li" className={cn(l.cell)} delay={(i % 3) * 0.08} key={`${item.caption}-${i}`}>
                <figure>
                  <div className={cn('relative overflow-hidden', l.aspect)}>
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
                            className="object-cover"
                            fill
                            sizes={i % 5 === 0 ? '(min-width: 1024px) 58vw, 100vw' : '(min-width: 1024px) 40vw, 50vw'}
                            src={media.url}
                          />
                        )
                      ) : (
                        <PlaceholderPanel className="h-full w-full" tone={tones[i % tones.length]}>
                          <SceneArt variant={i + 1} />
                        </PlaceholderPanel>
                      )}
                    </Parallax>
                  </div>
                  {item.caption ? (
                    <figcaption className="mt-3 flex items-center gap-3 font-sans text-[0.6875rem] uppercase tracking-[0.2em] text-olive-grey">
                      <span className="font-display text-xs normal-case italic tracking-normal text-bronze-deep">
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
