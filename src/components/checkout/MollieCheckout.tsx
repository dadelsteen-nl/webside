'use client'

import { useCart, usePayments } from '@payloadcms/plugin-ecommerce/client/react'
import { useLocale, useTranslations } from 'next-intl'
import { cloneElement, useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react'

import { lineImage, variantLabel } from '@/components/Cart/lineUtils'
import { Media } from '@/components/Media'
import { formatPrice } from '@/components/Price'
import { ArrowIcon, btn, Eyebrow, fieldClass, labelClass } from '@/components/shop/ui'
import { Link } from '@/i18n/navigation'
import { useAuth } from '@/providers/Auth'
import { cn } from '@/utilities/cn'

/** sessionStorage key: guest email needed again on the confirm page after the Mollie redirect. */
export const CHECKOUT_EMAIL_KEY = 'dadelsteen:checkout-email'

const COUNTRIES = ['NL', 'BE', 'DE', 'LU'] as const

type Method = { id: string; description: string; image?: string | null }
type Mode = 'live' | 'simulation' | 'disabled'

type Fields = {
  email: string
  firstName: string
  lastName: string
  addressLine1: string
  addressLine2: string
  postalCode: string
  city: string
  country: (typeof COUNTRIES)[number]
  phone: string
  company: string
  vatNumber: string
}

const empty: Fields = {
  addressLine1: '',
  addressLine2: '',
  city: '',
  company: '',
  country: 'NL',
  email: '',
  firstName: '',
  lastName: '',
  phone: '',
  postalCode: '',
  vatNumber: '',
}

const POSTAL: Record<string, RegExp> = {
  BE: /^\d{4}$/,
  DE: /^\d{5}$/,
  LU: /^(L-?)?\d{4}$/i,
  NL: /^\d{4}\s?[a-z]{2}$/i,
}

export function MollieCheckout() {
  const t = useTranslations('checkout.checkout')
  const tc = useTranslations('checkout.checkout.address')
  const tCountry = useTranslations('checkout.checkout.countries')
  const locale = useLocale()
  const { user } = useAuth()
  const { cart } = useCart()
  const { initiatePayment } = usePayments()

  const [f, setF] = useState<Fields>(empty)
  const [business, setBusiness] = useState(false)
  const [terms, setTerms] = useState(false)
  const [method, setMethod] = useState<string>('')
  const [methods, setMethods] = useState<Method[]>([])
  const [mode, setMode] = useState<Mode | null>(null)
  const [errors, setErrors] = useState<Partial<Record<keyof Fields | 'terms', string>>>({})
  const [formError, setFormError] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'redirecting'>('idle')

  const items = cart?.items ?? []
  const subtotal = typeof cart?.subtotal === 'number' ? cart.subtotal : 0

  useEffect(() => {
    if (!subtotal) return
    let cancelled = false
    fetch(`/api/payments/mollie/methods?amount=${subtotal}&locale=${locale}`)
      .then((r) => r.json())
      .then((res: { methods: Method[]; mode: Mode }) => {
        if (cancelled) return
        setMethods(res.methods)
        setMode(res.mode)
        setMethod((cur) => cur || res.methods[0]?.id || '')
      })
      .catch(() => !cancelled && setMode('disabled'))
    return () => {
      cancelled = true
    }
  }, [locale, subtotal])

  const set = (key: keyof Fields) => (value: string) => {
    setF((cur) => ({ ...cur, [key]: value }))
    if (errors[key]) setErrors((cur) => ({ ...cur, [key]: undefined }))
  }

  const validate = () => {
    const next: typeof errors = {}
    const req: (keyof Fields)[] = ['firstName', 'lastName', 'addressLine1', 'postalCode', 'city', 'phone']
    if (!user) req.unshift('email')
    if (business) req.push('company')
    for (const key of req) if (!f[key].trim()) next[key] = tc('required')
    if (!user && f.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) next.email = tc('invalidEmail')
    if (f.postalCode && !POSTAL[f.country]?.test(f.postalCode.trim())) next.postalCode = tc('invalidPostalCode')
    if (!terms) next.terms = t('termsRequired')
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setFormError('')
    if (!validate()) {
      setFormError(t('errors.incomplete'))
      return
    }
    setStatus('submitting')
    const email = (user?.email ?? f.email).trim()
    const address = {
      addressLine1: f.addressLine1.trim(),
      addressLine2: f.addressLine2.trim() || undefined,
      city: f.city.trim(),
      company: business ? f.company.trim() : undefined,
      country: f.country,
      firstName: f.firstName.trim(),
      lastName: f.lastName.trim(),
      phone: f.phone.trim(),
      postalCode: f.postalCode.trim().toUpperCase(),
    }
    try {
      const res = (await initiatePayment('mollie', {
        additionalData: {
          billingAddress: address,
          customerEmail: email,
          locale,
          paymentMethod: method || undefined,
          shippingAddress: address,
          vatNumber: business ? f.vatNumber.trim() || undefined : undefined,
        },
      })) as { checkoutUrl?: string }
      if (!res?.checkoutUrl) throw new Error('No checkout URL')
      try {
        sessionStorage.setItem(CHECKOUT_EMAIL_KEY, email)
      } catch {
        // Storage can be unavailable (private mode); the confirm page then asks Mollie status only.
      }
      setStatus('redirecting')
      window.location.assign(res.checkoutUrl)
    } catch (err) {
      console.error(err)
      const msg = err instanceof Error ? err.message : ''
      setFormError(/stock|voorraad/i.test(msg) ? t('errors.outOfStock') : t('errors.generic'))
      setStatus('idle')
    }
  }

  const total = useMemo(() => formatPrice(subtotal, locale), [subtotal, locale])

  if (!items.length && status === 'idle') {
    return (
      <div className="container py-24 text-center md:py-36">
        <p className="font-display text-4xl font-light text-ink">{t('empty.title')}</p>
        <p className="mx-auto mt-4 max-w-sm text-olive-grey">{t('empty.text')}</p>
        <Link className={cn(btn.ink, 'mt-10')} href="/shop">
          {t('empty.cta')}
          <ArrowIcon />
        </Link>
      </div>
    )
  }

  const busy = status !== 'idle'

  return (
    <form className="container pb-24 pt-12 md:pb-32 md:pt-20" noValidate onSubmit={onSubmit}>
      <Eyebrow>{t('eyebrow')}</Eyebrow>
      <h1 className="mt-6 font-display text-5xl font-light leading-[1.02] text-ink md:text-7xl">{t('title')}</h1>

      <div className="mt-12 grid gap-12 md:mt-16 lg:grid-cols-12 lg:gap-16">
        <div className="space-y-14 lg:col-span-7">
          <Step n={1} title={t('contact.title')} intro={user ? undefined : t('contact.intro')}>
            {user ? (
              <p className="text-sm text-ink">{t('contact.loggedInAs', { email: user.email ?? '' })}</p>
            ) : (
              <>
                <Field error={errors.email} id="email" label={t('contact.email')}>
                  <input autoComplete="email" inputMode="email" onChange={(e) => set('email')(e.target.value)} type="email" value={f.email} />
                </Field>
                <p className="mt-3 text-sm text-olive-grey">
                  {t('contact.haveAccount')}{' '}
                  <Link className="text-ink underline decoration-bronze underline-offset-4" href="/login">
                    {t('contact.login')}
                  </Link>
                </p>
              </>
            )}
          </Step>

          <Step n={2} title={tc('title')} intro={tc('intro')}>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field error={errors.firstName} id="firstName" label={tc('firstName')}>
                <input autoComplete="given-name" onChange={(e) => set('firstName')(e.target.value)} value={f.firstName} />
              </Field>
              <Field error={errors.lastName} id="lastName" label={tc('lastName')}>
                <input autoComplete="family-name" onChange={(e) => set('lastName')(e.target.value)} value={f.lastName} />
              </Field>
              <Field className="sm:col-span-2" error={errors.addressLine1} id="addressLine1" label={tc('addressLine1')}>
                <input autoComplete="address-line1" onChange={(e) => set('addressLine1')(e.target.value)} value={f.addressLine1} />
              </Field>
              <Field className="sm:col-span-2" id="addressLine2" label={tc('addressLine2')}>
                <input autoComplete="address-line2" onChange={(e) => set('addressLine2')(e.target.value)} value={f.addressLine2} />
              </Field>
              <Field error={errors.postalCode} id="postalCode" label={tc('postalCode')}>
                <input autoComplete="postal-code" onChange={(e) => set('postalCode')(e.target.value)} value={f.postalCode} />
              </Field>
              <Field error={errors.city} id="city" label={tc('city')}>
                <input autoComplete="address-level2" onChange={(e) => set('city')(e.target.value)} value={f.city} />
              </Field>
              <Field id="country" label={tc('country')}>
                <select autoComplete="country" onChange={(e) => set('country')(e.target.value)} value={f.country}>
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c}>
                      {tCountry(c)}
                    </option>
                  ))}
                </select>
              </Field>
              <Field error={errors.phone} hint={tc('phoneHint')} id="phone" label={tc('phone')}>
                <input autoComplete="tel" inputMode="tel" onChange={(e) => set('phone')(e.target.value)} type="tel" value={f.phone} />
              </Field>
            </div>

            <label className="mt-6 flex cursor-pointer items-center gap-3 text-sm text-ink">
              <input checked={business} className="size-4 accent-bronze" onChange={(e) => setBusiness(e.target.checked)} type="checkbox" />
              {tc('business')}
            </label>
            {business ? (
              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <Field error={errors.company} id="company" label={tc('company')}>
                  <input autoComplete="organization" onChange={(e) => set('company')(e.target.value)} value={f.company} />
                </Field>
                <Field id="vatNumber" label={tc('vatNumber')}>
                  <input onChange={(e) => set('vatNumber')(e.target.value)} value={f.vatNumber} />
                </Field>
              </div>
            ) : null}
          </Step>

          <Step n={3} title={t('payment.title')} intro={t('payment.intro')}>
            {mode === 'simulation' ? (
              <p className="mb-5 border-l-2 border-bronze bg-cream px-4 py-3 text-sm text-olive-grey">{t('payment.simulation')}</p>
            ) : null}
            {mode === 'disabled' ? (
              <p className="border-l-2 border-error bg-cream px-4 py-3 text-sm text-ink">{t('payment.disabled')}</p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-3" role="radiogroup" aria-label={t('payment.title')}>
                {methods.map((m) => (
                  <label
                    className={cn(
                      'flex min-h-16 cursor-pointer items-center gap-3 border bg-cream px-4 py-3 text-sm text-ink transition-colors duration-300',
                      method === m.id ? 'border-bronze ring-1 ring-bronze' : 'border-ink/15 hover:border-ink/40',
                    )}
                    key={m.id}
                  >
                    <input
                      checked={method === m.id}
                      className="sr-only"
                      name="method"
                      onChange={() => setMethod(m.id)}
                      type="radio"
                      value={m.id}
                    />
                    {m.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img alt="" className="h-6 w-auto" src={m.image} />
                    ) : null}
                    {m.description}
                  </label>
                ))}
              </div>
            )}
          </Step>
        </div>

        <aside className="lg:col-span-5">
          <div className="border border-ink/10 bg-cream p-6 md:p-8 lg:sticky lg:top-28">
            <h2 className="font-display text-2xl font-light text-ink">{t('summary.title')}</h2>
            <ul className="mt-6 divide-y divide-ink/10 border-y border-ink/10">
              {items.map((item, i) => {
                const product = typeof item.product === 'object' ? item.product : null
                if (!product) return null
                const variant = item.variant && typeof item.variant === 'object' ? item.variant : undefined
                const image = lineImage(product, variant)
                const unit = variant?.priceInEUR ?? product.priceInEUR ?? 0
                return (
                  <li className="flex gap-4 py-4" key={item.id ?? i}>
                    <div className="relative h-20 w-16 shrink-0 overflow-hidden bg-stone">
                      {image ? <Media className="absolute inset-0" fill imgClassName="object-cover" resource={image} size="80px" /> : null}
                    </div>
                    <div className="min-w-0 grow">
                      <p className="font-display text-lg font-light leading-tight text-ink">{product.title}</p>
                      {variant ? <p className="mt-1 text-xs text-olive-grey">{variantLabel(variant)}</p> : null}
                      <p className="mt-1 text-xs text-olive-grey">{t('summary.quantity', { count: item.quantity || 0 })}</p>
                    </div>
                    <p className="shrink-0 text-sm text-ink">{formatPrice(unit * (item.quantity || 0), locale)}</p>
                  </li>
                )
              })}
            </ul>
            <dl className="mt-6 space-y-3 text-sm">
              <div className="flex justify-between text-olive-grey">
                <dt>{t('summary.subtotal')}</dt>
                <dd>{total}</dd>
              </div>
              <div className="flex justify-between text-olive-grey">
                <dt>{t('summary.delivery')}</dt>
                <dd>{t('summary.free')}</dd>
              </div>
              <div className="flex items-baseline justify-between border-t border-ink/10 pt-4">
                <dt className="text-ink">{t('summary.total')}</dt>
                <dd className="font-display text-3xl font-light text-ink">{total}</dd>
              </div>
            </dl>
            <p className="mt-2 text-xs text-olive-grey">{t('summary.vatNote')}</p>

            <label className="mt-8 flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-ink">
              <input
                aria-invalid={Boolean(errors.terms)}
                checked={terms}
                className="mt-1 size-4 shrink-0 accent-bronze"
                onChange={(e) => {
                  setTerms(e.target.checked)
                  setErrors((cur) => ({ ...cur, terms: undefined }))
                }}
                type="checkbox"
              />
              <span>
                {t.rich('terms', {
                  privacy: (c) => (
                    <Link className="underline decoration-bronze underline-offset-4" href="/privacy" target="_blank">
                      {c}
                    </Link>
                  ),
                  terms: (c) => (
                    <Link className="underline decoration-bronze underline-offset-4" href="/terms" target="_blank">
                      {c}
                    </Link>
                  ),
                })}
              </span>
            </label>
            {errors.terms ? <p className="mt-2 text-xs text-error">{errors.terms}</p> : null}

            {formError ? (
              <p className="mt-6 border-l-2 border-error px-4 py-2 text-sm text-ink" role="alert">
                {formError}
              </p>
            ) : null}

            <button className={cn(btn.ink, 'mt-6 w-full')} disabled={busy || mode === 'disabled' || mode === null} type="submit">
              {status === 'redirecting' ? t('redirecting') : status === 'submitting' ? t('submitting') : t('submit', { amount: total })}
              {busy ? null : <ArrowIcon />}
            </button>
            <p className="mt-4 flex items-center justify-center gap-2 text-xs text-olive-grey">
              <LockIcon />
              {t('secure')}
            </p>
          </div>
        </aside>
      </div>
    </form>
  )
}

