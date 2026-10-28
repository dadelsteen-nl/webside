'use client'

import { useTranslations } from 'next-intl'
import React, { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'

import { Notice, TextField } from '@/components/account/fields'
import { ArrowIcon, btn } from '@/components/shop/ui'
import { Link } from '@/i18n/navigation'
import { cn } from '@/utilities/cn'

type FormData = { email: string }

export const ForgotPasswordForm: React.FC = () => {
  const t = useTranslations('checkout.auth')
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
  } = useForm<FormData>()

  const onSubmit = useCallback(
    async (data: FormData) => {
      const response = await fetch('/api/users/forgot-password', {
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      })
      if (response.ok) {
        setSent(true)
        setError('')
      } else {
        setError(t('forgot.error'))
      }
    },
    [t],
  )

  if (sent) {
    return (
      <div className="space-y-6">
        <Notice tone="success">
          <strong className="font-medium">{t('forgot.sentTitle')}.</strong> {t('forgot.sentText')}
        </Notice>
        <Link className={btn.link} href="/login">
          {t('login.submit')}
          <ArrowIcon className="text-bronze" />
        </Link>
      </div>
    )
  }

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
      <button className={cn(btn.ink, 'w-full')} disabled={isSubmitting} type="submit">
        {isSubmitting ? t('processing') : t('forgot.submit')}
        {isSubmitting ? null : <ArrowIcon />}
      </button>
      <p className="border-t border-ink/10 pt-6 text-sm">
        <Link className="text-ink underline decoration-bronze underline-offset-4" href="/login">
          {t('login.submit')}
        </Link>
      </p>
    </form>
  )
}
