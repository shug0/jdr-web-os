'use client'

import { useWallpaperContext, type WallpaperContextType } from './wallpaper-provider'

export function useWallpaper(): WallpaperContextType {
  return useWallpaperContext()
}