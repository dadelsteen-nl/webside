import { Info } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

import { Reveal } from '@/components/ui/motion'
import { cn } from '@/utilities/cn'

import { emphasis, SectionLabel } from './primitives'

type Step = { status: string; title: string; text: string }

/**
 * Dadelsteen's path to nationwide availability: local government → national government →
 * rehab & physio → health-insurer reimbursement. Only the first step is current; the copy and the
 * closing note keep the later steps clearly framed as ambitions. Shared by the home and business pages.
 */
export async function Roadmap({ className }: { className?: string }) {
  const t = await getTranslations('home.roadmap')
  const steps = t.raw('steps') as Step[]

  return (
    <section aria-labelledby="roadmap-title" className={cn('bg-stone/60 py-24 md:py-36', className)}>
      <div className="container">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <Reveal className="lg:col-span-7">
            <SectionLabel>{t('label')}</SectionLabel>
            <h2
              className="mt-8 max-w-[16ch] text-[clamp(2.25rem,4.6vw,4.25rem)] font-light leading-[1.02] tracking-[-0.025em] text-ink"
              id="roadmap-title"
            >
              {t.rich('title', emphasis)}
            </h2>
          </Reveal>
          <Reveal className="lg:col-span-4 lg:col-start-9" delay={0.1}>
            <p className="max-w-sm text-base leading-relaxed text-olive-grey">{t('intro')}</p>
          </Reveal>
        </div>

        <ol className="relative mt-16 grid gap-10 md:mt-24 md:grid-cols-2 lg:grid-cols-4 lg:gap-0">
          {/* Timeline rail (desktop) */}
          <span aria-hidden="true" className="absolute top-[0.4375rem] left-0 hidden h-px w-full bg-ink/15 lg:block" />
          {steps.map((step, i) => {
            const current = i === 0
            return (
              <Reveal as="li" className="relative lg:pr-10" delay={i * 0.12} key={step.title}>
                <span
                  aria-hidden="true"
                  className={cn(
                    'relative z-10 block size-3.5 rounded-full border-2',
                    current ? 'border-palm bg-palm' : 'border-ink/30 bg-sand',
                  )}
                />
                <span
                  className={cn(
                    'mt-6 inline-flex h-7 items-center rounded-full px-3 font-sans text-[0.625rem] font-semibold uppercase tracking-[0.18em]',
                    current ? 'bg-palm text-cream' : 'border border-ink/20 text-olive-grey',
                  )}
                >
                  {step.status}
                </span>
                <h3 className="mt-5 text-2xl font-light leading-tight text-ink md:text-[1.75rem]">{step.title}</h3>
                <p className="mt-3 max-w-xs text-[0.9375rem] leading-relaxed text-olive-grey">{step.text}</p>
              </Reveal>
            )
          })}
        </ol>

        <Reveal className="mt-14 md:mt-20" delay={0.2}>
          <p className="flex max-w-3xl items-start gap-3 border-l-2 border-bronze bg-cream/70 px-5 py-4 text-sm leading-relaxed text-olive-grey">
            <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-bronze" strokeWidth={1.5} />
            {t('note')}
          </p>
        </Reveal>
      </div>
    </section>
  )
}
