import { getTranslations } from 'next-intl/server'
import NextImage from 'next/image'

import { Reveal } from '@/components/ui/motion'
import { Link } from '@/i18n/navigation'
import { brand } from '@/lib/brandMedia'

import type { HomeMedia } from './types'

import { ArrowIcon, SectionLabel } from './primitives'

type Item = { title: string; text: string; cta: string }

const defaultImages: HomeMedia[] = [brand.home, brand.rehab, brand.personalTraining, brand.office]

type Props = {
  productSlug: string
  /** Optional imagery per card, same order as the copy (home, physio, gyms, hotels) */
  images?: (HomeMedia | null | undefined)[]
}

export async function Audiences({ images = [], productSlug }: Props) {
  const t = await getTranslations('home.audiences')
  const items = t.raw('items') as Item[]

  return (
    <section aria-labelledby="home-audiences-title" className="bg-cream py-24 md:py-36">
      <div className="container">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <Reveal className="lg:col-span-7">
            <SectionLabel>{t('label')}</SectionLabel>
            <h2
              className="mt-8 max-w-[16ch] text-[clamp(2.25rem,4.6vw,4.25rem)] font-light leading-[1.02] tracking-[-0.025em] text-ink"
              id="home-audiences-title"
            >
              {t('title')}
            </h2>
          </Reveal>
          <Reveal className="lg:col-span-4 lg:col-start-9" delay={0.1}>
            <p className="max-w-sm text-base leading-relaxed text-olive-grey">{t('intro')}</p>
          </Reveal>
        </div>

        <ul className="mt-16 grid gap-5 sm:grid-cols-2 md:mt-24 lg:grid-cols-4 lg:gap-6">
          {items.map((item, i) => {
            const image = images[i]?.url ? images[i] : defaultImages[i % defaultImages.length]
            const href =
              i === 0
                ? ({ params: { slug: productSlug }, pathname: '/products/[slug]' } as const)
                : ('/business' as const)
            return (
              <Reveal as="li" delay={i * 0.1} key={item.title}>
                <Link className="group block focus-visible:ring-offset-cream" href={href}>
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <div className="absolute inset-0 transition-transform duration-[1400ms] ease-[var(--ease-luxe)] group-hover:scale-[1.06]">
                      {image?.url ? (
                        <NextImage
                          alt={image.alt || item.title}
                          className="object-cover"
                          fill
                          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                          src={image.url}
                        />
                      ) : null}
                    </div>
                    <div
                      className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-ink/75 via-ink/10 to-transparent p-6 text-cream"
                    >
                      <span className="font-display text-sm italic opacity-70">{String(i + 1).padStart(2, '0')}</span>
                      <h3 className="mt-2 text-2xl font-light leading-tight">{item.title}</h3>
                    </div>
                  </div>
                  <p className="mt-5 text-[0.9375rem] leading-relaxed text-olive-grey">{item.text}</p>
                  <span className="mt-4 inline-flex items-center gap-3 font-sans text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-ink">
                    <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-1 transition-[background-size] duration-700 ease-[var(--ease-luxe)] group-hover:bg-[length:100%_1px]">
                      {item.cta}
                    </span>
                    <ArrowIcon className="text-bronze" />
                  </span>
                </Link>
              </Reveal>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
