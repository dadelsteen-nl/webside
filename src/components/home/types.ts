/** Plain, serialisable props for the home sections (CMS data or static fallback). */

export type HomeMedia = {
  url: string
  alt: string
  width?: number | null
  height?: number | null
  mimeType?: string | null
}

export type HomeHotspot = {
  x: number
  y: number
  title: string
  text?: string | null
}

export type HomeProduct = {
  title: string
  slug: string
  description?: string | null
  /** Price in whole euros (already converted from cents) */
  priceEUR?: number | null
  image?: HomeMedia | null
  /** Product id, used for the add-to-cart link */
  id?: number | string | null
}

export type HomeGalleryItem = {
  media?: HomeMedia | null
  caption?: string | null
}

export type HomeTestimonial = {
  name: string
  role?: string | null
  quote: string
  rating?: number | null
  photo?: HomeMedia | null
}

export type HomeFaq = {
  question: string
  /** Plain text answer */
  answer: string
}

export type HomePost = {
  title: string
  slug: string
  excerpt?: string | null
  image?: HomeMedia | null
  publishedAt?: string | null
}

export type CalcDefaults = {
  gymMonthly: number
  trainerSession: number
  sessionsPerMonth: number
  years: number
}
