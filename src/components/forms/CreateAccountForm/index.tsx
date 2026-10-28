'use client'

import { useLocale, useTranslations } from 'next-intl'
import { useRouter, useSearchParams } from 'next/navigation'
import { getSafeRedirect } from 'payload/shared'
import React, { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { Notice, TextField } from '@/components/account/fields'
import { ArrowIcon, btn } from '@/components/shop/ui'
import { Link } from '@/i18n/navigation'
import { useAuth } from '@/providers/Auth'
import { cn } from '@/utilities/cn'

type FormData = { email: string; password: string; passwordConfirm: string }

export const CreateAccountForm: React.FC = () => {
  const t = useTranslations('checkout.auth')
  const locale = useLocale()
  const searchParams = useSearchParams()
  const { login } = useAuth()
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const redirectParam = searchParams.get('redirect') ?? ''

  const {
    formState: { errors, isSubmitting },
    getValues,
    handleSubmit,
    register,
  } = useForm<FormData>()

  const onSubmit = useCallback(
    async (data: FormData) => {
      setError(null)
      const response = await fetch('/api/users', {
        body: JSON.stringify(data),
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      })
      if (!response.ok) {
        setError(t('register.error'))
        return
      }
      try {
        await login({ email: data.email, password: data.password })
        toast.success(t('register.success'))
        router.push(getSafeRedirect({ fallbackTo: `/${locale}/account`, redirectTo: redirectParam }))
        router.refresh()
      } catch {
        setError(t('register.error'))
      }
    },
    [locale, login, redirectParam, router, t],
  )

  const query = redirectParam ? { redirect: redirectParam } : undefined

  return (
    <form className="space-y-6" noValidate onSubmit={handleSubmit(onSubmit)}>
      {error ? <Notice tone="error">{error}</Notice> : null}

      <TextField
        autoComplete="email"
        error={errors.email?.message}
        id="email"
        label={t('email')}
        type="email"
        {...register('email', { required: t('required') })}
      />
      <div className="grid gap-6 sm:grid-cols-2">
        <TextField
          autoComplete="new-password"
          error={errors.password?.message}
          id="password"
          label={t('password')}
          type="password"
          {...register('password', { required: t('required') })}
        />
        <TextField
          autoComplete="new-password"
          error={errors.passwordConfirm?.message}
          id="passwordConfirm"
          label={t('passwordConfirm')}
          type="password"
          {...register('passwordConfirm', {
            required: t('required'),
            validate: (value) => value === getValues('password') || t('mismatch'),
          })}
        />
      </div>

      <button className={cn(btn.ink, 'w-full')} disabled={isSubmitting} type="submit">
        {isSubmitting ? t('processing') : t('register.submit')}
        {isSubmitting ? null : <ArrowIcon />}
      </button>

      <p className="border-t border-ink/10 pt-6 text-sm text-olive-grey">
        {t('register.hasAccount')}{' '}
        <Link className="text-ink underline decoration-bronze underline-offset-4" href={{ pathname: '/login', query }}>
          {t('register.login')}
        </Link>
      </p>
    </form>
  )
}
