'use client'

import { cn } from '@/utilities/cn'
import { Plus } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useTranslations } from 'next-intl'
import React, { useEffect, useId, useRef, useState } from 'react'

import { useConsent } from './consent'
import { socialIcons, WhatsAppIcon } from './icons'
import { platformLabels, type SocialLink, whatsappHref } from './social'

type Props = {
  links: SocialLink[]
  whatsappNumber?: string | null
}

const ease = [0.22, 1, 0.36, 1] as const

/**
 * Floating social rail. Desktop (lg+): slim vertical bar on the right edge. Mobile: a round
 * button bottom-right that unfolds the icons. Render once in the layout.
 */
export function SocialBar({ links, whatsappNumber }: Props) {
  const t = useTranslations('common')
  const waHref = whatsappHref(whatsappNumber, t('whatsappMessage'))

  if (!links.length && !waHref) return null

  return (
    <>
      <DesktopRail links={links} waHref={waHref} />
      <MobileFab links={links} waHref={waHref} />
    </>
  )
}

function useItems(links: SocialLink[]) {
  const t = useTranslations('common.social')
  return links.map((link) => ({
    ...link,
    Icon: socialIcons[link.platform],
    label: t('followOn', { platform: platformLabels[link.platform] }),
  }))
}

function externalProps(link: { url: string; placeholder?: boolean }) {
  // Placeholder links (no URL configured yet) stay in-page instead of opening an empty tab.
  return link.placeholder
    ? { href: link.url }
    : { href: link.url, rel: 'noopener noreferrer', target: '_blank' as const }
}

function DesktopRail({ links, waHref }: { links: SocialLink[]; waHref: string | null }) {
  const t = useTranslations('common.social')
  const items = useItems(links)

  return (
    <aside
      aria-label={t('follow')}
      className="fixed top-1/2 right-0 z-30 hidden -translate-y-1/2 lg:block"
    >
      <div className="flex flex-col items-center gap-5 border-y border-l border-ink/10 bg-sand/80 px-2.5 py-6 text-ink backdrop-blur-md">
        <span
          aria-hidden="true"
          className="text-[0.5625rem] font-medium uppercase tracking-[0.4em] text-olive-grey [writing-mode:vertical-rl]"
        >
          {t('follow')}
        </span>
        <span aria-hidden="true" className="h-8 w-px bg-ink/15" />
        <ul className="flex flex-col items-center gap-1">
          {items.map(({ Icon, label, ...link }) => (
            <li key={link.platform}>
              <a
                {...externalProps(link)}
                aria-label={label}
                className="group flex size-9 items-center justify-center text-ink/70 transition-colors duration-700 ease-(--ease-luxe) hover:text-bronze-deep"
                title={platformLabels[link.platform]}
              >
                <Icon className="size-[1.05rem] transition-transform duration-700 ease-(--ease-luxe) group-hover:-translate-x-0.5" />
              </a>
            </li>
          ))}
        </ul>
        {waHref ? (
          <>
            <span aria-hidden="true" className="h-px w-5 bg-ink/15" />
            <a
              aria-label={t('whatsapp')}
              className="flex size-9 items-center justify-center rounded-full border border-ink/20 text-ink transition-colors duration-700 ease-(--ease-luxe) hover:border-[#25d366] hover:bg-[#25d366] hover:text-white"
              href={waHref}
              rel="noopener noreferrer"
              target="_blank"
              title="WhatsApp"
            >
              <WhatsAppIcon className="size-[1.05rem]" />
            </a>
          </>
        ) : null}
      </div>
    </aside>
  )
}

function MobileFab({ links, waHref }: { links: SocialLink[]; waHref: string | null }) {
  const t = useTranslations('common.social')
  const items = useItems(links)
  const reduceMotion = useReducedMotion()
  const { ready, hasDecided } = useConsent()
  const [open, setOpen] = useState(false)
  const listId = useId()
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    const onPointer = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('pointerdown', onPointer)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('pointerdown', onPointer)
    }
  }, [open])

  // Keep the bottom edge free while the cookie banner is asking for consent.
  if (!ready || !hasDecided) return null

  const all = [
    ...(waHref
      ? [
          {
            key: 'whatsapp',
            href: waHref,
            label: t('whatsapp'),
            Icon: WhatsAppIcon,
            placeholder: false,
            whatsapp: true,
          },
        ]
      : []),
    ...items.map((i) => ({
      key: i.platform,
      href: i.url,
      label: i.label,
      Icon: i.Icon,
      placeholder: Boolean(i.placeholder),
      whatsapp: false,
    })),
  ]

  return (
    <div className="fixed right-4 bottom-4 z-40 lg:hidden" ref={rootRef}>
      <AnimatePresence>
        {open ? (
          <motion.ul
            className="absolute right-0.5 bottom-16 flex flex-col items-center gap-2"
            exit={{ opacity: 0 }}
            id={listId}
            initial={false}
            transition={{ duration: 0.3 }}
          >
            {all.map(({ key, href, label, Icon, placeholder, whatsapp }, i) => (
              <motion.li
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: reduceMotion ? 0 : 8, scale: 0.9 }}
                initial={{ opacity: 0, y: reduceMotion ? 0 : 12, scale: 0.9 }}
                key={key}
                transition={{
                  duration: reduceMotion ? 0 : 0.6,
                  ease,
                  delay: reduceMotion ? 0 : (all.length - 1 - i) * 0.05,
                }}
              >
                <a
                  {...externalProps({ url: href, placeholder })}
                  aria-label={label}
                  className={cn(
                    'flex size-11 items-center justify-center rounded-full border border-ink/10 bg-cream text-ink shadow-[0_10px_30px_-12px_rgba(46,31,22,0.35)] transition-colors duration-500',
                    whatsapp ? 'active:bg-[#25d366] active:text-white' : 'active:text-bronze-deep',
                  )}
                  onClick={() => setOpen(false)}
                >
                  <Icon className="size-[1.1rem]" />
                </a>
              </motion.li>
            ))}
          </motion.ul>
        ) : null}
      </AnimatePresence>

      <button
        aria-controls={listId}
        aria-expanded={open}
        aria-label={open ? t('close') : t('open')}
        className="flex size-12 items-center justify-center rounded-full bg-ink text-cream shadow-[0_14px_40px_-14px_rgba(46,31,22,0.6)] transition-colors duration-500 hover:bg-bronze-deep"
        onClick={() => setOpen((v) => !v)}
        type="button"
      >
        <Plus
          aria-hidden="true"
          className={cn(
            'size-5 transition-transform duration-700 ease-(--ease-luxe)',
            open && 'rotate-45',
          )}
          strokeWidth={1.25}
        />
      </button>
    </div>
  )
}
