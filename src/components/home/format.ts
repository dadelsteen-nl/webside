export const intlLocale = (locale: string) => (locale === 'nl' ? 'nl-NL' : 'en-GB')

/** Whole-euro currency formatting, e.g. "€ 5.499" (nl) / "€5,499" (en). */
export function formatEUR(value: number, locale: string) {
  return new Intl.NumberFormat(intlLocale(locale), {
    currency: 'EUR',
    maximumFractionDigits: 0,
    style: 'currency',
  }).format(value)
}
