import createMollieClient, { type MollieClient } from '@mollie/api-client'

let client: MollieClient | null = null

/** Lazily created Mollie client; throws when no API key is configured. */
export const getMollieClient = (): MollieClient => {
  const apiKey = process.env.MOLLIE_API_KEY
  if (!apiKey) throw new Error('MOLLIE_API_KEY is not configured.')
  if (!client) client = createMollieClient({ apiKey })
  return client
}
