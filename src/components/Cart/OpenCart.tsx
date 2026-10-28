import { Button } from '@/components/ui/button'
import React from 'react'

export function OpenCartButton({
  label = 'Cart',
  quantity,
  ...rest
}: {
  className?: string
  label?: string
  quantity?: number
}) {
  return (
    <Button
      aria-label={quantity ? `${label} (${quantity})` : label}
      className="navLink relative items-end hover:cursor-pointer"
      size="clear"
      variant="nav"
      {...rest}
    >
      <span>{label}</span>

      {quantity ? (
        <>
          <span>•</span>
          <span>{quantity}</span>
        </>
      ) : null}
    </Button>
  )
}
