import type { SiteSetting } from '@/payload-types'

/** Dadelsteen contact details; fallback for empty Site Settings fields. */
export const COMPANY_CONTACT = {
  email: 'info@dadelsteen.nl',
  phone: '+31 6 14640335',
  address: {
    street: 'Johan de Wittlaan 7',
    postalCode: '2517 JT',
    city: 'Den Haag',
    country: 'Nederland',
  },
} as const

const countryLabel = { nl: 'Nederland', en: 'The Netherlands' } as const

/** Fills empty contact fields in Site Settings with the company defaults. */
export function withCompanyContact(settings: SiteSetting, locale: string): SiteSetting {
  const a = settings.address ?? {}
  const country = a.country?.trim() || COMPANY_CONTACT.address.country
  return {
    ...settings,
    email: settings.email?.trim() || COMPANY_CONTACT.email,
    phone: settings.phone?.trim() || COMPANY_CONTACT.phone,
    address: {
      ...a,
      street: a.street?.trim() || COMPANY_CONTACT.address.street,
      postalCode: a.postalCode?.trim() || COMPANY_CONTACT.address.postalCode,
      city: a.city?.trim() || COMPANY_CONTACT.address.city,
      country: country === 'Nederland' && locale === 'en' ? countryLabel.en : country,
    },
  }
}
