import NextImage from 'next/image'
import { getTranslations } from 'next-intl/server'

import { ArrowIcon } from '@/components/home/primitives'
import { Link } from '@/i18n/navigation'
import type { Post } from '@/payload-types'
import { cn } from '@/utilities/cn'

import { categoryTitles, dateFormatter, heroOf, readingMinutes } from './utils'

export async function PostCard({
  post,
  locale,
  featured = false,
  priority = false,
}: {
  post: Post
  locale: string
  featured?: boolean
  priority?: boolean
}) {
  const t = await getTranslations({ locale, namespace: 'blog.journal' })
  const hero = heroOf(post)
  const cat = categoryTitles(post)[0]
  const date = post.publishedAt ? dateFormatter(locale).format(new Date(post.publishedAt)) : null

  return (
    <Link
      className={cn('group block', featured && 'grid gap-8 md:grid-cols-12 md:items-end md:gap-12')}
      href={{ pathname: '/journal/[slug]', params: { slug: post.slug } }}
    >
      <div
        className={cn(
          'relative overflow-hidden bg-stone',
          featured ? 'aspect-[4/3] md:col-span-7 md:aspect-[3/2]' : 'aspect-[4/5]',
        )}
      >
        {hero ? (
          <NextImage
            alt={hero.alt}
            className="object-cover transition-transform duration-[1400ms] ease-[var(--ease-luxe)] group-hover:scale-[1.04]"
            fill
            priority={priority}
            sizes={featured ? '(min-width: 768px) 58vw, 100vw' : '(min-width: 768px) 33vw, 100vw'}
            src={hero.url}
          />
        ) : (
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-br from-stone to-sand" />
        )}
      </div>
      <div className={cn(featured ? 'md:col-span-5' : 'mt-6')}>
        <p className="flex flex-wrap items-center gap-x-3 font-sans text-[0.6875rem] uppercase tracking-[0.2em] text-olive-grey">
          {cat ? <span className="text-bronze-deep">{cat}</span> : null}
          {date ? <time dateTime={post.publishedAt ?? undefined}>{date}</time> : null}
        </p>
        <h3
          className={cn(
            'mt-3 font-light leading-tight text-ink',
            featured ? 'text-[clamp(2rem,3.4vw,3.25rem)] tracking-[-0.02em]' : 'text-2xl',
          )}
        >
          {post.title}
        </h3>
        {post.excerpt ? (
          <p className={cn('mt-4 leading-relaxed text-olive-grey', featured ? 'text-base' : 'line-clamp-3 text-[0.9375rem]')}>
            {post.excerpt}
          </p>
        ) : null}
        <span className="mt-5 inline-flex items-center gap-3 font-sans text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-ink">
          {t('readMore')}
          <span className="text-olive-grey normal-case tracking-normal">
            · {t('minRead', { minutes: readingMinutes(post) })}
          </span>
          <ArrowIcon className="text-bronze" />
        </span>
      </div>
    </Link>
  )
}
