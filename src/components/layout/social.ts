import type { SiteSetting } from '@/payload-types'

export type SocialPlatform = NonNullable<SiteSetting['socialLinks']>[number]['platform']

export type SocialLink = {
  platform: SocialPlatform
  url: string
  /** True when no real URL is configured yet and the link is a design placeholder. */
  placeholder?: boolean
}

export const platformLabels: Record<SocialPlatform, string> = {
  instagram: 'Instagram',
  tiktok: 'TikTok',
  facebook: 'Facebook',
  linkedin: 'LinkedIn',
  youtube: 'YouTube',
}

// TODO(content): remove once real social URLs are entered in Payload → Settings → Site settings.
const placeholderPlatforms: SocialPlatform[] = ['instagram', 'tiktok', 'linkedin', 'facebook']

/**
 * Social links from site settings, in CMS order. Entries without a URL are dropped.
 * If none are configured at all, placeholder links (href "#") keep the design visible.
 */
export function resolveSocialLinks(settings?: Pick<SiteSetting, 'socialLinks'> | null): SocialLink[] {
  const configured = (settings?.socialLinks ?? [])
    .filter((link) => Boolean(link?.url?.trim()))
    .map((link) => ({ platform: link.platform, url: link.url.trim() }))

  if (configured.length) return configured

  return placeholderPlatforms.map((platform) => ({ platform, url: '#', placeholder: true }))
}

/** wa.me deep link, or null when no number is configured. */
export function whatsappHref(number: string | null | undefined, message: string): string | null {
  const digits = (number ?? '').replace(/\D/g, '')
  if (!digits) return null
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`
}
