import { getTranslations } from 'next-intl/server'

import { Reveal } from '@/components/ui/motion'
import { Link } from '@/i18n/navigation'
import { brand, brandVideo } from '@/lib/brandMedia'
import type { SiteSetting } from '@/payload-types'
import { cn } from '@/utilities/cn'

import {
  ArrowIcon,
  buttonStyles,
  CtaBand,
  emphasis,
  indexLabel,
  MediaFigure,
  PageHero,
  SectionHeader,
  SectionLabel,
} from '../shared'

type Item = { title: string; text: string }

export async function AboutHero() {
  const t = await getTranslations('pages.about.hero')
  return <PageHero eyebrow={t('eyebrow')} image={brand.home} intro={t('intro')} title={t.rich('title', emphasis)} />
}

export async function AboutStory() {
  const t = await getTranslations('pages.about.story')
  const tm = await getTranslations('pages.about.media')
  const paragraphs = t.raw('paragraphs') as string[]
  return (
    <section aria-labelledby="about-story-title" className="py-24 md:py-36">
      <div className="container grid gap-16 md:grid-cols-12">
        <div className="relative md:col-span-5">
          <Reveal className="aspect-[4/5] w-full">
            <MediaFigure caption={tm('studio')} className="h-full" image={brand.livingRoom} />
          </Reveal>
        </div>
        <div className="md:col-span-6 md:col-start-7 md:pt-12">
          <SectionHeader id="about-story-title" label={t('label')} title={t.rich('title', emphasis)} />
          <div className="mt-12 space-y-6">
            {paragraphs.map((p, i) => (
              <Reveal delay={0.1 + i * 0.08} key={i}>
                <p className={cn('leading-relaxed text-olive-grey md:text-lg', i === 0 && 'text-ink')}>{p}</p>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.3}>
            <blockquote className="mt-14 border-l border-bronze pl-6 font-display text-2xl font-light italic leading-snug text-ink md:text-3xl">
              {t('quote')}
            </blockquote>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

export async function AboutValues() {
  const t = await getTranslations('pages.about.values')
  const items = t.raw('items') as Item[]
  return (
    <section aria-labelledby="about-values-title" className="bg-cream py-24 md:py-36">
      <div className="container">
        <SectionHeader id="about-values-title" label={t('label')} title={t.rich('title', emphasis)} />
        <ul className="mt-16 grid gap-x-10 gap-y-14 sm:grid-cols-2 md:mt-24 lg:grid-cols-4">
          {items.map((item, i) => (
            <Reveal as="li" className="border-t border-ink/15 pt-7" delay={i * 0.1} key={item.title}>
              <span className="font-display text-sm font-light text-bronze-deep">{indexLabel(i)}</span>
              <h3 className="mt-8 font-display text-2xl font-light tracking-[-0.01em]">{item.title}</h3>
              <p className="mt-3 leading-relaxed text-olive-grey">{item.text}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}

export async function AboutWork() {
  const [t, tm] = await Promise.all([getTranslations('pages.about.work'), getTranslations('pages.about.media')])
  const items = t.raw('items') as Item[]
  return (
    <section aria-labelledby="about-work-title" className="py-24 md:py-36">
      <div className="container grid gap-16 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <SectionHeader id="about-work-title" label={t('label')} title={t.rich('title', emphasis)} />
          <ol className="mt-14">
            {items.map((item, i) => (
              <Reveal as="li" className="grid grid-cols-[3rem_1fr] gap-4 border-t border-ink/15 py-8" delay={i * 0.08} key={item.title}>
                <span className="pt-1 font-display text-sm font-light text-bronze-deep">{indexLabel(i)}</span>
                <div>
                  <h3 className="font-display text-2xl font-light tracking-[-0.01em]">{item.title}</h3>
                  <p className="mt-3 max-w-md leading-relaxed text-olive-grey">{item.text}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
        <div className="grid grid-cols-2 gap-4 self-end lg:col-span-5 lg:col-start-8">
          <Reveal className="col-span-2 aspect-[16/10]">
            <MediaFigure caption={tm('film')} className="h-full" image={brandVideo.heroPoster} sizes="(min-width: 1024px) 40vw, 100vw" video={brandVideo.hero} />
          </Reveal>
          <Reveal className="aspect-square" delay={0.1}>
            <MediaFigure caption={tm('team')} className="h-full" image={brand.personalTraining} sizes="(min-width: 1024px) 20vw, 50vw" />
          </Reveal>
          <Reveal className="aspect-square" delay={0.2}>
            <MediaFigure caption={tm('studio')} className="h-full" image={brand.studio} sizes="(min-width: 1024px) 20vw, 50vw" />
          </Reveal>
        </div>
      </div>
    </section>
  )
}

export async function AboutRole({ settings }: { settings: SiteSetting | null }) {
  const [t, tf] = await Promise.all([getTranslations('pages.about.role'), getTranslations('pages.about.facts')])

  const a = settings?.address
  const address = [a?.street, [a?.postalCode, a?.city].filter(Boolean).join(' '), a?.country]
    .filter(Boolean)
    .join(', ')
  const facts = [
    [tf('companyName'), settings?.companyName],
    [tf('kvk'), settings?.kvkNumber],
    [tf('vat'), settings?.vatNumber],
    [tf('address'), a?.street || a?.city ? address : null],
    [tf('email'), settings?.email],
  ].filter((f): f is [string, string] => typeof f[1] === 'string' && f[1].trim() !== '')

  return (
    <section aria-labelledby="about-role-title" className="border-t border-ink/10 bg-stone/40 py-24 md:py-36">
      {/* TODO(partnership): imbody distributorship status is unconfirmed. Keep this copy neutral
          ("we bring imbody to NL/BE") until an official partner/reseller agreement is confirmed. */}
      <div className="container grid gap-16 md:grid-cols-12">
        <div className="md:col-span-7">
          <SectionHeader id="about-role-title" label={t('label')} title={t.rich('title', emphasis)} />
          <Reveal delay={0.15}>
            <p className="mt-10 max-w-xl leading-relaxed text-olive-grey md:text-lg">{t('text')}</p>
          </Reveal>
        </div>
        {facts.length ? (
          <Reveal className="md:col-span-4 md:col-start-9 md:self-end" delay={0.2}>
            <SectionLabel as="h2" className="mb-6">
              {tf('label')}
            </SectionLabel>
            <dl className="border-t border-ink/15">
              {facts.map(([label, value]) => (
                <div className="flex flex-col gap-1 border-b border-ink/15 py-4 sm:flex-row sm:justify-between sm:gap-6" key={label}>
                  <dt className="font-sans text-[0.6875rem] uppercase tracking-[0.2em] text-olive-grey">{label}</dt>
                  <dd className="text-sm text-ink sm:text-right">{value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        ) : null}
      </div>
    </section>
  )
}

export async function AboutCta() {
  const t = await getTranslations('pages.about.cta')
  return (
    <CtaBand
      actions={
        <>
          <Link className={cn(buttonStyles.base, buttonStyles.cream)} href="/demo">
            {t('primary')}
            <ArrowIcon />
          </Link>
          <Link className={cn(buttonStyles.base, buttonStyles.outlineLight)} href="/contact">
            {t('secondary')}
          </Link>
        </>
      }
      id="about-cta-title"
      text={t('text')}
      title={t.rich('title', emphasis)}
    />
  )
}
