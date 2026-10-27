import createMiddleware from 'next-intl/middleware'

import { routing } from './i18n/routing'

export default createMiddleware(routing)

export const config = {
  // Explicit locale matchers: a single negative-lookahead matcher did not match
  // prefixed paths (/nl/...) under Next 16. The last entry catches unprefixed
  // pages (e.g. /shop) so they get redirected to a locale.
  matcher: ['/', '/(nl|en)/:path*', '/((?!api|admin|next|_next|_vercel|.*\..*).*)'],
}
