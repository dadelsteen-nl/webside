'use client'

import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useRef, useState, useTransition } from 'react'
import type { FieldValues, Path, UseFormSetError } from 'react-hook-form'

import type { LeadActionResult } from '@/lib/actions/leadTypes'

type Status = 'idle' | 'success'

/**
 * Shared submit flow for lead forms: time-trap timestamp, pending state,
 * mapping server field errors onto react-hook-form, and form-level errors.
 */
export function useLeadSubmit<T extends FieldValues>(setError: UseFormSetError<T>) {
  const t = useTranslations('forms.errors')
  const startedAt = useRef(0)
  const [pending, startTransition] = useTransition()
  const [status, setStatus] = useState<Status>('idle')
  const [formError, setFormError] = useState<string>()

  useEffect(() => {
    startedAt.current = Date.now()
  }, [])

  const submit = useCallback(
    (action: (startedAt: number) => Promise<LeadActionResult>) => {
      setFormError(undefined)
      startTransition(async () => {
        let result: LeadActionResult
        try {
          result = await action(startedAt.current)
        } catch (err) {
          console.error('Lead submission failed', err)
          setFormError(t('server'))
          return
        }
        if (result.ok) {
          setStatus('success')
          return
        }
        if (result.error === 'validation' && result.fieldErrors) {
          let first = true
          for (const [field, code] of Object.entries(result.fieldErrors)) {
            if (!code) continue
            setError(field as Path<T>, { message: t(code), type: 'server' }, { shouldFocus: first })
            first = false
          }
          return
        }
        setFormError(t(result.error === 'rateLimit' ? 'rateLimit' : 'server'))
      })
    },
    [setError, t],
  )

  const reset = useCallback(() => {
    startedAt.current = Date.now()
    setStatus('idle')
  }, [])

  return { formError, pending, reset, status, submit }
}
