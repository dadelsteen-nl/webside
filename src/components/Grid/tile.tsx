import type { Media as MediaType } from '@/payload-types'

import { Label } from '@/components/Grid/Label'
import { Media } from '@/components/Media'
import { cn } from '@/utilities/cn'
import React from 'react'

type Props = {
  active?: boolean
  isInteractive?: boolean
  label?: {
    amount: number
    position?: 'bottom' | 'center'
    title: string
  }
  media?: MediaType
}

export const GridTileImage: React.FC<Props> = ({ active, isInteractive = true, label, media }) => {
  return (
    <div
      className={cn(
        'group relative flex h-full w-full items-center justify-center overflow-hidden bg-stone transition-[outline-color] duration-500',
        active ? 'outline outline-1 outline-offset-2 outline-bronze' : 'outline-transparent',
      )}
    >
      {media ? (
        <Media
          className="absolute inset-0"
          fill
          imgClassName={cn('object-cover', {
            'transition-transform duration-[1200ms] ease-[var(--ease-luxe)] group-hover:scale-[1.04]':
              isInteractive,
          })}
          resource={media}
          size="(min-width: 768px) 33vw, 66vw"
        />
      ) : null}
      {label ? <Label amount={label.amount} position={label.position} title={label.title} /> : null}
    </div>
  )
}
