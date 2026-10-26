import createMiddleware from 'next-intl/middleware'

import { routing } from './i18n/routing'

export default createMiddleware(routing)

export const config = {
  // Skip Payload admin/API, Next internals, preview/seed routes and static files
  matcher: ['/((?!api|admin|next|_next|_vercel|.*\..*).*)'],
}
