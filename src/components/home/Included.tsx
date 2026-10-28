import { getTranslations } from 'next-intl/server'
import NextImage from 'next/image'

import { Reveal } from '@/components/ui/motion'
import { includedAccessories } from '@/lib/brandMedia'

import { SectionLabel } from './primitives'

type Item = { title: string; text: string }

/** Everything that ships with the device, one photo per accessory. */
export async function Included() {
  const t = await getTranslations('home.included')
  const copy = t.raw('items') as Record<string, Item>

  return (
    <section aria-labelledby="home-included-title" className="bg-sand py-24 md:py-36">
      <div className="container">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <Reveal className="lg:col-span-7">
            <SectionLabel>{t('label')}</SectionLabel>
            <h2
              className="mt-8 max-w-[16ch] text-[clamp(2.25rem,4.6vw,4.25rem)] font-light leading-[1.02] tracking-[-0.025em] text-ink"
              id="home-included-title"
            >
              {t('title')}
            </h2>
          </Reveal>
          <Reveal className="lg:col-span-4 lg:col-start-9" delay={0.1}>
            <p className="max-w-sm text-base leading-relaxed text-olive-grey">{t('intro')}</p>
          </Reveal>
        </div>

        <ul className="mt-14 grid grid-cols-2 gap-3 sm:gap-5 md:mt-20 lg:grid-cols-4 lg:gap-6">
          {includedAccessories.map(({ image, key }, i) => {
            const item = copy[key]
            return (
              <Reveal as="li" delay={(i % 4) * 0.06} key={key}>
                <div className="relative aspect-square overflow-hidden bg-ink">
                  <NextImage
                    alt={item?.title ?? image.alt}
                    className="object-cover transition-transform duration-[1400ms] ease-[var(--ease-luxe)] hover:scale-[1.05]"
                    fill
                    sizes="(min-width: 1024px) 22vw, 50vw"
                    src={image.url}
                  />
                </div>
                <h3 className="mt-4 text-lg font-light leading-tight text-ink md:text-xl">{item?.title}</h3>
                <p className="mt-1 text-[0.8125rem] leading-relaxed text-olive-grey">{item?.text}</p>
              </Reveal>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
