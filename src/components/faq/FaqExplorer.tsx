'use client'

import { useTranslations } from 'next-intl'
import { useMemo, useState } from 'react'

import { cn } from '@/utilities/cn'

import { FaqAccordion, type FaqItem } from './FaqAccordion'

export type FaqGroup = { category: string; label: string; items: FaqItem[] }

/** Searchable FAQ grouped by category, with anchored category pills. */
export function FaqExplorer({ groups }: { groups: FaqGroup[] }) {
  const t = useTranslations('blog.faq')
  const [query, setQuery] = useState('')
  const q = query.trim().toLowerCase()

  const filtered = useMemo(
    () =>
      groups
        .map((g) => ({
          ...g,
          items: q
            ? g.items.filter((i) => `${i.question} ${i.answer}`.toLowerCase().includes(q))
            : g.items,
        }))
        .filter((g) => g.items.length > 0),
    [groups, q],
  )
  const count = filtered.reduce((n, g) => n + g.items.length, 0)

  return (
    <div>
      <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <nav aria-label={t('categoriesLabel')}>
          <ul className="flex flex-wrap gap-2">
            {groups.map((g) => (
              <li key={g.category}>
                <a
                  className="inline-block border border-ink/20 px-4 py-2 font-sans text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-ink transition-colors duration-500 hover:border-bronze hover:text-bronze-deep"
                  href={`#faq-${g.category}`}
                >
                  {g.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="w-full md:max-w-xs">
          <label className="sr-only" htmlFor="faq-search">
            {t('searchLabel')}
          </label>
          <input
            className="w-full border-0 border-b border-ink/30 bg-transparent py-3 text-base text-ink outline-none transition-colors duration-500 placeholder:text-olive-grey/70 focus:border-bronze"
            id="faq-search"
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('searchPlaceholder')}
            type="search"
            value={query}
          />
        </div>
      </div>

      <p aria-live="polite" className={cn('mt-6 text-xs text-olive-grey', !q && 'sr-only')} role="status">
        {t('results', { count })}
      </p>

      {count === 0 ? (
        <p className="mt-12 text-olive-grey">{t('noResults', { query })}</p>
      ) : (
        <div className="mt-12 space-y-16 md:space-y-20">
          {filtered.map((g) => (
            <section aria-labelledby={`faq-${g.category}-title`} className="scroll-mt-28" id={`faq-${g.category}`} key={g.category}>
              <div className="grid gap-6 md:grid-cols-[14rem_minmax(0,1fr)] md:gap-12">
                <h2
                  className="font-sans text-[0.6875rem] font-medium uppercase tracking-[0.28em] text-olive-grey"
                  id={`faq-${g.category}-title`}
                >
                  <span aria-hidden="true" className="mr-3 inline-block h-px w-8 bg-bronze align-middle" />
                  {g.label}
                </h2>
                <FaqAccordion items={g.items} />
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
