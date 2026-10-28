import { getServerSideURL } from '@/utilities/getURL'

export const dynamic = 'force-dynamic'

// Disallowed paths are listed per locale prefix (localized pathnames: see src/i18n/routing.ts).
const DISALLOW = [
  '/admin',
  '/api/',
  '/nl/afrekenen',
  '/en/checkout',
  '/nl/winkelwagen',
  '/en/cart',
  '/nl/account',
  '/en/account',
  '/nl/bestellingen',
  '/en/orders',
  '/nl/inloggen',
  '/en/login',
  '/nl/uitloggen',
  '/en/logout',
  '/nl/account-aanmaken',
  '/en/create-account',
  '/nl/wachtwoord-vergeten',
  '/en/forgot-password',
  '/nl/bestelling-zoeken',
  '/en/find-order',
]

export function GET() {
  const base = getServerSideURL().replace(/\/$/, '')
  const body = [
    'User-Agent: *',
    'Allow: /',
    ...DISALLOW.map((p) => `Disallow: ${p}`),
    '',
    `Host: ${base}`,
    `Sitemap: ${base}/sitemap.xml`,
    '',
  ].join('\n')
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}
