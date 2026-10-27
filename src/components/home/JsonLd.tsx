import { getTranslations } from 'next-intl/server'

import { getServerSideURL } from '@/utilities/getURL'

/** Organization + WebSite structured data for the home page. */
export async function HomeJsonLd({ locale, sameAs = [] }: { locale: string; sameAs?: string[] }) {
  const t = await getTranslations({ locale, namespace: 'home.meta' })
  const base = getServerSideURL().replace(/\/$/, '')

  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@id': `${base}/#organization`,
        '@type': 'Organization',
        areaServed: ['NL', 'BE'],
        description: t('organizationDescription'),
        logo: `${base}/favicon.svg`,
        name: 'Dadelsteen',
        url: `${base}/${locale}`,
        ...(sameAs.length ? { sameAs } : {}),
      },
      {
        '@id': `${base}/#website`,
        '@type': 'WebSite',
        inLanguage: locale === 'nl' ? 'nl-NL' : 'en',
        name: 'Dadelsteen',
        publisher: { '@id': `${base}/#organization` },
        url: `${base}/${locale}`,
      },
    ],
  }

  return (
    <script
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph).replace(/</g, '\\u003c') }}
      type="application/ld+json"
    />
  )
}
