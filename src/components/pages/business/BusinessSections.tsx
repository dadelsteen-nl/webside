import { getTranslations } from 'next-intl/server'
import NextImage from 'next/image'

import { B2BForm } from '@/components/forms/leads'
import { Reveal } from '@/components/ui/motion'
import { Link } from '@/i18n/navigation'
import { brand } from '@/lib/brandMedia'
import { cn } from '@/utilities/cn'

import {
  ArrowIcon,
  buttonStyles,
  CtaBand,
  emphasis,
  emphasisLight,
  indexLabel,
  PageHero,
  SectionHeader,
} from '../shared'

type Item = { title: string; text: string }

const segmentImages: Record<string, typeof brand.studio> = {
  corporate: brand.modernLounge,
  fitness: brand.studio,
  government: brand.office,
  physio: brand.personalTraining,
  rehab: brand.rehab,
  social: brand.stretch,
}

export async function BusinessHero() {
  const t = await getTranslations('pages.business.hero')
  const stats = t.raw('stats') as { value: string; label: string }[]
  return (
    <PageHero
      actions={
        <>
          <a className={cn(buttonStyles.base, buttonStyles.forest)} href="#aanvraag">
            {t('primary')}
            <ArrowIcon />
          </a>
          <Link
            className={cn(buttonStyles.base, buttonStyles.outlineBronze)}
            href={{ pathname: '/demo', query: { type: 'business' } }}
          >
            {t('secondary')}
          </Link>
        </>
      }
      aside={
        <dl className="grid grid-cols-3 gap-6 border-t border-ink/15 pt-6">
          {stats.map((s) => (
            <div key={s.label}>
              <dt className="sr-only">{s.label}</dt>
              <dd className="font-display text-3xl font-light tracking-[-0.02em] text-ink md:text-4xl">{s.value}</dd>
              <dd className="mt-2 font-sans text-[0.6875rem] uppercase tracking-[0.2em] text-olive-grey" aria-hidden="true">
                {s.label}
              </dd>
            </div>
          ))}
        </dl>
      }
      eyebrow={t('eyebrow')}
      image={brand.office}
      intro={t('intro')}
      title={t.rich('title', emphasis)}
    />
  )
}

