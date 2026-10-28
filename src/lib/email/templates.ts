// Branded transactional email templates (inline styles only; email clients ignore <style>).
// Server-only. Copy lives here (not in messages/) because emails are rendered outside a request locale.

export type EmailLocale = 'nl' | 'en'

export type RenderedEmail = {
  subject: string
  html: string
  text: string
}

export type LeadKind = 'demo' | 'contact' | 'b2b'

const C = {
  sand: '#f4efe8',
  cream: '#faf7f2',
  stone: '#e4dacb',
  ink: '#1a1a1a',
  bronze: '#b08d57',
  olive: '#6e6a5e',
}

const SERIF = "'Fraunces', Georgia, 'Times New Roman', serif"
const SANS = "'Manrope', 'Helvetica Neue', Arial, sans-serif"

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

const nl2br = (value: string) => escapeHtml(value).replace(/\r?\n/g, '<br />')

type Contact = { email?: string | null; phone?: string | null }

type LayoutArgs = {
  locale: EmailLocale
  preheader: string
  eyebrow: string
  heading: string
  bodyHtml: string
  contact?: Contact
}

function layout({ bodyHtml, contact, eyebrow, heading, locale, preheader }: LayoutArgs): string {
  const tagline = locale === 'nl' ? 'Kracht vanuit de kern' : 'Strength from the core'
  const contactLine = [
    contact?.email
      ? `<a href="mailto:${escapeHtml(contact.email)}" style="color:${C.ink};text-decoration:none;">${escapeHtml(contact.email)}</a>`
      : '',
    contact?.phone ? escapeHtml(contact.phone) : '',
  ]
    .filter(Boolean)
    .join(' &nbsp;·&nbsp; ')

  return `<!doctype html>
<html lang="${locale}">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="color-scheme" content="light only" />
<title>${escapeHtml(heading)}</title>
</head>
<body style="margin:0;padding:0;background:${C.sand};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:${C.sand};">${escapeHtml(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.sand};">
  <tr>
    <td align="center" style="padding:40px 16px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;">
        <tr>
          <td style="padding:0 8px 28px 8px;font-family:${SERIF};font-size:22px;font-weight:300;letter-spacing:0.02em;color:${C.ink};">
            Dadelsteen
          </td>
        </tr>
        <tr>
          <td style="background:${C.cream};border-top:1px solid ${C.bronze};padding:44px 40px 40px 40px;">
            <p style="margin:0 0 18px 0;font-family:${SANS};font-size:11px;font-weight:600;letter-spacing:0.28em;text-transform:uppercase;color:${C.olive};">${escapeHtml(eyebrow)}</p>
            <h1 style="margin:0 0 24px 0;font-family:${SERIF};font-size:32px;line-height:1.15;font-weight:300;color:${C.ink};">${escapeHtml(heading)}</h1>
            <div style="font-family:${SANS};font-size:15px;line-height:1.7;color:${C.ink};">${bodyHtml}</div>
          </td>
        </tr>
        <tr>
          <td style="padding:28px 8px 0 8px;font-family:${SANS};font-size:12px;line-height:1.7;color:${C.olive};">
            <span style="font-family:${SERIF};font-style:italic;color:${C.bronze};">${tagline}</span><br />
            ${contactLine}
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>`
}

const p = (html: string) => `<p style="margin:0 0 16px 0;">${html}</p>`

function summaryTable(rows: Array<[string, string | null | undefined]>): string {
  const filled = rows.filter(([, v]) => v !== undefined && v !== null && String(v).trim() !== '')
  if (!filled.length) return ''
  const trs = filled
    .map(
      ([k, v]) => `<tr>
  <td valign="top" style="padding:10px 16px 10px 0;border-bottom:1px solid ${C.stone};font-family:${SANS};font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:${C.olive};white-space:nowrap;">${escapeHtml(k)}</td>
  <td valign="top" style="padding:10px 0;border-bottom:1px solid ${C.stone};font-family:${SANS};font-size:14px;color:${C.ink};">${nl2br(String(v))}</td>
</tr>`,
    )
    .join('')
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 24px 0;border-top:1px solid ${C.stone};">${trs}</table>`
}

