import type { Metadata } from 'next'

import { getTranslations, setRequestLocale } from 'next-intl/server'

import { FaqExplorer, type FaqGroup } from '@/components/faq'
import { ArrowIcon, buttonStyles, SectionLabel } from '@/components/home/primitives'
import { Link } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'
import { getFaqs, getSiteSettings } from '@/lib/data'
import { breadcrumbJsonLd, faqJsonLd } from '@/lib/seo'
import { buildAlternates, localizedUrl } from '@/lib/seo/alternates'
import { JsonLd } from '@/lib/seo/JsonLd'
import { cn } from '@/utilities/cn'

type Args = { params: Promise<{ locale: string }> }

const CATEGORY_ORDER = ['product', 'shop', 'delivery', 'business', 'general'] as const

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'blog.faq.meta' })
  return {
    title: t('title'),
    description: t('description'),
    alternates: buildAlternates('/faq', undefined, locale as Locale),
  }
}

export default async function FaqPage({ params }: Args) {
  const { locale: raw } = await params
  const locale = raw as Locale
  setRequestLocale(locale)

  const [t, tc, faqs, settings] = await Promise.all([
    getTranslations({ locale, namespace: 'blog.faq' }),
    getTranslations({ locale, namespace: 'common' }),
    getFaqs({ locale }),
    getSiteSettings(locale).catch(() => null),
  ])

  const groups: FaqGroup[] = CATEGORY_ORDER.map((category) => ({
    category,
    label: t(`categories.${category}`),
    items: faqs
      .filter((f) => f.category === category)
      .map((f) => ({ id: f.id, question: f.question, answer: f.answer })),
  })).filter((g) => g.items.length > 0)

  const wa = settings?.whatsappNumber
    ? `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(tc('whatsappMessage'))}`
    : null

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: tc('brand'), url: localizedUrl('/', locale) },
            { name: t('meta.title'), url: localizedUrl('/faq', locale) },
          ]),
          ...(faqs.length
            ? [faqJsonLd(faqs.map((f) => ({ question: f.question, answer: f.answer })))]
            : []),
        ]}
      />
      <section className="bg-sand py-16 md:py-28">
        <div className="container">
          <header className="max-w-3xl">
            <SectionLabel>{t('eyebrow')}</SectionLabel>
            <h1 className="mt-8 text-[clamp(2.5rem,5.4vw,5rem)] font-light leading-[1.02] tracking-[-0.025em] text-ink">
              {t('title')}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-olive-grey">{t('intro')}</p>
          </header>

          <div className="mt-14 md:mt-20">
            {groups.length ? (
              <FaqExplorer groups={groups} />
            ) : (
              <p className="text-olive-grey">{t('empty')}</p>
            )}
          </div>
        </div>
      </section>

      <section className="bg-ink py-20 text-cream md:py-28">
        <div className="container flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div>
            <SectionLabel tone="light">{t('contact.label')}</SectionLabel>
            <h2 className="mt-8 max-w-[16ch] text-[clamp(2rem,4vw,3.5rem)] font-light leading-[1.05] tracking-[-0.02em] text-cream">
              {t('contact.title')}
            </h2>
            <p className="mt-5 max-w-md text-cream/70">{t('contact.body')}</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            {wa ? (
              <a className={cn(buttonStyles.base, buttonStyles.cream)} href={wa} rel="noopener" target="_blank">
                {t('contact.whatsapp')}
              </a>
            ) : null}
            <Link className={cn(buttonStyles.base, buttonStyles.outlineLight)} href="/contact">
              {t('contact.contact')}
              <ArrowIcon />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
