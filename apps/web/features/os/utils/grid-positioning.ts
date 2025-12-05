/**
 * Calcul automatique de la grille des icônes du desktop
 */

export interface GridConfig {
  cols: number
  rows: number
  cellWidth: number
  cellHeight: number
  startX: number
  startY: number
  gapX: number
  gapY: number
}

export interface GridPosition {
  x: number
  y: number
  col: number
  row: number
}

/**
 * Calcule la configuration optimale de la grille basée sur la taille de l'écran
 * La grille occupe tout l'écran disponible
 */
export function calculateGridConfig(): GridConfig {
  if (typeof window === 'undefined') {
    // SSR fallback avec des cellules carrées
    const fallbackCellSize = 100
    return {
      cols: 4,
      rows: 6,
      cellWidth: fallbackCellSize,
      cellHeight: fallbackCellSize,
      startX: 20,
      startY: 20,
      gapX: 15,
      gapY: 15
    }
  }

  const screenWidth = window.innerWidth
  const screenHeight = window.innerHeight
  
  // Zone utilisable - prendre en compte que le Desktop a déjà un offset top-10
  // et une height de calc(100vh - 2.5rem) = calc(100vh - 40px)
  const taskbarHeight = 40 // Hauteur de la taskbar (h-10 = 40px)
  const margin = 20 // Marge uniforme sur tous les côtés
  
  const usableWidth = screenWidth - (margin * 2) // Marges gauche/droite
  const usableHeight = screenHeight - taskbarHeight - (margin * 2) // Taskbar + marges haut/bas
  
  // Taille minimale d'une cellule (pour pouvoir contenir une icône 64px + label)
  const minCellSize = 120 // Augmenté pour plus d'espace pour le texte
  const maxCellSize = 180 // Augmenté pour permettre des cellules plus grandes
  
  // Calcul du nombre optimal de colonnes et lignes
  const minCols = 3
  const maxCols = 12
  const minRows = 3
  const maxRows = 10
  
  // Gap minimum entre les cellules
  const minGap = 10
  
  // Pour des cellules carrées, on calcule la taille optimale basée sur les deux dimensions
  // On teste différentes tailles de cellules carrées pour trouver la meilleure
  let bestCellSize = minCellSize
  let bestCols = minCols
  let bestRows = minRows
  let bestUsage = 0 // Pourcentage d'utilisation de l'espace
  
  // Test de différentes tailles de cellules carrées
  for (let cellSize = minCellSize; cellSize <= maxCellSize; cellSize += 5) {
    // Calcul du nombre de colonnes qui rentrent
    const colsThatFit = Math.floor((usableWidth + minGap) / (cellSize + minGap))
    const cols = Math.max(minCols, Math.min(colsThatFit, maxCols))
    
    // Calcul du nombre de rangées qui rentrent
    const rowsThatFit = Math.floor((usableHeight + minGap) / (cellSize + minGap))
    const rows = Math.max(minRows, Math.min(rowsThatFit, maxRows))
    
    // Calcul de l'utilisation de l'espace (nombre total de cellules)
    const totalCells = cols * rows
    const usage = totalCells
    
    // Vérifier que cette configuration rentre vraiment
    const totalWidthNeeded = cols * cellSize + (cols - 1) * minGap
    const totalHeightNeeded = rows * cellSize + (rows - 1) * minGap
    
    if (totalWidthNeeded <= usableWidth && totalHeightNeeded <= usableHeight && usage > bestUsage) {
      bestUsage = usage
      bestCellSize = cellSize
      bestCols = cols
      bestRows = rows
    }
  }
  
  // Utiliser la meilleure configuration trouvée
  const cols = bestCols
  const rows = bestRows
  const cellSize = bestCellSize
  
  // Les cellules sont carrées : width = height = cellSize
  const cellWidth = cellSize
  const cellHeight = cellSize
  
  // Calcul des gaps pour répartir l'espace restant
  const totalCellsWidth = cols * cellWidth
  const totalCellsHeight = rows * cellHeight
  
  const gapX = cols > 1 ? (usableWidth - totalCellsWidth) / (cols - 1) : 0
  const gapY = rows > 1 ? (usableHeight - totalCellsHeight) / (rows - 1) : 0
  
  // S'assurer que les gaps ne sont pas trop grands (pour garder une grille cohérente)
  const maxGap = 30
  const finalGapX = Math.min(gapX, maxGap)
  const finalGapY = Math.min(gapY, maxGap)
  
  // Position de départ - même marge partout pour cohérence visuelle
  // Note: pas besoin d'ajouter taskbarHeight car le Desktop a déjà un offset top-10
  const startX = margin
  const startY = margin
  
  return {
    cols,
    rows,
    cellWidth,
    cellHeight,
    startX,
    startY,
    gapX: finalGapX,
    gapY: finalGapY
  }
}

/**
 * Calcule la position d'une icône dans la grille
 */
export function calculateIconPosition(
  index: number,
  gridConfig: GridConfig
): GridPosition {
  const col = index % gridConfig.cols
  const row = Math.floor(index / gridConfig.cols)
  
  const x = gridConfig.startX + col * (gridConfig.cellWidth + gridConfig.gapX)
  const y = gridConfig.startY + row * (gridConfig.cellHeight + gridConfig.gapY)
  
  return { x, y, col, row }
}

/**
 * Génère les positions pour toutes les icônes
 */
export function generateIconPositions(iconCount: number): GridPosition[] {
  const gridConfig = calculateGridConfig()
  const positions: GridPosition[] = []
  
  for (let i = 0; i < iconCount; i++) {
    positions.push(calculateIconPosition(i, gridConfig))
  }
  
  return positions
}

/**
 * Génère les cellules de debug pour visualiser la grille
 */
export function generateDebugGridCells(): Array<{
  x: number
  y: number
  width: number
  height: number
}> {
  const gridConfig = calculateGridConfig()
  const cells = []
  
  for (let row = 0; row < gridConfig.rows; row++) {
    for (let col = 0; col < gridConfig.cols; col++) {
      const x = gridConfig.startX + col * (gridConfig.cellWidth + gridConfig.gapX)
      const y = gridConfig.startY + row * (gridConfig.cellHeight + gridConfig.gapY)
      
      cells.push({
        x,
        y,
        width: gridConfig.cellWidth,
        height: gridConfig.cellHeight
      })
    }
  }
  
  return cells
}