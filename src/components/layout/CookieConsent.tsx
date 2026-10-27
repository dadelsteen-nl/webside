'use client'

import { Link } from '@/i18n/navigation'
import { cn } from '@/utilities/cn'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useTranslations } from 'next-intl'
import React, { useEffect, useId, useRef, useState } from 'react'

import { useConsent } from './consent'

export { useConsent } from './consent'

const ease = [0.22, 1, 0.36, 1] as const

const textButton =
  'text-[0.6875rem] uppercase tracking-[0.2em] text-olive-grey underline-offset-4 transition-colors duration-500 hover:text-ink hover:underline'

/**
 * GDPR cookie banner. Non-blocking card bottom-left; "Only necessary" is as prominent as
 * "Accept all" (AP requirement: refusing must be as easy as accepting). Re-open it anywhere with
 * `useConsent().openPreferences()` or <CookieSettingsButton />.
 */
export function CookieConsent() {
  const t = useTranslations('common.cookies')
  const {
    ready,
    hasDecided,
    consent,
    preferencesOpen,
    acceptAll,
    rejectAll,
    save,
    closePreferences,
  } = useConsent()
  const reduceMotion = useReducedMotion()
  const titleId = useId()
  const descId = useId()

  const [view, setView] = useState<'intro' | 'prefs'>('intro')
  const [analytics, setAnalytics] = useState(false)
  const [marketing, setMarketing] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const visible = ready && (!hasDecided || preferencesOpen)

  // Opened via "Cookie settings": jump to the preference view, pre-filled with the current choice.
  useEffect(() => {
    if (!preferencesOpen) return
    setAnalytics(consent?.analytics ?? false)
    setMarketing(consent?.marketing ?? false)
    setView('prefs')
    // Wait a frame so the card is mounted before moving focus into it.
    const raf = requestAnimationFrame(() => cardRef.current?.focus())
    return () => cancelAnimationFrame(raf)
  }, [preferencesOpen, consent])

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && hasDecided) closePreferences()
  }

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          aria-describedby={descId}
          aria-labelledby={titleId}
          aria-modal="false"
          className="fixed inset-x-3 bottom-3 z-[70] max-h-[calc(100dvh-1.5rem)] overflow-y-auto border border-ink/10 bg-cream/95 p-6 text-ink shadow-[0_30px_80px_-30px_rgba(26,26,26,0.35)] backdrop-blur-md outline-none sm:inset-x-auto sm:bottom-6 sm:left-6 sm:w-[26rem] sm:p-8"
          data-lenis-prevent
          exit={{ opacity: 0, y: reduceMotion ? 0 : 16, transition: { duration: 0.5, ease } }}
          initial={{ opacity: 0, y: reduceMotion ? 0 : 24 }}
          key="cookie-consent"
          onKeyDown={onKeyDown}
          ref={cardRef}
          role="dialog"
          tabIndex={-1}
          transition={{ duration: reduceMotion ? 0 : 1, ease, delay: hasDecided ? 0 : 0.8 }}
        >
          <p className="mb-3 text-[0.625rem] font-medium uppercase tracking-[0.32em] text-bronze-deep">
            Cookies
          </p>
          <h2 className="font-display text-2xl font-light leading-tight" id={titleId}>
            {t('title')}
          </h2>

          {view === 'intro' ? (
            <>
              <p className="mt-4 text-sm leading-relaxed text-olive-grey" id={descId}>
                {t('body')}{' '}
                <Link
                  className="text-ink underline decoration-bronze/60 underline-offset-4 transition-colors duration-500 hover:decoration-ink"
                  href="/cookies"
                >
                  {t('policy')}
                </Link>
              </p>
              <div className="mt-6 grid grid-cols-2 gap-2">
                <ConsentButton onClick={acceptAll} variant="solid">
                  {t('acceptAll')}
                </ConsentButton>
                <ConsentButton onClick={rejectAll} variant="outline">
                  {t('necessaryOnly')}
                </ConsentButton>
              </div>
              <button className={cn(textButton, 'mt-4')} onClick={() => setView('prefs')} type="button">
                {t('preferences')}
              </button>
            </>
          ) : (
            <>
              <ul className="mt-5 divide-y divide-ink/10 border-y border-ink/10" id={descId}>
                <ConsentToggle
                  checked
                  description={t('necessaryDesc')}
                  disabled
                  label={t('necessary')}
                  lockedLabel={t('alwaysOn')}
                />
                <ConsentToggle
                  checked={analytics}
                  description={t('analyticsDesc')}
                  label={t('analytics')}
                  onChange={setAnalytics}
                />
                <ConsentToggle
                  checked={marketing}
                  description={t('marketingDesc')}
                  label={t('marketing')}
                  onChange={setMarketing}
                />
              </ul>
              <div className="mt-6 grid grid-cols-2 gap-2">
                <ConsentButton onClick={() => save({ analytics, marketing })} variant="solid">
                  {t('save')}
                </ConsentButton>
                <ConsentButton onClick={rejectAll} variant="outline">
                  {t('necessaryOnly')}
                </ConsentButton>
              </div>
              <div className="mt-4 flex items-center justify-between gap-4">
                <button
                  className={textButton}
                  onClick={() => (hasDecided ? closePreferences() : setView('intro'))}
                  type="button"
                >
                  {t('back')}
                </button>
                <button className={textButton} onClick={acceptAll} type="button">
                  {t('acceptAll')}
                </button>
              </div>
            </>
          )}
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

