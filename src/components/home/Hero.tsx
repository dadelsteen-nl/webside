import { getTranslations } from 'next-intl/server'

import { Link } from '@/i18n/navigation'
import { Reveal, SplitLines } from '@/components/ui/motion'
import { cn } from '@/utilities/cn'

import type { HomeMedia } from './types'

import { HeroMedia } from './HeroMedia'
import { ArrowIcon, buttonStyles, emphasis } from './primitives'

type Props = {
  /** CMS override; newlines split the headline into revealed lines */
  title?: string | null
  subtitle?: string | null
  video?: HomeMedia | null
  poster?: HomeMedia | null
  productSlug: string
}

type Sector = { key: string; label: string }

/**
 * Light, organisation-first hero: Dadelsteen's promise on sand, the imbody system framed on the right,
 * and quick links into the sectors on the business page.
 */
export async function Hero({ poster, productSlug, subtitle, title, video }: Props) {
  const t = await getTranslations('home.hero')
  const sectors = t.raw('sectors') as Sector[]

  const lines = title
    ? title.split(/\n+/).filter(Boolean)
    : [t.rich('titleLine1', emphasis), t.rich('titleLine2', emphasis)]

  return (
    <section
      aria-labelledby="home-hero-title"
      className="relative isolate overflow-hidden bg-sand pt-28 text-ink md:pt-36"
    >
      {/* Soft palm-green and desert washes instead of a dark overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(55%_60%_at_8%_10%,rgba(70,112,79,0.10),transparent_70%),radial-gradient(45%_50%_at_95%_90%,rgba(201,165,122,0.22),transparent_70%)]"
      />

      <div className="container grid gap-12 pb-16 md:pb-24 lg:grid-cols-12 lg:items-center lg:gap-10">
        <div className="lg:col-span-6 xl:col-span-6">
          <Reveal delay={0.1} duration={1.2} trigger="mount" y={12}>
            <p className="mb-8 flex items-center gap-3 font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.28em] text-palm">
              <span aria-hidden="true" className="h-px w-8 bg-palm" />
              {t('eyebrow')}
            </p>
          </Reveal>

          <h1
            className="max-w-[13ch] font-display text-[clamp(2.75rem,6.4vw,6.25rem)] font-light leading-[0.95] tracking-[-0.03em]"
            id="home-hero-title"
          >
            <SplitLines delay={0.25} lines={lines} stagger={0.14} trigger="mount" />
          </h1>

          <Reveal delay={0.7} trigger="mount" y={16}>
            <p className="mt-8 max-w-xl text-base leading-relaxed text-olive-grey md:text-lg">
              {subtitle || t('subtitle')}
            </p>
          </Reveal>

          <Reveal className="mt-10 flex flex-col gap-3 sm:flex-row" delay={0.85} trigger="mount" y={16}>
            <Link className={cn(buttonStyles.base, buttonStyles.forest)} href={{ hash: 'aanvraag', pathname: '/business' }}>
              {t('ctaPrimary')}
              <ArrowIcon />
            </Link>
            <Link
              className={cn(buttonStyles.base, buttonStyles.outlineInk)}
              href={{ params: { slug: productSlug }, pathname: '/products/[slug]' }}
            >
              {t('ctaSecondary')}
            </Link>
          </Reveal>
        </div>

        <Reveal className="lg:col-span-6" delay={0.3} duration={1.4} trigger="mount" y={24}>
          <div className="relative">
            <div
              aria-hidden="true"
              className="absolute -right-3 -bottom-3 hidden h-full w-full border border-bronze/40 md:block"
            />
            <div className="relative aspect-[4/5] overflow-hidden bg-stone sm:aspect-[16/11] lg:aspect-[4/5] xl:aspect-[5/5]">
              <HeroMedia label={t('videoLabel')} poster={poster} video={video} />
              <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink/45 via-transparent to-transparent" />
              <p className="absolute bottom-5 left-5 right-5 font-sans text-[0.6875rem] font-medium uppercase tracking-[0.22em] text-cream">
                {t('mediaCaption')}
              </p>
            </div>
          </div>
        </Reveal>
      </div>

      {/* Sector quick links */}
      <div className="border-t border-ink/10 bg-cream/70">
        <nav aria-label={t('sectorsLabel')} className="container">
          <ul className="flex flex-wrap items-center gap-x-2 gap-y-2 py-5 md:py-6">
            <li className="mr-4 font-sans text-[0.625rem] font-semibold uppercase tracking-[0.28em] text-olive-grey">
              {t('sectorsLabel')}
            </li>
            {sectors.map((s) => (
              <li key={s.key}>
                <Link
                  className="inline-flex h-9 items-center rounded-full border border-ink/15 px-4 text-[0.8125rem] text-ink transition-colors duration-500 ease-[var(--ease-luxe)] hover:border-palm hover:bg-palm hover:text-cream"
                  href={{ hash: s.key, pathname: '/business' }}
                >
                  {s.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  )
}
