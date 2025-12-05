'use client'

import { useEffect, useState } from 'react'
import { useSharedContext } from '../shared-context'

export type Theme = 'light' | 'dark' | 'system'

export function useTheme() {
  // Use shared context for theme state (synced via cookies/localStorage)
  const { theme, setTheme: setSharedTheme, isInitialized } = useSharedContext()

  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    if (!isInitialized) return

    const updateResolvedTheme = () => {
      if (theme === 'system') {
        if (typeof window !== 'undefined') {
          const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
          setResolvedTheme(systemTheme)
        }
      } else {
        setResolvedTheme(theme)
      }
    }

    updateResolvedTheme()

    if (theme === 'system' && typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      mediaQuery.addEventListener('change', updateResolvedTheme)
      return () => mediaQuery.removeEventListener('change', updateResolvedTheme)
    }
  }, [theme, isInitialized])

  useEffect(() => {
    // Apply theme to document (only on client)
    if (typeof window !== 'undefined' && isInitialized) {
      const root = document.documentElement
      
      if (resolvedTheme === 'dark') {
        root.classList.add('dark')
      } else {
        root.classList.remove('dark')
      }
    }
  }, [resolvedTheme, isInitialized])

  return {
    theme,
    resolvedTheme,
    setTheme: setSharedTheme,
    isInitialized,
  }
}