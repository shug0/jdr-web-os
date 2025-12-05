'use client'

import { useRef, useState, useEffect } from 'react'
import { cn } from '@workspace/ui/lib/utils'
import type { DesktopProps } from '../schemas'
import { DesktopIconComponent } from './desktop-icon'
import { useWallpaperRotation } from '../hooks/use-wallpaper-rotation'
import { generateDebugGridCells } from '../utils/grid-positioning'
import { useOSStore } from '../stores/os-store'

export function Desktop({
  icons,
  onIconDoubleClick,
  onIconMove,
  onContextMenu
}: DesktopProps) {
  const desktopRef = useRef<HTMLDivElement>(null)
  const debugMode = useOSStore(state => state.system.debugMode)
  
  // Système de rotation des wallpapers (wallpaper du jour fixe)
  const { currentWallpaperUrl, isRotating, toggleRotation } = useWallpaperRotation({
    rotationInterval: 30000, // 30 secondes
    autoStart: false // Désactivé pour garder le wallpaper du jour
  })
  
  // Debug controls for noise
  const [noiseIntensity, setNoiseIntensity] = useState(3)
  const [baseFrequency, setBaseFrequency] = useState(0.3)
  const [numOctaves, setNumOctaves] = useState(4)
  const [blendMode, setBlendMode] = useState<string>('overlay')
  const [showDebug, setShowDebug] = useState(false)
  
  // Debug grid - uniquement côté client pour éviter l'hydratation mismatch
  const [isClient, setIsClient] = useState(false)
  const debugGridCells = (debugMode && isClient) ? generateDebugGridCells() : []
  
  // S'assurer qu'on est côté client
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Coffee color palette
  const coffeeColors = [
    '#f7e9e3', // Crème claire
    '#e8bba0', // Beige rosé
    '#ca9169', // Caramel
    '#BA9D8A', // Café au lait (actuel)
    '#9b6f4f', // Moka
    '#6F4E37', // Café noir
    '#463020', // Expresso
    '#20140c'  // Café très foncé
  ]

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    onContextMenu({ x: e.clientX, y: e.clientY })
  }

  const handleDesktopClick = () => {
    // Close any open context menus when clicking on empty desktop
  }

  // Generate noise SVG as data URL
  const generateNoiseSVG = () => {
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'>
      <defs>
        <filter id='noise'>
          <feTurbulence type='fractalNoise' baseFrequency='${baseFrequency}' numOctaves='${numOctaves}' stitchTiles='stitch'/>
        </filter>
      </defs>
      <rect width='100%' height='100%' fill='white' filter='url(#noise)'/>
    </svg>`
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
  }

  return (
    <>
      <main
        ref={desktopRef}
        className={cn(
          "fixed top-0 left-0 w-screen h-screen overflow-hidden",
          "select-none transition-opacity duration-500"
        )}
        style={{
          backgroundImage: `url("${currentWallpaperUrl}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          touchAction: 'manipulation' // Better touch performance
        }}
        onContextMenu={handleContextMenu}
        onClick={handleDesktopClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleDesktopClick()
          }
        }}
        aria-label="Bureau"
      >
        {/* Subtle texture overlay for depth */}
        <div 
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
          style={{
            backgroundImage: `url("${generateNoiseSVG()}")`,
            backgroundSize: '200px 200px',
            backgroundRepeat: 'repeat',
            opacity: noiseIntensity / 100,
            mixBlendMode: blendMode as React.CSSProperties['mixBlendMode']
          }}
        />

        {/* Desktop Content with top bar offset */}
        <div className="absolute top-10 left-0 w-full" style={{ height: 'calc(100vh - 2.5rem)' }}>
          
          {/* Debug Grid Visualization */}
          {debugMode && (
            <div className="absolute inset-0 pointer-events-none z-10">
              {debugGridCells.map((cell, index) => (
                <div
                  key={`debug-cell-${cell.x}-${cell.y}-${index}`}
                  className="absolute border-2 border-green-500 opacity-30"
                  style={{
                    left: `${cell.x}px`,
                    top: `${cell.y}px`,
                    width: `${cell.width}px`,
                    height: `${cell.height}px`
                  }}
                />
              ))}
            </div>
          )}
          
          {/* Desktop Icons */}
          <div className="relative w-full h-full">
        {icons.map((icon) => (
          <DesktopIconComponent
            key={icon.id}
            icon={icon}
            onDoubleClick={() => onIconDoubleClick(icon.appId)}
            onMove={(position) => onIconMove(icon.id, position)}
          />
        ))}
          </div>

          {/* Wallpaper Credit */}
          <div className="absolute bottom-4 right-4 text-xs text-white/70 hover:text-white/90 transition-colors">
            <a
              href="https://8pxl.co/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              Wallpapers by Jubilee
            </a>
          </div>
        </div>
      </main>

    </>
  )
}