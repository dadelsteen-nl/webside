'use client'

import { AnimatePresence, motion } from 'motion/react'
import { useLocale, useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'

import { EASE_LUXE } from '@/components/ui/motion'
import { submitDemoRequest } from '@/lib/actions/leads'
import type { DemoRequestInput, LeadLocale } from '@/lib/actions/leadTypes'

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

type Values = Omit<DemoRequestInput, 'locale' | 'startedAt'>

const LOCATIONS = ['showroom', 'at-home', 'online'] as const
const TIMES = ['morning', 'afternoon', 'evening'] as const

const todayLocal = () => {
  const d = new Date()
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
  return d.toISOString().slice(0, 10)
}

export function DemoForm({
  defaultAudience = 'private',
  defaultLocation,
}: {
  defaultAudience?: 'private' | 'business'
  defaultLocation?: (typeof LOCATIONS)[number]
}) {
  const t = useTranslations('forms')
  const locale = useLocale() as LeadLocale
  const {
    formState: { errors },
    handleSubmit,
    register,
    reset: resetForm,
    setError,
    watch,
  } = useForm<Values>({
    defaultValues: {
      audience: defaultAudience,
      companyName: '',
      consent: false,
      email: '',
      location: defaultLocation ?? '',
      message: '',
      name: '',
      phone: '',
      preferredDate: '',
      preferredTime: '',
      website: '',
    },
    mode: 'onTouched',
  })
  const { formError, pending, reset, status, submit } = useLeadSubmit(setError)
  const isBusiness = watch('audience') === 'business'

  const onSubmit = handleSubmit((values) =>
    submit((startedAt) => submitDemoRequest({ ...values, locale, startedAt })),
  )

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
            text={t('demo.successText')}
            title={t('demo.successTitle')}
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
            columns={2}
            legend={t('demo.audienceLegend')}
            options={(['private', 'business'] as const).map((v) => ({
              label: t(`demo.audiences.${v}`),
              value: v,
            }))}
            registration={register('audience')}
            size="sm"
          />

          <div className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
            <TextField
              autoComplete="name"
              error={errors.name?.message}
              label={t('fields.name')}
              registration={register('name', {
                maxLength: { message: t('errors.tooLong'), value: 120 },
                required: t('errors.required'),
                validate: (v) => v.trim() !== '' || t('errors.required'),
              })}
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
            <AnimatePresence initial={false}>
              {isBusiness ? (
                <motion.div
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  initial={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.6, ease: EASE_LUXE }}
                >
                  <TextField
                    autoComplete="organization"
                    error={errors.companyName?.message}
                    label={t('fields.companyName')}
                    registration={register('companyName', {
                      shouldUnregister: true,
                      validate: (v) => !isBusiness || (v ?? '').trim() !== '' || t('errors.required'),
                    })}
                  />
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>

          <TileGroup
            error={errors.location?.message}
            legend={t('demo.locationLegend')}
            options={LOCATIONS.map((v) => ({
              hint: t(`demo.locations.${v}.hint`),
              label: t(`demo.locations.${v}.label`),
              value: v,
            }))}
            registration={register('location')}
          />

          <div className="grid gap-x-8 gap-y-7 sm:grid-cols-2 sm:items-end">
            <TextField
              error={errors.preferredDate?.message}
              floatLabel
              label={t('fields.preferredDate')}
              min={todayLocal()}
              optional
              registration={register('preferredDate', {
                validate: (v) => !v || v >= todayLocal() || t('errors.date'),
              })}
              type="date"
            />
            <TileGroup
              columns={3}
              legend={t('demo.timeLegend')}
              options={TIMES.map((v) => ({ label: t(`demo.times.${v}`), value: v }))}
              registration={register('preferredTime')}
              size="sm"
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
            <SubmitButton pending={pending}>{t('demo.submit')}</SubmitButton>
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  )
}