function Step({ children, intro, n, title }: { children: ReactNode; intro?: string; n: number; title: string }) {
  return (
    <section>
      <div className="flex items-baseline gap-4 border-b border-ink/10 pb-4">
        <span className="font-display text-sm text-bronze-deep">{String(n).padStart(2, '0')}</span>
        <h2 className="font-display text-2xl font-light text-ink md:text-3xl">{title}</h2>
      </div>
      {intro ? <p className="mt-4 text-sm text-olive-grey">{intro}</p> : null}
      <div className="mt-6">{children}</div>
    </section>
  )
}

/** Label + control + error; applies the shared field styling to the single input/select child. */
function Field({
  children,
  className,
  error,
  hint,
  id,
  label,
}: {
  children: React.ReactElement<React.InputHTMLAttributes<HTMLInputElement>>
  className?: string
  error?: string
  hint?: string
  id: string
  label: string
}) {
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined
  const control = cloneElement(children, {
    'aria-describedby': describedBy,
    'aria-invalid': Boolean(error) || undefined,
    className: fieldClass,
    id,
    name: id,
  })
  return (
    <div className={className}>
      <label className={labelClass} htmlFor={id}>
        {label}
      </label>
      {control}
      {error ? (
        <p className="mt-1.5 text-xs text-error" id={`${id}-error`}>
          {error}
        </p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-olive-grey" id={`${id}-hint`}>
          {hint}
        </p>
      ) : null}
    </div>
  )
}

function LockIcon() {
  return (
    <svg aria-hidden="true" className="size-3.5" fill="none" viewBox="0 0 16 16">
      <rect height="7" rx="1" stroke="currentColor" width="10" x="3" y="7" />
      <path d="M5 7V5a3 3 0 0 1 6 0v2" stroke="currentColor" />
    </svg>
  )
}
