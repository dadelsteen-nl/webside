import type { Metadata } from 'next'

import { getTranslations, setRequestLocale } from 'next-intl/server'

import { CookieSettingsButton } from '@/components/layout/CookieConsent'
import type { AppPathname, Locale } from '@/i18n/routing'
import { getSiteSettings } from '@/lib/data'
import { breadcrumbJsonLd } from '@/lib/seo'
import { buildAlternates, localizedUrl } from '@/lib/seo/alternates'
import { JsonLd } from '@/lib/seo/JsonLd'

import { LegalLayout, type LegalSection } from './LegalLayout'

export type LegalKey = 'privacy' | 'terms' | 'cookies' | 'returns'

// Update when the legal copy changes materially.
const LAST_UPDATED = '2026-10-27'

type CookieCategory = {
  id: string
  title: string
  body: string
  cookies: { name: string; purpose: string; duration: string }[]
}

export async function legalMetadata(
  key: LegalKey,
  pathname: AppPathname,
  locale: Locale,
): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: `legal.${key}.meta` })
  return {
    title: t('title'),
    description: t('description'),
    alternates: buildAlternates(pathname, undefined, locale),
  }
}

function fill(text: string, vars: Record<string, string>) {
  return text.replace(/\{(\w+)\}/g, (m, k: string) => vars[k] ?? m)
}

export async function LegalPage({
  legalKey,
  pathname,
  locale,
}: {
  legalKey: LegalKey
  pathname: AppPathname
  locale: Locale
}) {
  setRequestLocale(locale)
  const [t, settings] = await Promise.all([
    getTranslations({ locale, namespace: 'legal' }),
    getSiteSettings(locale).catch(() => null),
  ])
  const a = settings?.address
  const address =
    [a?.street, [a?.postalCode, a?.city].filter(Boolean).join(' '), a?.country]
      .filter(Boolean)
      .join(', ') || (locale === 'nl' ? '[adres]' : '[address]')
  const vars: Record<string, string> = {
    company: settings?.companyName || 'Dadelsteen',
    kvk: settings?.kvkNumber || (locale === 'nl' ? '[KvK-nummer]' : '[KvK number]'),
    vat: settings?.vatNumber || (locale === 'nl' ? '[BTW-nummer]' : '[VAT number]'),
    address,
    email: settings?.email || 'info@dadelsteen.nl',
    phone: settings?.phone || '',
    returnDays: String(settings?.returnDays ?? 14),
    warrantyYears: String(settings?.warrantyYears ?? 2),
  }

  const sections = (t.raw(`${legalKey}.sections`) as LegalSection[]).map((s) => ({
    ...s,
    title: fill(s.title, vars),
    body: s.body?.map((p) => fill(p, vars)),
    list: s.list?.map((p) => fill(p, vars)),
  }))

  const categories =
    legalKey === 'cookies' ? (t.raw('cookies.categories') as CookieCategory[]) : []

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: t('ui.home'), url: localizedUrl('/', locale) },
          { name: t(`${legalKey}.title`), url: localizedUrl(pathname, locale) },
        ])}
      />
      <LegalLayout
        draftNote={t('ui.draftNote')}
        extraToc={categories.map((c) => ({ id: `cookie-${c.id}`, title: c.title }))}
        intro={fill(t(`${legalKey}.intro`, vars), vars)}
        lastUpdated={LAST_UPDATED}
        lastUpdatedLabel={t('ui.lastUpdated')}
        printLabel={t('ui.print')}
        sections={sections}
        title={t(`${legalKey}.title`)}
        tocLabel={t('ui.toc')}
      >
        {legalKey === 'cookies' ? (
          <>
            <div className="pb-12 print:hidden">
              <CookieSettingsButton className="inline-flex min-h-12 items-center justify-center rounded-[var(--radius)] bg-ink px-7 font-sans text-xs font-medium uppercase tracking-[0.18em] text-cream transition-colors duration-500 hover:bg-bronze-deep">
                {t('cookies.manage')}
              </CookieSettingsButton>
            </div>
            {categories.map((c) => (
              <section className="scroll-mt-28 pb-12" id={`cookie-${c.id}`} key={c.id}>
                <h2 className="text-2xl font-light leading-tight text-ink md:text-3xl">{c.title}</h2>
                <p className="mt-5 text-[0.9375rem] leading-[1.8] text-ink/80">{c.body}</p>
                <div className="mt-6 overflow-x-auto">
                  <table className="w-full min-w-[32rem] border-collapse text-left text-sm">
                    <thead>
                      <tr className="border-b border-ink/20 font-sans text-[0.6875rem] uppercase tracking-[0.16em] text-olive-grey">
                        <th className="py-3 pr-4 font-medium" scope="col">{t('ui.cookieName')}</th>
                        <th className="py-3 pr-4 font-medium" scope="col">{t('ui.cookiePurpose')}</th>
                        <th className="py-3 font-medium" scope="col">{t('ui.cookieDuration')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {c.cookies.map((ck) => (
                        <tr className="border-b border-ink/10 align-top" key={ck.name}>
                          <td className="py-3 pr-4 font-mono text-xs text-ink">{ck.name}</td>
                          <td className="py-3 pr-4 text-ink/80">{ck.purpose}</td>
                          <td className="py-3 text-ink/80">{ck.duration}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            ))}
          </>
        ) : null}
      </LegalLayout>
    </>
  )
}
