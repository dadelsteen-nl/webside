import type { GlobalConfig } from 'payload'

import { adminOnly } from '@/access/adminOnly'
import { revalidateGlobal } from '@/globals/hooks/revalidateGlobal'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site settings',
  admin: { group: 'Settings' },
  access: {
    read: () => true,
    update: adminOnly,
  },
  hooks: {
    afterChange: [revalidateGlobal],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Company',
          fields: [
            { name: 'companyName', type: 'text', defaultValue: 'Dadelsteen' },
            { name: 'kvkNumber', type: 'text', label: 'KvK number' },
            { name: 'vatNumber', type: 'text', label: 'BTW / VAT number' },
            { name: 'iban', type: 'text', label: 'IBAN' },
            {
              name: 'address',
              type: 'group',
              fields: [
                { name: 'street', type: 'text' },
                { name: 'postalCode', type: 'text' },
                { name: 'city', type: 'text' },
                { name: 'country', type: 'text', defaultValue: 'Nederland' },
              ],
            },
            { name: 'email', type: 'email' },
            { name: 'phone', type: 'text' },
            {
              name: 'openingHours',
              type: 'textarea',
              localized: true,
            },
          ],
        },
        {
          label: 'Social & messaging',
          fields: [
            {
              name: 'whatsappNumber',
              type: 'text',
              admin: { description: 'International format without + or spaces, e.g. 31612345678' },
            },
            {
              name: 'socialLinks',
              type: 'array',
              admin: { description: 'Shown in the floating social bar and footer, in this order.' },
              fields: [
                {
                  name: 'platform',
                  type: 'select',
                  required: true,
                  options: [
                    { label: 'Instagram', value: 'instagram' },
                    { label: 'TikTok', value: 'tiktok' },
                    { label: 'Facebook', value: 'facebook' },
                    { label: 'LinkedIn', value: 'linkedin' },
                    { label: 'YouTube', value: 'youtube' },
                  ],
                },
                { name: 'url', type: 'text', required: true },
              ],
            },
          ],
        },
        {
          label: 'Shop',
          fields: [
            {
              name: 'shippingNote',
              type: 'text',
              localized: true,
              admin: { description: 'E.g. "Free delivery & installation in NL and BE"' },
            },
            { name: 'warrantyYears', type: 'number', defaultValue: 2 },
            { name: 'returnDays', type: 'number', defaultValue: 14 },
          ],
        },
      ],
    },
  ],
}
