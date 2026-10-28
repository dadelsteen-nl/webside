import { routing } from '@/i18n/routing'

/**
 * Shared, dependency-light helpers for the Mollie adapter (safe for server + Payload CLI).
 */

export type MollieMode = 'live' | 'simulation' | 'disabled'

export const MOLLIE_SLUG = 'mollie'

/**
 * - `live`: MOLLIE_API_KEY is set (test_ or live_ key) → real Mollie hosted checkout.
 * - `simulation`: no key and NODE_ENV !== 'production' → fake payments that always succeed.
 * - `disabled`: no key in production → checkout is blocked.
 */
export const getMollieMode = (): MollieMode => {
  if (process.env.MOLLIE_API_KEY) return 'live'
  if (process.env.NODE_ENV !== 'production') return 'simulation'
  return 'disabled'
}

/** Payment method ids we offer in the storefront (Mollie ids). */
export const SUPPORTED_METHODS = [
  'ideal',
  'bancontact',
  'creditcard',
  'applepay',
  'paypal',
  'klarna',
  'kbc',
  'belfius',
  'banktransfer',
] as const

export type SupportedMethod = (typeof SUPPORTED_METHODS)[number]

export const isSupportedMethod = (value: unknown): value is SupportedMethod =>
  typeof value === 'string' && (SUPPORTED_METHODS as readonly string[]).includes(value)

/** Static fallback list (simulation mode or when Mollie's methods API is unreachable). */
export const STATIC_METHODS: { id: SupportedMethod; description: string }[] = [
  { id: 'ideal', description: 'iDEAL' },
  { id: 'bancontact', description: 'Bancontact' },
  { id: 'creditcard', description: 'Creditcard' },
]

/** Cents → Mollie amount string, e.g. 549900 → "5499.00". */
export const toMollieAmount = (cents: number): string => (Math.round(cents) / 100).toFixed(2)

type AppLocale = (typeof routing.locales)[number]

export const toAppLocale = (value: unknown): AppLocale =>
  typeof value === 'string' && (routing.locales as readonly string[]).includes(value)
    ? (value as AppLocale)
    : routing.defaultLocale

export const toMollieLocale = (locale: AppLocale, country?: string | null) => {
  if (locale === 'nl') return country === 'BE' ? 'nl_BE' : 'nl_NL'
  return 'en_US'
}

/**
 * Localized pathname for an internal route, read straight from the next-intl routing table.
 * (Equivalent to `getPathname` from `@/i18n/navigation`, but without pulling next-intl's
 * React navigation into the Payload config, which is also loaded by the Payload CLI.)
 */
export const localizedPath = (
  locale: AppLocale,
  internal: keyof typeof routing.pathnames,
): string => {
  const entry = routing.pathnames[internal] as string | Record<AppLocale, string>
  const path = typeof entry === 'string' ? entry : entry[locale]
  return `/${locale}${path === '/' ? '' : path}`
}

export const getServerURL = () =>
  (process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000').replace(/\/$/, '')

/** Mollie cannot reach localhost; only send a webhook URL when it is publicly reachable. */
export const getWebhookURL = (): string | undefined => {
  if (process.env.MOLLIE_WEBHOOK_URL) return process.env.MOLLIE_WEBHOOK_URL
  const base = getServerURL()
  if (/\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0)(:|\/|$)/.test(base)) return undefined
  return `${base}/api/payments/${MOLLIE_SLUG}/webhooks`
}

export const normalizeEmail = (value: unknown): string =>
  typeof value === 'string' ? value.trim().toLowerCase() : ''

export const relationID = (value: unknown): string | undefined => {
  const id =
    typeof value === 'object' && value !== null && 'id' in value
      ? (value as { id: unknown }).id
      : value
  if (typeof id === 'number' && Number.isFinite(id)) return String(id)
  if (typeof id === 'string' && id.trim()) return id
  return undefined
}

/** Maps a Mollie payment status to the plugin's transaction status for terminal failures. */
export const failureStatusFor = (
  mollieStatus: string,
): 'failed' | 'cancelled' | 'expired' | undefined => {
  if (mollieStatus === 'failed') return 'failed'
  if (mollieStatus === 'canceled') return 'cancelled'
  if (mollieStatus === 'expired') return 'expired'
  return undefined
}
