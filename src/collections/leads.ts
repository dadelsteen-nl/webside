import type { CollectionConfig, Field } from 'payload'

import { adminOnly } from '@/access/adminOnly'
import { adminOnlyFieldAccess } from '@/access/adminOnlyFieldAccess'
import { publicAccess } from '@/access/publicAccess'

export const leadAccess: CollectionConfig['access'] = {
  create: publicAccess,
  read: adminOnly,
  update: adminOnly,
  delete: adminOnly,
}

/** Shared fields for all lead collections. `status` can only be set by admins. */
export const leadMetaFields: Field[] = [
  {
    name: 'locale',
    type: 'select',
    options: [
      { label: 'Nederlands', value: 'nl' },
      { label: 'English', value: 'en' },
    ],
    defaultValue: 'nl',
    admin: { position: 'sidebar' },
  },
  {
    name: 'status',
    type: 'select',
    defaultValue: 'new',
    required: true,
    options: [
      { label: 'New', value: 'new' },
      { label: 'Contacted', value: 'contacted' },
      { label: 'Scheduled', value: 'scheduled' },
      { label: 'Done', value: 'done' },
    ],
    access: {
      create: adminOnlyFieldAccess,
      update: adminOnlyFieldAccess,
    },
    admin: { position: 'sidebar' },
  },
]
