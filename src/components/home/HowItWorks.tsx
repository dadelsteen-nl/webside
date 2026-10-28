import { getTranslations } from 'next-intl/server'
import NextImage from 'next/image'

import { Reveal } from '@/components/ui/motion'
import { Link } from '@/i18n/navigation'
import { brand } from '@/lib/brandMedia'
import { cn } from '@/utilities/cn'

import { ArrowIcon, buttonStyles, SectionLabel } from './primitives'

type Step = { title: string; text: string }

/** Demo in the showroom, installation at home, training with the app. */
const stepImages = [brand.studio, brand.floorInstall, brand.mirrorCoach]

export async function HowItWorks() {
  const t = await getTranslations('home.how')
  const steps = t.raw('steps') as Step[]

  return (
    <section aria-labelledby="home-how-title" className="bg-sand py-24 md:py-36">
      <div className="container">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <Reveal className="lg:col-span-7">
            <SectionLabel>{t('label')}</SectionLabel>
            <h2
              className="mt-8 max-w-[18ch] text-[clamp(2.25rem,4.6vw,4.25rem)] font-light leading-[1.02] tracking-[-0.025em] text-ink"
              id="home-how-title"
            >
              {t('title')}
            </h2>
          </Reveal>
          <Reveal className="lg:col-span-4 lg:col-start-9 lg:justify-self-end" delay={0.1}>
            <Link className={cn(buttonStyles.base, buttonStyles.ink)} href="/demo">
              {t('cta')}
              <ArrowIcon />
            </Link>
          </Reveal>
        </div>

        <ol className="mt-16 grid border-t border-ink/15 md:mt-24 md:grid-cols-3">
          {steps.map((step, i) => (
            <Reveal
              as="li"
              className={cn(
                'relative py-10 md:py-12 md:pr-10',
                i > 0 && 'border-t border-ink/15 md:border-l md:border-t-0 md:pl-10',
              )}
              delay={i * 0.12}
              key={step.title}
            >
              <span
                aria-hidden="true"
                className="absolute -top-px left-0 h-px w-16 bg-bronze md:left-auto"
              />
              <div className="relative mb-8 aspect-[4/3] overflow-hidden bg-stone">
                <NextImage
                  alt={stepImages[i]?.alt ?? ''}
                  className="object-cover"
                  fill
                  sizes="(min-width: 768px) 30vw, 100vw"
                  src={(stepImages[i] ?? brand.studio).url}
                />
              </div>
              <span className="font-display text-sm italic text-bronze-deep">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-6 text-[1.75rem] font-light leading-tight text-ink md:text-3xl">{step.title}</h3>
              <p className="mt-4 max-w-sm text-[0.9375rem] leading-relaxed text-olive-grey">{step.text}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
