'use client'

import { useCallback, useSyncExternalStore } from 'react'

import { CONSENT_KEY, CONSENT_VERSION } from './consentConfig'

export { CONSENT_KEY, CONSENT_VERSION }

/**
 * Cookie consent store (GDPR / Dutch AP guidance): nothing non-essential runs until the visitor
 * actively chooses. The choice is persisted in localStorage and in the first-party cookie
 * `dadelsteen_consent` (JSON) so server code can read it too.
 */
const MAX_AGE_SECONDS = 60 * 60 * 24 * 180 // re-ask after 6 months

export type ConsentChoice = {
  necessary: true
  analytics: boolean
  marketing: boolean
  version: number
  /** ISO timestamp of the decision (proof of consent). */
  updatedAt: string
}

type State = {
  /** undefined = not read yet (SSR / before hydration), null = no decision yet. */
  consent: ConsentChoice | null | undefined
  preferencesOpen: boolean
}

type GtagFn = (command: 'consent', action: 'default' | 'update', params: Record<string, string>) => void

declare global {
  interface Window {
    gtag?: GtagFn
  }
}

let state: State = { consent: undefined, preferencesOpen: false }
const serverState: State = { consent: undefined, preferencesOpen: false }
const listeners = new Set<() => void>()

function emit(next: State) {
  state = next
  listeners.forEach((l) => l())
}

function isChoice(value: unknown): value is ConsentChoice {
  if (!value || typeof value !== 'object') return false
  const v = value as Record<string, unknown>
  return (
    typeof v.analytics === 'boolean' &&
    typeof v.marketing === 'boolean' &&
    v.version === CONSENT_VERSION
  )
}

function readStored(): ConsentChoice | null {
  let raw: string | null = null
  try {
    raw = window.localStorage.getItem(CONSENT_KEY)
  } catch {
    // localStorage can throw in private mode / blocked storage; fall back to the cookie below.
    raw = null
  }
  if (!raw) {
    const match = document.cookie.match(new RegExp(`(?:^|; )${CONSENT_KEY}=([^;]*)`))
    raw = match ? decodeURIComponent(match[1]!) : null
  }
  if (!raw) return null
  try {
    const parsed: unknown = JSON.parse(raw)
    return isChoice(parsed) ? { ...parsed, necessary: true } : null
  } catch {
    // Corrupt value: treat as "no decision" so the banner asks again.
    return null
  }
}

function pushConsentMode(choice: ConsentChoice) {
  const value = (granted: boolean) => (granted ? 'granted' : 'denied')
  window.gtag?.('consent', 'update', {
    analytics_storage: value(choice.analytics),
    ad_storage: value(choice.marketing),
    ad_user_data: value(choice.marketing),
    ad_personalization: value(choice.marketing),
  })
  window.dispatchEvent(new CustomEvent('dadelsteen:consent', { detail: choice }))
}

function persist(choice: ConsentChoice) {
  const json = JSON.stringify(choice)
  try {
    window.localStorage.setItem(CONSENT_KEY, json)
  } catch {
    // Storage unavailable: the cookie below still records the choice.
  }
  const secure = window.location.protocol === 'https:' ? '; Secure' : ''
  document.cookie = `${CONSENT_KEY}=${encodeURIComponent(json)}; Max-Age=${MAX_AGE_SECONDS}; Path=/; SameSite=Lax${secure}`
}

function ensureLoaded() {
  if (state.consent !== undefined || typeof window === 'undefined') return
  const stored = readStored()
  state = { ...state, consent: stored }
  if (stored) pushConsentMode(stored)
}

function subscribe(listener: () => void) {
  ensureLoaded()
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function saveConsent(prefs: { analytics: boolean; marketing: boolean }) {
  const choice: ConsentChoice = {
    necessary: true,
    analytics: prefs.analytics,
    marketing: prefs.marketing,
    version: CONSENT_VERSION,
    updatedAt: new Date().toISOString(),
  }
  persist(choice)
  pushConsentMode(choice)
  emit({ consent: choice, preferencesOpen: false })
}

export function openConsentPreferences() {
  ensureLoaded()
  emit({ ...state, preferencesOpen: true })
}

export function closeConsentPreferences() {
  emit({ ...state, preferencesOpen: false })
}

/**
 * Read and update cookie consent anywhere in the client tree (no provider needed).
 * Gate any analytics/marketing script on `analytics` / `marketing`.
 */
export function useConsent() {
  const snapshot = useSyncExternalStore(
    subscribe,
    () => state,
    () => serverState,
  )

  const acceptAll = useCallback(() => saveConsent({ analytics: true, marketing: true }), [])
  const rejectAll = useCallback(() => saveConsent({ analytics: false, marketing: false }), [])

  return {
    consent: snapshot.consent,
    /** False until the stored value has been read on the client. */
    ready: snapshot.consent !== undefined,
    hasDecided: Boolean(snapshot.consent),
    analytics: snapshot.consent?.analytics ?? false,
    marketing: snapshot.consent?.marketing ?? false,
    preferencesOpen: snapshot.preferencesOpen,
    acceptAll,
    rejectAll,
    save: saveConsent,
    openPreferences: openConsentPreferences,
    closePreferences: closeConsentPreferences,
  }
}
