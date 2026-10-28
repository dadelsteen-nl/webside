import type { SiteSetting } from '@/payload-types'

import { absoluteUrl } from './alternates'

export function organizationJsonLd(settings?: Partial<SiteSetting> | null) {
  const a = settings?.address
  const sameAs = (settings?.socialLinks ?? []).map((s) => s.url).filter(Boolean)
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': absoluteUrl('/#organization'),
    name: settings?.companyName || 'Dadelsteen',
    url: absoluteUrl('/'),
    logo: absoluteUrl('/favicon.svg'),
    areaServed: ['NL', 'BE'],
    ...(settings?.email ? { email: settings.email } : {}),
    ...(settings?.phone ? { telephone: settings.phone } : {}),
    ...(settings?.kvkNumber ? { identifier: `KvK ${settings.kvkNumber}` } : {}),
    ...(settings?.vatNumber ? { vatID: settings.vatNumber } : {}),
    ...(a?.street || a?.city
      ? {
          address: {
            '@type': 'PostalAddress',
            streetAddress: a?.street ?? undefined,
            postalCode: a?.postalCode ?? undefined,
            addressLocality: a?.city ?? undefined,
            addressCountry: a?.country ?? undefined,
          },
        }
      : {}),
    ...(sameAs.length ? { sameAs } : {}),
  }
}

/** items: name + absolute URL (or path, which is made absolute). */
export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : absoluteUrl(item.url),
    })),
  }
}

export function articleJsonLd(input: {
  title: string
  description?: string | null
  url: string
  image?: string | null
  datePublished?: string | null
  dateModified?: string | null
  locale: string
  publisherName?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: input.title,
    ...(input.description ? { description: input.description } : {}),
    ...(input.image ? { image: [input.image] } : {}),
    ...(input.datePublished ? { datePublished: input.datePublished } : {}),
    dateModified: input.dateModified || input.datePublished || undefined,
    inLanguage: input.locale === 'nl' ? 'nl-NL' : 'en',
    mainEntityOfPage: input.url,
    author: { '@type': 'Organization', name: input.publisherName || 'Dadelsteen' },
    publisher: {
      '@type': 'Organization',
      name: input.publisherName || 'Dadelsteen',
      logo: { '@type': 'ImageObject', url: absoluteUrl('/favicon.svg') },
    },
  }
}

export function faqJsonLd(items: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((i) => ({
      '@type': 'Question',
      name: i.question,
      acceptedAnswer: { '@type': 'Answer', text: i.answer },
    })),
  }
}
