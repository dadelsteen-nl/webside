import type { ReactNode } from 'react'

import { getTranslations } from 'next-intl/server'
import NextImage from 'next/image'

import { Eyebrow } from '@/components/shop/ui'
import { brand } from '@/lib/brandMedia'

type Props = {
  eyebrow: string
  title: string
  intro?: string
  children: ReactNode
}

/** Split layout for login, register, password and order-lookup pages: photo panel + form. */
export async function AuthShell({ children, eyebrow, intro, title }: Props) {
  const t = await getTranslations('checkout.auth.aside')
  const points = t.raw('points') as string[]

  return (
    <div className="container grid gap-12 pb-24 pt-10 md:pb-32 md:pt-16 lg:grid-cols-12 lg:gap-16">
      <div className="lg:col-span-6 lg:col-start-1 lg:py-8 xl:col-span-5">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="mt-6 font-display text-5xl font-light leading-[1.02] tracking-[-0.02em] text-ink md:text-6xl">
          {title}
        </h1>
        {intro ? <p className="mt-5 max-w-md leading-relaxed text-olive-grey">{intro}</p> : null}
        <div className="mt-10">{children}</div>
      </div>

      <aside className="relative hidden min-h-[36rem] overflow-hidden bg-ink lg:col-span-6 lg:col-start-7 lg:block xl:col-span-6 xl:col-start-7">
        <NextImage
          alt={brand.livingRoom.alt}
          className="object-cover opacity-80"
          fill
          sizes="50vw"
          src={brand.livingRoom.url}
        />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-10 text-cream xl:p-12">
          <p className="max-w-sm font-display text-3xl font-light leading-tight">{t('title')}</p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-cream/75">{t('text')}</p>
          <ul className="mt-8 space-y-3 border-t border-cream/20 pt-6">
            {points.map((point) => (
              <li className="flex items-center gap-3 text-sm text-cream/85" key={point}>
                <span aria-hidden="true" className="h-px w-5 bg-bronze" />
                {point}
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  )
}
