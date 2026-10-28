import type { Payload } from 'payload'

import type { RenderedEmail } from './templates'

/**
 * Sends an email through the configured Payload adapter (Resend in production,
 * console logging when RESEND_API_KEY is absent). Failures are logged and reported
 * via the return value so a lead is never lost because email delivery failed.
 */
export async function sendRenderedEmail(
  payload: Payload,
  to: string,
  email: RenderedEmail,
  options: { replyTo?: string } = {},
): Promise<boolean> {
  try {
    await payload.sendEmail({
      to,
      subject: email.subject,
      html: email.html,
      text: email.text,
      ...(options.replyTo ? { replyTo: options.replyTo } : {}),
    })
    return true
  } catch (err) {
    payload.logger.error({ err, msg: `Failed to send email "${email.subject}" to ${to}` })
    return false
  }
}
