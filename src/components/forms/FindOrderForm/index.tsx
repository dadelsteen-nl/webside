'use client'

import { useTranslations } from 'next-intl'
import React, { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'

import { Notice, TextField } from '@/components/account/fields'
import { ArrowIcon, btn } from '@/components/shop/ui'
import { useAuth } from '@/providers/Auth'
import { cn } from '@/utilities/cn'

import { sendOrderAccessEmail } from './sendOrderAccessEmail'

type FormData = { email: string; orderID: string }

type Props = { initialEmail?: string }

export const FindOrderForm: React.FC<Props> = ({ initialEmail }) => {
  const t = useTranslations('checkout.auth')
  const { user } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)

  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
  } = useForm<FormData>({ defaultValues: { email: initialEmail || user?.email } })

  const onSubmit = useCallback(
    async (data: FormData) => {
      setError(null)
      try {
        const result = await sendOrderAccessEmail({ email: data.email, orderID: data.orderID })
        if (result.success) setSent(true)
        else setError(t('findOrder.error'))
      } catch {
        setError(t('findOrder.error'))
      }
    },
    [t],
  )

  if (sent) {
    return (
      <Notice tone="success">
        <strong className="font-medium">{t('findOrder.sentTitle')}.</strong> {t('findOrder.sentText')}
      </Notice>
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
      <TextField
        error={errors.orderID?.message}
        hint={t('findOrder.hint')}
        id="orderID"
        inputMode="numeric"
        label={t('findOrder.orderID')}
        {...register('orderID', { required: t('required') })}
      />
      <button className={cn(btn.ink, 'w-full')} disabled={isSubmitting} type="submit">
        {isSubmitting ? t('findOrder.sending') : t('findOrder.submit')}
        {isSubmitting ? null : <ArrowIcon />}
      </button>
    </form>
  )
}
