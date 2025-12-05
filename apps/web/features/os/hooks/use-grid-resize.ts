import { useEffect } from 'react'
import { useGridZonePersistence } from './use-grid-zone-persistence'

/**
 * Hook qui gère la redistribution des icônes lors du resize de la fenêtre
 * Utilise le système de zones pour maintenir les positions relatives
 */
export function useGridResize() {
  const { recalculateAllPositions } = useGridZonePersistence()

  useEffect(() => {
    const handleResize = () => {
      // Recalculer les positions en maintenant les zones relatives
      recalculateAllPositions()
    }

    // Debounce le resize pour éviter trop de recalculs
    let resizeTimeout: NodeJS.Timeout
    const debouncedResize = () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(handleResize, 200)
    }

    window.addEventListener('resize', debouncedResize)
    return () => {
      window.removeEventListener('resize', debouncedResize)
      clearTimeout(resizeTimeout)
    }
  }, [recalculateAllPositions])
}