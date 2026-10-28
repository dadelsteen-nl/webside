import React from 'react'

import { Price } from '@/components/Price'
import { cn } from '@/utilities/cn'

type Props = {
  amount: number
  position?: 'bottom' | 'center'
  title: string
}

export const Label: React.FC<Props> = ({ amount, position = 'bottom', title }) => {
  return (
    <div
      className={cn('absolute left-0 flex w-full px-4 pb-4', {
        'bottom-0': position === 'bottom',
        'bottom-1/3 justify-center': position === 'center',
      })}
    >
      <div className="flex grow items-end justify-between gap-4 bg-cream/90 px-4 py-3 backdrop-blur-sm">
        <h3 className="line-clamp-2 font-display text-lg font-light leading-tight text-ink">
          {title}
        </h3>
        <Price
          amount={amount}
          as="span"
          className="flex-none font-sans text-xs uppercase tracking-[0.12em] text-bronze-deep"
        />
      </div>
    </div>
  )
}
