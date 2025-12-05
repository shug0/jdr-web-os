'use client'

/**
 * Main hook for accessing and updating shared context across JDR Coffee apps
 *
 * Uses cookies for persistence across all apps (.jdr.coffee or .jdr.local domain)
 * Uses postMessage API for real-time iframe synchronization
 */

import { useEffect, useState, useCallback } from 'react'
import type { SharedContext, Theme } from './types'
import { DEFAULT_SHARED_CONTEXT } from './types'
import { getSharedContext, setSharedContext } from './cookie-utils'
import { notifyIframesOfContextChange, listenForParentContextUpdates } from './iframe-sync'

/**
 * Hook for managing shared context across all JDR Coffee apps
 *
 * Features:
 * - Reads/writes cookies for persistence across all apps
 * - Synchronizes changes in real-time with iframes via postMessage
 * - Provides theme and future preferences (universe, language, etc.)
 *
 * @example
 * ```tsx
 * function ThemeToggle() {
 *   const { theme, setTheme } = useSharedContext()
 *   return (
 *     <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
 *       Toggle theme
 *     </button>
 *   )
 * }
 * ```
 */
export function useSharedContext() {
  const [context, setContext] = useState<SharedContext>(DEFAULT_SHARED_CONTEXT)
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize context from storage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return

    const savedContext = getSharedContext()
    setContext(savedContext)
    setIsInitialized(true)
  }, [])

  // Listen for context updates from parent window (if we're in an iframe)
  useEffect(() => {
    if (typeof window === 'undefined') return

    const cleanup = listenForParentContextUpdates((newContext) => {
      // Update local state only - don't trigger another update cycle
      setContext(newContext)
    })

    return cleanup
  }, [])

  // Update context and persist to storage
  const updateContext = useCallback((newContext: Partial<SharedContext>) => {
    setContext((prev) => {
      const updated = { ...prev, ...newContext }

      // Persist to cookie
      setSharedContext(updated)

      // Notify iframes of the change (if we're a parent window)
      notifyIframesOfContextChange(updated)

      return updated
    })
  }, [])

  // Convenience method for updating theme
  const setTheme = useCallback(
    (theme: Theme) => {
      updateContext({ theme })
    },
    [updateContext]
  )

  return {
    /** Current shared context */
    context,

    /** Whether the context has been initialized from storage */
    isInitialized,

    /** Current theme preference */
    theme: context.theme,

    /** Update the entire shared context */
    updateContext,

    /** Update just the theme preference */
    setTheme,

    // Future: add more convenience methods
    // setUniverse: (universe) => updateContext({ universe }),
    // setLanguage: (language) => updateContext({ language }),
  }
}
