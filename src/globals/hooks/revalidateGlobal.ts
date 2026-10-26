import type { GlobalAfterChangeHook } from 'payload'

import { revalidateTag } from 'next/cache'

export const revalidateGlobal: GlobalAfterChangeHook = ({ doc, global, req: { payload, context } }) => {
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating global ${global.slug}`)
    revalidateTag(`global_${global.slug}`, 'max')
  }

  return doc
}
