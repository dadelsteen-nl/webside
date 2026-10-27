import { getTranslations } from 'next-intl/server'

import { LogoIcon } from '@/components/icons/logo'
import { Reveal, SplitLines } from '@/components/ui/motion'
import { Link } from '@/i18n/navigation'
import { cn } from '@/utilities/cn'

import { Grain } from './Placeholder'
import { ArrowIcon, buttonStyles, emphasis } from './primitives'

export async function DemoCta({ whatsappNumber }: { whatsappNumber?: string | null }) {
  const t = await getTranslations('home.cta')
  const tc = await getTranslations('common')
  const wa = whatsappNumber?.replace(/\D/g, '')

  return (
    <section
      aria-labelledby="home-cta-title"
      className="relative isolate overflow-hidden bg-ink py-28 text-cream md:py-44"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(80%_120%_at_85%_110%,rgba(176,141,87,0.38),transparent_60%),radial-gradient(60%_80%_at_0%_0%,rgba(110,106,94,0.35),transparent_70%)]"
      />
      <Grain className="-z-10 opacity-[0.12] mix-blend-screen" />
      <LogoIcon
        aria-hidden="true"
        className="pointer-events-none absolute -right-[6vw] top-1/2 -z-10 h-[120%] w-auto -translate-y-1/2 text-cream/[0.05]"
      />

      <div className="container">
        <Reveal>
          <p className="flex items-center gap-3 font-sans text-[0.6875rem] font-medium uppercase tracking-[0.28em] text-cream/60">
            <span aria-hidden="true" className="h-px w-8 bg-bronze" />
            {t('eyebrow')}
          </p>
        </Reveal>
        <h2
          className="mt-10 font-display text-[clamp(3rem,9vw,8.5rem)] font-light leading-[0.92] tracking-[-0.035em]"
          id="home-cta-title"
        >
          <SplitLines lines={[t.rich('title', emphasis)]} />
        </h2>
        <div className="mt-12 grid gap-10 md:grid-cols-12 md:items-end">
          <Reveal className="md:col-span-5" delay={0.15}>
            <p className="max-w-md text-base leading-relaxed text-cream/70 md:text-lg">{t('text')}</p>
          </Reveal>
          <Reveal className="flex flex-col gap-3 sm:flex-row md:col-span-7 md:justify-end" delay={0.25}>
            <Link className={cn(buttonStyles.base, buttonStyles.cream)} href="/demo">
              {t('primary')}
              <ArrowIcon />
            </Link>
            {wa ? (
              <a
                className={cn(buttonStyles.base, buttonStyles.outlineLight)}
                href={`https://wa.me/${wa}?text=${encodeURIComponent(tc('whatsappMessage'))}`}
                rel="noopener noreferrer"
                target="_blank"
              >
                {t('whatsapp')}
              </a>
            ) : (
              <Link className={cn(buttonStyles.base, buttonStyles.outlineLight)} href="/contact">
                {tc('contactUs')}
              </Link>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  )
}
