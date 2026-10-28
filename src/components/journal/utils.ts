import type { Media, Post } from '@/payload-types'

export function dateFormatter(locale: string) {
  return new Intl.DateTimeFormat(locale === 'nl' ? 'nl-NL' : 'en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function collectText(node: unknown): string {
  if (!node || typeof node !== 'object') return ''
  const n = node as { text?: unknown; children?: unknown[] }
  const own = typeof n.text === 'string' ? n.text : ''
  const kids = Array.isArray(n.children) ? n.children.map(collectText).join(' ') : ''
  return `${own} ${kids}`
}

/** Reading time in whole minutes (min 1), ~220 wpm. */
export function readingMinutes(post: Pick<Post, 'content' | 'excerpt'>): number {
  const text = post.content ? collectText(post.content.root) : (post.excerpt ?? '')
  const words = text.split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 220))
}

export function heroOf(post: Post): { url: string; alt: string } | null {
  const m = post.heroImage as Media | number | null | undefined
  if (!m || typeof m !== 'object' || !m.url) return null
  return { url: m.url, alt: m.alt || post.title }
}

export function categoryTitles(post: Post): string[] {
  return (post.categories ?? [])
    .map((c) => (typeof c === 'object' ? c.title : null))
    .filter((t): t is string => Boolean(t))
}
