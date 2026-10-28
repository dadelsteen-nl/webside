'use client'

import { AnimatePresence, motion } from 'motion/react'
import { useLocale, useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'

import { EASE_LUXE } from '@/components/ui/motion'
import { submitContactRequest } from '@/lib/actions/leads'
import type { ContactRequestInput, LeadLocale } from '@/lib/actions/leadTypes'

import {
  ConsentField,
  EMAIL_PATTERN,
  FormAlert,
  Honeypot,
  PHONE_PATTERN,
  SubmitButton,
  TextField,
} from './fields'
import { FormSuccess } from './FormSuccess'
import { useLeadSubmit } from './useLeadSubmit'

type Values = Omit<ContactRequestInput, 'locale' | 'startedAt'>

export function ContactForm() {
  const t = useTranslations('forms')
  const locale = useLocale() as LeadLocale
  const {
    formState: { errors },
    handleSubmit,
    register,
    reset: resetForm,
    setError,
  } = useForm<Values>({
    defaultValues: { consent: false, email: '', message: '', name: '', phone: '', subject: '', website: '' },
    mode: 'onTouched',
  })
  const { formError, pending, reset, status, submit } = useLeadSubmit(setError)

  const onSubmit = handleSubmit((values) =>
    submit((startedAt) => submitContactRequest({ ...values, locale, startedAt })),
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
            text={t('contact.successText')}
            title={t('contact.successTitle')}
          />
        </motion.div>
      ) : (
        <motion.form
          animate={{ opacity: 1 }}
          className="relative flex flex-col gap-9"
          exit={{ opacity: 0, y: -12 }}
          initial={{ opacity: 0 }}
          key="form"
          noValidate
          onSubmit={onSubmit}
          transition={{ duration: 0.6, ease: EASE_LUXE }}
        >
          <Honeypot registration={register('website')} />
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
            <TextField
              error={errors.subject?.message}
              label={t('fields.subject')}
              optional
              registration={register('subject', {
                maxLength: { message: t('errors.tooLong'), value: 160 },
              })}
            />
          </div>
          <TextField
            error={errors.message?.message}
            label={t('fields.message')}
            multiline
            registration={register('message', {
              maxLength: { message: t('errors.tooLong'), value: 4000 },
              required: t('errors.required'),
              validate: (v) => v.trim() !== '' || t('errors.required'),
            })}
          />
          <ConsentField
            error={errors.consent?.message}
            registration={register('consent', { required: t('errors.consent') })}
          />
          <FormAlert message={formError} />
          <div>
            <SubmitButton pending={pending}>{t('contact.submit')}</SubmitButton>
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  )
}
