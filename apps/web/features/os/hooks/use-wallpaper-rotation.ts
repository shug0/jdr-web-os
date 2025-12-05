'use client'

import { useState, useEffect, useCallback } from 'react'
import { getTodaysWallpaper, getAllWallpapers, getWallpaperUrl, type WallpaperMapping } from '../utils/wallpaper-mapping'

interface WallpaperRotationOptions {
  /** Intervalle de rotation en millisecondes (défaut: 30s) */
  rotationInterval?: number
  /** Démarrer la rotation automatiquement (défaut: true) */
  autoStart?: boolean
}

export function useWallpaperRotation({
  rotationInterval = 30000, // 30 secondes
  autoStart = true
}: WallpaperRotationOptions = {}) {
  // Start with first wallpaper to prevent hydration mismatch
  const allWallpapers = getAllWallpapers()
  const [currentWallpaper, setCurrentWallpaper] = useState<WallpaperMapping>(allWallpapers[0] as WallpaperMapping)
  const [isRotating, setIsRotating] = useState(autoStart)
  
  // Set today's wallpaper after mount to prevent hydration issues
  useEffect(() => {
    setCurrentWallpaper(getTodaysWallpaper())
  }, [])

  // Fonction pour passer au wallpaper suivant
  const nextWallpaper = useCallback(() => {
    setCurrentWallpaper(prev => {
      const currentIndex = allWallpapers.findIndex(wp => wp.id === prev.id)
      const nextIndex = (currentIndex + 1) % allWallpapers.length
      return allWallpapers[nextIndex] as WallpaperMapping // Safe because of modulo
    })
  }, [allWallpapers])

  // Fonction pour passer au wallpaper précédent
  const previousWallpaper = useCallback(() => {
    setCurrentWallpaper(prev => {
      const currentIndex = allWallpapers.findIndex(wp => wp.id === prev.id)
      const prevIndex = currentIndex === 0 ? allWallpapers.length - 1 : currentIndex - 1
      return allWallpapers[prevIndex] as WallpaperMapping // Safe because of calculation
    })
  }, [allWallpapers])

  // Fonction pour aller à un wallpaper spécifique
  const goToWallpaper = useCallback((wallpaper: WallpaperMapping) => {
    setCurrentWallpaper(wallpaper)
  }, [])

  // Fonction pour revenir au wallpaper du jour
  const goToTodaysWallpaper = useCallback(() => {
    setCurrentWallpaper(getTodaysWallpaper())
  }, [])

  // Contrôles de rotation
  const startRotation = useCallback(() => setIsRotating(true), [])
  const stopRotation = useCallback(() => setIsRotating(false), [])
  const toggleRotation = useCallback(() => setIsRotating(prev => !prev), [])

  // Gestion de la rotation automatique
  useEffect(() => {
    if (!isRotating) return

    const interval = setInterval(nextWallpaper, rotationInterval)
    return () => clearInterval(interval)
  }, [isRotating, rotationInterval, nextWallpaper])

  // Générer l'URL du wallpaper actuel
  const currentWallpaperUrl = getWallpaperUrl(currentWallpaper)

  return {
    currentWallpaper,
    currentWallpaperUrl,
    isRotating,
    nextWallpaper,
    previousWallpaper,
    goToWallpaper,
    goToTodaysWallpaper,
    startRotation,
    stopRotation,
    toggleRotation,
    allWallpapers
  }
}