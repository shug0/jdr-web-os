'use client'

import { useEffect, useState } from 'react'
import { cn } from '@workspace/ui/lib/utils'
import { getTodaysWallpaper, getWallpaperUrl } from './wallpaper-utils'

interface WallpaperProps {
  className?: string
}

export function Wallpaper({ className }: WallpaperProps) {
  const [isClient, setIsClient] = useState(false)
  const [wallpaperUrl, setWallpaperUrl] = useState('')

  useEffect(() => {
    setIsClient(true)
    
    const todaysWallpaper = getTodaysWallpaper()
    setWallpaperUrl(getWallpaperUrl(todaysWallpaper))
  }, [])

  // Don't render with background until client-side
  if (!isClient) {
    return (
      <div 
        className={cn(
          "fixed inset-0 -z-10",
          className
        )}
      />
    )
  }

  return (
    <div 
      className={cn(
        "fixed inset-0 -z-10",
        className
      )}
      style={{
        backgroundImage: `url(${wallpaperUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    />
  )
}