function ConsentButton({
  children,
  onClick,
  variant,
}: {
  children: React.ReactNode
  onClick: () => void
  variant: 'solid' | 'outline'
}) {
  return (
    <button
      className={cn(
        'min-h-11 px-3 py-3 text-[0.625rem] font-medium uppercase tracking-[0.18em] transition-colors duration-700 ease-(--ease-luxe)',
        variant === 'solid'
          ? 'border border-ink bg-ink text-cream hover:border-bronze-deep hover:bg-bronze-deep'
          : 'border border-ink/80 text-ink hover:bg-ink hover:text-cream',
      )}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  )
}

function ConsentToggle({
  checked,
  description,
  disabled,
  label,
  lockedLabel,
  onChange,
}: {
  checked: boolean
  description: string
  disabled?: boolean
  label: string
  lockedLabel?: string
  onChange?: (value: boolean) => void
}) {
  const id = useId()
  return (
    <li className="flex items-start justify-between gap-6 py-4">
      <div>
        <p className="text-sm font-medium" id={`${id}-label`}>
          {label}
        </p>
        <p className="mt-1 text-xs leading-relaxed text-olive-grey" id={`${id}-desc`}>
          {description}
        </p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1 pt-0.5">
        <button
          aria-checked={checked}
          aria-describedby={`${id}-desc`}
          aria-labelledby={`${id}-label`}
          className={cn(
            'relative h-6 w-11 rounded-full border transition-colors duration-500 ease-(--ease-luxe)',
            checked ? 'border-bronze bg-bronze' : 'border-ink/25 bg-transparent',
            disabled && 'cursor-not-allowed opacity-60',
          )}
          disabled={disabled}
          onClick={() => onChange?.(!checked)}
          role="switch"
          type="button"
        >
          <span
            aria-hidden="true"
            className={cn(
              'absolute top-1/2 left-0.5 size-[1.125rem] -translate-y-1/2 rounded-full transition-transform duration-500 ease-(--ease-luxe)',
              checked ? 'translate-x-5 bg-cream' : 'translate-x-0 bg-ink/70',
            )}
          />
        </button>
        {lockedLabel ? (
          <span className="text-[0.625rem] uppercase tracking-[0.16em] text-olive-grey">
            {lockedLabel}
          </span>
        ) : null}
      </div>
    </li>
  )
}

/** Small text button that re-opens the consent preferences (used in the footer). */
export function CookieSettingsButton({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  const { openPreferences } = useConsent()
  return (
    <button className={className} onClick={openPreferences} type="button">
      {children}
    </button>
  )
}
