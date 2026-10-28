'use client'

import type { Product, Variant } from '@/payload-types'

import React from 'react'

import { cn } from '@/utilities/cn'

type Props = {
  product: Product
  variants: Variant[]
  /** Selected option id per variant type id */
  selection: Record<string, string>
  onSelect: (typeID: string, optionID: string) => void
}

const optionIdsOf = (variant: Variant) =>
  (variant.options || []).map((o) => String(typeof o === 'object' ? o.id : o))

/** Controlled option picker (one row per variant type). */
export function VariantSelector({ onSelect, product, selection, variants }: Props) {
  const types = (product.variantTypes || []).filter(
    (type): type is Exclude<typeof type, number> => typeof type === 'object' && type !== null,
  )

  if (!product.enableVariants || !variants.length || !types.length) return null

  return (
    <div className="flex flex-col gap-6">
      {types.map((type) => {
        const options = (type.options?.docs || []).filter(
          (o): o is Exclude<typeof o, number> => typeof o === 'object' && o !== null,
        )
        if (!options.length) return null
        const typeID = String(type.id)

        return (
          <fieldset key={typeID}>
            <legend className="mb-3 font-sans text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-olive-grey">
              {type.label}
            </legend>
            <div className="flex flex-wrap gap-2">
              {options.map((option) => {
                const optionID = String(option.id)
                const next = { ...selection, [typeID]: optionID }
                const wanted = Object.values(next)
                const available = variants.some(
                  (v) => (v.inventory || 0) > 0 && wanted.every((id) => optionIdsOf(v).includes(id)),
                )
                const active = selection[typeID] === optionID
                return (
                  <button
                    aria-pressed={active}
                    className={cn(
                      'min-h-11 border px-5 font-sans text-xs uppercase tracking-[0.14em] transition-colors duration-500 ease-[var(--ease-luxe)]',
                      active
                        ? 'border-ink bg-ink text-cream'
                        : 'border-ink/15 bg-cream text-ink hover:border-ink/50',
                      !available && 'line-through opacity-40',
                    )}
                    disabled={!available}
                    key={optionID}
                    onClick={() => onSelect(typeID, optionID)}
                    type="button"
                  >
                    {option.label}
                  </button>
                )
              })}
            </div>
          </fieldset>
        )
      })}
    </div>
  )
}

/** Finds the variant whose options exactly cover the selection. */
export const findVariant = (variants: Variant[], selection: Record<string, string>) => {
  const wanted = Object.values(selection)
  if (!wanted.length) return undefined
  return variants.find((v) => {
    const ids = optionIdsOf(v)
    return ids.length === wanted.length && wanted.every((id) => ids.includes(id))
  })
}
