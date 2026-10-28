import { postgresAdapter } from '@payloadcms/db-postgres'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { resendAdapter } from '@payloadcms/email-resend'
import {
  BoldFeature,
  EXPERIMENTAL_TableFeature,
  IndentFeature,
  ItalicFeature,
  LinkFeature,
  OrderedListFeature,
  UnderlineFeature,
  UnorderedListFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { en } from '@payloadcms/translations/languages/en'
import { nl } from '@payloadcms/translations/languages/nl'
import { fileURLToPath } from 'url'

import { Categories } from '@/collections/Categories'
import { Media } from '@/collections/Media'
import { Pages } from '@/collections/Pages'
import { Users } from '@/collections/Users'
import { Faqs } from '@/collections/Faqs'
import { Testimonials } from '@/collections/Testimonials'
import { Posts } from '@/collections/Posts'
import { DemoRequests } from '@/collections/DemoRequests'
import { ContactRequests } from '@/collections/ContactRequests'
import { B2BRequests } from '@/collections/B2BRequests'
import { Footer } from '@/globals/Footer'
import { Header } from '@/globals/Header'
import { Homepage } from '@/globals/Homepage'
import { SiteSettings } from '@/globals/SiteSettings'
import { migrations } from './migrations'
import { plugins } from './plugins'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const databaseURL = process.env.DATABASE_URL || process.env.POSTGRES_URL || ''
const isPostgres = /^postgres(ql)?:\/\//.test(databaseURL)

// Vercel has no persistent disk, so SQLite cannot work there.
if (process.env.VERCEL && !isPostgres) {
  throw new Error('DATABASE_URL must be a Postgres URL on Vercel: connect a Neon database under Storage.')
}

export default buildConfig({
  admin: {
    components: {
      // The `BeforeLogin` component renders a message that you see while logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below and the import `BeforeLogin` statement on line 15.
      beforeLogin: ['@/components/BeforeLogin#BeforeLogin'],
      // The `BeforeDashboard` component renders the 'welcome' block that you see after logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below and the import `BeforeDashboard` statement on line 15.
      beforeDashboard: ['@/components/BeforeDashboard#BeforeDashboard'],
    },
    user: Users.slug,
  },
  collections: [
    Users,
    Pages,
    Categories,
    Media,
    Faqs,
    Testimonials,
    Posts,
    DemoRequests,
    ContactRequests,
    B2BRequests,
  ],
  // Postgres (Neon on Vercel) when DATABASE_URL is a postgres URL; local SQLite file otherwise.
  // Production applies the committed migrations on startup; create new ones with `pnpm payload migrate:create`.
  db: isPostgres
    ? postgresAdapter({
        pool: { connectionString: databaseURL },
        prodMigrations: migrations,
      })
    : sqliteAdapter({
        client: {
          url: databaseURL,
        },
      }),
  editor: lexicalEditor({
    features: () => {
      return [
        UnderlineFeature(),
        BoldFeature(),
        ItalicFeature(),
        OrderedListFeature(),
        UnorderedListFeature(),
        LinkFeature({
          enabledCollections: ['pages', 'posts'],
          fields: ({ defaultFields }) => {
            const defaultFieldsWithoutUrl = defaultFields.filter((field) => {
              if ('name' in field && field.name === 'url') return false
              return true
            })

            return [
              ...defaultFieldsWithoutUrl,
              {
                name: 'url',
                type: 'text',
                admin: {
                  condition: ({ linkType }) => linkType !== 'internal',
                },
                label: ({ t }) => t('fields:enterURL'),
                required: true,
              },
            ]
          },
        }),
        IndentFeature(),
        EXPERIMENTAL_TableFeature(),
      ]
    },
  }),
  // Resend when RESEND_API_KEY is set; otherwise Payload's default console email logging.
  email: process.env.RESEND_API_KEY
    ? resendAdapter({
        apiKey: process.env.RESEND_API_KEY,
        defaultFromAddress: process.env.EMAIL_FROM || 'hallo@dadelsteen.nl',
        defaultFromName: 'Dadelsteen',
      })
    : undefined,
  endpoints: [],
  globals: [SiteSettings, Homepage, Header, Footer],
  i18n: {
    fallbackLanguage: 'nl',
    supportedLanguages: { nl, en },
  },
  localization: {
    locales: [
      { code: 'nl', label: 'Nederlands' },
      { code: 'en', label: 'English' },
    ],
    defaultLocale: 'nl',
    fallback: true,
  },
  plugins,
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  // Sharp is now an optional dependency -
  // if you want to resize images, crop, set focal point, etc.
  // make sure to install it and pass it to the config.
  // sharp,
})
