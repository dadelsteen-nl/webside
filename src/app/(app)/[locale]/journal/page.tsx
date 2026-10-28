import type { Metadata } from 'next'

import { getTranslations, setRequestLocale } from 'next-intl/server'

import { buttonStyles, SectionLabel } from '@/components/home/primitives'
import { PostCard } from '@/components/journal/PostCard'
import { Link } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'
import { getPosts } from '@/lib/data'
import { breadcrumbJsonLd } from '@/lib/seo'
import { buildAlternates, localizedUrl } from '@/lib/seo/alternates'
import { JsonLd } from '@/lib/seo/JsonLd'
import { cn } from '@/utilities/cn'

type Args = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'blog.journal.meta' })
  return {
    title: t('title'),
    description: t('description'),
    alternates: buildAlternates('/journal', undefined, locale as Locale),
  }
}

export default async function JournalPage({ params }: Args) {
  const { locale: raw } = await params
  const locale = raw as Locale
  setRequestLocale(locale)

  const [t, tc, posts] = await Promise.all([
    getTranslations({ locale, namespace: 'blog.journal' }),
    getTranslations({ locale, namespace: 'common' }),
    getPosts({ locale, limit: 60 }),
  ])
  const [featured, ...rest] = posts

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: tc('brand'), url: localizedUrl('/', locale) },
          { name: t('meta.title'), url: localizedUrl('/journal', locale) },
        ])}
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

          {featured ? (
            <>
              <div className="mt-16 md:mt-24">
                <PostCard featured locale={locale} post={featured} priority />
              </div>
              {rest.length ? (
                <div className="mt-24 border-t border-ink/10 pt-10 md:mt-32">
                  <h2 className="font-sans text-[0.6875rem] font-medium uppercase tracking-[0.28em] text-olive-grey">
                    {t('all')}
                  </h2>
                  <ul className="mt-10 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
                    {rest.map((post) => (
                      <li key={post.id}>
                        <PostCard locale={locale} post={post} />
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </>
          ) : (
            <div className="mt-20 max-w-xl border-t border-ink/10 pt-12">
              <h2 className="text-3xl font-light text-ink">{t('empty.title')}</h2>
              <p className="mt-4 leading-relaxed text-olive-grey">{t('empty.body')}</p>
              <Link className={cn(buttonStyles.base, buttonStyles.ink, 'mt-8')} href="/demo">
                {t('empty.cta')}
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
