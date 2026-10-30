import { getTranslations } from 'next-intl/server'
import NextImage from 'next/image'
import type { ReactNode } from 'react'

import { ContactForm } from '@/components/forms/leads'
import { Reveal } from '@/components/ui/motion'
import { Link } from '@/i18n/navigation'
import { brand } from '@/lib/brandMedia'
import type { SiteSetting } from '@/payload-types'
import { cn } from '@/utilities/cn'

import { ArrowIcon, buttonStyles, emphasis, PageHero, SectionLabel } from '../shared'

export async function ContactHero() {
  const t = await getTranslations('pages.contact.hero')
  return <PageHero eyebrow={t('eyebrow')} intro={t('intro')} title={t.rich('title', emphasis)} />
}

function formatAddress(settings: SiteSetting | null) {
  const a = settings?.address
  if (!a?.street && !a?.city) return null
  const lines = [a.street, [a.postalCode, a.city].filter(Boolean).join(' '), a.country].filter(
    (l): l is string => Boolean(l && l.trim()),
  )
  return lines
}

function DetailRow({ children, label }: { label: string; children: ReactNode }) {
  return (
    <div className="border-t border-ink/15 py-6">
      <dt className="font-sans text-[0.6875rem] font-medium uppercase tracking-[0.22em] text-olive-grey">{label}</dt>
      <dd className="mt-2.5 text-lg text-ink">{children}</dd>
    </div>
  )
}

const linkClass =
  'underline decoration-transparent underline-offset-[6px] transition-[text-decoration-color] duration-500 hover:decoration-bronze'

export async function ContactMain({ settings }: { settings: SiteSetting | null }) {
  const [t, tf] = await Promise.all([
    getTranslations('pages.contact.details'),
    getTranslations('pages.contact.form'),
  ])

  const email = settings?.email?.trim()
  const phone = settings?.phone?.trim()
  const wa = settings?.whatsappNumber?.replace(/\D/g, '')
  const address = formatAddress(settings)
  const hours = settings?.openingHours?.trim()

  return (
    <section aria-label={t('title')} className="py-20 md:py-32">
      <div className="container grid gap-20 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-4">
          <Reveal>
            <SectionLabel as="h2">{t('title')}</SectionLabel>
          </Reveal>
          <Reveal delay={0.1}>
            <dl className="mt-10">
              {email ? (
                <DetailRow label={t('email')}>
                  <a className={linkClass} href={`mailto:${email}`}>
                    {email}
                  </a>
                </DetailRow>
              ) : null}
              {phone ? (
                <DetailRow label={t('phone')}>
                  <a className={linkClass} href={`tel:${phone.replace(/[^\d+]/g, '')}`}>
                    {phone}
                  </a>
                </DetailRow>
              ) : null}
              {address ? (
                <DetailRow label={t('address')}>
                  <address className="not-italic leading-relaxed">
                    {address.map((line) => (
                      <span className="block" key={line}>
                        {line}
                      </span>
                    ))}
                  </address>
                </DetailRow>
              ) : null}
              {hours ? (
                <DetailRow label={t('hours')}>
                  <span className="block whitespace-pre-line text-base leading-relaxed">{hours}</span>
                </DetailRow>
              ) : null}
            </dl>
            <div className="border-t border-ink/15 pt-8">
              {wa ? (
                <a
                  className={cn(buttonStyles.base, buttonStyles.outlineBronze, 'w-full sm:w-auto')}
                  href={`https://wa.me/${wa}?text=${encodeURIComponent(t('whatsappMessage'))}`}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <svg aria-hidden="true" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .1-1.3c0-.1-.2-.2-.5-.3Z" />
                  </svg>
                  {t('whatsappButton')}
                </a>
              ) : null}
              <p className="mt-6 text-sm leading-relaxed text-olive-grey">{t('response')}</p>
            </div>
          </Reveal>
        </div>

        <div className="lg:col-span-7 lg:col-start-6">
          <Reveal>
            <h2 className="font-display text-[clamp(2rem,4vw,3.25rem)] font-light leading-[1.05] tracking-[-0.03em]">
              {tf.rich('title', emphasis)}
            </h2>
            <p className="mt-5 max-w-lg leading-relaxed text-olive-grey">{tf('intro')}</p>
          </Reveal>
          <Reveal className="mt-12" delay={0.1}>
            <div className="border border-ink/10 bg-cream px-6 py-10 sm:px-10 md:px-14 md:py-14">
              <ContactForm />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/** Showroom photo with address and a link out to the map (no third-party embed). */
export async function ContactMap({ settings }: { settings: SiteSetting | null }) {
  const t = await getTranslations('pages.contact.map')
  const address = formatAddress(settings)
  const query = address?.join(', ')

  return (
    <section aria-labelledby="contact-map-title" className="pb-24 md:pb-36">
      <div className="container">
        <Reveal>
          <div className="relative overflow-hidden">
            <div className="relative aspect-[4/5] w-full bg-stone sm:aspect-[16/9] lg:aspect-[21/8]">
              <NextImage alt={brand.studio.alt} className="object-cover" fill sizes="100vw" src={brand.studio.url} />
            </div>
            <div className="absolute inset-x-0 bottom-0 flex flex-col gap-6 bg-gradient-to-t from-ink/80 via-ink/40 to-transparent p-6 pt-24 text-cream md:flex-row md:items-end md:justify-between md:p-10">
              <div>
                <SectionLabel tone="light">{t('label')}</SectionLabel>
                <h2 className="mt-4 font-display text-2xl font-light md:text-4xl" id="contact-map-title">
                  {query ?? 'Dadelsteen'}
                </h2>
                <p className="mt-3 max-w-md text-sm text-cream/75">{t('note')}</p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                {query ? (
                  <a
                    className={cn(buttonStyles.base, buttonStyles.cream)}
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {t('open')}
                    <ArrowIcon />
                  </a>
                ) : null}
                <Link className={cn(buttonStyles.base, buttonStyles.outlineLight)} href="/demo">
                  {t('demoLink')}
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
