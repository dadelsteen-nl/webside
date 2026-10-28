'use client'

import { Check, Minus, X } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { useId, useMemo, useState, type CSSProperties } from 'react'

import { Reveal } from '@/components/ui/motion'
import { cn } from '@/utilities/cn'

import type { CalcDefaults } from './types'

import { formatEUR } from './format'
import { SectionLabel } from './primitives'

type Props = {
  defaults: CalcDefaults
  /** One-time imbody price in whole euros */
  imbodyPrice: number
}

type Row = { label: string; values: string[] }

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))

function Slider({
  format,
  label,
  max,
  min,
  onChange,
  step = 1,
  value,
}: {
  label: string
  value: number
  min: number
  max: number
  step?: number
  format: (v: number) => string
  onChange: (v: number) => void
}) {
  const id = useId()
  const pct = ((value - min) / (max - min)) * 100
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <label className="text-sm text-olive-grey" htmlFor={id}>
          {label}
        </label>
        <output className="font-display text-xl font-light tabular-nums text-ink" htmlFor={id}>
          {format(value)}
        </output>
      </div>
      <input
        aria-valuetext={format(value)}
        className="home-range mt-4 w-full"
        id={id}
        max={max}
        min={min}
        onChange={(e) => onChange(Number(e.target.value))}
        step={step}
        style={{ '--pct': `${pct}%` } as CSSProperties}
        type="range"
        value={value}
      />
    </div>
  )
}

