/**
 * Shared context types for JDR Coffee apps
 * This context is shared across all apps via cookies (production) or localStorage (development)
 */

export type Theme = 'light' | 'dark' | 'system'

/**
 * Shared context interface
 * This will be extended with more preferences in the future (universe, language, etc.)
 */
export interface SharedContext {
  /** Theme preference: light, dark, or system */
  theme: Theme
  // Future additions:
  // universe?: 'medieval' | 'scifi' | 'modern'
  // language?: 'fr' | 'en'
  // userId?: string
}

/**
 * Default shared context values
 */
export const DEFAULT_SHARED_CONTEXT: SharedContext = {
  theme: 'system',
}

/**
 * Cookie/Storage key for the shared context
 */
export const SHARED_CONTEXT_KEY = 'jdr-context'
