/**
 * Utilitaires partagés pour la gestion des wallpapers
 * Logique centralisée utilisée par l'app Web et les apps standalone
 */

export interface WallpaperMapping {
  filename: string
  dayOfWeek: number
}

export const WALLPAPER_MAPPINGS: WallpaperMapping[] = [
  { filename: '1-desktop.png', dayOfWeek: 0 }, // Dimanche
  { filename: '2-desktop.png', dayOfWeek: 1 }, // Lundi
  { filename: '3-desktop.png', dayOfWeek: 2 }, // Mardi
  { filename: '4-desktop.png', dayOfWeek: 3 }, // Mercredi
  { filename: '5-desktop.png', dayOfWeek: 4 }, // Jeudi
  { filename: '6-desktop.png', dayOfWeek: 5 }, // Vendredi
  { filename: '7-desktop.png', dayOfWeek: 6 }  // Samedi
]

/**
 * Obtient le wallpaper du jour basé sur la date actuelle
 */
export function getTodaysWallpaper(): WallpaperMapping {
  const today = new Date()
  const dayOfWeek = today.getDay()
  const wallpaper = WALLPAPER_MAPPINGS[dayOfWeek]
  
  if (!wallpaper) {
    // Fallback au premier wallpaper si jamais il y a un problème
    const fallback = WALLPAPER_MAPPINGS[0]
    if (!fallback) {
      throw new Error('No wallpapers available')
    }
    return fallback
  }
  
  return wallpaper
}

/**
 * Obtient l'URL d'un wallpaper selon l'environnement
 */
export function getWallpaperUrl(wallpaper: WallpaperMapping): string {
  const isDevelopment = typeof window !== 'undefined' && 
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  
  return isDevelopment 
    ? `http://localhost:3000/wallpapers/${wallpaper.filename}`
    : `https://os.jdr.coffee/wallpapers/${wallpaper.filename}`
}