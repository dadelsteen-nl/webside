'use server'

import configPromise from '@payload-config'
import { after } from 'next/server'
import { headers } from 'next/headers'
import { getPayload, type Payload } from 'payload'
import { z } from 'zod'

import { getSiteSettings } from '@/lib/data'
import { sendRenderedEmail } from '@/lib/email/send'
import {
  b2bConfirmationEmail,
  contactConfirmationEmail,
  demoConfirmationEmail,
  leadNotificationEmail,
  type LeadNotification,
  type RenderedEmail,
} from '@/lib/email/templates'
import { getServerSideURL } from '@/utilities/getURL'

import type {
  B2BRequestInput,
  ContactRequestInput,
  DemoRequestInput,
  FieldErrorCode,
  LeadActionResult,
  LeadLocale,
} from './leadTypes'

// ---------------------------------------------------------------------------
// Anti-spam: in-memory rate limit per IP (per server instance) + honeypot + time trap.

const RATE_WINDOW_MS = 10 * 60 * 1000
const RATE_MAX = 5
const MIN_FILL_MS = 2500
const hits = new Map<string, number[]>()

async function clientIp(): Promise<string> {
  const h = await headers()
  const forwarded = h.get('x-forwarded-for')?.split(',')[0]?.trim()
  return forwarded || h.get('x-real-ip') || 'unknown'
}

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS)
  if (recent.length >= RATE_MAX) {
    hits.set(ip, recent)
    return true
  }
  recent.push(now)
  hits.set(ip, recent)
  // Keep the map from growing unbounded.
  if (hits.size > 5000) {
    for (const [key, times] of hits) {
      if (!times.some((t) => now - t < RATE_WINDOW_MS)) hits.delete(key)
    }
  }
  return false
}

function looksLikeBot(input: { website?: unknown; startedAt?: unknown }): boolean {
  if (typeof input.website === 'string' && input.website.trim() !== '') return true
  const started = Number(input.startedAt)
  if (!Number.isFinite(started)) return true
  const elapsed = Date.now() - started
  return elapsed < MIN_FILL_MS || elapsed > 24 * 60 * 60 * 1000
}

// ---------------------------------------------------------------------------
// Validation

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const PHONE_RE = /^\+?[\d\s().-]{6,20}$/

const requiredText = (max: number) =>
  z.string('required').trim().min(1, 'required').max(max, 'tooLong')

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max, 'tooLong')
    .optional()
    .transform((v) => v || undefined)

const email = z.string('required').trim().min(1, 'required').max(254, 'tooLong').regex(EMAIL_RE, 'email')

const phone = z
  .string()
  .trim()
  .optional()
  .transform((v) => v || undefined)
  .refine((v) => v === undefined || PHONE_RE.test(v), 'phone')

const optionalEnum = <T extends readonly [string, ...string[]]>(values: T) =>
  z
    .union([z.enum(values, 'invalid'), z.literal('')])
    .optional()
    .transform((v) => (v ? (v as T[number]) : undefined))

const consent = z.boolean('consent').refine((v) => v === true, 'consent')

const locale = z.enum(['nl', 'en']).catch('nl')

const todayISO = () => new Date().toISOString().slice(0, 10)

const preferredDate = z
  .string()
  .trim()
  .optional()
  .transform((v) => v || undefined)
  .refine((v) => {
    if (v === undefined) return true
    if (!/^\d{4}-\d{2}-\d{2}$/.test(v) || Number.isNaN(Date.parse(v))) return false
    const max = new Date()
    max.setFullYear(max.getFullYear() + 1)
    return v >= todayISO() && v <= max.toISOString().slice(0, 10)
  }, 'date')

const demoSchema = z
  .object({
    locale,
    name: requiredText(120),
    email,
    phone,
    preferredDate,
    preferredTime: optionalEnum(['morning', 'afternoon', 'evening'] as const),
    location: optionalEnum(['showroom', 'at-home', 'online'] as const),
    audience: z.enum(['private', 'business']).catch('private'),
    companyName: optionalText(160),
    message: optionalText(4000),
    consent,
  })
  .superRefine((v, ctx) => {
    if (v.audience === 'business' && !v.companyName) {
      ctx.addIssue({ code: 'custom', message: 'required', path: ['companyName'] })
    }
  })

