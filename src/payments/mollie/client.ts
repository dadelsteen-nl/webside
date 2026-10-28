import type { PaymentAdapterClient } from '@payloadcms/plugin-ecommerce/types'

/** Client-side registration of the Mollie adapter for the EcommerceProvider. */
export const mollieAdapterClient = (props?: { label?: string }): PaymentAdapterClient => ({
  name: 'mollie',
  confirmOrder: true,
  initiatePayment: true,
  label: props?.label || 'Mollie',
})
