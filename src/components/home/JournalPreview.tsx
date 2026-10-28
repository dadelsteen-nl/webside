import { getLocale, getTranslations } from 'next-intl/server'
import NextImage from 'next/image'

import { Reveal } from '@/components/ui/motion'
import { Link } from '@/i18n/navigation'
import { brand } from '@/lib/brandMedia'
import { cn } from '@/utilities/cn'

import type { HomePost } from './types'

import { intlLocale } from './format'
import { ArrowIcon, SectionLabel } from './primitives'

/** Latest posts. Renders nothing when there are no posts. */
const fallbackImages = [brand.stretch, brand.mirrorCoach, brand.apartment]

export async function JournalPreview({ posts }: { posts?: HomePost[] | null }) {
  if (!posts?.length) return null

  const t = await getTranslations('home.journal')
  const locale = await getLocale()
  const dateFmt = new Intl.DateTimeFormat(intlLocale(locale), { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <section aria-labelledby="home-journal-title" className="bg-sand py-24 md:py-36">
      <div className="container">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <Reveal>
            <SectionLabel>{t('label')}</SectionLabel>
            <h2
              className="mt-8 max-w-[18ch] text-[clamp(2.25rem,4.6vw,4.25rem)] font-light leading-[1.02] tracking-[-0.025em] text-ink"
              id="home-journal-title"
            >
              {t('title')}
            </h2>
          </Reveal>
          <Link
            className="group inline-flex items-center gap-3 font-sans text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-ink"
            href="/journal"
          >
            <span className="border-b border-bronze pb-1">{t('cta')}</span>
            <ArrowIcon className="text-bronze" />
          </Link>
        </div>

        <ul className={cn('mt-14 grid gap-10 md:mt-20 md:gap-6', posts.length >= 3 ? 'md:grid-cols-3' : 'md:grid-cols-2')}>
          {posts.slice(0, 3).map((post, i) => (
            <Reveal as="li" delay={i * 0.1} key={post.slug}>
              <Link
                className="group block"
                href={{ params: { slug: post.slug }, pathname: '/journal/[slug]' }}
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-stone">
                  <div className="absolute inset-0 transition-transform duration-[1400ms] ease-[var(--ease-luxe)] group-hover:scale-[1.05]">
                    <NextImage
                      alt={post.image?.alt || post.title}
                      className="object-cover"
                      fill
                      sizes="(min-width: 768px) 33vw, 100vw"
                      src={post.image?.url || fallbackImages[i % fallbackImages.length]!.url}
                    />
                  </div>
                </div>
                {post.publishedAt ? (
                  <time
                    className="mt-6 block font-sans text-[0.6875rem] uppercase tracking-[0.2em] text-olive-grey"
                    dateTime={post.publishedAt}
                  >
                    {dateFmt.format(new Date(post.publishedAt))}
                  </time>
                ) : null}
                <h3 className="mt-3 text-2xl font-light leading-tight text-ink">{post.title}</h3>
                {post.excerpt ? (
                  <p className="mt-3 line-clamp-3 text-[0.9375rem] leading-relaxed text-olive-grey">{post.excerpt}</p>
                ) : null}
                <span className="mt-5 inline-flex items-center gap-3 font-sans text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-ink">
                  {t('readMore')}
                  <ArrowIcon className="text-bronze" />
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