const contactSchema = z.object({
  locale,
  name: requiredText(120),
  email,
  phone,
  subject: optionalText(160),
  message: requiredText(4000),
  consent,
})

const b2bSchema = z.object({
  locale,
  companyName: requiredText(160),
  contactName: requiredText(120),
  email,
  phone,
  businessType: optionalEnum(['government', 'social', 'gym', 'physio', 'clinic', 'salon', 'hotel', 'corporate', 'other'] as const),
  units: z
    .union([z.string(), z.number()])
    .optional()
    .transform((v) => (v === undefined || v === '' ? undefined : Number(v)))
    .refine((v) => v === undefined || (Number.isInteger(v) && v >= 1 && v <= 1000), 'invalid'),
  message: optionalText(4000),
  consent,
})

const KNOWN_CODES: FieldErrorCode[] = ['required', 'email', 'phone', 'consent', 'date', 'tooLong', 'invalid']

function toFieldErrors(error: z.ZodError): Partial<Record<string, FieldErrorCode>> {
  const out: Partial<Record<string, FieldErrorCode>> = {}
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? '_form')
    if (out[key]) continue
    out[key] = (KNOWN_CODES as string[]).includes(issue.message)
      ? (issue.message as FieldErrorCode)
      : 'invalid'
  }
  return out
}

// ---------------------------------------------------------------------------
// Shared pipeline

type Prepared<T> = { ok: true; data: T } | { ok: false; result: LeadActionResult } | { ok: 'spam' }

async function prepare<S extends z.ZodType>(schema: S, input: unknown): Promise<Prepared<z.output<S>>> {
  const raw = (input && typeof input === 'object' ? input : {}) as Record<string, unknown>
  if (looksLikeBot(raw)) return { ok: 'spam' }
  if (isRateLimited(await clientIp())) return { ok: false, result: { ok: false, error: 'rateLimit' } }
  const parsed = schema.safeParse(raw)
  if (!parsed.success) {
    return { ok: false, result: { ok: false, error: 'validation', fieldErrors: toFieldErrors(parsed.error) } }
  }
  return { ok: true, data: parsed.data }
}

type Notify = {
  payload: Payload
  collection: 'demo-requests' | 'contact-requests' | 'b2b-requests'
  id: number | string
  locale: LeadLocale
  customerEmail: string
  confirmation: (contact: { email?: string | null; phone?: string | null }) => RenderedEmail
  notification: LeadNotification
}

/** Emails are sent after the response so the visitor isn't kept waiting. */
function scheduleEmails(n: Notify) {
  after(async () => {
    const settings = await getSiteSettings(n.locale).catch((err: unknown) => {
      n.payload.logger.error({ err, msg: 'Could not load site settings for lead emails' })
      return null
    })
    const contact = { email: settings?.email, phone: settings?.phone }
    const notifyTo = process.env.LEADS_NOTIFY_EMAIL || settings?.email

    const jobs: Promise<boolean>[] = [
      sendRenderedEmail(n.payload, n.customerEmail, n.confirmation(contact), {
        replyTo: settings?.email || undefined,
      }),
    ]
    if (notifyTo) {
      jobs.push(
        sendRenderedEmail(
          n.payload,
          notifyTo,
          leadNotificationEmail(n.notification, {
            customerLocale: n.locale,
            adminUrl: `${getServerSideURL()}/admin/collections/${n.collection}/${n.id}`,
          }),
          { replyTo: n.customerEmail },
        ),
      )
    } else {
      n.payload.logger.warn(
        `No LEADS_NOTIFY_EMAIL or site-settings email configured; skipping internal notification for ${n.collection}/${n.id}`,
      )
    }
    await Promise.all(jobs)
  })
}

const getClient = () => getPayload({ config: configPromise })

async function persist<T>(fn: (payload: Payload) => Promise<T>): Promise<{ payload: Payload; doc: T } | null> {
  const payload = await getClient()
  try {
    return { payload, doc: await fn(payload) }
  } catch (err) {
    payload.logger.error({ err, msg: 'Failed to store lead' })
    return null
  }
}

// ---------------------------------------------------------------------------
// Actions

