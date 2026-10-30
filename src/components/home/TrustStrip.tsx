import { ClipboardCheck, Handshake, ShieldCheck, Wrench } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

import { Reveal } from '@/components/ui/motion'

const icons = [Handshake, Wrench, ClipboardCheck, ShieldCheck]

type Item = { title: string; text: string }

export async function TrustStrip() {
  const t = await getTranslations('home.trust')
  const items = t.raw('items') as Item[]

  return (
    <section aria-label={t('label')} className="border-b border-ink/10 bg-cream">
      <ul className="container grid grid-cols-2 lg:grid-cols-4">
        {items.map((item, i) => {
          const Icon = icons[i % icons.length]!
          return (
            <Reveal
              as="li"
              className={[
                'flex flex-col gap-4 py-8 pr-4 sm:flex-row sm:items-start lg:py-10 lg:pl-8',
                i % 2 === 1 ? 'border-l border-ink/10 pl-4 sm:pl-6' : '',
                i >= 2 ? 'border-t border-ink/10 lg:border-t-0' : '',
                i === 2 ? 'lg:border-l' : '',
                i === 0 ? 'lg:pl-0' : '',
              ].join(' ')}
              delay={i * 0.08}
              key={item.title}
              y={12}
            >
              <Icon aria-hidden="true" className="size-6 shrink-0 text-palm" strokeWidth={1} />
              <div>
                <p className="font-sans text-sm font-medium text-ink">{item.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-olive-grey sm:text-[0.8125rem]">
                  {item.text}
                </p>
              </div>
            </Reveal>
          )
        })}
      </ul>
    </section>
  )
}
