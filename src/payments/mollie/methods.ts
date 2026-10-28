import { getMollieClient } from './mollieClient'
import {
  STATIC_METHODS,
  getMollieMode,
  isSupportedMethod,
  toMollieAmount,
  toMollieLocale,
  type MollieMode,
} from './shared'

export type CheckoutPaymentMethod = {
  id: string
  description: string
  image?: string | null
}

export type PaymentMethodsResult = {
  mode: MollieMode
  methods: CheckoutPaymentMethod[]
}

const cache = new Map<string, { at: number; value: CheckoutPaymentMethod[] }>()
const TTL = 10 * 60 * 1000

/**
 * Enabled payment methods for the checkout. Calls `mollie.methods.list` when a key exists,
 * otherwise (simulation) returns the static NL/BE list; `disabled` returns none.
 */
export const listPaymentMethods = async ({
  amount,
  locale,
}: {
  amount?: number
  locale: 'nl' | 'en'
}): Promise<PaymentMethodsResult> => {
  const mode = getMollieMode()
  if (mode === 'disabled') return { methods: [], mode }
  if (mode === 'simulation') return { methods: STATIC_METHODS, mode }

  const key = `${locale}:${amount ?? ''}`
  const hit = cache.get(key)
  if (hit && Date.now() - hit.at < TTL) return { methods: hit.value, mode }

  try {
    const methods = await getMollieClient().methods.list({
      locale: toMollieLocale(locale) as never,
      ...(amount ? { amount: { currency: 'EUR', value: toMollieAmount(amount) } } : {}),
    })
    const value = methods
      .filter((m) => isSupportedMethod(m.id))
      .map((m) => ({ id: m.id, description: m.description, image: m.image?.svg ?? null }))
    cache.set(key, { at: Date.now(), value })
    return { methods: value.length ? value : STATIC_METHODS, mode }
  } catch (err) {
    console.error('[mollie] methods.list failed, falling back to static list', err)
    return { methods: STATIC_METHODS, mode }
  }
}
