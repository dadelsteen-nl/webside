import type { CollectionConfig } from 'payload'

import { leadAccess, leadMetaFields } from './leads'

export const DemoRequests: CollectionConfig = {
  slug: 'demo-requests',
  access: leadAccess,
  admin: {
    group: 'Leads',
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'preferredDate', 'location', 'status', 'createdAt'],
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'phone', type: 'text' },
    { name: 'preferredDate', type: 'date' },
    {
      name: 'preferredTime',
      type: 'select',
      options: [
        { label: 'Morning', value: 'morning' },
        { label: 'Afternoon', value: 'afternoon' },
        { label: 'Evening', value: 'evening' },
      ],
    },
    {
      name: 'location',
      type: 'select',
      options: [
        { label: 'Showroom', value: 'showroom' },
        { label: 'At home', value: 'at-home' },
        { label: 'Online', value: 'online' },
      ],
    },
    {
      name: 'audience',
      type: 'select',
      defaultValue: 'private',
      options: [
        { label: 'Private', value: 'private' },
        { label: 'Business', value: 'business' },
      ],
    },
    { name: 'companyName', type: 'text' },
    { name: 'message', type: 'textarea' },
    ...leadMetaFields,
  ],
}
