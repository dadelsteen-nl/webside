import type { PaymentAdapter } from '@payloadcms/plugin-ecommerce/types'
import type { Endpoint, GroupField, PayloadRequest } from 'payload'

import type { Transaction } from '@/payload-types'

import { getMollieClient } from './mollieClient'
import { listPaymentMethods } from './methods'
import {
  assertPaymentMatchesTransaction,
  syncTransactionWithPayment,
  type MolliePaymentSnapshot,
} from './settle'
import {
  MOLLIE_SLUG,
  getMollieMode,
  getServerURL,
  getWebhookURL,
  isSupportedMethod,
  localizedPath,
  normalizeEmail,
  relationID,
  toAppLocale,
  toMollieAmount,
  toMollieLocale,
  type MollieMode,
} from './shared'

type InitiatePayment = PaymentAdapter['initiatePayment']
type ConfirmOrder = PaymentAdapter['confirmOrder']

const SIM_PREFIX = 'sim_'

const warnSimulation = (req: PayloadRequest) =>
  req.payload.logger.warn(
    '[mollie] MOLLIE_API_KEY is not set — running in SIMULATION mode. Payments are faked and always succeed. Never use this in production.',
  )

const findTransaction = async (
  req: PayloadRequest,
  where: { field: 'mollie.paymentID' | 'mollie.reference'; value: string },
): Promise<Transaction | null> => {
  const res = await req.payload.find({
    collection: 'transactions',
    depth: 0,
    limit: 2,
    pagination: false,
    req,
    where: { [where.field]: { equals: where.value } },
  })
  if (res.docs.length !== 1) return null
  return res.docs[0] ?? null
}

const fetchPayment = async (paymentID: string): Promise<MolliePaymentSnapshot> => {
  const payment = await getMollieClient().payments.get(paymentID)
  return {
    id: payment.id,
    amount: payment.amount,
    metadata: payment.metadata,
    method: payment.method ?? null,
    status: payment.status,
  }
}

/** Snapshot used in simulation mode: behaves like a paid Mollie payment. */
const simulatedPayment = (transaction: Transaction): MolliePaymentSnapshot => ({
  id: transaction.mollie?.paymentID || '',
  amount: { currency: transaction.currency || 'EUR', value: toMollieAmount(transaction.amount || 0) },
  metadata: { transactionID: String(transaction.id) },
  method: transaction.mollie?.method || 'ideal',
  status: 'paid',
})

const getPayment = async (mode: MollieMode, transaction: Transaction) => {
  const paymentID = transaction.mollie?.paymentID
  if (!paymentID) throw new Error('Transaction has no Mollie payment ID.')
  if (paymentID.startsWith(SIM_PREFIX)) {
    if (mode !== 'simulation') throw new Error('Simulated payments are not accepted in this mode.')
    return simulatedPayment(transaction)
  }
  return fetchPayment(paymentID)
}

