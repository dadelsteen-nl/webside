import { FLAGSHIP_PRODUCT_SLUG, type NavHref } from '@/components/Header/navItems'
import { LogoIcon } from '@/components/icons/logo'
import { CookieSettingsButton } from '@/components/layout/CookieConsent'
import { getLayoutSiteSettings } from '@/components/layout/getSiteSettings'
import { socialIcons } from '@/components/layout/icons'
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher'
import { platformLabels, resolveSocialLinks } from '@/components/layout/social'
import { Link } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'
import { getLocale, getTranslations } from 'next-intl/server'
import React from 'react'

const linkClass =
  'text-sm text-cream/70 transition-colors duration-700 ease-(--ease-luxe) hover:text-cream'
const headingClass = 'mb-6 text-[0.625rem] font-medium uppercase tracking-[0.32em] text-bronze'

const paymentMethods = ['iDEAL', 'Bancontact', 'Visa', 'Mastercard'] as const

export async function Footer() {
  const locale = (await getLocale()) as Locale
  const [settings, t, tn, tc] = await Promise.all([
    getLayoutSiteSettings(locale),
    getTranslations('common.footer'),
    getTranslations('nav'),
    getTranslations('common'),
  ])

  const socials = resolveSocialLinks(settings)
  const companyName = settings.companyName?.trim() || 'Dadelsteen'
  const year = new Date().getFullYear()
  const { street, postalCode, city, country } = settings.address ?? {}
  const cityLine = [postalCode, city].filter(Boolean).join(' ')
  const phoneHref = settings.phone ? `tel:${settings.phone.replace(/[^\d+]/g, '')}` : null

  const columns: { title: string; links: { label: string; href: NavHref }[] }[] = [
    {
      title: t('shop'),
      links: [
        {
          label: t('imbody'),
          href: { pathname: '/products/[slug]', params: { slug: FLAGSHIP_PRODUCT_SLUG } },
        },
        { label: t('shopAll'), href: '/shop' },
        { label: t('bookDemo'), href: '/demo' },
      ],
    },
    {
      title: t('company'),
      links: [
        { label: tn('about'), href: '/about' },
        { label: tn('business'), href: '/business' },
        { label: tn('blog'), href: '/journal' },
        { label: tn('contact'), href: '/contact' },
        { label: tn('faq'), href: '/faq' },
      ],
    },
    {
      title: t('service'),
      links: [
        { label: tn('demo'), href: '/demo' },
        { label: tn('returns'), href: '/returns' },
        { label: tn('terms'), href: '/terms' },
        { label: tn('privacy'), href: '/privacy' },
        { label: tn('cookies'), href: '/cookies' },
      ],
    },
  ]

  return (
    <footer className="relative mt-auto bg-ink text-cream">
      <div className="mx-auto max-w-[96rem] px-5 md:px-8 xl:px-12">
        {/* Statement */}
        <div className="flex flex-col gap-10 border-b border-cream/10 py-20 md:flex-row md:items-end md:justify-between md:py-28">
          <div className="max-w-3xl">
            <LogoIcon className="mb-8 h-16" />
            <p className="font-display text-[2.25rem] leading-[1.08] font-light tracking-[-0.015em] text-balance sm:text-5xl lg:text-6xl">
              {t('statement')}
            </p>
          </div>
          <Link
            className="inline-flex h-12 shrink-0 items-center justify-center self-start border border-bronze px-8 text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-cream transition-colors duration-700 ease-(--ease-luxe) hover:bg-bronze hover:text-ink md:self-auto"
            href="/demo"
          >
            {tc('bookDemo')}
          </Link>
        </div>

        {/* Columns */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-14 py-16 md:grid-cols-4 lg:grid-cols-12 lg:py-20">
          {columns.map((col) => (
            <nav aria-label={col.title} className="lg:col-span-2" key={col.title}>
              <h2 className={headingClass}>{col.title}</h2>
              <ul className="flex flex-col gap-3.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link className={linkClass} href={link.href}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div className="col-span-2 md:col-span-1 lg:col-span-4 lg:col-start-9">
            <h2 className={headingClass}>{t('contact')}</h2>
            <address className="flex flex-col gap-1 text-sm leading-relaxed text-cream/70 not-italic">
              <span className="text-cream">{companyName}</span>
              {street ? <span>{street}</span> : null}
              {cityLine ? <span>{cityLine}</span> : null}
              {country ? <span>{country}</span> : null}
              {settings.email || phoneHref ? (
                <span className="mt-4 flex flex-col gap-1">
                  {settings.email ? (
                    <a className={linkClass} href={`mailto:${settings.email}`}>
                      {settings.email}
                    </a>
                  ) : null}
                  {phoneHref ? (
                    <a className={linkClass} href={phoneHref}>
                      {settings.phone}
                    </a>
                  ) : null}
                </span>
              ) : null}
            </address>

            {settings.openingHours ? (
              <div className="mt-6 text-sm text-cream/70">
                <p className="mb-1 text-[0.625rem] uppercase tracking-[0.24em] text-cream/45">
                  {t('openingHours')}
                </p>
                <p className="whitespace-pre-line">{settings.openingHours}</p>
              </div>
            ) : null}

            {settings.kvkNumber || settings.vatNumber ? (
              <dl className="mt-6 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-xs text-cream/50">
                {settings.kvkNumber ? (
                  <>
                    <dt className="uppercase tracking-[0.18em]">{t('kvk')}</dt>
                    <dd>{settings.kvkNumber}</dd>
                  </>
                ) : null}
                {settings.vatNumber ? (
                  <>
                    <dt className="uppercase tracking-[0.18em]">{t('vat')}</dt>
                    <dd>{settings.vatNumber}</dd>
                  </>
                ) : null}
              </dl>
            ) : null}

            {socials.length ? (
              <div className="mt-8">
                <p className="sr-only">{t('followUs')}</p>
                <ul className="-ml-2.5 flex items-center gap-1">
                  {socials.map((link) => {
                    const Icon = socialIcons[link.platform]
                    return (
                      <li key={link.platform}>
                        <a
                          aria-label={tc('social.followOn', {
                            platform: platformLabels[link.platform],
                          })}
                          className="flex size-10 items-center justify-center text-cream/60 transition-colors duration-700 ease-(--ease-luxe) hover:text-bronze"
                          href={link.url}
                          {...(link.placeholder
                            ? {}
                            : { rel: 'noopener noreferrer', target: '_blank' })}
                        >
                          <Icon className="size-[1.1rem]" />
                        </a>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ) : null}
          </div>
        </div>

        {/* Bottom row */}
        <div className="flex flex-col gap-6 border-t border-cream/10 py-8 text-xs text-cream/50 lg:flex-row lg:items-center lg:justify-between">
          <p>
            &copy; {year} Dadelsteen. {t('rights')}
          </p>

          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-2 text-[0.625rem] uppercase tracking-[0.24em]">{t('payments')}</span>
            <ul className="flex flex-wrap items-center gap-2">
              {paymentMethods.map((method) => (
                <li
                  className="border border-cream/15 px-2.5 py-1 text-[0.625rem] font-medium tracking-[0.08em] text-cream/75"
                  key={method}
                >
                  {method}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center gap-6 text-cream/70">
            <CookieSettingsButton className="text-[0.6875rem] uppercase tracking-[0.2em] transition-colors duration-500 hover:text-cream">
              {t('cookieSettings')}
            </CookieSettingsButton>
            <span aria-hidden="true" className="h-3 w-px bg-cream/20" />
            <LanguageSwitcher />
          </div>
        </div>

        <p className="pb-10 text-[0.6875rem] leading-relaxed text-cream/35">{t('trademark')}</p>
      </div>
    </footer>
  )
}