export async function submitDemoRequest(input: DemoRequestInput): Promise<LeadActionResult> {
  const prepared = await prepare(demoSchema, input)
  if (prepared.ok === 'spam') return { ok: true }
  if (!prepared.ok) return prepared.result
  const d = prepared.data

  const saved = await persist((payload) =>
    payload.create({
      collection: 'demo-requests',
      // Data is built exclusively from validated fields above; `status` is admin-only for
      // public API calls, so we set the initial value server-side.
      overrideAccess: true,
      data: {
        status: 'new',
        name: d.name,
        email: d.email,
        phone: d.phone,
        preferredDate: d.preferredDate ? new Date(`${d.preferredDate}T12:00:00Z`).toISOString() : undefined,
        preferredTime: d.preferredTime,
        location: d.location,
        audience: d.audience,
        companyName: d.audience === 'business' ? d.companyName : undefined,
        message: d.message,
        locale: d.locale,
      },
    }),
  )
  if (!saved) return { ok: false, error: 'server' }

  const lead = {
    name: d.name,
    email: d.email,
    phone: d.phone,
    preferredDate: d.preferredDate ? `${d.preferredDate}T12:00:00Z` : undefined,
    preferredTime: d.preferredTime,
    location: d.location,
    audience: d.audience,
    companyName: d.audience === 'business' ? d.companyName : undefined,
    message: d.message,
  }
  scheduleEmails({
    payload: saved.payload,
    collection: 'demo-requests',
    id: saved.doc.id,
    locale: d.locale,
    customerEmail: d.email,
    confirmation: (contact) => demoConfirmationEmail(lead, d.locale, contact),
    notification: { kind: 'demo', lead },
  })
  return { ok: true }
}

export async function submitContactRequest(input: ContactRequestInput): Promise<LeadActionResult> {
  const prepared = await prepare(contactSchema, input)
  if (prepared.ok === 'spam') return { ok: true }
  if (!prepared.ok) return prepared.result
  const d = prepared.data

  const saved = await persist((payload) =>
    payload.create({
      collection: 'contact-requests',
      // Data is built exclusively from validated fields above; `status` is admin-only for
      // public API calls, so we set the initial value server-side.
      overrideAccess: true,
      data: {
        status: 'new',
        name: d.name,
        email: d.email,
        phone: d.phone,
        subject: d.subject,
        message: d.message,
        locale: d.locale,
      },
    }),
  )
  if (!saved) return { ok: false, error: 'server' }

  const lead = { name: d.name, email: d.email, phone: d.phone, subject: d.subject, message: d.message }
  scheduleEmails({
    payload: saved.payload,
    collection: 'contact-requests',
    id: saved.doc.id,
    locale: d.locale,
    customerEmail: d.email,
    confirmation: (contact) => contactConfirmationEmail(lead, d.locale, contact),
    notification: { kind: 'contact', lead },
  })
  return { ok: true }
}

export async function submitB2BRequest(input: B2BRequestInput): Promise<LeadActionResult> {
  const prepared = await prepare(b2bSchema, input)
  if (prepared.ok === 'spam') return { ok: true }
  if (!prepared.ok) return prepared.result
  const d = prepared.data

  const saved = await persist((payload) =>
    payload.create({
      collection: 'b2b-requests',
      // Data is built exclusively from validated fields above; `status` is admin-only for
      // public API calls, so we set the initial value server-side.
      overrideAccess: true,
      data: {
        status: 'new',
        companyName: d.companyName,
        contactName: d.contactName,
        email: d.email,
        phone: d.phone,
        businessType: d.businessType,
        units: d.units,
        message: d.message,
        locale: d.locale,
      },
    }),
  )
  if (!saved) return { ok: false, error: 'server' }

  const lead = {
    companyName: d.companyName,
    contactName: d.contactName,
    email: d.email,
    phone: d.phone,
    businessType: d.businessType,
    units: d.units,
    message: d.message,
  }
  scheduleEmails({
    payload: saved.payload,
    collection: 'b2b-requests',
    id: saved.doc.id,
    locale: d.locale,
    customerEmail: d.email,
    confirmation: (contact) => b2bConfirmationEmail(lead, d.locale, contact),
    notification: { kind: 'b2b', lead },
  })
  return { ok: true }
}
