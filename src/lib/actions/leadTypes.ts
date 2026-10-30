// Shared (client + server) types for the lead form server actions.

export type LeadLocale = 'nl' | 'en'

/** Error codes; the client maps them to `forms.errors.<code>`. */
export type FieldErrorCode = 'required' | 'email' | 'phone' | 'consent' | 'date' | 'tooLong' | 'invalid'

export type LeadActionResult =
  | { ok: true }
  | {
      ok: false
      error: 'validation' | 'rateLimit' | 'server'
      fieldErrors?: Partial<Record<string, FieldErrorCode>>
    }

/** Anti-spam fields every form sends along. */
export type AntiSpam = {
  /** Honeypot; must stay empty. */
  website?: string
  /** `Date.now()` when the form was rendered (time trap). */
  startedAt: number
}

export type DemoRequestInput = AntiSpam & {
  locale: LeadLocale
  name: string
  email: string
  phone?: string
  preferredDate?: string // YYYY-MM-DD
  preferredTime?: 'morning' | 'afternoon' | 'evening' | ''
  location?: 'showroom' | 'at-home' | 'online' | ''
  audience: 'private' | 'business'
  companyName?: string
  message?: string
  consent: boolean
}

export type ContactRequestInput = AntiSpam & {
  locale: LeadLocale
  name: string
  email: string
  phone?: string
  subject?: string
  message: string
  consent: boolean
}

export type B2BRequestInput = AntiSpam & {
  locale: LeadLocale
  companyName: string
  contactName: string
  email: string
  phone?: string
  businessType?: 'government' | 'social' | 'gym' | 'physio' | 'clinic' | 'salon' | 'hotel' | 'corporate' | 'other' | ''
  units?: string | number
  message?: string
  consent: boolean
}
