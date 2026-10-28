import type { PayloadRequest } from 'payload'
import { commitTransaction, initTransaction, killTransaction } from 'payload'

import type { Transaction } from '@/payload-types'

import { failureStatusFor, relationID, toMollieAmount } from './shared'

export type MolliePaymentSnapshot = {
  id: string
  status: string
  method?: string | null
  amount: { value: string; currency: string }
  metadata?: unknown
}

/**
 * Checks that the Mollie payment really belongs to this transaction and covers its amount.
 * Throws on any mismatch — never settle on data we did not create ourselves.
 */
export const assertPaymentMatchesTransaction = (
  payment: MolliePaymentSnapshot,
  transaction: Transaction,
) => {
  if (payment.id !== transaction.mollie?.paymentID) {
    throw new Error('Mollie payment does not match the transaction.')
  }
  const meta = (payment.metadata ?? {}) as Record<string, unknown>
  if (relationID(meta.transactionID) !== String(transaction.id)) {
    throw new Error('Mollie payment metadata does not reference this transaction.')
  }
  if (typeof transaction.amount !== 'number' || transaction.amount <= 0) {
    throw new Error('Transaction amount is missing.')
  }
  if (
    payment.amount.currency !== (transaction.currency || 'EUR') ||
    payment.amount.value !== toMollieAmount(transaction.amount)
  ) {
    throw new Error('Mollie payment amount does not match the transaction amount.')
  }
}

/**
 * Creates the order for a paid transaction outside the plugin's confirm-order endpoint
 * (used by the webhook / status poll). Mirrors the plugin's settlement: atomic claim of the
 * pending transaction, order creation, cart marked purchased, inventory decrement and the
 * transaction marked `succeeded`. Idempotent — a second call finds the claim taken and returns.
 */
export const settlePaidTransaction = async ({
  req,
  transaction,
}: {
  req: PayloadRequest
  transaction: Transaction
}): Promise<{ orderID?: number | string; settled: boolean }> => {
  const { payload } = req

  if (transaction.status === 'succeeded') {
    return { orderID: relationID(transaction.order), settled: false }
  }
  if (transaction.status !== 'pending' || transaction.order) {
    return { orderID: relationID(transaction.order), settled: false }
  }

  const shouldCommit = await initTransaction(req)

  try {
    const claimed = await payload.db.updateOne({
      collection: 'transactions',
      data: { status: 'processing' },
      options: { atomic: true },
      req,
      where: {
        and: [
          { id: { equals: transaction.id } },
          { status: { equals: 'pending' } },
          { order: { exists: false } },
        ],
      },
    })

    if (!claimed) {
      // Someone else (confirm-order or a parallel webhook) is settling it.
      if (shouldCommit) await killTransaction(req)
      return { settled: false }
    }

    const items = (transaction.items || []).map((item) => ({
      product: relationID(item.product) ? Number(relationID(item.product)) : undefined,
      quantity: item.quantity,
      ...(item.variant ? { variant: Number(relationID(item.variant)) } : {}),
    }))

    if (!items.length) throw new Error('Transaction has no items to settle.')

    const shippingAddress =
      transaction.mollie?.shippingAddress && typeof transaction.mollie.shippingAddress === 'object'
        ? (transaction.mollie.shippingAddress as Record<string, unknown>)
        : undefined

    const customerID = relationID(transaction.customer)

    const order = await payload.create({
      collection: 'orders',
      data: {
        amount: transaction.amount,
        currency: transaction.currency,
        ...(customerID
          ? { customer: Number(customerID) }
          : { customerEmail: transaction.customerEmail }),
        items: items as NonNullable<Transaction['items']>,
        ...(shippingAddress ? { shippingAddress } : {}),
        status: 'processing',
        transactions: [transaction.id],
      },
      req,
    })

    const cartID = relationID(transaction.cart)
    if (cartID) {
      await payload.update({
        id: cartID,
        collection: 'carts',
        data: { purchasedAt: new Date().toISOString() },
        req,
      })
    }

    for (const item of items) {
      const hasVariant = item.variant !== undefined
      const id = hasVariant ? item.variant : item.product
      if (id === undefined) continue
      await payload.db.updateOne({
        id,
        collection: hasVariant ? 'variants' : 'products',
        data: { inventory: { $inc: item.quantity * -1 } },
        req,
      })
    }

    await payload.update({
      id: transaction.id,
      collection: 'transactions',
      data: { order: order.id, status: 'succeeded' },
      req,
    })

    if (shouldCommit) await commitTransaction(req)

    payload.logger.info(`[mollie] Order ${order.id} created for transaction ${transaction.id}`)
    return { orderID: order.id, settled: true }
  } catch (err) {
    if (shouldCommit) await killTransaction(req)
    throw err
  }
}

/**
 * Applies a freshly fetched Mollie payment to our transaction: stores the status/method,
 * settles when paid, marks terminal failures. Safe to call repeatedly.
 */
export const syncTransactionWithPayment = async ({
  payment,
  req,
  transaction,
}: {
  payment: MolliePaymentSnapshot
  req: PayloadRequest
  transaction: Transaction
}): Promise<{ status: Transaction['status']; orderID?: number | string }> => {
  assertPaymentMatchesTransaction(payment, transaction)

  const failure = failureStatusFor(payment.status)

  if (transaction.mollie?.status !== payment.status || failure) {
    await req.payload.update({
      id: transaction.id,
      collection: 'transactions',
      data: {
        mollie: {
          ...transaction.mollie,
          status: payment.status,
          ...(payment.method ? { method: payment.method } : {}),
        },
        ...(failure && transaction.status === 'pending' ? { status: failure } : {}),
      },
      req,
    })
  }

  if (failure) {
    return { status: transaction.status === 'pending' ? failure : transaction.status }
  }

  if (payment.status === 'paid') {
    const { orderID } = await settlePaidTransaction({ req, transaction })
    return { status: 'succeeded', orderID: orderID ?? relationID(transaction.order) }
  }

  return { status: transaction.status }
}
