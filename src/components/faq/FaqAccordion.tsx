'use client'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { cn } from '@/utilities/cn'

export type FaqItem = { id: string | number; question: string; answer: string }

/** Accessible, brand-styled accordion (Radix). Reusable on the FAQ page, product pages, business, etc. */
export function FaqAccordion({
  items,
  className,
  defaultOpenFirst = false,
}: {
  items: FaqItem[]
  className?: string
  defaultOpenFirst?: boolean
}) {
  if (!items.length) return null
  return (
    <Accordion
      className={cn('border-t border-ink/15', className)}
      collapsible
      defaultValue={defaultOpenFirst ? String(items[0].id) : undefined}
      type="single"
    >
      {items.map((item) => (
        <AccordionItem className="border-b border-ink/15" key={item.id} value={String(item.id)}>
          <AccordionTrigger className="py-6 font-display text-lg font-light leading-snug text-ink hover:text-bronze-deep hover:no-underline md:text-xl [&>svg]:text-bronze">
            {item.question}
          </AccordionTrigger>
          <AccordionContent className="max-w-2xl whitespace-pre-line pb-7 text-[0.9375rem] leading-[1.8] text-olive-grey">
            {item.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
