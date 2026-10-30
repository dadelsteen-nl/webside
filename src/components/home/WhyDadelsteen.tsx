import { getTranslations } from 'next-intl/server'
import NextImage from 'next/image'

import { LogoIcon } from '@/components/icons/logo'
import { Reveal } from '@/components/ui/motion'
import { Link } from '@/i18n/navigation'
import { brand } from '@/lib/brandMedia'

import { ArrowIcon, emphasis, SectionLabel } from './primitives'

type Point = { title: string; text: string }

/** Dadelsteen as the partner around the system: advice, implementation, training, insight, service. */
export async function WhyDadelsteen() {
  const t = await getTranslations('home.why')
  const points = t.raw('points') as Point[]

  return (
    <section aria-labelledby="home-why-title" className="bg-sand py-24 md:py-36">
      <div className="container grid gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <Reveal>
            <SectionLabel>{t('label')}</SectionLabel>
            <h2
              className="mt-8 max-w-[15ch] text-[clamp(2.25rem,4.6vw,4.25rem)] font-light leading-[1.02] tracking-[-0.025em] text-ink"
              id="home-why-title"
            >
              {t.rich('title', emphasis)}
            </h2>
            <p className="mt-8 max-w-md text-base leading-relaxed text-olive-grey md:text-lg">{t('text')}</p>
          </Reveal>

          <Reveal className="mt-12" delay={0.1}>
            <figure className="relative aspect-[4/3] overflow-hidden bg-stone">
              <NextImage
                alt={t('imageAlt')}
                className="object-cover"
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                src={brand.personalTraining.url}
              />
            </figure>
          </Reveal>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <ol className="border-t border-ink/15">
            {points.map((point, i) => (
              <Reveal
                as="li"
                className="grid grid-cols-[3rem_1fr] gap-4 border-b border-ink/15 py-8 md:grid-cols-[4rem_1fr] md:py-10"
                delay={i * 0.08}
                key={point.title}
                y={12}
              >
                <span aria-hidden="true" className="font-display text-sm italic text-palm">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="text-2xl font-light leading-tight text-ink md:text-[1.75rem]">{point.title}</h3>
                  <p className="mt-3 max-w-md text-[0.9375rem] leading-relaxed text-olive-grey">{point.text}</p>
                </div>
              </Reveal>
            ))}
          </ol>

          <div className="mt-10 flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4 text-olive-grey">
              <LogoIcon className="h-8 shrink-0" />
              <span className="font-sans text-xs uppercase tracking-[0.22em]">{t('signature')}</span>
            </div>
            <Link
              className="group inline-flex items-center gap-3 font-sans text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-ink"
              href="/business"
            >
              <span className="border-b border-bronze pb-1">{t('cta')}</span>
              <ArrowIcon className="text-bronze" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
