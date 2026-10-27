import type { CollectionSlug, File, Payload, PayloadRequest } from 'payload'
import sharp from 'sharp'

import type { Media } from '@/payload-types'

import { accessories, categoriesContent, faqs, posts, proS, testimonials } from './content'

type Locale = 'nl' | 'en'

// Lead collections (demo/contact/b2b requests), users and form-builder forms are left alone
// except for forms/form-submissions which the template also clears.
const collections: CollectionSlug[] = [
  'categories',
  'media',
  'pages',
  'products',
  'faqs',
  'testimonials',
  'posts',
  'forms',
  'form-submissions',
  'variants',
  'variantOptions',
  'variantTypes',
  'carts',
  'transactions',
  'addresses',
  'orders',
]

const escapeXml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** Solid-colour placeholder image with a label, generated offline with sharp. */
async function placeholder(name: string, label: string, color: string, w = 1600, h = 1200): Promise<File> {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <rect width="100%" height="100%" fill="${color}"/>
    <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle"
      font-family="Georgia, serif" font-size="${Math.round(w / 20)}" fill="#8c6d3f">${escapeXml(label)}</text>
  </svg>`
  const data = await sharp(Buffer.from(svg)).png().toBuffer()
  return { name: `${name}.png`, data, mimetype: 'image/png', size: data.byteLength }
}

function richText(paragraphs: string[]) {
  return {
    root: {
      type: 'root',
      direction: 'ltr' as const,
      format: '' as const,
      indent: 0,
      version: 1,
      children: paragraphs.map((text) => ({
        type: 'paragraph',
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
        textFormat: 0,
        textStyle: '',
        children: [{ type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text, version: 1 }],
      })),
    },
  }
}

/** Copy `id`s of array rows from `created` onto `data` arrays (by index) so a second-locale update edits rows instead of adding new ones. */
function withRowIds<T extends Record<string, unknown>>(data: T, created: Record<string, unknown>): T {
  const out: Record<string, unknown> = { ...data }
  for (const [key, value] of Object.entries(data)) {
    const existing = created[key]
    if (Array.isArray(value) && Array.isArray(existing)) {
      out[key] = value.map((row, i) =>
        row && typeof row === 'object' && existing[i] && typeof existing[i] === 'object'
          ? { ...(row as object), id: (existing[i] as { id?: string }).id }
          : row,
      )
    }
  }
  return out as T
}

// Next.js revalidation errors are normal when seeding without a running server and can be ignored.
export const seed = async ({
  payload,
  req,
}: {
  payload: Payload
  req: PayloadRequest
}): Promise<void> => {
  payload.logger.info('Seeding Dadelsteen database...')

  const ctx = { disableRevalidate: true }

  payload.logger.info('— Clearing collections and globals...')
  for (const slug of ['header', 'footer'] as const) {
    await payload.updateGlobal({ slug, data: { navItems: [] }, depth: 0, context: ctx })
  }
  for (const collection of collections) {
    await payload.db.deleteMany({ collection, req, where: {} })
    if (payload.collections[collection].config.versions) {
      await payload.db.deleteVersions({ collection, req, where: {} })
    }
  }

  payload.logger.info('— Seeding media (generated placeholders)...')
  const mk = async (name: string, label: string, color: string, alt: string, w?: number, h?: number) =>
    (await payload.create({
      collection: 'media',
      data: { alt },
      file: await placeholder(name, label, color, w, h),
      context: ctx,
    })) as Media

  const heroImage = await mk('hero', 'imbody Pro S', '#e4dacb', 'Placeholder: imbody Pro S in a living room', 2000, 1200)
  const proImage = await mk('imbody-pro-s', 'imbody Pro S', '#d9cdb9', 'Placeholder: imbody Pro S smart mirror')
  const hotspotImage = await mk('imbody-pro-s-hotspots', 'imbody Pro S - detail', '#e9dfd0', 'Placeholder: imbody Pro S detail view')
  const accessoryImages: Media[] = []
  for (const a of accessories) {
    accessoryImages.push(await mk(a.slug, a.title.en, a.color, `Placeholder: ${a.title.en}`))
  }
  const postImages: Media[] = []
  for (const p of posts) {
    postImages.push(await mk(`post-${p.slug}`, p.title.en, '#cfc1ab', `Placeholder: ${p.title.en}`, 1600, 900))
  }

  payload.logger.info('— Seeding categories...')
  const cats: Record<string, { id: number }> = {}
  for (const c of categoriesContent) {
    const created = await payload.create({
      collection: 'categories',
      locale: 'nl',
      data: { title: c.title.nl, slug: c.slug },
      context: ctx,
    })
    await payload.update({
      collection: 'categories',
      id: created.id,
      locale: 'en',
      data: { title: c.title.en },
      context: ctx,
    })
    cats[c.slug] = created
  }

  payload.logger.info('— Seeding products...')
  const localeProduct = (l: Locale) => ({
    title: proS.title[l],
    shortDescription: proS.short[l],
    description: richText(proS.description[l]),
    badges: proS.badges.map((b) => ({ text: b[l] })),
    specs: proS.specs.map((s) => ({ label: s.label[l], value: s.value[l] })),
    features: proS.features.map((f) => ({ title: f.title[l], text: f.text[l], icon: f.icon })),
    hotspots: proS.hotspots.map((h) => ({ x: h.x, y: h.y, title: h.title[l], text: h.text[l] })),
    meta: { title: `${proS.title[l]} | Dadelsteen`, description: proS.metaDescription[l] },
  })

  const proCreated = await payload.create({
    collection: 'products',
    locale: 'nl',
    depth: 0,
    context: ctx,
    data: {
      ...localeProduct('nl'),
      slug: proS.slug,
      _status: 'published',
      productType: 'device',
      b2bAvailable: true,
      layout: [],
      gallery: [{ image: proImage.id }],
      hotspotImage: hotspotImage.id,
      categories: [cats['toestellen'].id],
      enableVariants: false,
      priceInEUREnabled: true,
      priceInEUR: proS.price,
      inventory: 25,
      meta: { ...localeProduct('nl').meta, image: proImage.id },
    },
  })
  await payload.update({
    collection: 'products',
    id: proCreated.id,
    locale: 'en',
    depth: 0,
    context: ctx,
    data: withRowIds(localeProduct('en'), proCreated as unknown as Record<string, unknown>),
  })

  const accessoryDocs: { id: number }[] = []
  for (const [i, a] of accessories.entries()) {
    const nlData = {
      title: a.title.nl,
      shortDescription: a.short.nl,
      description: richText([a.short.nl]),
      meta: { title: `${a.title.nl} | Dadelsteen`, description: a.short.nl },
    }
    const created = await payload.create({
      collection: 'products',
      locale: 'nl',
      depth: 0,
      context: ctx,
      data: {
        ...nlData,
        slug: a.slug,
        _status: 'published',
        productType: 'accessory',
        b2bAvailable: a.b2b,
        layout: [],
        gallery: [{ image: accessoryImages[i].id }],
        categories: [cats['accessoires'].id],
        enableVariants: false,
        priceInEUREnabled: true,
        priceInEUR: a.price,
        inventory: 100,
        meta: { ...nlData.meta, image: accessoryImages[i].id },
      },
    })
    await payload.update({
      collection: 'products',
      id: created.id,
      locale: 'en',
      depth: 0,
      context: ctx,
      data: {
        title: a.title.en,
        shortDescription: a.short.en,
        description: richText([a.short.en]),
        meta: { title: `${a.title.en} | Dadelsteen`, description: a.short.en },
      },
    })
    accessoryDocs.push(created)
  }
  await payload.update({
    collection: 'products',
    id: proCreated.id,
    depth: 0,
    context: ctx,
    data: { relatedProducts: accessoryDocs.map((d) => d.id) },
  })

  payload.logger.info('— Seeding FAQs...')
  for (const [i, f] of faqs.entries()) {
    const created = await payload.create({
      collection: 'faqs',
      locale: 'nl',
      context: ctx,
      data: { question: f.q.nl, answer: f.a.nl, category: f.category, order: i, showOnHome: f.home },
    })
    await payload.update({
      collection: 'faqs',
      id: created.id,
      locale: 'en',
      context: ctx,
      data: { question: f.q.en, answer: f.a.en },
    })
  }

  payload.logger.info('— Seeding testimonials (placeholders)...')
  for (const t of testimonials) {
    const created = await payload.create({
      collection: 'testimonials',
      locale: 'nl',
      context: ctx,
      data: { name: t.name, role: t.role.nl, quote: t.quote.nl, rating: 5, audience: t.audience, published: true },
    })
    await payload.update({
      collection: 'testimonials',
      id: created.id,
      locale: 'en',
      context: ctx,
      data: { role: t.role.en, quote: t.quote.en },
    })
  }

  payload.logger.info('— Seeding journal posts...')
  for (const [i, p] of posts.entries()) {
    const created = await payload.create({
      collection: 'posts',
      locale: 'nl',
      context: ctx,
      data: {
        title: p.title.nl,
        slug: p.slug,
        excerpt: p.excerpt.nl,
        heroImage: postImages[i].id,
        content: richText(p.body.nl),
        publishedAt: p.date,
        _status: 'published',
        meta: { title: `${p.title.nl} | Dadelsteen`, description: p.excerpt.nl },
      },
    })
    await payload.update({
      collection: 'posts',
      id: created.id,
      locale: 'en',
      context: ctx,
      data: {
        title: p.title.en,
        excerpt: p.excerpt.en,
        content: richText(p.body.en),
        _status: 'published',
        meta: { title: `${p.title.en} | Dadelsteen`, description: p.excerpt.en },
      },
    })
  }

  payload.logger.info('— Seeding globals...')
  const settingsBase = {
    companyName: 'Dadelsteen',
    kvkNumber: '',
    vatNumber: '',
    iban: '',
    email: 'info@dadelsteen.nl',
    phone: '',
    whatsappNumber: '',
    address: { street: '', postalCode: '', city: '', country: 'Nederland' },
    socialLinks: [
      { platform: 'instagram' as const, url: 'https://instagram.com/dadelsteen' },
      { platform: 'tiktok' as const, url: 'https://tiktok.com/@dadelsteen' },
      { platform: 'linkedin' as const, url: 'https://linkedin.com/company/dadelsteen' },
      { platform: 'facebook' as const, url: 'https://facebook.com/dadelsteen' },
    ],
    warrantyYears: 2,
    returnDays: 14,
  }
  await payload.updateGlobal({
    slug: 'site-settings',
    locale: 'nl',
    context: ctx,
    data: {
      ...settingsBase,
      openingHours: 'Ma-vr 09:00-17:30, zaterdag op afspraak',
      shippingNote: 'Gratis levering & installatie in Nederland en Belgie',
    },
  })
  const settingsNl = await payload.findGlobal({ slug: 'site-settings', locale: 'nl', depth: 0 })
  await payload.updateGlobal({
    slug: 'site-settings',
    locale: 'en',
    context: ctx,
    data: {
      ...withRowIds({ socialLinks: settingsBase.socialLinks }, settingsNl as unknown as Record<string, unknown>),
      openingHours: 'Mon-Fri 09:00-17:30, Saturday by appointment',
      shippingNote: 'Free delivery & installation in the Netherlands and Belgium',
    },
  })

  const homeL = (l: Locale) => ({
    heroTitle: l === 'nl' ? 'Je persoonlijke sportstudio, in een spiegel' : 'Your personal training studio, in a mirror',
    heroSubtitle:
      l === 'nl'
        ? 'Digitale weerstand, een AI-coach en een afwerking die thuis hoort in je interieur.'
        : 'Digital resistance, an AI coach and a finish that belongs in your interior.',
    hotspots: proS.hotspots.map((h) => ({ x: h.x, y: h.y, title: h.title[l], text: h.text[l] })),
  })
  await payload.updateGlobal({
    slug: 'homepage',
    locale: 'nl',
    context: ctx,
    data: {
      ...homeL('nl'),
      heroPoster: heroImage.id,
      featuredProduct: proCreated.id,
      hotspotImage: hotspotImage.id,
    },
  })
  const homeNl = await payload.findGlobal({ slug: 'homepage', locale: 'nl', depth: 0 })
  await payload.updateGlobal({
    slug: 'homepage',
    locale: 'en',
    context: ctx,
    data: withRowIds(homeL('en'), homeNl as unknown as Record<string, unknown>),
  })

  payload.logger.info('Seeded database successfully!')
}