function button(href: string, label: string): string {
  return `<a href="${escapeHtml(href)}" style="display:inline-block;margin-top:8px;padding:14px 26px;background:${C.ink};color:${C.cream};font-family:${SANS};font-size:11px;font-weight:600;letter-spacing:0.18em;text-transform:uppercase;text-decoration:none;">${escapeHtml(label)}</a>`
}

const toText = (lines: Array<string | null | undefined | false>) => lines.filter(Boolean).join('\n')

// ---------------------------------------------------------------------------
// Label dictionaries

const L = {
  nl: {
    name: 'Naam',
    email: 'E-mail',
    phone: 'Telefoon',
    date: 'Voorkeursdatum',
    time: 'Dagdeel',
    location: 'Locatie',
    audience: 'Voor',
    company: 'Bedrijf',
    contactName: 'Contactpersoon',
    businessType: 'Branche',
    units: 'Aantal toestellen',
    subject: 'Onderwerp',
    message: 'Bericht',
    locale: 'Taal',
    times: { morning: 'Ochtend', afternoon: 'Middag', evening: 'Avond' },
    locations: { showroom: 'Showroom', 'at-home': 'Bij u thuis', online: 'Online videodemo' },
    audiences: { private: 'Particulier', business: 'Zakelijk' },
    businessTypes: {
      gym: "Gym / PT-studio",
      physio: 'Fysiotherapie',
      clinic: 'Kliniek / revalidatie',
      salon: 'Wellness- / beautysalon',
      hotel: 'Hotel / vakantiepark',
      corporate: 'Bedrijfsfitness',
      other: 'Anders',
    },
  },
  en: {
    name: 'Name',
    email: 'Email',
    phone: 'Phone',
    date: 'Preferred date',
    time: 'Time of day',
    location: 'Location',
    audience: 'For',
    company: 'Company',
    contactName: 'Contact person',
    businessType: 'Industry',
    units: 'Number of units',
    subject: 'Subject',
    message: 'Message',
    locale: 'Language',
    times: { morning: 'Morning', afternoon: 'Afternoon', evening: 'Evening' },
    locations: { showroom: 'Showroom', 'at-home': 'At your home', online: 'Online video demo' },
    audiences: { private: 'Private', business: 'Business' },
    businessTypes: {
      gym: 'Gym / PT studio',
      physio: 'Physiotherapy',
      clinic: 'Clinic / rehabilitation',
      salon: 'Wellness / beauty salon',
      hotel: 'Hotel / holiday park',
      corporate: 'Corporate wellness',
      other: 'Other',
    },
  },
} as const

function formatDate(iso: string | null | undefined, locale: EmailLocale): string | undefined {
  if (!iso) return undefined
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return undefined
  return new Intl.DateTimeFormat(locale === 'nl' ? 'nl-NL' : 'en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Europe/Amsterdam',
  }).format(d)
}

// ---------------------------------------------------------------------------
// Lead data shapes (already validated)

export type DemoLead = {
  name: string
  email: string
  phone?: string
  preferredDate?: string
  preferredTime?: 'morning' | 'afternoon' | 'evening'
  location?: 'showroom' | 'at-home' | 'online'
  audience: 'private' | 'business'
  companyName?: string
  message?: string
}

export type ContactLead = {
  name: string
  email: string
  phone?: string
  subject?: string
  message: string
}

export type B2BLead = {
  companyName: string
  contactName: string
  email: string
  phone?: string
  businessType?: 'gym' | 'physio' | 'clinic' | 'salon' | 'hotel' | 'corporate' | 'other'
  units?: number
  message?: string
}

function demoRows(lead: DemoLead, locale: EmailLocale): Array<[string, string | undefined]> {
  const l = L[locale]
  return [
    [l.name, lead.name],
    [l.email, lead.email],
    [l.phone, lead.phone],
    [l.audience, l.audiences[lead.audience]],
    [l.company, lead.companyName],
    [l.location, lead.location ? l.locations[lead.location] : undefined],
    [l.date, formatDate(lead.preferredDate, locale)],
    [l.time, lead.preferredTime ? l.times[lead.preferredTime] : undefined],
    [l.message, lead.message],
  ]
}

function contactRows(lead: ContactLead, locale: EmailLocale): Array<[string, string | undefined]> {
  const l = L[locale]
  return [
    [l.name, lead.name],
    [l.email, lead.email],
    [l.phone, lead.phone],
    [l.subject, lead.subject],
    [l.message, lead.message],
  ]
}

