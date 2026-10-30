import type { CollectionConfig } from 'payload'

import { leadAccess, leadMetaFields } from './leads'

export const B2BRequests: CollectionConfig = {
  slug: 'b2b-requests',
  access: leadAccess,
  admin: {
    group: 'Leads',
    useAsTitle: 'companyName',
    defaultColumns: ['companyName', 'contactName', 'email', 'businessType', 'units', 'status'],
  },
  fields: [
    { name: 'companyName', type: 'text', required: true },
    { name: 'contactName', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'phone', type: 'text' },
    {
      name: 'businessType',
      type: 'select',
      options: [
        { label: 'Government / municipality', value: 'government' },
        { label: 'Social domain', value: 'social' },
        { label: 'Gym', value: 'gym' },
        { label: 'Physiotherapy', value: 'physio' },
        { label: 'Clinic', value: 'clinic' },
        { label: 'Salon', value: 'salon' },
        { label: 'Hotel', value: 'hotel' },
        { label: 'Corporate', value: 'corporate' },
        { label: 'Other', value: 'other' },
      ],
    },
    { name: 'units', type: 'number', min: 1 },
    { name: 'message', type: 'textarea' },
    ...leadMetaFields,
  ],
}
