import type { GlobalConfig } from 'payload'

import { adminOnly } from '@/access/adminOnly'
import { revalidateGlobal } from '@/globals/hooks/revalidateGlobal'

/**
 * Media and editable copy for the home page. Static microcopy lives in
 * messages/{locale}/home.json; anything here overrides it when filled in.
 */
export const Homepage: GlobalConfig = {
  slug: 'homepage',
  label: 'Homepage',
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
          label: 'Hero',
          fields: [
            { name: 'heroTitle', type: 'text', localized: true },
            { name: 'heroSubtitle', type: 'textarea', localized: true },
            {
              name: 'heroVideo',
              type: 'upload',
              relationTo: 'media',
              admin: { description: 'MP4/WebM, muted loop, ideally < 8 MB' },
            },
            {
              name: 'heroPoster',
              type: 'upload',
              relationTo: 'media',
              admin: { description: 'Still image shown before the video loads (and on reduced motion)' },
            },
          ],
        },
        {
          label: 'Product spotlight',
          fields: [
            { name: 'featuredProduct', type: 'relationship', relationTo: 'products' },
            { name: 'hotspotImage', type: 'upload', relationTo: 'media' },
            {
              name: 'hotspots',
              type: 'array',
              maxRows: 8,
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'x', type: 'number', min: 0, max: 100, required: true, admin: { description: 'Left, %' } },
                    { name: 'y', type: 'number', min: 0, max: 100, required: true, admin: { description: 'Top, %' } },
                  ],
                },
                { name: 'title', type: 'text', localized: true, required: true },
                { name: 'text', type: 'textarea', localized: true },
              ],
            },
          ],
        },
        {
          label: 'Gallery',
          fields: [
            {
              name: 'gallery',
              type: 'array',
              fields: [
                { name: 'media', type: 'upload', relationTo: 'media', required: true },
                { name: 'caption', type: 'text', localized: true },
              ],
            },
          ],
        },
        {
          label: 'Cost calculator',
          fields: [
            { name: 'calcGymMonthly', type: 'number', defaultValue: 60, label: 'Gym membership € / month' },
            { name: 'calcTrainerSession', type: 'number', defaultValue: 70, label: 'Personal trainer € / session' },
            { name: 'calcSessionsPerMonth', type: 'number', defaultValue: 4, label: 'PT sessions / month' },
            { name: 'calcYears', type: 'number', defaultValue: 5, label: 'Default years' },
          ],
        },
      ],
    },
  ],
}
