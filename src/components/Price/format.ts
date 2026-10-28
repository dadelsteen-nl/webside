/** Shared EUR formatter (amounts in cents). Safe on server and client. */
const formatters = new Map<string, Intl.NumberFormat>()

export const intlLocale = (locale: string) => (locale === 'nl' ? 'nl-NL' : 'en-GB')

export function formatPrice(cents: number, locale: string, currency = 'EUR'): string {
  const key = `${locale}:${currency}`
  let f = formatters.get(key)
  if (!f) {
    f = new Intl.NumberFormat(intlLocale(locale), { style: 'currency', currency })
    formatters.set(key, f)
  }
  return f.format(cents / 100)
}
