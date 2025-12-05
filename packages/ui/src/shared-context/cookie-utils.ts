/**
 * Cookie utilities for shared context
 *
 * Production: Uses cookies on .jdr.coffee domain for cross-app sharing
 * Development: Uses localStorage as fallback (cookies don't work across localhost ports)
 */

import type { SharedContext } from './types'
import { DEFAULT_SHARED_CONTEXT, SHARED_CONTEXT_KEY } from './types'
import { detectEnvironment } from '@workspace/foundation/config'

/**
 * Check if we're in production or local domain environment (for cookie sharing)
 * Returns true for:
 * - Production: .jdr.coffee domains
 * - Local testing: .jdr.local domains
 */
export function isProduction(): boolean {
  const env = detectEnvironment()
  return env === 'production' || env === 'local'
}

/**
 * Get the cookie domain based on current hostname
 */
export function getCookieDomain(): string {
  const env = detectEnvironment()

  switch (env) {
    case 'local':
      return '.jdr.local'
    case 'production':
      return '.jdr.coffee'
    default:
      return '.jdr.coffee'
  }
}

/**
 * Get shared context from cookie (production) or localStorage (development)
 */
export function getSharedContext(): SharedContext {
  if (typeof window === 'undefined') {
    return DEFAULT_SHARED_CONTEXT
  }

  try {
    if (isProduction()) {
      // Production: read from cookie
      const value = getCookie(SHARED_CONTEXT_KEY)
      if (value) {
        return JSON.parse(value)
      }
    } else {
      // Development: read from localStorage
      const value = localStorage.getItem(SHARED_CONTEXT_KEY)
      if (value) {
        return JSON.parse(value)
      }
    }
  } catch (error) {
    console.error('Error reading shared context:', error)
  }

  return DEFAULT_SHARED_CONTEXT
}

/**
 * Set shared context in cookie (production) or localStorage (development)
 */
export function setSharedContext(context: SharedContext): void {
  if (typeof window === 'undefined') return

  try {
    const value = JSON.stringify(context)

    if (isProduction()) {
      // Production/Local: set cookie with appropriate domain
      const domain = getCookieDomain()
      const isLocal = domain === '.jdr.local'

      setCookie(SHARED_CONTEXT_KEY, value, {
        domain,
        maxAge: 60 * 60 * 24 * 365, // 1 year
        path: '/',
        sameSite: 'lax',
        secure: !isLocal, // Only secure in production, not for .jdr.local
      })
    } else {
      // Development: set in localStorage
      localStorage.setItem(SHARED_CONTEXT_KEY, value)
    }
  } catch (error) {
    console.error('Error setting shared context:', error)
  }
}

/**
 * Delete shared context from cookie (production) or localStorage (development)
 */
export function deleteSharedContext(): void {
  if (typeof window === 'undefined') return

  try {
    if (isProduction()) {
      // Production/Local: delete cookie
      const domain = getCookieDomain()
      deleteCookie(SHARED_CONTEXT_KEY, { domain, path: '/' })
    } else {
      // Development: remove from localStorage
      localStorage.removeItem(SHARED_CONTEXT_KEY)
    }
  } catch (error) {
    console.error('Error deleting shared context:', error)
  }
}

// ============================================================================
// Cookie helpers (production only)
// ============================================================================

interface CookieOptions {
  domain?: string
  path?: string
  maxAge?: number
  expires?: Date
  secure?: boolean
  sameSite?: 'strict' | 'lax' | 'none'
}

/**
 * Get a cookie value by name
 */
export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null

  const cookies = document.cookie.split(';')
  for (const cookie of cookies) {
    const [key, value] = cookie.trim().split('=')
    if (key === name && value !== undefined) {
      return decodeURIComponent(value)
    }
  }
  return null
}

/**
 * Set a cookie with options
 */
export function setCookie(name: string, value: string, options: CookieOptions = {}): void {
  if (typeof document === 'undefined') return

  let cookieString = `${name}=${encodeURIComponent(value)}`

  if (options.domain) {
    cookieString += `; domain=${options.domain}`
  }

  if (options.path) {
    cookieString += `; path=${options.path}`
  }

  if (options.maxAge !== undefined) {
    cookieString += `; max-age=${options.maxAge}`
  }

  if (options.expires) {
    cookieString += `; expires=${options.expires.toUTCString()}`
  }

  if (options.secure) {
    cookieString += '; secure'
  }

  if (options.sameSite) {
    cookieString += `; samesite=${options.sameSite}`
  }

  document.cookie = cookieString
}

/**
 * Delete a cookie
 */
export function deleteCookie(name: string, options: Pick<CookieOptions, 'domain' | 'path'> = {}): void {
  if (typeof document === 'undefined') return

  setCookie(name, '', {
    ...options,
    maxAge: -1,
  })
}
