import { useTranslations } from 'next-intl'

import { Link } from '@/i18n/navigation'
import { cn } from '@/utilities/cn'

export type ShopFilter = 'all' | 'device' | 'accessory'

/** Hairline category tabs for the shop (Toestellen / Accessoires) driven by `?type=`. */
export function CategoryTabs({ active }: { active: ShopFilter }) {
  const t = useTranslations('shop.shop')

  const tabs: { key: ShopFilter; label: string }[] = [
    { key: 'all', label: t('tabs.all') },
    { key: 'device', label: t('tabs.devices') },
    { key: 'accessory', label: t('tabs.accessories') },
  ]

  return (
    <nav aria-label={t('tabsLabel')} className="border-b border-ink/10">
      <ul className="-mb-px flex gap-8 overflow-x-auto">
        {tabs.map((tab) => {
          const isActive = tab.key === active
          return (
            <li key={tab.key}>
              <Link
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'inline-block border-b py-4 font-sans text-[0.6875rem] font-medium uppercase tracking-[0.22em] transition-colors duration-500 ease-[var(--ease-luxe)]',
                  isActive
                    ? 'border-bronze text-ink'
                    : 'border-transparent text-olive-grey hover:text-ink',
                )}
                href={tab.key === 'all' ? '/shop' : { pathname: '/shop', query: { type: tab.key } }}
                scroll={false}
              >
                {tab.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
