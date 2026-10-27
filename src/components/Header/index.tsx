import { getLayoutSiteSettings } from '@/components/layout/getSiteSettings'
import { resolveSocialLinks } from '@/components/layout/social'
import type { Locale } from '@/i18n/routing'
import { getLocale } from 'next-intl/server'
import React from 'react'

import './index.css'
import { HeaderClient } from './index.client'

/**
 * Site header. Transparent (cream text) over the hero on the home page until the visitor scrolls;
 * solid sand with a hairline border everywhere else. On non-home pages it also renders a spacer
 * so content starts below the fixed bar — home sections should start at the very top (full-bleed
 * hero) and keep a dark-enough top area for the cream header text.
 */
export async function Header() {
  const locale = (await getLocale()) as Locale
  const settings = await getLayoutSiteSettings(locale)

  return <HeaderClient socialLinks={resolveSocialLinks(settings)} />
}
