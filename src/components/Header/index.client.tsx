'use client'

import { Cart } from '@/components/Cart'
import { OpenCartButton } from '@/components/Cart/OpenCart'
import { Logo } from '@/components/icons/logo'
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher'
import type { SocialLink } from '@/components/layout/social'
import { Link, usePathname } from '@/i18n/navigation'
import { cn } from '@/utilities/cn'
import { ShoppingBag, UserRound } from 'lucide-react'
import { useTranslations } from 'next-intl'
import React, { Suspense, useEffect, useState } from 'react'

import { MobileMenu } from './MobileMenu'
import { isActive, mainNav } from './navItems'

type Props = {
  socialLinks: SocialLink[]
}

const SCROLL_THRESHOLD = 24

export function HeaderClient({ socialLinks }: Props) {
  const t = useTranslations('nav')
  const tc = useTranslations('common')
  const pathname = usePathname()
  const isHome = pathname === '/'
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const solid = !isHome || scrolled

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,color,backdrop-filter] duration-1000 ease-(--ease-luxe)',
          solid
            ? 'border-ink/10 bg-sand/85 text-ink backdrop-blur-md'
            : 'border-transparent bg-transparent text-ink',
        )}
        data-header-solid={solid ? 'true' : 'false'}
      >
        <div
          className={cn(
            'mx-auto flex max-w-[96rem] items-center justify-between gap-6 px-5 transition-[height] duration-1000 ease-(--ease-luxe) md:px-8 xl:px-12',
            solid ? 'h-16 md:h-[4.5rem]' : 'h-20 md:h-24',
          )}
        >
          <Link
            aria-label={t('homeLink')}
            className="relative z-10 shrink-0"
            href="/"
          >
            <Logo />
          </Link>

          <nav aria-label={t('mainNav')} className="hidden xl:block">
            <ul className="flex items-center gap-8 2xl:gap-10">
              {mainNav.map((item) => {
                const active = isActive(pathname, item.match)
                return (
                  <li key={item.key}>
                    <Link
                      aria-current={active ? 'page' : undefined}
                      className={cn(
                        'navLink text-[0.6875rem] font-medium uppercase tracking-[0.22em] transition-opacity duration-700 ease-(--ease-luxe)',
                        active ? 'opacity-100' : 'opacity-75 hover:opacity-100',
                      )}
                      href={item.href}
                    >
                      {t(item.key)}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-4 md:gap-5">
            <LanguageSwitcher className="hidden md:flex" />

            <span aria-hidden="true" className="hidden h-4 w-px bg-current opacity-20 md:block" />

            <Link
              aria-label={t('account')}
              className="hidden size-9 items-center justify-center opacity-80 transition-opacity duration-500 hover:opacity-100 sm:flex"
              href="/account"
            >
              <UserRound aria-hidden="true" className="size-[1.1rem]" strokeWidth={1.25} />
            </Link>

            <CartTrigger />

            <Link
              className={cn(
                'hidden h-10 items-center border px-5 text-[0.625rem] font-medium uppercase tracking-[0.2em] transition-colors duration-700 ease-(--ease-luxe) md:inline-flex',
                'border-forest bg-forest text-cream hover:border-bronze-deep hover:bg-bronze-deep',
              )}
              href="/demo"
            >
              {tc('bookDemo')}
            </Link>

            <MobileMenu socialLinks={socialLinks} />
          </div>
        </div>
      </header>

      {/* Non-home pages: push content below the fixed header. */}
      {isHome ? null : <div aria-hidden="true" className="h-16 shrink-0 md:h-[4.5rem]" />}
    </>
  )
}

/**
 * Wraps the template's cart trigger (owned by the shop task) and restyles it for the header:
 * bag icon + quantity. The trigger's own "Cart" label stays for screen readers.
 */
function CartTrigger() {
  return (
    <div
      className={cn(
        'relative flex h-9 items-center',
        // Normalise OpenCartButton (nav variant) to the header style.
        '[&_button]:h-9! [&_button]:min-w-9! [&_button]:items-center! [&_button]:gap-1! [&_button]:p-0! [&_button]:pl-7! [&_button]:font-sans! [&_button]:text-[0.6875rem]! [&_button]:tracking-[0.1em]! [&_button]:text-current! [&_button]:opacity-80 [&_button:hover]:opacity-100',
        '[&_button>span:first-child]:sr-only [&_button>span:nth-child(2)]:hidden',
        '[&_button.navLink]:after:hidden!',
      )}
    >
      <ShoppingBag
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1 size-[1.1rem] -translate-y-1/2"
        strokeWidth={1.25}
      />
      <Suspense fallback={<OpenCartButton />}>
        <Cart />
      </Suspense>
    </div>
  )
}
