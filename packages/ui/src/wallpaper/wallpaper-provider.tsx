'use client'

import { createContext, useContext, type ReactNode } from 'react'

export interface WallpaperContextType {
  wallpaperUrl: string
}

const WallpaperContext = createContext<WallpaperContextType | undefined>(undefined)

interface WallpaperProviderProps {
  children: ReactNode
}

export function WallpaperProvider({ children }: WallpaperProviderProps) {
  // Get wallpaper URL based on environment
  const getWallpaperUrl = () => {
    if (typeof window === 'undefined') return ''
    
    const isDevelopment = 
      window.location.hostname === 'localhost' || 
      window.location.hostname === '127.0.0.1'
    
    if (isDevelopment) {
      return 'http://localhost:3000/wallpapers/1-desktop.png'
    }
      return 'https://os.jdr.coffee/wallpapers/1-desktop.png'
  }

  const wallpaperUrl = getWallpaperUrl()

  return (
    <WallpaperContext.Provider value={{ wallpaperUrl }}>
      {children}
    </WallpaperContext.Provider>
  )
}

export function useWallpaperContext() {
  const context = useContext(WallpaperContext)
  if (context === undefined) {
    throw new Error('useWallpaperContext must be used within a WallpaperProvider')
  }
  return context
}