export function CostCalculator({ defaults, imbodyPrice }: Props) {
  const t = useTranslations('home.calc')
  const locale = useLocale()

  const [years, setYears] = useState(clamp(defaults.years, 1, 10))
  const [gymMonthly, setGymMonthly] = useState(clamp(defaults.gymMonthly, 20, 150))
  const [sessions, setSessions] = useState(clamp(defaults.sessionsPerMonth, 0, 12))
  const [sessionPrice, setSessionPrice] = useState(clamp(defaults.trainerSession, 30, 150))

  const eur = (v: number) => formatEUR(v, locale)

  const result = useMemo(() => {
    const gym = gymMonthly * 12 * years
    const gymPt = gym + sessions * sessionPrice * 12 * years
    return { gym, gymPt, imbody: imbodyPrice }
  }, [gymMonthly, years, sessions, sessionPrice, imbodyPrice])

  const max = Math.max(result.gym, result.gymPt, result.imbody, 1)
  const savings = result.gymPt - result.imbody

  const bars = [
    { key: 'gym', label: t('rowGym'), value: result.gym },
    { key: 'gymPt', label: t('rowGymPt'), value: result.gymPt },
    { highlight: true, key: 'imbody', label: t('rowImbody'), note: t('imbodyNote'), value: result.imbody },
  ]

  const columns = t.raw('tableColumns') as string[]
  const rows = t.raw('tableRows') as Row[]

  const cell = (v: string) => {
    if (v === 'yes')
      return (
        <>
          <Check aria-hidden="true" className="mx-auto size-4 text-bronze-deep" strokeWidth={1.5} />
          <span className="sr-only">{t('yes')}</span>
        </>
      )
    if (v === 'no')
      return (
        <>
          <X aria-hidden="true" className="mx-auto size-4 text-olive-grey/60" strokeWidth={1.5} />
          <span className="sr-only">{t('no')}</span>
        </>
      )
    if (v === 'partial')
      return (
        <>
          <Minus aria-hidden="true" className="mx-auto size-4 text-olive-grey" strokeWidth={1.5} />
          <span className="sr-only">{t('partial')}</span>
        </>
      )
    return v
  }

  return (
    <section aria-labelledby="home-calc-title" className="bg-sand py-24 md:py-36">
      <div className="container">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <Reveal className="lg:col-span-7">
            <SectionLabel>{t('label')}</SectionLabel>
            <h2
              className="mt-8 max-w-[16ch] text-[clamp(2.25rem,4.6vw,4.25rem)] font-light leading-[1.02] tracking-[-0.025em] text-ink"
              id="home-calc-title"
            >
              {t('title')}
            </h2>
          </Reveal>
          <Reveal className="lg:col-span-4 lg:col-start-9" delay={0.1}>
            <p className="max-w-sm text-base leading-relaxed text-olive-grey">{t('intro')}</p>
          </Reveal>
        </div>

        <Reveal className="mt-16 grid border border-ink/10 bg-cream md:mt-20 lg:grid-cols-12" delay={0.1}>
          <div className="space-y-9 border-b border-ink/10 p-6 sm:p-10 lg:col-span-5 lg:border-b-0 lg:border-r">
            <Slider
              format={(v) => t('yearsValue', { count: v })}
              label={t('years')}
              max={10}
              min={1}
              onChange={setYears}
              value={years}
            />
            <Slider
              format={eur}
              label={t('gymMonthly')}
              max={150}
              min={20}
              onChange={setGymMonthly}
              step={5}
              value={gymMonthly}
            />
            <Slider
              format={(v) => String(v)}
              label={t('sessionsPerMonth')}
              max={12}
              min={0}
              onChange={setSessions}
              value={sessions}
            />
            <Slider
              format={eur}
              label={t('sessionPrice')}
              max={150}
              min={30}
              onChange={setSessionPrice}
              step={5}
              value={sessionPrice}
            />
          </div>

          <div className="flex flex-col p-6 sm:p-10 lg:col-span-7">
            <p className="font-sans text-[0.6875rem] font-medium uppercase tracking-[0.22em] text-olive-grey">
              {t('resultsTitle', { count: years })}
            </p>
            <ul aria-live="polite" className="mt-8 space-y-7">
              {bars.map((bar) => (
                <li key={bar.key}>
                  <div className="flex items-baseline justify-between gap-4">
                    <span className={cn('text-sm', bar.highlight ? 'font-medium text-ink' : 'text-olive-grey')}>
                      {bar.label}
                    </span>
                    <span
                      className={cn(
                        'font-display font-light tabular-nums',
                        bar.highlight ? 'text-3xl text-bronze-deep' : 'text-2xl text-ink',
                      )}
                    >
                      {eur(bar.value)}
                    </span>
                  </div>
                  <div className="mt-3 h-2 w-full overflow-hidden bg-stone/70">
                    <div
                      className={cn(
                        'h-full origin-left transition-[width] duration-1000 ease-[var(--ease-luxe)]',
                        bar.highlight ? 'bg-bronze' : 'bg-ink/80',
                      )}
                      style={{ width: `${Math.max(1.5, (bar.value / max) * 100)}%` }}
                    />
                  </div>
                  {bar.note ? <p className="mt-2 text-xs text-olive-grey">{bar.note}</p> : null}
                </li>
              ))}
            </ul>

            <div className="mt-auto pt-10">
              {savings > 0 ? (
                <p className="border-t border-ink/10 pt-6 text-sm text-olive-grey">
                  {t('savings')}{' '}
                  <strong className="font-display text-2xl font-light tabular-nums text-ink">{eur(savings)}</strong>{' '}
                  {t('savingsSuffix')}
                </p>
              ) : null}
              <p className="mt-4 text-xs leading-relaxed text-olive-grey/80">{t('disclaimer')}</p>
            </div>
          </div>
        </Reveal>

        <Reveal className="mt-16 md:mt-24">
          <h3 className="text-2xl font-light text-ink md:text-3xl">{t('tableTitle')}</h3>
          <div className="relative mt-8 overflow-x-auto">
            <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-ink/15">
                  <th className="py-4 pr-4 font-sans text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-olive-grey" scope="col">
                    {t('tableCriterion')}
                  </th>
                  {columns.map((col, i) => (
                    <th
                      className={cn(
                        'w-[22%] px-3 py-4 text-center font-sans text-[0.6875rem] font-medium uppercase tracking-[0.18em]',
                        i === 0 ? 'bg-cream text-bronze-deep' : 'text-olive-grey',
                      )}
                      key={col}
                      scope="col"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr className="border-b border-ink/10" key={row.label}>
                    <th className="py-4 pr-4 font-normal text-ink" scope="row">
                      {row.label}
                    </th>
                    {row.values.map((v, i) => (
                      <td
                        className={cn('px-3 py-4 text-center', i === 0 ? 'bg-cream text-ink' : 'text-olive-grey')}
                        key={i}
                      >
                        {cell(v)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
