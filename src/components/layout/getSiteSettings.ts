import type { SiteSetting } from '@/payload-types'
import type { Locale } from '@/i18n/routing'

import { withCompanyContact } from '@/lib/company'
import { getCachedGlobal } from '@/utilities/getGlobals'

/** Site settings for the chrome (header/footer/social bar), cached per locale. */
export async function getLayoutSiteSettings(locale: Locale): Promise<SiteSetting> {
  return withCompanyContact(await getCachedGlobal('site-settings', 1, locale)(), locale)
}
