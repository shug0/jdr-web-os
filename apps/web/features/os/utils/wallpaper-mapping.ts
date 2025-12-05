/**
 * Mapping des wallpapers par jour de la semaine (cycle de 7 jours)
 * Garantit que tous les utilisateurs voient le même wallpaper le même jour
 *
 * Note: Utilise maintenant la logique partagée de @workspace/ui
 */

import { getTodaysWallpaper as getBasicTodaysWallpaper, WALLPAPER_MAPPINGS as BASIC_MAPPINGS } from '@workspace/ui/wallpaper'

export interface WallpaperMapping {
  id: string
  filename: string
  name: string
  dayOfWeek: number // 0 = Dimanche, 1 = Lundi, etc.
}

// Extension des mappings de base avec des IDs et noms pour l'app Web
export const WALLPAPER_MAPPINGS: WallpaperMapping[] = [
  { id: 'sunday', filename: '1-desktop.png', name: 'Dimanche - Mystère', dayOfWeek: 0 },
  { id: 'monday', filename: '2-desktop.png', name: 'Lundi - Réveil', dayOfWeek: 1 },
  { id: 'tuesday', filename: '3-desktop.png', name: 'Mardi - Aventure', dayOfWeek: 2 },
  { id: 'wednesday', filename: '4-desktop.png', name: 'Mercredi - Milieu', dayOfWeek: 3 },
  { id: 'thursday', filename: '5-desktop.png', name: 'Jeudi - Force', dayOfWeek: 4 },
  { id: 'friday', filename: '6-desktop.png', name: 'Vendredi - Liberté', dayOfWeek: 5 },
  { id: 'saturday', filename: '7-desktop.png', name: 'Samedi - Repos', dayOfWeek: 6 }
]

/**
 * Obtient le wallpaper du jour basé sur la logique partagée
 */
export function getTodaysWallpaper(): WallpaperMapping {
  const basicWallpaper = getBasicTodaysWallpaper()
  const extendedWallpaper = WALLPAPER_MAPPINGS.find(wp => wp.filename === basicWallpaper.filename)
  
  if (!extendedWallpaper) {
    // Fallback au premier wallpaper
    const fallback = WALLPAPER_MAPPINGS[0]
    if (!fallback) {
      throw new Error('No wallpapers available')
    }
    return fallback
  }
  
  return extendedWallpaper
}

/**
 * Obtient un wallpaper par son ID
 */
export function getWallpaperById(id: string): WallpaperMapping | undefined {
  return WALLPAPER_MAPPINGS.find(wp => wp.id === id)
}

/**
 * Obtient tous les wallpapers disponibles
 */
export function getAllWallpapers(): WallpaperMapping[] {
  return WALLPAPER_MAPPINGS
}

/**
 * Obtient l'URL complète d'un wallpaper
 */
export function getWallpaperUrl(wallpaper: WallpaperMapping): string {
  return `/wallpapers/${wallpaper.filename}`
}