export async function BusinessSegments() {
  const t = await getTranslations('pages.business.segments')
  const items = t.raw('items') as { key: string; title: string; text: string; bullets: string[] }[]
  return (
    <section aria-labelledby="biz-segments-title" className="py-24 md:py-36">
      <div className="container">
        <SectionHeader id="biz-segments-title" label={t('label')} title={t.rich('title', emphasis)} />
        <ul className="mt-16 grid gap-6 md:mt-24 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => {
            const image = segmentImages[item.key] ?? brand.studio
            return (
              <Reveal
                as="li"
                className="flex scroll-mt-28 flex-col border border-ink/10 bg-cream"
                delay={(i % 3) * 0.1}
                id={item.key}
                key={item.key}
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-stone">
                  <NextImage
                    alt={image.alt}
                    className="object-cover"
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    src={image.url}
                  />
                </div>
                <div className="flex flex-1 flex-col p-8 md:p-10">
                  <span className="font-display text-sm font-light text-palm">{indexLabel(i)}</span>
                  <h3 className="mt-6 font-display text-2xl font-light tracking-[-0.02em] md:text-3xl">{item.title}</h3>
                  <p className="mb-8 mt-4 leading-relaxed text-olive-grey">{item.text}</p>
                  <ul className="mt-auto space-y-3 border-t border-ink/10 pt-6">
                    {item.bullets.map((b) => (
                      <li className="flex gap-3 text-sm leading-relaxed text-ink" key={b}>
                        <span aria-hidden="true" className="mt-2.5 h-px w-4 shrink-0 bg-bronze" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

export async function BusinessWhy() {
  const t = await getTranslations('pages.business.why')
  const items = t.raw('items') as Item[]
  return (
    <section aria-labelledby="biz-why-title" className="relative overflow-hidden bg-forest py-24 text-cream md:py-36">
      <div className="container">
        <div className="max-w-3xl">
          <Reveal>
            <p className="flex items-center gap-3 font-sans text-[0.6875rem] font-medium uppercase tracking-[0.28em] text-cream/60">
              <span aria-hidden="true" className="h-px w-8 bg-clay" />
              {t('label')}
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2
              className="mt-8 font-display text-[clamp(2.25rem,5vw,4.25rem)] font-light leading-[1.02] tracking-[-0.03em]"
              id="biz-why-title"
            >
              {t.rich('title', emphasisLight)}
            </h2>
          </Reveal>
        </div>
        <ul className="mt-16 grid gap-x-10 gap-y-14 sm:grid-cols-2 md:mt-24 lg:grid-cols-5 lg:gap-x-8">
          {items.map((item, i) => (
            <Reveal as="li" className="border-t border-cream/20 pt-6" delay={i * 0.08} key={item.title}>
              <span className="font-display text-sm font-light text-clay">{indexLabel(i)}</span>
              <h3 className="mt-6 font-display text-xl font-light tracking-[-0.01em] md:text-2xl">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-cream/65">{item.text}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}

export async function BusinessProcess() {
  const t = await getTranslations('pages.business.process')
  const steps = t.raw('steps') as Item[]
  return (
    <section aria-labelledby="biz-process-title" className="py-24 md:py-36">
      <div className="container">
        <SectionHeader id="biz-process-title" label={t('label')} title={t.rich('title', emphasis)} />
        <ol className="relative mt-16 grid gap-12 md:mt-24 md:grid-cols-4 md:gap-8">
          <span aria-hidden="true" className="absolute top-[0.6rem] left-0 hidden h-px w-full bg-ink/15 md:block" />
          {steps.map((step, i) => (
            <Reveal as="li" className="relative" delay={i * 0.12} key={step.title}>
              <span aria-hidden="true" className="relative block h-[1.2rem] w-[1.2rem] rounded-full border border-bronze bg-sand">
                <span className="absolute inset-[5px] rounded-full bg-bronze" />
              </span>
              <p className="mt-8 font-sans text-[0.6875rem] font-medium uppercase tracking-[0.22em] text-olive-grey">
                {indexLabel(i)}
              </p>
              <h3 className="mt-3 font-display text-2xl font-light tracking-[-0.01em]">{step.title}</h3>
              <p className="mt-3 max-w-xs leading-relaxed text-olive-grey">{step.text}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}

export async function BusinessProcurement() {
  const t = await getTranslations('pages.business.procurement')
  const items = t.raw('items') as Item[]
  return (
    <section aria-labelledby="biz-procurement-title" className="py-24 md:py-36">
      <div className="container grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SectionHeader
            id="biz-procurement-title"
            intro={t('intro')}
            label={t('label')}
            title={t.rich('title', emphasis)}
          />
          <Reveal className="mt-10" delay={0.2}>
            <a className={cn(buttonStyles.base, buttonStyles.outlineBronze)} href="#aanvraag">
              {t('cta')}
              <ArrowIcon />
            </a>
          </Reveal>
        </div>
        <ul className="grid gap-px self-start border border-ink/10 bg-ink/10 sm:grid-cols-2 lg:col-span-7">
          {items.map((item, i) => (
            <Reveal as="li" className="bg-cream p-8 md:p-10" delay={i * 0.08} key={item.title}>
              <span className="font-display text-sm font-light text-palm">{indexLabel(i)}</span>
              <h3 className="mt-5 font-display text-xl font-light tracking-[-0.01em] text-ink md:text-2xl">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-olive-grey">{item.text}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}

export async function BusinessFormSection() {
  const t = await getTranslations('pages.business.form')
  const points = t.raw('points') as string[]
  return (
    <section aria-labelledby="biz-form-title" className="scroll-mt-24 bg-stone/40 py-24 md:py-36" id="aanvraag">
      <div className="container grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <SectionHeader id="biz-form-title" intro={t('intro')} label={t('label')} title={t.rich('title', emphasis)} />
          <Reveal delay={0.2}>
            <ul className="mt-12 space-y-4">
              {points.map((p) => (
                <li className="flex items-center gap-4 text-sm text-ink" key={p}>
                  <span aria-hidden="true" className="h-px w-6 bg-bronze" />
                  {p}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
        <Reveal className="lg:col-span-7 lg:col-start-6" delay={0.1}>
          <div className="border border-ink/10 bg-cream px-6 py-10 sm:px-10 md:px-14 md:py-14">
            <B2BForm />
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export async function BusinessCta() {
  const t = await getTranslations('pages.business.cta')
  return (
    <CtaBand
      actions={
        <Link
          className={cn(buttonStyles.base, buttonStyles.cream)}
          href={{ pathname: '/demo', query: { type: 'business' } }}
        >
          {t('button')}
          <ArrowIcon />
        </Link>
      }
      id="biz-cta-title"
      text={t('text')}
      title={t.rich('title', emphasis)}
    />
  )
}
