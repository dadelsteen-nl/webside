'use client'

import { Logo } from '@/components/icons/logo'
import { socialIcons } from '@/components/layout/icons'
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher'
import { platformLabels, type SocialLink } from '@/components/layout/social'
import { Link, usePathname } from '@/i18n/navigation'
import { cn } from '@/utilities/cn'
import { useLenis } from 'lenis/react'
import { X } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useTranslations } from 'next-intl'
import React, { useCallback, useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import { isActive, mainNav } from './navItems'

const ease = [0.22, 1, 0.36, 1] as const

type Props = {
  socialLinks: SocialLink[]
}

/** Hamburger (below xl) opening a full-screen sand overlay with large serif links. */
export function MobileMenu({ socialLinks }: Props) {
  const t = useTranslations('nav')
  const tc = useTranslations('common')
  const ts = useTranslations('common.social')
  const pathname = usePathname()
  const lenis = useLenis()
  const reduceMotion = useReducedMotion()
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const dialogId = useId()
  const titleId = useId()
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => setMounted(true), [])

  const close = useCallback(() => setOpen(false), [])

  // Close on navigation.
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  // Close when resizing up to the desktop nav.
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 80rem)')
    const onChange = () => mq.matches && setOpen(false)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  // Scroll lock, focus management, Escape + focus trap.
  useEffect(() => {
    if (!open) return
    const trigger = triggerRef.current
    const prevOverflow = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'
    lenis?.stop()
    const raf = requestAnimationFrame(() => closeRef.current?.focus())

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        return
      }
      if (e.key !== 'Tab' || !panelRef.current) return
      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      )
      if (!focusable.length) return
      const first = focusable[0]!
      const last = focusable[focusable.length - 1]!
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    window.addEventListener('keydown', onKey)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('keydown', onKey)
      document.documentElement.style.overflow = prevOverflow
      lenis?.start()
      trigger?.focus()
    }
  }, [open, lenis])

  const d = (i: number) => (reduceMotion ? 0 : 0.25 + i * 0.07)
  const y = reduceMotion ? 0 : 28

  const overlay = (
    <AnimatePresence>
      {open ? (
        <motion.div
          animate={{ opacity: 1 }}
          aria-labelledby={titleId}
          aria-modal="true"
          className="fixed inset-0 z-[80] flex flex-col overflow-y-auto bg-sand text-ink"
          data-lenis-prevent
          exit={{ opacity: 0, transition: { duration: reduceMotion ? 0 : 0.5, ease } }}
          id={dialogId}
          initial={{ opacity: 0 }}
          key="mobile-menu"
          ref={panelRef}
          role="dialog"
          transition={{ duration: reduceMotion ? 0 : 0.7, ease }}
        >
          <h2 className="sr-only" id={titleId}>
            {t('menu')}
          </h2>
          <div className="flex h-16 shrink-0 items-center justify-between border-b border-ink/10 px-5 md:h-[4.5rem] md:px-8">
            <Link aria-label={t('homeLink')} href="/" onClick={close}>
              <Logo />
            </Link>
            <button
              aria-label={t('closeMenu')}
              className="-mr-2 flex size-11 items-center justify-center transition-colors duration-500 hover:text-bronze-deep"
              onClick={close}
              ref={closeRef}
              type="button"
            >
              <X aria-hidden="true" className="size-6" strokeWidth={1} />
            </button>
          </div>

          <nav aria-label={t('mobileNav')} className="flex-1 px-5 pt-10 pb-8 md:px-8 md:pt-14">
            <ul className="flex flex-col gap-1">
              {mainNav.map((item, i) => {
                const active = isActive(pathname, item.match)
                return (
                  <motion.li
                    animate={{ opacity: 1, y: 0 }}
                    initial={{ opacity: 0, y }}
                    key={item.key}
                    transition={{ duration: reduceMotion ? 0 : 1, ease, delay: d(i) }}
                  >
                    <Link
                      aria-current={active ? 'page' : undefined}
                      className="group flex items-baseline gap-4 py-1.5"
                      href={item.href}
                      onClick={close}
                    >
                      <span className="w-6 text-[0.625rem] tracking-[0.2em] text-olive-grey tabular-nums">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span
                        className={cn(
                          'font-display text-[2.5rem] leading-[1.1] font-light tracking-[-0.01em] transition-colors duration-700 ease-(--ease-luxe) sm:text-5xl',
                          active ? 'text-bronze-deep italic' : 'group-hover:text-bronze-deep',
                        )}
                      >
                        {t(item.key)}
                      </span>
                    </Link>
                  </motion.li>
                )
              })}
            </ul>

            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="mt-10 flex flex-col gap-3 sm:flex-row"
              initial={{ opacity: 0, y }}
              transition={{ duration: reduceMotion ? 0 : 1, ease, delay: d(mainNav.length) }}
            >
              <Link
                className="inline-flex h-12 items-center justify-center bg-ink px-7 text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-cream transition-colors duration-700 hover:bg-bronze-deep"
                href="/demo"
                onClick={close}
              >
                {tc('bookDemo')}
              </Link>
              <Link
                className="inline-flex h-12 items-center justify-center border border-ink/30 px-7 text-[0.6875rem] font-medium uppercase tracking-[0.2em] transition-colors duration-700 hover:border-ink"
                href="/account"
                onClick={close}
              >
                {t('account')}
              </Link>
            </motion.div>
          </nav>

          <motion.div
            animate={{ opacity: 1 }}
            className="flex shrink-0 items-center justify-between gap-6 border-t border-ink/10 px-5 py-6 md:px-8"
            initial={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 1, ease, delay: d(mainNav.length + 1) }}
          >
            <LanguageSwitcher size="large" />
            {socialLinks.length ? (
              <ul aria-label={ts('follow')} className="flex items-center gap-1">
                {socialLinks.map((link) => {
                  const Icon = socialIcons[link.platform]
                  return (
                    <li key={link.platform}>
                      <a
                        aria-label={ts('followOn', { platform: platformLabels[link.platform] })}
                        className="flex size-10 items-center justify-center text-ink/70 transition-colors duration-500 hover:text-bronze-deep"
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
            ) : null}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )

  return (
    <>
      <button
        aria-controls={dialogId}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={t('openMenu')}
        className="group -mr-2 flex size-11 flex-col items-center justify-center gap-[5px] xl:hidden"
        onClick={() => setOpen(true)}
        ref={triggerRef}
        type="button"
      >
        <span className="block h-px w-6 bg-current transition-transform duration-700 ease-(--ease-luxe) group-hover:translate-x-0.5" />
        <span className="block h-px w-6 bg-current transition-transform duration-700 ease-(--ease-luxe) group-hover:-translate-x-0.5" />
      </button>
      {/* Portal: the header uses backdrop-filter, which would otherwise trap the fixed overlay. */}
      {mounted ? createPortal(overlay, document.body) : null}
    </>
  )
}
