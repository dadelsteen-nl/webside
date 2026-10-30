import type { Metadata } from 'next'

import { getTranslations, setRequestLocale } from 'next-intl/server'
import NextImage from 'next/image'
import { notFound } from 'next/navigation'

import { buttonStyles, SectionLabel } from '@/components/home/primitives'
import { PostCard } from '@/components/journal/PostCard'
import { categoryTitles, dateFormatter, heroOf, readingMinutes } from '@/components/journal/utils'
import { RichText } from '@/components/RichText'
import { Link } from '@/i18n/navigation'
import { type Locale, routing } from '@/i18n/routing'
import { getPostBySlug, getPosts } from '@/lib/data'
import { articleJsonLd, breadcrumbJsonLd } from '@/lib/seo'
import { absoluteUrl, buildAlternates, localizedUrl } from '@/lib/seo/alternates'
import { JsonLd } from '@/lib/seo/JsonLd'
import type { Post } from '@/payload-types'
import { cn } from '@/utilities/cn'

type Args = { params: Promise<{ locale: string; slug: string }> }

/** Slugs are localized: resolve the sibling post's slug per locale (matched by id). */
async function slugsByLocale(post: Post, locale: Locale) {
  const result: Partial<Record<Locale, { slug: string }>> = { [locale]: { slug: post.slug } }
  await Promise.all(
    routing.locales
      .filter((l) => l !== locale)
      .map(async (l) => {
        const match = (await getPosts({ locale: l, limit: 200 }).catch(() => [])).find(
          (p) => p.id === post.id,
        )
        if (match) result[l] = { slug: match.slug }
      }),
  )
  return result
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { locale: raw, slug } = await params
  const locale = raw as Locale
  const post = await getPostBySlug(slug, locale)
  if (!post) return {}
  const slugs = await slugsByLocale(post, locale)
  const hero = heroOf(post)
  const metaImage =
    post.meta?.image && typeof post.meta.image === 'object' ? post.meta.image.url : hero?.url
  const title = post.meta?.title || post.title
  const description = post.meta?.description || post.excerpt || undefined
  const image = metaImage ? absoluteUrl(metaImage) : undefined

  return {
    title,
    description,
    alternates: buildAlternates(
      '/journal/[slug]',
      { slug: post.slug },
      locale,
      { nl: slugs.nl, en: slugs.en },
    ),
    openGraph: {
      type: 'article',
      title,
      description,
      publishedTime: post.publishedAt ?? undefined,
      images: image ? [{ url: image }] : undefined,
    },
  }
}

export default async function PostPage({ params }: Args) {
  const { locale: raw, slug } = await params
  const locale = raw as Locale
  setRequestLocale(locale)

  const post = await getPostBySlug(slug, locale)
  if (!post) notFound()

  const [t, tc, all] = await Promise.all([
    getTranslations({ locale, namespace: 'blog.journal' }),
    getTranslations({ locale, namespace: 'common' }),
    getPosts({ locale, limit: 6 }),
  ])
  const related = all.filter((p) => p.id !== post.id).slice(0, 3)
  const hero = heroOf(post)
  const cats = categoryTitles(post)
  const url = localizedUrl('/journal/[slug]', locale, { slug: post.slug })
  const date = post.publishedAt ? dateFormatter(locale).format(new Date(post.publishedAt)) : null

  return (
    <>
      <JsonLd
        data={[
          articleJsonLd({
            title: post.title,
            description: post.meta?.description || post.excerpt,
            url,
            image: hero ? absoluteUrl(hero.url) : null,
            datePublished: post.publishedAt,
            dateModified: post.updatedAt,
            locale,
          }),
          breadcrumbJsonLd([
            { name: tc('brand'), url: localizedUrl('/', locale) },
            { name: t('meta.title'), url: localizedUrl('/journal', locale) },
            { name: post.title, url },
          ]),
        ]}
      />
      <article className="bg-sand pt-14 md:pt-24">
        <header className="container max-w-4xl">
          <Link
            className="font-sans text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-olive-grey transition-colors duration-500 hover:text-bronze-deep"
            href="/journal"
          >
            ← {t('post.back')}
          </Link>
          <p className="mt-10 flex flex-wrap items-center gap-x-4 gap-y-1 font-sans text-[0.6875rem] uppercase tracking-[0.2em] text-olive-grey">
            {cats[0] ? <span className="text-bronze-deep">{cats[0]}</span> : null}
            {date ? <time dateTime={post.publishedAt ?? undefined}>{date}</time> : null}
            <span>{t('minRead', { minutes: readingMinutes(post) })}</span>
          </p>
          <h1 className="mt-6 text-[clamp(2.25rem,5vw,4.5rem)] font-light leading-[1.04] tracking-[-0.025em] text-ink">
            {post.title}
          </h1>
          {post.excerpt ? (
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-olive-grey">{post.excerpt}</p>
          ) : null}
        </header>

        {hero ? (
          <div className="container mt-12 max-w-6xl md:mt-16">
            <div className="relative aspect-[16/9] overflow-hidden bg-stone">
              <NextImage alt={hero.alt} className="object-cover" fill priority sizes="(min-width: 1200px) 1152px, 100vw" src={hero.url} />
            </div>
          </div>
        ) : null}

        <div className="container mt-14 pb-20 md:mt-20 md:pb-28">
          {post.content ? (
            <RichText className="mx-auto" data={post.content as never} enableGutter={false} />
          ) : null}
        </div>
      </article>

      {related.length ? (
        <section className="border-t border-ink/10 bg-cream py-20 md:py-28">
          <div className="container">
            <SectionLabel>{t('post.related')}</SectionLabel>
            <ul className="mt-12 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <li key={p.id}>
                  <PostCard locale={locale} post={p} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <section className="bg-forest py-20 text-cream md:py-28">
        <div className="container flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div>
            <SectionLabel tone="light">{t('post.ctaLabel')}</SectionLabel>
            <h2 className="mt-8 max-w-[20ch] text-[clamp(2rem,4vw,3.5rem)] font-light leading-[1.05] tracking-[-0.02em] text-cream">
              {t('post.ctaTitle')}
            </h2>
            <p className="mt-5 max-w-md text-cream/70">{t('post.ctaBody')}</p>
          </div>
          <Link className={cn(buttonStyles.base, buttonStyles.cream)} href="/demo">
            {t('post.ctaButton')}
          </Link>
        </div>
      </section>
    </>
  )
}
