'use client'

import { useTranslations } from 'next-intl'

import { Link, usePathname } from '@/i18n/navigation'
import { cn } from '@/utilities/cn'

type Props = { className?: string }

const items = [
  { href: '/account', key: 'settings' },
  { href: '/account/addresses', key: 'addresses' },
  { href: '/orders', key: 'orders' },
] as const

/** Account section navigation: horizontal tabs on mobile, vertical list from lg. */
export const AccountNav: React.FC<Props> = ({ className }) => {
  const t = useTranslations('checkout.account.nav')
  const pathname = usePathname()

  const isActive = (href: string) =>
    href === '/orders' ? pathname.startsWith('/orders') : pathname === href

  return (
    <nav aria-label={t('label')} className={className}>
      <ul className="-mx-4 flex gap-1 overflow-x-auto px-4 lg:mx-0 lg:flex-col lg:gap-0 lg:overflow-visible lg:border-t lg:border-ink/10 lg:px-0">
        {items.map((item) => {
          const active = isActive(item.href)
          return (
            <li className="shrink-0 lg:border-b lg:border-ink/10" key={item.href}>
              <Link
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex items-center justify-between gap-4 whitespace-nowrap border-b-2 px-3 py-3 font-sans text-[0.6875rem] font-medium uppercase tracking-[0.2em] transition-colors duration-300 lg:border-b-0 lg:border-l-2 lg:px-4 lg:py-4',
                  active ? 'border-bronze text-ink' : 'border-transparent text-olive-grey hover:text-ink',
                )}
                href={item.href}
              >
                {t(item.key)}
              </Link>
            </li>
          )
        })}
        <li className="shrink-0 lg:mt-6">
          <Link
            className="flex whitespace-nowrap px-3 py-3 font-sans text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-olive-grey underline-offset-4 transition-colors hover:text-ink hover:underline lg:px-4"
            href="/logout"
          >
            {t('logout')}
          </Link>
        </li>
      </ul>
    </nav>
  )
}
