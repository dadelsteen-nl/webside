import type { CollectionConfig } from 'payload'

import { leadAccess, leadMetaFields } from './leads'

export const ContactRequests: CollectionConfig = {
  slug: 'contact-requests',
  access: leadAccess,
  admin: {
    group: 'Leads',
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'subject', 'status', 'createdAt'],
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'phone', type: 'text' },
    { name: 'subject', type: 'text' },
    { name: 'message', type: 'textarea', required: true },
    ...leadMetaFields,
  ],
}
