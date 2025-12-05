import type { DesktopIcon } from '../schemas'
import { calculateGridConfig, type GridConfig, type GridPosition } from './grid-positioning'

export interface IconZoneMapping {
  iconId: string
  zoneIndex: number
  relativePosition: { x: number; y: number } // Position relative dans la zone (0-1)
}

/**
 * Calcule l'index de zone pour une position donnée
 */
export function calculateZoneIndex(
  position: { x: number; y: number },
  gridConfig: GridConfig
): number {
  const col = Math.floor((position.x - gridConfig.startX) / (gridConfig.cellWidth + gridConfig.gapX))
  const row = Math.floor((position.y - gridConfig.startY) / (gridConfig.cellHeight + gridConfig.gapY))
  
  // Clamp values pour éviter les index négatifs ou trop grands
  const clampedCol = Math.max(0, Math.min(col, gridConfig.cols - 1))
  const clampedRow = Math.max(0, Math.min(row, gridConfig.rows - 1))
  
  return clampedRow * gridConfig.cols + clampedCol
}

/**
 * Calcule la position relative d'une icône dans sa zone (0-1)
 */
export function calculateRelativePosition(
  absolutePosition: { x: number; y: number },
  zoneIndex: number,
  gridConfig: GridConfig
): { x: number; y: number } {
  const col = zoneIndex % gridConfig.cols
  const row = Math.floor(zoneIndex / gridConfig.cols)
  
  const zoneStartX = gridConfig.startX + col * (gridConfig.cellWidth + gridConfig.gapX)
  const zoneStartY = gridConfig.startY + row * (gridConfig.cellHeight + gridConfig.gapY)
  
  const relativeX = (absolutePosition.x - zoneStartX) / gridConfig.cellWidth
  const relativeY = (absolutePosition.y - zoneStartY) / gridConfig.cellHeight
  
  // Clamp entre 0 et 1
  return {
    x: Math.max(0, Math.min(1, relativeX)),
    y: Math.max(0, Math.min(1, relativeY))
  }
}

/**
 * Calcule la position absolue à partir de la zone et position relative
 */
export function calculateAbsolutePosition(
  zoneIndex: number,
  relativePosition: { x: number; y: number },
  gridConfig: GridConfig
): { x: number; y: number } {
  const col = zoneIndex % gridConfig.cols
  const row = Math.floor(zoneIndex / gridConfig.cols)
  
  const zoneStartX = gridConfig.startX + col * (gridConfig.cellWidth + gridConfig.gapX)
  const zoneStartY = gridConfig.startY + row * (gridConfig.cellHeight + gridConfig.gapY)
  
  return {
    x: zoneStartX + relativePosition.x * gridConfig.cellWidth,
    y: zoneStartY + relativePosition.y * gridConfig.cellHeight
  }
}

/**
 * Crée un mapping des icônes vers leurs zones
 */
export function createIconZoneMapping(icons: DesktopIcon[]): IconZoneMapping[] {
  const gridConfig = calculateGridConfig()
  
  return icons.map(icon => {
    const zoneIndex = calculateZoneIndex(icon.position, gridConfig)
    const relativePosition = calculateRelativePosition(icon.position, zoneIndex, gridConfig)
    
    return {
      iconId: icon.id,
      zoneIndex,
      relativePosition
    }
  })
}

/**
 * Recalcule les positions des icônes en maintenant leurs zones relatives
 */
export function recalculateIconPositions(
  iconMappings: IconZoneMapping[],
  newGridConfig?: GridConfig
): Array<{ iconId: string; position: { x: number; y: number } }> {
  const gridConfig = newGridConfig || calculateGridConfig()
  
  return iconMappings.map(mapping => {
    // Si la zone n'existe plus dans la nouvelle grille, utiliser une zone par défaut
    const maxZoneIndex = gridConfig.cols * gridConfig.rows - 1
    const safeZoneIndex = Math.min(mapping.zoneIndex, maxZoneIndex)
    
    const newPosition = calculateAbsolutePosition(
      safeZoneIndex,
      mapping.relativePosition,
      gridConfig
    )
    
    return {
      iconId: mapping.iconId,
      position: newPosition
    }
  })
}

/**
 * Distribue automatiquement les icônes dans les zones disponibles
 */
export function distributeIconsInZones(iconCount: number): IconZoneMapping[] {
  const gridConfig = calculateGridConfig()
  const totalZones = gridConfig.cols * gridConfig.rows
  
  return Array.from({ length: iconCount }, (_, index) => ({
    iconId: `icon-${index}`,
    zoneIndex: index % totalZones, // Distribution cyclique si plus d'icônes que de zones
    relativePosition: { x: 0, y: 0 } // Position en haut à gauche de la cellule (le flex center s'occupe du centrage)
  }))
}