import type { CollectionConfig } from 'payload'

import { adminOnly } from '@/access/adminOnly'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  access: { create: adminOnly, read: () => true, update: adminOnly, delete: adminOnly },
  admin: {
    group: 'Content',
    useAsTitle: 'name',
    defaultColumns: ['name', 'role', 'audience', 'rating', 'published'],
    description:
      'Seeded testimonials are PLACEHOLDERS. Replace with real customer reviews before launch.',
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'role', type: 'text', localized: true, admin: { description: 'Role or location' } },
    { name: 'quote', type: 'textarea', localized: true, required: true },
    { name: 'rating', type: 'number', min: 1, max: 5, defaultValue: 5 },
    { name: 'photo', type: 'upload', relationTo: 'media' },
    {
      name: 'audience',
      type: 'select',
      defaultValue: 'home',
      options: [
        { label: 'Home', value: 'home' },
        { label: 'Business', value: 'business' },
      ],
      admin: { position: 'sidebar' },
    },
    { name: 'published', type: 'checkbox', defaultValue: true, admin: { position: 'sidebar' } },
  ],
}
