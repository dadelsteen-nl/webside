'use client'

import { Link, usePathname } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'
import { cn } from '@/utilities/cn'
import { useLocale, useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import React from 'react'

type Props = {
  className?: string
  /** `inline` = "NL / EN" compact (header, footer); `large` = bigger type (mobile menu). */
  size?: 'inline' | 'large'
}

/**
 * Locale switcher rendered as real links (crawlable, works without JS). Keeps the current
 * internal pathname + dynamic params so /nl/producten/x ↔ /en/products/x.
 */
export function LanguageSwitcher({ className, size = 'inline' }: Props) {
  const t = useTranslations('nav')
  const locale = useLocale()
  const pathname = usePathname()
  const params = useParams()

  // Drop the [locale] segment; the remaining params fill dynamic pathnames like /products/[slug].
  const { locale: _ignored, ...routeParams } = params as Record<string, string | string[]>
  const href = { pathname, params: routeParams } as unknown as React.ComponentProps<
    typeof Link
  >['href']

  return (
    <nav aria-label={t('switchLanguage')} className={cn('flex items-center', className)}>
      <ul className="flex items-center gap-2">
        {routing.locales.map((loc, i) => {
          const active = loc === locale
          return (
            <li className="flex items-center gap-2" key={loc}>
              {i > 0 ? (
                <span aria-hidden="true" className="opacity-40">
                  /
                </span>
              ) : null}
              <Link
                aria-current={active ? 'true' : undefined}
                aria-label={t(`languages.${loc}`)}
                className={cn(
                  'uppercase transition-opacity duration-500 ease-(--ease-luxe)',
                  size === 'large'
                    ? 'font-display text-lg tracking-[0.2em]'
                    : 'text-[0.6875rem] font-medium tracking-[0.2em]',
                  active ? 'opacity-100' : 'opacity-50 hover:opacity-100',
                )}
                href={href}
                hrefLang={loc}
                lang={loc}
                locale={loc}
                scroll={false}
              >
                {loc}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
