import type { CollectionConfig } from 'payload'

import { adminOnly } from '@/access/adminOnly'

export const Faqs: CollectionConfig = {
  slug: 'faqs',
  access: { create: adminOnly, read: () => true, update: adminOnly, delete: adminOnly },
  admin: {
    group: 'Content',
    useAsTitle: 'question',
    defaultColumns: ['question', 'category', 'order', 'showOnHome'],
  },
  defaultSort: 'order',
  fields: [
    { name: 'question', type: 'text', localized: true, required: true },
    { name: 'answer', type: 'textarea', localized: true, required: true },
    {
      name: 'category',
      type: 'select',
      defaultValue: 'general',
      required: true,
      options: [
        { label: 'Product', value: 'product' },
        { label: 'Shop', value: 'shop' },
        { label: 'Delivery', value: 'delivery' },
        { label: 'Business', value: 'business' },
        { label: 'General', value: 'general' },
      ],
      admin: { position: 'sidebar' },
    },
    { name: 'order', type: 'number', defaultValue: 0, admin: { position: 'sidebar' } },
    { name: 'showOnHome', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar' } },
  ],
}
