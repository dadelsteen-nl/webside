import { getTranslations } from 'next-intl/server'

import { DemoForm } from '@/components/forms/leads'
import { Reveal } from '@/components/ui/motion'
import { brand } from '@/lib/brandMedia'
import { cn } from '@/utilities/cn'

import { ArrowIcon, buttonStyles, emphasis, FaqList, indexLabel, PageHero, SectionHeader } from '../shared'

type Item = { title: string; text: string }

export async function DemoHero() {
  const t = await getTranslations('pages.demo.hero')
  const meta = t.raw('meta') as string[]
  return (
    <PageHero
      actions={
        <a className={cn(buttonStyles.base, buttonStyles.ink)} href="#plan">
          {t('cta')}
          <ArrowIcon />
        </a>
      }
      aside={
        <ul className="flex flex-wrap gap-x-8 gap-y-3 border-t border-ink/15 pt-6">
          {meta.map((m) => (
            <li
              className="font-sans text-[0.6875rem] font-medium uppercase tracking-[0.22em] text-olive-grey"
              key={m}
            >
              {m}
            </li>
          ))}
        </ul>
      }
      eyebrow={t('eyebrow')}
      image={brand.mirrorCoach}
      intro={t('intro')}
      title={t.rich('title', emphasis)}
    />
  )
}

function OptionGlyph({ kind }: { kind: string }) {
  const common = { fill: 'none', stroke: 'currentColor', strokeWidth: 1 }
  return (
    <svg aria-hidden="true" className="h-12 w-12 text-bronze" viewBox="0 0 48 48">
      {kind === 'showroom' ? (
        <g {...common}>
          <path d="M8 42V18a16 16 0 0 1 32 0v24" />
          <path d="M4 42h40" />
          <rect height="16" rx="1" width="8" x="20" y="22" />
        </g>
      ) : kind === 'at-home' ? (
        <g {...common}>
          <path d="M6 22 24 8l18 14" />
          <path d="M10 19v23h28V19" />
          <rect height="13" rx="1" width="7" x="20.5" y="27" />
        </g>
      ) : (
        <g {...common}>
          <rect height="24" rx="1.5" width="36" x="6" y="10" />
          <path d="M18 42h12M24 34v8" />
          <path d="M21 17v10l8-5z" />
        </g>
      )}
    </svg>
  )
}

export async function DemoOptions() {
  const t = await getTranslations('pages.demo.options')
  const items = t.raw('items') as { key: string; title: string; text: string; meta: string }[]
  return (
    <section aria-labelledby="demo-options-title" className="py-24 md:py-36">
      <div className="container">
        <SectionHeader id="demo-options-title" label={t('label')} title={t.rich('title', emphasis)} />
        <ul className="mt-16 grid gap-5 md:mt-24 md:grid-cols-3 md:gap-6">
          {items.map((item, i) => (
            <Reveal as="li" className={cn('h-full', i === 1 && 'md:mt-12')} delay={i * 0.12} key={item.key}>
              <article className="flex h-full flex-col border border-ink/10 bg-cream p-8 transition-colors duration-700 hover:border-bronze/60 md:p-10">
                <div className="flex items-start justify-between">
                  <OptionGlyph kind={item.key} />
                  <span className="font-display text-sm font-light text-olive-grey">{indexLabel(i)}</span>
                </div>
                <h3 className="mt-12 font-display text-3xl font-light tracking-[-0.02em]">{item.title}</h3>
                <p className="mt-4 flex-1 leading-relaxed text-olive-grey">{item.text}</p>
                <p className="mt-10 border-t border-ink/10 pt-5 font-sans text-[0.6875rem] font-medium uppercase tracking-[0.22em] text-ink">
                  {item.meta}
                </p>
              </article>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}

export async function DemoExpect() {
  const t = await getTranslations('pages.demo.expect')
  const items = t.raw('items') as Item[]
  return (
    <section aria-labelledby="demo-expect-title" className="bg-stone/40 py-24 md:py-36">
      <div className="container grid gap-16 md:grid-cols-12">
        <div className="md:col-span-5">
          <div className="md:sticky md:top-32">
            <SectionHeader id="demo-expect-title" label={t('label')} title={t.rich('title', emphasis)} />
          </div>
        </div>
        <ol className="md:col-span-6 md:col-start-7">
          {items.map((item, i) => (
            <Reveal as="li" className="grid grid-cols-[3rem_1fr] gap-4 border-t border-ink/15 py-9" delay={i * 0.08} key={item.title}>
              <span className="pt-1 font-display text-sm font-light text-bronze-deep">{indexLabel(i)}</span>
              <div>
                <h3 className="font-display text-2xl font-light tracking-[-0.01em] md:text-[1.75rem]">{item.title}</h3>
                <p className="mt-3 max-w-md leading-relaxed text-olive-grey">{item.text}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}

export async function DemoFormSection({ audience }: { audience: 'private' | 'business' }) {
  const t = await getTranslations('pages.demo.form')
  const reassurance = t.raw('reassurance') as string[]
  return (
    <section aria-labelledby="demo-form-title" className="scroll-mt-24 py-24 md:py-36" id="plan">
      <div className="container grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <SectionHeader id="demo-form-title" intro={t('intro')} label={t('label')} title={t.rich('title', emphasis)} />
          <Reveal delay={0.2}>
            <ul className="mt-12 space-y-4">
              {reassurance.map((r) => (
                <li className="flex items-center gap-4 text-sm text-ink" key={r}>
                  <svg aria-hidden="true" className="h-3 w-3 shrink-0 text-bronze" fill="none" viewBox="0 0 12 12">
                    <path d="M1.5 6.5 4.5 9.5 10.5 2.5" stroke="currentColor" strokeWidth="1.3" />
                  </svg>
                  {r}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
        <Reveal className="lg:col-span-7 lg:col-start-6" delay={0.1}>
          <div className="border border-ink/10 bg-cream px-6 py-10 sm:px-10 md:px-14 md:py-14">
            <DemoForm defaultAudience={audience} />
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export async function DemoFaq() {
  const t = await getTranslations('pages.demo.faq')
  const items = t.raw('items') as { q: string; a: string }[]
  return (
    <section aria-labelledby="demo-faq-title" className="border-t border-ink/10 py-24 md:py-32">
      <div className="container grid gap-12 md:grid-cols-12">
        <div className="md:col-span-4">
          <SectionHeader id="demo-faq-title" label={t('label')} title={t('title')} />
        </div>
        <div className="md:col-span-7 md:col-start-6">
          <FaqList items={items} />
        </div>
      </div>
    </section>
  )
}
