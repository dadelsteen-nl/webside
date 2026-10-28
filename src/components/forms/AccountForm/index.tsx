'use client'

import { useTranslations } from 'next-intl'
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import type { User } from '@/payload-types'

import { TextField } from '@/components/account/fields'
import { btn } from '@/components/shop/ui'
import { useAuth } from '@/providers/Auth'
import { cn } from '@/utilities/cn'

type FormData = {
  email: string
  name: User['name']
  password: string
  passwordConfirm: string
}

/** Edit name / email, or switch to a password change. */
export const AccountForm: React.FC = () => {
  const t = useTranslations('checkout.account.settings')
  const { setUser, user } = useAuth()
  const [changePassword, setChangePassword] = useState(false)

  const {
    formState: { errors, isDirty, isSubmitting },
    getValues,
    handleSubmit,
    register,
    reset,
  } = useForm<FormData>()

  useEffect(() => {
    if (user) reset({ email: user.email, name: user.name, password: '', passwordConfirm: '' })
  }, [user, reset, changePassword])

  const onSubmit = useCallback(
    async (data: FormData) => {
      if (!user) return
      const body = changePassword ? { password: data.password } : { email: data.email, name: data.name }
      const response = await fetch(`/api/users/${user.id}`, {
        body: JSON.stringify(body),
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        method: 'PATCH',
      })
      if (!response.ok) {
        toast.error(t('saveError'))
        return
      }
      const json = await response.json()
      setUser(json.doc)
      toast.success(t('saved'))
      setChangePassword(false)
    },
    [changePassword, setUser, t, user],
  )

  return (
    <form className="space-y-6" noValidate onSubmit={handleSubmit(onSubmit)}>
      {changePassword ? (
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
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          <TextField
            autoComplete="name"
            error={errors.name?.message}
            id="name"
            label={t('name')}
            {...register('name', { required: t('required') })}
          />
          <TextField
            autoComplete="email"
            error={errors.email?.message}
            id="email"
            label={t('email')}
            type="email"
            {...register('email', { required: t('required') })}
          />
        </div>
      )}

      <div className="flex flex-col gap-4 border-t border-ink/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <button
          className={btn.link}
          onClick={() => setChangePassword((cur) => !cur)}
          type="button"
        >
          {changePassword ? t('cancel') : t('changePassword')}
        </button>
        <button className={cn(btn.ink)} disabled={isSubmitting || !isDirty} type="submit">
          {isSubmitting ? t('processing') : changePassword ? t('savePassword') : t('save')}
        </button>
      </div>
    </form>
  )
}
