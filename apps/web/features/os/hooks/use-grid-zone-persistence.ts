import { useEffect, useRef } from 'react'
import { useOSStore } from '../stores/os-store'
import { 
  createIconZoneMapping, 
  recalculateIconPositions,
  type IconZoneMapping
} from '../utils/grid-zone-mapping'

/**
 * Hook avancé pour gérer la persistance des zones d'icônes lors du resize
 * Maintient les icônes dans leurs zones relatives même quand la grille change
 */
export function useGridZonePersistence() {
  const { desktop, moveIcon } = useOSStore()
  const zoneMappingRef = useRef<IconZoneMapping[]>([])
  const isInitializedRef = useRef(false)

  // Créer le mapping initial des zones
  useEffect(() => {
    if (desktop.icons.length > 0 && !isInitializedRef.current) {
      zoneMappingRef.current = createIconZoneMapping(desktop.icons)
      isInitializedRef.current = true
    }
  }, [desktop.icons])

  // Mettre à jour le mapping quand les icônes bougent
  useEffect(() => {
    if (isInitializedRef.current && desktop.icons.length > 0) {
      // Mettre à jour le mapping avec les nouvelles positions
      zoneMappingRef.current = createIconZoneMapping(desktop.icons)
    }
  }, [desktop.icons])

  // Fonction pour recalculer toutes les positions selon la nouvelle grille
  const recalculateAllPositions = () => {
    if (zoneMappingRef.current.length === 0 || desktop.icons.length === 0) return

    const newPositions = recalculateIconPositions(zoneMappingRef.current)
    
    // Appliquer les nouvelles positions
    for (const { iconId, position } of newPositions) {
      const icon = desktop.icons.find(i => i.id === iconId)
      if (icon) {
        moveIcon(iconId, position)
      }
    }
  }

  return {
    recalculateAllPositions,
    zoneMappingRef: zoneMappingRef.current
  }
}