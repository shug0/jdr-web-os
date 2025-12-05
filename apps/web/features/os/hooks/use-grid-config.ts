import { useState, useEffect } from 'react'
import { calculateGridConfig, type GridConfig } from '../utils/grid-positioning'

/**
 * Compare deux configurations de grille pour éviter les mises à jour inutiles
 */
function areGridConfigsEqual(a: GridConfig, b: GridConfig): boolean {
  return (
    a.cols === b.cols &&
    a.rows === b.rows &&
    a.cellWidth === b.cellWidth &&
    a.cellHeight === b.cellHeight &&
    a.startX === b.startX &&
    a.startY === b.startY &&
    a.gapX === b.gapX &&
    a.gapY === b.gapY
  )
}

/**
 * Hook pour obtenir la configuration de grille avec mise à jour automatique
 */
export function useGridConfig() {
  const [gridConfig, setGridConfig] = useState<GridConfig>(() => calculateGridConfig())

  useEffect(() => {
    if (typeof window === 'undefined') return

    const updateGridConfig = () => {
      const newConfig = calculateGridConfig()
      setGridConfig(prevConfig => {
        // Ne mettre à jour que si la configuration a réellement changé
        if (areGridConfigsEqual(prevConfig, newConfig)) {
          return prevConfig // Garder la même référence
        }
        return newConfig
      })
    }

    // Mettre à jour la config lors du resize uniquement
    let resizeTimeout: NodeJS.Timeout
    const debouncedUpdate = () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(updateGridConfig, 100)
    }

    window.addEventListener('resize', debouncedUpdate)

    return () => {
      window.removeEventListener('resize', debouncedUpdate)
      clearTimeout(resizeTimeout)
    }
  }, [])

  return gridConfig
}