const initiatePayment: InitiatePayment = async ({ data, req }) => {
  const mode = getMollieMode()
  const { payload } = req
  const { billingAddress, cart, currency, customerEmail, shippingAddress } = data
  const extra = (req.data || {}) as Record<string, unknown>

  if (mode === 'disabled') throw new Error('Payments are not activated.')
  if (mode === 'simulation') warnSimulation(req)

  if (!cart?.items?.length) throw new Error('Cart is empty or not provided.')
  if (!customerEmail || typeof customerEmail !== 'string') {
    throw new Error('A valid customer email is required to make a purchase.')
  }
  const amount = cart.subtotal
  if (typeof amount !== 'number' || amount <= 0) throw new Error('A valid amount is required.')
  if (currency.toUpperCase() !== 'EUR') throw new Error('Only EUR is supported.')

  const locale = toAppLocale(extra.locale)
  const method = isSupportedMethod(extra.paymentMethod) ? extra.paymentMethod : undefined
  const vatNumber =
    typeof extra.vatNumber === 'string' ? extra.vatNumber.trim().slice(0, 32) : undefined
  const reference = crypto.randomUUID()

  const items = cart.items.map((item) => {
    const { product, variant, ...rest } = item
    return {
      ...rest,
      product: Number(relationID(product)),
      quantity: item.quantity,
      ...(variant ? { variant: Number(relationID(variant)) } : {}),
    }
  })

  const transaction = await payload.create({
    collection: 'transactions',
    data: {
      ...(req.user ? { customer: req.user.id } : { customerEmail: normalizeEmail(customerEmail) }),
      amount,
      billingAddress: billingAddress as Transaction['billingAddress'],
      cart: cart.id as number,
      currency: 'EUR',
      items,
      paymentMethod: MOLLIE_SLUG,
      status: 'pending',
      mollie: {
        reference,
        locale,
        ...(method ? { method } : {}),
        ...(vatNumber ? { vatNumber } : {}),
        shippingAddress: (shippingAddress || billingAddress || null) as unknown as Record<string, unknown>,
        simulated: mode === 'simulation',
      },
    },
    req,
  })

  const redirectUrl = `${getServerURL()}${localizedPath(locale, '/checkout/confirm-order')}?ref=${reference}`

  if (mode === 'simulation') {
    const paymentID = `${SIM_PREFIX}${crypto.randomUUID().replace(/-/g, '').slice(0, 16)}`
    await payload.update({
      id: transaction.id,
      collection: 'transactions',
      data: { mollie: { ...transaction.mollie, paymentID, status: 'open' } },
      req,
    })
    return {
      checkoutUrl: redirectUrl,
      message: 'Payment initiated (simulation)',
      reference,
      simulated: true,
      transactionID: transaction.id,
    }
  }

  try {
    const webhookUrl = getWebhookURL()
    const billingCountry = (billingAddress as { country?: string } | undefined)?.country
    const payment = await getMollieClient().payments.create({
      amount: { currency: 'EUR', value: toMollieAmount(amount) },
      description: `Dadelsteen bestelling ${transaction.id}`,
      locale: toMollieLocale(locale, billingCountry) as never,
      metadata: { cartID: String(cart.id), reference, transactionID: String(transaction.id) },
      redirectUrl,
      ...(webhookUrl ? { webhookUrl } : {}),
      ...(method ? { method: method as never } : {}),
    })

    await payload.update({
      id: transaction.id,
      collection: 'transactions',
      data: {
        mollie: { ...transaction.mollie, paymentID: payment.id, status: payment.status },
      },
      req,
    })

    const checkoutUrl = payment.getCheckoutUrl()
    if (!checkoutUrl) throw new Error('Mollie did not return a checkout URL.')

    return { checkoutUrl, message: 'Payment initiated', reference, transactionID: transaction.id }
  } catch (err) {
    payload.logger.error({ err, msg: '[mollie] Error creating payment' })
    await payload.update({
      id: transaction.id,
      collection: 'transactions',
      data: { status: 'failed' },
      req,
    })
    throw new Error(err instanceof Error ? err.message : 'Unknown error creating Mollie payment')
  }
}

/**
 * Called by `/api/payments/mollie/confirm-order` when the customer returns from Mollie.
 * Body: `{ reference }` (from the redirect URL). Only finalizes when Mollie reports `paid`.
 */
const confirmOrder: ConfirmOrder = async ({ data, finalizeOrder, req }) => {
  const mode = getMollieMode()
  if (mode === 'disabled') throw new Error('Payments are not activated.')

  const reference = typeof data.reference === 'string' ? data.reference : ''
  if (!/^[0-9a-f-]{36}$/i.test(reference)) throw new Error('A valid payment reference is required.')

  const transaction = await findTransaction(req, { field: 'mollie.reference', value: reference })
  if (!transaction) throw new Error('No transaction found for this reference.')

  if (relationID(data.cartID) !== relationID(transaction.cart)) {
    throw new Error('Cart does not match the transaction.')
  }
  if (req.user) {
    if (relationID(transaction.customer) !== relationID(req.user.id)) {
      throw new Error('Transaction belongs to another customer.')
    }
  } else if (normalizeEmail(transaction.customerEmail) !== normalizeEmail(data.customerEmail)) {
    throw new Error('Customer email does not match the transaction.')
  }

  const payment = await getPayment(mode, transaction)
  if (mode === 'simulation' && payment.id.startsWith(SIM_PREFIX)) warnSimulation(req)

  // Validates ownership/amount and records the latest status (failures are marked too).
  assertPaymentMatchesTransaction(payment, transaction)

  if (payment.status !== 'paid') {
    if (transaction.mollie?.status !== payment.status) {
      await req.payload.update({
        id: transaction.id,
        collection: 'transactions',
        data: { mollie: { ...transaction.mollie, status: payment.status } },
        req,
      })
    }
    throw new Error(`Payment not completed (status: ${payment.status}).`)
  }

  const order = await finalizeOrder({
    orderData: {
      amount: transaction.amount,
      currency: transaction.currency,
      ...(req.user
        ? { customer: req.user.id }
        : { customerEmail: normalizeEmail(transaction.customerEmail) }),
      items: (transaction.items || []).map((item) => ({
        product: relationID(item.product) ? Number(relationID(item.product)) : undefined,
        quantity: item.quantity,
        ...(item.variant ? { variant: Number(relationID(item.variant)) } : {}),
      })),
      ...(transaction.mollie?.shippingAddress
        ? { shippingAddress: transaction.mollie.shippingAddress }
        : {}),
      status: 'processing',
    },
    transactionID: transaction.id,
  })

  return {
    message: 'Order confirmed',
    orderID: order.id as number,
    transactionID: transaction.id,
    ...(typeof order.accessToken === 'string' ? { accessToken: order.accessToken } : {}),
  }
}

