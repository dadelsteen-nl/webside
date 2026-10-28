'use client'

import { AnimatePresence, motion } from 'motion/react'
import { useLocale, useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'

import { EASE_LUXE } from '@/components/ui/motion'
import { submitB2BRequest } from '@/lib/actions/leads'
import type { B2BRequestInput, LeadLocale } from '@/lib/actions/leadTypes'

import {
  ConsentField,
  EMAIL_PATTERN,
  FormAlert,
  Honeypot,
  PHONE_PATTERN,
  SubmitButton,
  TextField,
  TileGroup,
} from './fields'
import { FormSuccess } from './FormSuccess'
import { useLeadSubmit } from './useLeadSubmit'

type Values = Omit<B2BRequestInput, 'locale' | 'startedAt' | 'units'> & { units: string }

export const BUSINESS_TYPES = ['physio', 'clinic', 'gym', 'hotel', 'corporate', 'salon', 'other'] as const

export function B2BForm() {
  const t = useTranslations('forms')
  const locale = useLocale() as LeadLocale
  const {
    formState: { errors },
    handleSubmit,
    register,
    reset: resetForm,
    setError,
  } = useForm<Values>({
    defaultValues: {
      businessType: '',
      companyName: '',
      consent: false,
      contactName: '',
      email: '',
      message: '',
      phone: '',
      units: '',
      website: '',
    },
    mode: 'onTouched',
  })
  const { formError, pending, reset, status, submit } = useLeadSubmit(setError)

  const onSubmit = handleSubmit((values) =>
    submit((startedAt) => submitB2BRequest({ ...values, locale, startedAt })),
  )

  const required = (v: string) => v.trim() !== '' || t('errors.required')

  return (
    <AnimatePresence initial={false} mode="wait">
      {status === 'success' ? (
        <motion.div
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          key="success"
          transition={{ duration: 0.6, ease: EASE_LUXE }}
        >
          <FormSuccess
            onReset={() => {
              resetForm()
              reset()
            }}
            text={t('b2b.successText')}
            title={t('b2b.successTitle')}
          />
        </motion.div>
      ) : (
        <motion.form
          animate={{ opacity: 1 }}
          className="relative flex flex-col gap-10"
          exit={{ opacity: 0, y: -12 }}
          initial={{ opacity: 0 }}
          key="form"
          noValidate
          onSubmit={onSubmit}
          transition={{ duration: 0.6, ease: EASE_LUXE }}
        >
          <Honeypot registration={register('website')} />

          <TileGroup
            columns={4}
            error={errors.businessType?.message}
            legend={t('b2b.businessTypeLegend')}
            options={BUSINESS_TYPES.map((v) => ({ label: t(`b2b.businessTypes.${v}`), value: v }))}
            registration={register('businessType')}
            size="sm"
          />

          <div className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
            <TextField
              autoComplete="organization"
              error={errors.companyName?.message}
              label={t('fields.companyName')}
              registration={register('companyName', { required: t('errors.required'), validate: required })}
            />
            <TextField
              autoComplete="name"
              error={errors.contactName?.message}
              label={t('fields.contactName')}
              registration={register('contactName', { required: t('errors.required'), validate: required })}
            />
            <TextField
              autoComplete="email"
              error={errors.email?.message}
              inputMode="email"
              label={t('fields.email')}
              registration={register('email', {
                pattern: { message: t('errors.email'), value: EMAIL_PATTERN },
                required: t('errors.required'),
              })}
              type="email"
            />
            <TextField
              autoComplete="tel"
              error={errors.phone?.message}
              inputMode="tel"
              label={t('fields.phone')}
              optional
              registration={register('phone', {
                pattern: { message: t('errors.phone'), value: PHONE_PATTERN },
              })}
              type="tel"
            />
            <TextField
              error={errors.units?.message}
              inputMode="numeric"
              label={t('fields.units')}
              max={1000}
              min={1}
              optional
              registration={register('units', {
                validate: (v) =>
                  v === '' || (/^\d+$/.test(v) && Number(v) >= 1 && Number(v) <= 1000) || t('errors.invalid'),
              })}
              type="number"
            />
          </div>

          <TextField
            error={errors.message?.message}
            label={t('fields.messageOptional')}
            multiline
            optional
            registration={register('message', {
              maxLength: { message: t('errors.tooLong'), value: 4000 },
            })}
          />

          <ConsentField
            error={errors.consent?.message}
            registration={register('consent', { required: t('errors.consent') })}
          />

          <FormAlert message={formError} />

          <div>
            <SubmitButton pending={pending}>{t('b2b.submit')}</SubmitButton>
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  )
}
