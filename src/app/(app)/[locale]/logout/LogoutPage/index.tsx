'use client'

import { useEcommerce } from '@payloadcms/plugin-ecommerce/client/react'
import { useTranslations } from 'next-intl'
import React, { useEffect, useRef, useState } from 'react'

import { ArrowIcon, btn, Eyebrow } from '@/components/shop/ui'
import { Link } from '@/i18n/navigation'
import { useAuth } from '@/providers/Auth'
import { cn } from '@/utilities/cn'

export const LogoutPage: React.FC = () => {
  const t = useTranslations('checkout.auth.logout')
  const { logout } = useAuth()
  const { clearSession } = useEcommerce()
  const [state, setState] = useState<'pending' | 'success' | 'already'>('pending')
  const started = useRef(false)

  useEffect(() => {
    if (started.current) return
    started.current = true
    logout()
      .then(() => {
        clearSession()
        setState('success')
      })
      .catch(() => setState('already'))
  }, [clearSession, logout])

  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <Eyebrow className="justify-center">{t('eyebrow')}</Eyebrow>
      <h1 aria-live="polite" className="mt-8 font-display text-4xl font-light text-ink md:text-5xl">
        {state === 'pending' ? '…' : state === 'success' ? t('success') : t('already')}
      </h1>
      {state !== 'pending' ? (
        <>
          <p className="mt-5 text-olive-grey">{t('next')}</p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link className={cn(btn.ink)} href="/shop">
              {t('shop')}
              <ArrowIcon />
            </Link>
            <Link className={cn(btn.outline)} href="/login">
              {t('login')}
            </Link>
          </div>
        </>
      ) : null}
    </div>
  )
}
