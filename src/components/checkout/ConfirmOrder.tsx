'use client'

import { useEcommerce, usePayments } from '@payloadcms/plugin-ecommerce/client/react'
import { useTranslations } from 'next-intl'
import { useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

import { ArrowIcon, btn, Eyebrow } from '@/components/shop/ui'
import { Link, useRouter } from '@/i18n/navigation'
import { useAuth } from '@/providers/Auth'
import { cn } from '@/utilities/cn'

import { CHECKOUT_EMAIL_KEY } from './MollieCheckout'

type State = 'checking' | 'pending' | 'failed' | 'canceled' | 'expired' | 'missing'

const POLL_MS = 3000
const MAX_POLLS = 40

/**
 * Landing page after the Mollie redirect (`?ref=<reference>`). Confirms the order once Mollie
 * reports `paid`, polls while the payment is still open/pending, then routes to the order page.
 */
export function ConfirmOrder() {
  const t = useTranslations('checkout.confirm')
  const params = useSearchParams()
  const router = useRouter()
  const { user } = useAuth()
  const { cart, clearCart, clearSession } = useEcommerce()
  const { confirmOrder } = usePayments()
  const [state, setState] = useState<State>('checking')
  const started = useRef(false)

  const ref = params.get('ref') ?? ''

  useEffect(() => {
    if (started.current) return
    if (!/^[0-9a-f-]{36}$/i.test(ref)) {
      setState('missing')
      return
    }
    // Wait until the provider restored the cart (confirm needs its ID)
    if (!cart?.id) return
    started.current = true

    let email = user?.email ?? ''
    try {
      email ||= sessionStorage.getItem(CHECKOUT_EMAIL_KEY) ?? ''
    } catch {
      // ignore
    }

    let polls = 0
    let timer: ReturnType<typeof setTimeout> | undefined

    const attempt = async (): Promise<void> => {
      try {
        const result = (await confirmOrder('mollie', {
          additionalData: { customerEmail: email, reference: ref },
        })) as { orderID?: number; accessToken?: string }
        if (!result?.orderID) throw new Error('No order')

        try {
          sessionStorage.removeItem(CHECKOUT_EMAIL_KEY)
        } catch {
          // ignore
        }
        if (user) await clearCart().catch(() => undefined)
        else clearSession()

        const query: Record<string, string> = {}
        if (!user && email) query.email = email
        if (result.accessToken) query.accessToken = result.accessToken
        router.replace({ params: { id: String(result.orderID) }, pathname: '/orders/[id]', query })
      } catch (err) {
        const msg = err instanceof Error ? err.message : ''
        const status = /status: (\w+)/.exec(msg)?.[1]
        if (status === 'failed' || status === 'canceled' || status === 'expired') {
          setState(status)
        } else if ((status === 'open' || status === 'pending' || status === 'authorized') && polls < MAX_POLLS) {
          polls++
          setState('pending')
          timer = setTimeout(() => void attempt(), POLL_MS)
        } else {
          console.error(err)
          setState(status ? 'pending' : 'missing')
        }
      }
    }
    void attempt()
    return () => clearTimeout(timer)
  }, [cart?.id, clearCart, clearSession, confirmOrder, ref, router, user])

  // No cart restored after a while means we cannot confirm from this browser
  useEffect(() => {
    if (cart?.id || state !== 'checking') return
    const id = setTimeout(() => !started.current && setState('missing'), 8000)
    return () => clearTimeout(id)
  }, [cart?.id, state])

  const failed = state === 'failed' || state === 'canceled' || state === 'expired'
  const title =
    state === 'checking'
      ? t('checking')
      : state === 'pending'
        ? t('pendingTitle')
        : state === 'canceled'
          ? t('cancelledTitle')
          : state === 'expired'
            ? t('expiredTitle')
            : state === 'failed'
              ? t('failedTitle')
              : t('missingTitle')
  const text = state === 'pending' ? t('pendingText') : failed ? t('failedText') : state === 'missing' ? t('missingText') : ''

  return (
    <div className="container flex min-h-[70vh] flex-col items-center justify-center py-24 text-center">
      <Eyebrow className="justify-center">{t('eyebrow')}</Eyebrow>
      {state === 'checking' || state === 'pending' ? (
        <span aria-hidden="true" className="mt-10 block size-10 animate-spin rounded-full border border-ink/15 border-t-bronze" />
      ) : null}
      <h1 aria-live="polite" className="mt-8 max-w-2xl font-display text-4xl font-light leading-tight text-ink md:text-5xl">
        {title}
      </h1>
      {text ? <p className="mt-5 max-w-md text-olive-grey">{text}</p> : null}
      {failed || state === 'missing' ? (
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          {failed ? (
            <Link className={cn(btn.ink)} href="/checkout">
              {t('retry')}
              <ArrowIcon />
            </Link>
          ) : (
            <Link className={cn(btn.ink)} href="/shop">
              {t('toShop')}
            </Link>
          )}
          <Link className={cn(btn.outline)} href="/contact">
            {t('contact')}
          </Link>
        </div>
      ) : null}
    </div>
  )
}
