'use client'

import { useLocale, useTranslations } from 'next-intl'
import { useRouter, useSearchParams } from 'next/navigation'
import { getSafeRedirect } from 'payload/shared'
import React, { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'

import { Notice, TextField } from '@/components/account/fields'
import { ArrowIcon, btn } from '@/components/shop/ui'
import { Link } from '@/i18n/navigation'
import { useAuth } from '@/providers/Auth'
import { cn } from '@/utilities/cn'

type FormData = { email: string; password: string }

export const LoginForm: React.FC = () => {
  const t = useTranslations('checkout.auth')
  const ta = useTranslations('checkout.account')
  const locale = useLocale()
  const searchParams = useSearchParams()
  const { login } = useAuth()
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const redirectParam = searchParams.get('redirect') ?? ''

  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
  } = useForm<FormData>()

  const onSubmit = useCallback(
    async (data: FormData) => {
      setError(null)
      try {
        await login(data)
        router.push(getSafeRedirect({ fallbackTo: `/${locale}/account`, redirectTo: redirectParam }))
        router.refresh()
      } catch {
        setError(t('login.error'))
      }
    },
    [locale, login, redirectParam, router, t],
  )

  const query = redirectParam ? { redirect: redirectParam } : undefined

  return (
    <form className="space-y-6" noValidate onSubmit={handleSubmit(onSubmit)}>
      {searchParams.get('reason') === 'login' ? <Notice>{ta('loginRequired')}</Notice> : null}
      {error ? <Notice tone="error">{error}</Notice> : null}

      <TextField
        autoComplete="email"
        error={errors.email?.message}
        id="email"
        label={t('email')}
        type="email"
        {...register('email', { required: t('required') })}
      />
      <TextField
        autoComplete="current-password"
        error={errors.password?.message}
        id="password"
        label={t('password')}
        type="password"
        {...register('password', { required: t('required') })}
      />
      <div className="flex justify-end">
        <Link className={btn.link} href={{ pathname: '/forgot-password', query }}>
          {t('login.forgot')}
        </Link>
      </div>

      <button className={cn(btn.ink, 'w-full')} disabled={isSubmitting} type="submit">
        {isSubmitting ? t('processing') : t('login.submit')}
        {isSubmitting ? null : <ArrowIcon />}
      </button>

      <p className="border-t border-ink/10 pt-6 text-sm text-olive-grey">
        {t('login.noAccount')}{' '}
        <Link className="text-ink underline decoration-bronze underline-offset-4" href={{ pathname: '/create-account', query }}>
          {t('login.create')}
        </Link>
      </p>
    </form>
  )
}