function b2bRows(lead: B2BLead, locale: EmailLocale): Array<[string, string | undefined]> {
  const l = L[locale]
  return [
    [l.company, lead.companyName],
    [l.contactName, lead.contactName],
    [l.email, lead.email],
    [l.phone, lead.phone],
    [l.businessType, lead.businessType ? l.businessTypes[lead.businessType] : undefined],
    [l.units, lead.units ? String(lead.units) : undefined],
    [l.message, lead.message],
  ]
}

const rowsToText = (rows: Array<[string, string | undefined]>) =>
  rows.filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`)

// ---------------------------------------------------------------------------
// Customer confirmations

export function demoConfirmationEmail(
  lead: DemoLead,
  locale: EmailLocale,
  contact?: Contact,
): RenderedEmail {
  const first = lead.name.split(' ')[0] || lead.name
  const rows = demoRows(lead, locale)
  const c =
    locale === 'nl'
      ? {
          subject: 'Uw demo-aanvraag bij Dadelsteen',
          eyebrow: 'Demo-aanvraag ontvangen',
          heading: `Dank u, ${first}.`,
          intro:
            'We hebben uw aanvraag voor een persoonlijke imbody-demo in goede orde ontvangen. Binnen één werkdag nemen we contact met u op om een moment af te stemmen dat u past.',
          recap: 'Uw gegevens',
          outro:
            'Tijdens de demo van 30 tot 45 minuten maakt u kennis met de AI-coach, voelt u de digitale weerstand en bespreken we wat imbody voor u kan betekenen. Geheel vrijblijvend.',
          sign: 'Met warme groet,<br />Team Dadelsteen',
        }
      : {
          subject: 'Your Dadelsteen demo request',
          eyebrow: 'Demo request received',
          heading: `Thank you, ${first}.`,
          intro:
            'We have received your request for a personal imbody demo. We will be in touch within one business day to arrange a moment that suits you.',
          recap: 'Your details',
          outro:
            'During the 30 to 45 minute demo you will meet the AI coach, feel the digital resistance for yourself and talk through what imbody can do for you. Entirely without obligation.',
          sign: 'Warm regards,<br />The Dadelsteen team',
        }

  return {
    subject: c.subject,
    html: layout({
      locale,
      preheader: c.intro,
      eyebrow: c.eyebrow,
      heading: c.heading,
      contact,
      bodyHtml:
        p(escapeHtml(c.intro)) +
        `<p style="margin:24px 0 4px 0;font-family:${SERIF};font-size:18px;font-weight:300;">${c.recap}</p>` +
        summaryTable(rows) +
        p(escapeHtml(c.outro)) +
        p(c.sign),
    }),
    text: toText([c.heading, '', c.intro, '', `${c.recap}:`, ...rowsToText(rows), '', c.outro, '', c.sign.replace('<br />', '\n')]),
  }
}

export function contactConfirmationEmail(
  lead: ContactLead,
  locale: EmailLocale,
  contact?: Contact,
): RenderedEmail {
  const first = lead.name.split(' ')[0] || lead.name
  const c =
    locale === 'nl'
      ? {
          subject: 'We hebben uw bericht ontvangen',
          eyebrow: 'Bericht ontvangen',
          heading: `Dank voor uw bericht, ${first}.`,
          intro:
            'Uw bericht is bij ons aangekomen. We lezen alles persoonlijk en reageren doorgaans binnen één werkdag.',
          recap: 'Uw bericht',
          sign: 'Met warme groet,<br />Team Dadelsteen',
        }
      : {
          subject: 'We have received your message',
          eyebrow: 'Message received',
          heading: `Thank you for your message, ${first}.`,
          intro:
            'Your message has reached us. We read everything personally and usually reply within one business day.',
          recap: 'Your message',
          sign: 'Warm regards,<br />The Dadelsteen team',
        }
  const rows = contactRows(lead, locale).filter(([k]) => k !== L[locale].email)
  return {
    subject: c.subject,
    html: layout({
      locale,
      preheader: c.intro,
      eyebrow: c.eyebrow,
      heading: c.heading,
      contact,
      bodyHtml:
        p(escapeHtml(c.intro)) +
        `<p style="margin:24px 0 4px 0;font-family:${SERIF};font-size:18px;font-weight:300;">${c.recap}</p>` +
        summaryTable(rows) +
        p(c.sign),
    }),
    text: toText([c.heading, '', c.intro, '', `${c.recap}:`, ...rowsToText(rows), '', c.sign.replace('<br />', '\n')]),
  }
}

export function b2bConfirmationEmail(
  lead: B2BLead,
  locale: EmailLocale,
  contact?: Contact,
): RenderedEmail {
  const first = lead.contactName.split(' ')[0] || lead.contactName
  const rows = b2bRows(lead, locale)
  const c =
    locale === 'nl'
      ? {
          subject: 'Uw zakelijke aanvraag bij Dadelsteen',
          eyebrow: 'Zakelijke aanvraag',
          heading: `Dank u, ${first}.`,
          intro: `We hebben de aanvraag voor ${lead.companyName} ontvangen. Een van onze adviseurs neemt binnen één werkdag contact met u op voor een eerste kennismaking.`,
          next: 'Daarna plannen we graag een demo op locatie en stellen we een voorstel op maat op, desgewenst inclusief staffelprijzen of leasemogelijkheden.',
          recap: 'Uw aanvraag',
          sign: 'Met vriendelijke groet,<br />Team Dadelsteen Zakelijk',
        }
      : {
          subject: 'Your Dadelsteen business enquiry',
          eyebrow: 'Business enquiry',
          heading: `Thank you, ${first}.`,
          intro: `We have received the enquiry for ${lead.companyName}. One of our advisors will contact you within one business day for an initial conversation.`,
          next: 'From there we would be glad to arrange an on-site demo and prepare a tailored proposal, including volume pricing or leasing options on request.',
          recap: 'Your enquiry',
          sign: 'Kind regards,<br />Dadelsteen Business',
        }
  return {
    subject: c.subject,
    html: layout({
      locale,
      preheader: c.intro,
      eyebrow: c.eyebrow,
      heading: c.heading,
      contact,
      bodyHtml:
        p(escapeHtml(c.intro)) +
        p(escapeHtml(c.next)) +
        `<p style="margin:24px 0 4px 0;font-family:${SERIF};font-size:18px;font-weight:300;">${c.recap}</p>` +
        summaryTable(rows) +
        p(c.sign),
    }),
    text: toText([c.heading, '', c.intro, c.next, '', `${c.recap}:`, ...rowsToText(rows), '', c.sign.replace('<br />', '\n')]),
  }
}

// ---------------------------------------------------------------------------
// Internal notification (always Dutch labels; the team works in Dutch)

const KIND_LABEL: Record<LeadKind, string> = {
  demo: 'Nieuwe demo-aanvraag',
  contact: 'Nieuw contactbericht',
  b2b: 'Nieuwe zakelijke aanvraag',
}

export type LeadNotification =
  | { kind: 'demo'; lead: DemoLead }
  | { kind: 'contact'; lead: ContactLead }
  | { kind: 'b2b'; lead: B2BLead }

export function leadNotificationEmail(
  notification: LeadNotification,
  meta: { customerLocale: EmailLocale; adminUrl: string },
): RenderedEmail {
  const rows: Array<[string, string | undefined]> =
    notification.kind === 'demo'
      ? demoRows(notification.lead, 'nl')
      : notification.kind === 'contact'
        ? contactRows(notification.lead, 'nl')
        : b2bRows(notification.lead, 'nl')
  rows.push([L.nl.locale, meta.customerLocale === 'nl' ? 'Nederlands' : 'English'])

  const who =
    notification.kind === 'b2b'
      ? `${notification.lead.companyName} (${notification.lead.contactName})`
      : notification.lead.name
  const heading = KIND_LABEL[notification.kind]

  return {
    subject: `${heading}: ${who}`,
    html: layout({
      locale: 'nl',
      preheader: `${heading} van ${who}`,
      eyebrow: 'Lead',
      heading,
      bodyHtml: summaryTable(rows) + button(meta.adminUrl, 'Openen in beheer'),
    }),
    text: toText([`${heading}: ${who}`, '', ...rowsToText(rows), '', meta.adminUrl]),
  }
}
