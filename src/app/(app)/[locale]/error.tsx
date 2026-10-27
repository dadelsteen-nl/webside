'use client'

import { LogoIcon } from '@/components/icons/logo'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import React, { useEffect } from 'react'

type Props = {
  error: Error & { digest?: string }
  /** Next.js 16 recovery callback. */
  retry?: () => void
  /** Pre-16 name, kept for compatibility. */
  reset?: () => void
}

export default function Error({ error, retry, reset }: Props) {
  const t = useTranslations('common.error')

  useEffect(() => {
    console.error(error)
  }, [error])

  const tryAgain = retry ?? reset

  return (
    <section className="flex min-h-[75vh] items-center px-5 py-24 md:px-8 md:py-32">
      <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
        <LogoIcon className="mb-10 h-14 w-10 text-bronze" />
        <p className="mb-6 text-[0.625rem] font-medium uppercase tracking-[0.36em] text-bronze-deep">
          {t('eyebrow')}
        </p>
        <h1 className="font-display text-4xl leading-[1.08] font-light text-balance sm:text-5xl md:text-6xl">
          {t('title')}
        </h1>
        <span aria-hidden="true" className="my-10 h-12 w-px bg-ink/20" />
        <p className="max-w-md text-base leading-relaxed text-olive-grey">{t('body')}</p>
        <div className="mt-12 flex flex-col gap-3 sm:flex-row">
          {tryAgain ? (
            <button
              className="inline-flex h-12 items-center justify-center bg-ink px-8 text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-cream transition-colors duration-700 ease-(--ease-luxe) hover:bg-bronze-deep"
              onClick={() => tryAgain()}
              type="button"
            >
              {t('retry')}
            </button>
          ) : null}
          <Link
            className="inline-flex h-12 items-center justify-center border border-bronze px-8 text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-ink transition-colors duration-700 ease-(--ease-luxe) hover:bg-bronze hover:text-cream"
            href="/"
          >
            {t('home')}
          </Link>
        </div>
        {error.digest ? (
          <p className="mt-10 text-[0.625rem] uppercase tracking-[0.2em] text-olive-grey/70">
            {t('reference')}: {error.digest}
          </p>
        ) : null}
      </div>
    </section>
  )
}
