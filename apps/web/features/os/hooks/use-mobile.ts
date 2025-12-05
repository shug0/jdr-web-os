'use client'

import { useState, useEffect } from 'react'

/**
 * Hook pour détecter si on est en mode mobile
 * Utilise le breakpoint 640px (sm:) pour la cohérence avec notre CSS
 */
export function useMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 640) // Breakpoint sm: 640px
    }

    // Check initial state
    checkIsMobile()

    // Listen for resize events
    window.addEventListener('resize', checkIsMobile)
    return () => window.removeEventListener('resize', checkIsMobile)
  }, [])

  return isMobile
}