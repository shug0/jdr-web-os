/**
 * Shared context system for JDR Coffee apps
 *
 * Provides cross-app state synchronization via:
 * - Cookies for persistence (.jdr.coffee or .jdr.local domain)
 * - postMessage API for real-time iframe synchronization
 *
 * @example
 * ```tsx
 * import { useSharedContext } from '@workspace/ui/shared-context'
 *
 * function MyComponent() {
 *   const { theme, setTheme } = useSharedContext()
 *
 *   return (
 *     <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
 *       Current theme: {theme}
 *     </button>
 *   )
 * }
 * ```
 */

// Main hook
export { useSharedContext } from './use-shared-context'

// Types
export type { SharedContext, Theme } from './types'
export { DEFAULT_SHARED_CONTEXT, SHARED_CONTEXT_KEY } from './types'

// Utilities (for advanced usage)
export {
  getSharedContext,
  setSharedContext,
  deleteSharedContext,
  isProduction,
  getCookieDomain,
  getCookie,
  setCookie,
  deleteCookie,
} from './cookie-utils'

export {
  notifyIframesOfContextChange,
  listenForParentContextUpdates,
} from './iframe-sync'
