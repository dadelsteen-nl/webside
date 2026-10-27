import type { Page } from '@/payload-types'

// Minimal fallback for the CMS `home` page before any page is created.
export const homeStaticData = (): Partial<Page> => ({
  slug: 'home',
  title: 'Dadelsteen',
  hero: { type: 'none' },
  layout: [],
})
