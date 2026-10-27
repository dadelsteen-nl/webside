import type { Link } from '@/i18n/navigation'
import type React from 'react'

export type NavHref = React.ComponentProps<typeof Link>['href']

/** Slug of the flagship product page linked as "imbody" in the main navigation. */
export const FLAGSHIP_PRODUCT_SLUG = 'imbody-pro-s'

export type NavItem = {
  /** Key in the `nav` messages namespace. */
  key: 'product' | 'shop' | 'business' | 'demo' | 'about' | 'blog' | 'contact'
  href: NavHref
  /** Internal pathname used for active-state matching. */
  match: string
}

export const mainNav: NavItem[] = [
  {
    key: 'product',
    href: { pathname: '/products/[slug]', params: { slug: FLAGSHIP_PRODUCT_SLUG } },
    match: '/products/[slug]',
  },
  { key: 'shop', href: '/shop', match: '/shop' },
  { key: 'business', href: '/business', match: '/business' },
  { key: 'demo', href: '/demo', match: '/demo' },
  { key: 'about', href: '/about', match: '/about' },
  { key: 'blog', href: '/journal', match: '/journal' },
  { key: 'contact', href: '/contact', match: '/contact' },
]

export function isActive(pathname: string, match: string) {
  return pathname === match || pathname.startsWith(`${match}/`)
}