/**
 * Mollie webhook: POST form body `id=tr_xxx`. We only trust the id and re-fetch the payment
 * from Mollie. Always answers 200 for unknown ids (Mollie retries on non-2xx).
 */
const webhookEndpoint: Endpoint = {
  method: 'post',
  path: '/webhooks',
  handler: async (req) => {
    const mode = getMollieMode()
    if (mode !== 'live') return Response.json({ received: true })

    let id = ''
    try {
      const raw = req.text ? await req.text() : ''
      id = new URLSearchParams(raw).get('id') || ''
      if (!id && raw.trim().startsWith('{')) {
        const parsed = JSON.parse(raw) as { id?: unknown }
        id = typeof parsed.id === 'string' ? parsed.id : ''
      }
    } catch {
      id = ''
    }

    if (!/^tr_[A-Za-z0-9]+$/.test(id)) {
      return Response.json({ message: 'Invalid payment id' }, { status: 400 })
    }

    try {
      const transaction = await findTransaction(req, { field: 'mollie.paymentID', value: id })
      if (!transaction) {
        req.payload.logger.warn(`[mollie] Webhook for unknown payment ${id}`)
        return Response.json({ received: true })
      }
      const payment = await fetchPayment(id)
      const result = await syncTransactionWithPayment({ payment, req, transaction })
      req.payload.logger.info(
        `[mollie] Webhook ${id}: ${payment.status} → transaction ${transaction.id} ${result.status}`,
      )
      return Response.json({ received: true })
    } catch (err) {
      req.payload.logger.error({ err, msg: `[mollie] Webhook processing failed for ${id}` })
      // 500 makes Mollie retry later.
      return Response.json({ message: 'Webhook processing failed' }, { status: 500 })
    }
  },
}

/**
 * GET /status?ref=<reference> — used by the confirm page to poll while a payment is pending.
 * In live mode it re-syncs with Mollie (covers local dev, where webhooks cannot reach us).
 */
const statusEndpoint: Endpoint = {
  method: 'get',
  path: '/status',
  handler: async (req) => {
    const ref = typeof req.query?.ref === 'string' ? req.query.ref : ''
    if (!/^[0-9a-f-]{36}$/i.test(ref)) {
      return Response.json({ message: 'Invalid reference' }, { status: 400 })
    }
    const transaction = await findTransaction(req, { field: 'mollie.reference', value: ref })
    if (!transaction) return Response.json({ message: 'Not found' }, { status: 404 })

    let status = transaction.status
    let paymentStatus = transaction.mollie?.status || null

    const paymentID = transaction.mollie?.paymentID
    if (getMollieMode() === 'live' && paymentID && !paymentID.startsWith(SIM_PREFIX)) {
      if (status === 'pending') {
        try {
          const payment = await fetchPayment(paymentID)
          paymentStatus = payment.status
          const result = await syncTransactionWithPayment({ payment, req, transaction })
          status = result.status
        } catch (err) {
          req.payload.logger.error({ err, msg: '[mollie] Status sync failed' })
        }
      }
    } else if (paymentID?.startsWith(SIM_PREFIX) && status === 'pending') {
      paymentStatus = 'paid'
    }

    return Response.json({ paymentStatus, status })
  },
}

/** GET /methods?amount=<cents>&locale=nl — enabled payment methods for the checkout tiles. */
const methodsEndpoint: Endpoint = {
  method: 'get',
  path: '/methods',
  handler: async (req) => {
    const amount = Number(req.query?.amount)
    const locale = toAppLocale(req.query?.locale)
    const result = await listPaymentMethods({
      amount: Number.isFinite(amount) && amount > 0 ? amount : undefined,
      locale,
    })
    return Response.json(result, {
      headers: { 'Cache-Control': 'private, max-age=300' },
    })
  },
}

export const mollieAdapter = (props?: { label?: string }): PaymentAdapter => {
  const group: GroupField = {
    name: 'mollie',
    type: 'group',
    admin: {
      condition: (data) => data?.paymentMethod === MOLLIE_SLUG,
    },
    fields: [
      { name: 'paymentID', type: 'text', label: 'Mollie payment ID', index: true },
      { name: 'reference', type: 'text', label: 'Checkout reference', index: true },
      { name: 'status', type: 'text', label: 'Mollie status' },
      { name: 'method', type: 'text', label: 'Payment method' },
      { name: 'locale', type: 'text', label: 'Locale' },
      { name: 'vatNumber', type: 'text', label: 'VAT number (B2B)' },
      { name: 'shippingAddress', type: 'json', label: 'Shipping address' },
      { name: 'simulated', type: 'checkbox', label: 'Simulated (dev only)' },
    ],
  }

  return {
    name: MOLLIE_SLUG,
    label: props?.label || 'Mollie',
    group,
    initiatePayment,
    confirmOrder,
    endpoints: [webhookEndpoint, statusEndpoint, methodsEndpoint],
  }
}

export { getMollieMode } from './shared'
