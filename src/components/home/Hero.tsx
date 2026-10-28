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

export async function Hero({ poster, productSlug, subtitle, title, video }: Props) {
  const t = await getTranslations('home.hero')

  const lines = title
    ? title.split(/\n+/).filter(Boolean)
    : [t.rich('titleLine1', emphasis), t.rich('titleLine2', emphasis)]

  return (
    <section
      aria-labelledby="home-hero-title"
      className="relative isolate flex min-h-[100svh] items-end overflow-hidden bg-ink text-cream"
    >
      <div className="absolute inset-0 -z-10">
        <HeroMedia label={t('videoLabel')} poster={poster} video={video} />
        {/* legibility: top for the transparent header, bottom-left for copy */}
        <div className="absolute inset-0 bg-gradient-to-b from-ink/55 via-ink/10 to-ink/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/75 via-ink/30 to-transparent md:via-ink/20" />
      </div>

      <div className="container relative pb-[clamp(5rem,12vh,9rem)] pt-36">
        <Reveal delay={0.1} duration={1.2} trigger="mount" y={12}>
          <p className="mb-8 font-sans text-[0.6875rem] font-medium uppercase tracking-[0.3em] text-cream/70">
            {t('eyebrow')}
          </p>
        </Reveal>

        <h1
          className="max-w-[14ch] font-display text-[clamp(3rem,8.4vw,8.5rem)] font-light leading-[0.9] tracking-[-0.035em]"
          id="home-hero-title"
        >
          <SplitLines delay={0.25} lines={lines} stagger={0.14} trigger="mount" />
        </h1>

        <div className="mt-10 grid gap-10 md:mt-14 md:grid-cols-12 md:items-end">
          <Reveal className="md:col-span-5" delay={0.75} trigger="mount" y={16}>
            <p className="max-w-md text-base leading-relaxed text-cream/80 md:text-lg">
              {subtitle || t('subtitle')}
            </p>
          </Reveal>

          <Reveal
            className="flex flex-col gap-3 sm:flex-row md:col-span-7 md:justify-end"
            delay={0.95}
            trigger="mount"
            y={16}
          >
            <Link className={cn(buttonStyles.base, buttonStyles.cream)} href="/demo">
              {t('ctaPrimary')}
              <ArrowIcon />
            </Link>
            <Link
              className={cn(buttonStyles.base, buttonStyles.outlineLight)}
              href={{ params: { slug: productSlug }, pathname: '/products/[slug]' }}
            >
              {t('ctaSecondary')}
            </Link>
          </Reveal>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 md:flex"
      >
        <span className="font-sans text-[0.625rem] uppercase tracking-[0.3em] text-cream/60">
          {t('scroll')}
        </span>
        <span className="relative h-12 w-px overflow-hidden bg-cream/20">
          <span className="absolute inset-x-0 top-0 h-1/2 animate-[home-scroll-cue_2.4s_var(--ease-luxe)_infinite] bg-cream" />
        </span>
      </div>
    </section>
  )
}
