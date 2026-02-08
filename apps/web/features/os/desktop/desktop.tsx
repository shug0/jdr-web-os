'use client'

import { useRef, useState, useEffect } from 'react'
import { cn } from '@workspace/ui/lib/utils'
import type { DesktopProps } from '../schemas'
import { DesktopIconComponent } from './desktop-icon'
import { IconGroup } from './icon-group'
import { useWallpaperRotation } from '../hooks/use-wallpaper-rotation'
import { useOSStore } from '../stores/os-store'
import { organizeIconsIntoGroups } from '../utils/icon-groups'

export function Desktop({
  icons,
  onIconDoubleClick,
  onIconMove,
  onContextMenu
}: DesktopProps) {
  const desktopRef = useRef<HTMLDivElement>(null)
  const debugMode = useOSStore(state => state.system.debugMode)
  
  // Organiser les icônes en groupes - version simplifiée
  const { groups, aboutIcon } = organizeIconsIntoGroups()
  
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
          
          {/* Desktop Content avec layout CSS simple */}
          <div className="w-full h-full p-3 sm:p-4 flex flex-col">
            
            {/* Section du haut : Apps JDR à gauche, Wikis à droite */}
            <div className="flex flex-col lg:flex-row justify-between items-start gap-4 sm:gap-6 mb-4 sm:mb-6">
              
              {/* Apps JDR à gauche */}
              <div className="flex-shrink-0">
                {groups[0] && (
                  <IconGroup
                    key={groups[0].id}
                    title={groups[0].title}
                    icons={groups[0].icons}
                    onIconDoubleClick={onIconDoubleClick}
                    onIconMove={onIconMove}
                  />
                )}
              </div>
              
              {/* Groupes Wiki à droite */}
              <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4 lg:gap-6">
                {groups[1] && (
                  <IconGroup
                    key={groups[1].id}
                    title={groups[1].title}
                    icons={groups[1].icons}
                    onIconDoubleClick={onIconDoubleClick}
                    onIconMove={onIconMove}
                  />
                )}
                {groups[2] && (
                  <IconGroup
                    key={groups[2].id}
                    title={groups[2].title}
                    icons={groups[2].icons}
                    onIconDoubleClick={onIconDoubleClick}
                    onIconMove={onIconMove}
                  />
                )}
              </div>
              
            </div>
            
            {/* Spacer pour pousser "À propos" en bas */}
            <div className="flex-1" />
            
            {/* À propos en bas à gauche */}
            <div className="self-start">
              <button
                className={cn(
                  "cursor-pointer select-none bg-transparent",
                  "flex flex-col items-center justify-start",
                  "rounded-lg p-1",
                  "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                  "hover:bg-white/10 transition-colors duration-200",
                  "active:bg-white/20"
                )}
                onClick={() => onIconDoubleClick(aboutIcon.appId)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    onIconDoubleClick(aboutIcon.appId)
                  }
                }}
                aria-label={`Ouvrir ${aboutIcon.label}`}
                type="button"
              >
                {/* Zone fixe pour l'image */}
                <div className="mb-1 sm:mb-2">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 flex items-center justify-center">
                    {aboutIcon.icon ? (
                      <img
                        src={aboutIcon.icon}
                        alt=""
                        className="drop-shadow-lg pixel-art rounded-md w-full h-full object-contain"
                        style={{ 
                          imageRendering: 'pixelated'
                        }}
                        draggable={false}
                        aria-hidden="true"
                      />
                    ) : (
                      <div className="bg-secondary rounded drop-shadow-lg flex items-center justify-center w-full h-full">
                        <span className="text-xs sm:text-sm font-mono text-muted-foreground">APP</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Label */}
                <div className={cn(
                  "text-xs sm:text-sm font-medium text-white text-center",
                  "px-1.5 py-0.5 sm:px-2 sm:py-1",
                  "bg-black/50 backdrop-blur-sm",
                  "rounded-md shadow-md",
                  "leading-tight whitespace-nowrap"
                )}>
                  {aboutIcon.label}
                </div>
              </button>
            </div>
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