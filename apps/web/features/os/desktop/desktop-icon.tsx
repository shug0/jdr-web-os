'use client'

import { useState } from 'react'
import { cn } from '@workspace/ui/lib/utils'
import type { DesktopIcon } from '../schemas'
import { useGridConfig } from '../hooks/use-grid-config'
import { useOSStore } from '../stores/os-store'

interface DesktopIconProps {
  icon: DesktopIcon
  onDoubleClick: () => void
  onMove: (position: { x: number; y: number }) => void
}

export function DesktopIconComponent({ icon, onDoubleClick, onMove }: DesktopIconProps) {
  const gridConfig = useGridConfig()
  const debugMode = useOSStore(state => state.system.debugMode)
  const handleClick = () => {
    onDoubleClick() // Single click opens app
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onDoubleClick()
    }
  }

  // Render app icon (image or fallback)
  const renderIcon = () => {
    if (icon.icon) {
      return (
        <img
          src={icon.icon}
          alt=""
          className={cn(
            "drop-shadow-lg pixel-art",
            debugMode && "border-2 border-red-500"
          )}
          style={{ 
            imageRendering: 'pixelated',
            width: '56px',
            height: '56px',
            objectFit: 'contain'
          }}
          draggable={false}
          aria-hidden="true"
        />
      )
    }
    
    // Fallback to simple div if no icon
    return (
      <div 
        className={cn(
          "bg-secondary rounded drop-shadow-lg flex items-center justify-center",
          debugMode && "border-2 border-red-500"
        )}
        style={{ width: '56px', height: '56px' }}
      >
        <span className="text-xs font-mono text-muted-foreground">APP</span>
      </div>
    )
  }

  return (
    <button
      className={cn(
        "absolute cursor-pointer select-none bg-transparent",
        "flex flex-col items-center justify-start",
        "rounded-lg p-1",
        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        "hover:bg-white/10 transition-colors duration-200",
        "active:bg-white/20",
        debugMode && "border-2 border-purple-500"
      )}
      style={{
        left: `${icon.position.x}px`,
        top: `${icon.position.y}px`,
        width: `${gridConfig.cellWidth}px`,
        height: `${gridConfig.cellHeight}px`
      }}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-label={`Ouvrir ${icon.label}`}
      type="button"
    >
      {/* Zone fixe pour l'image */}
      <div 
        className={cn(
          "flex items-center justify-center",
          debugMode && "border-2 border-blue-500"
        )}
        style={{ 
          width: '60px', 
          height: '60px' 
        }}
      >
        {renderIcon()}
      </div>

      {/* Espacement fixe entre l'icône et le texte */}
      <div style={{ height: '8px' }} />

      {/* Zone pour le texte avec position fixe sous l'icône */}
      <div className="flex items-center justify-center">
        {/* Icon Label with Badge Effect */}
        <div
          className={cn(
            "text-sm font-medium text-white text-center",
            "px-2 py-1.5",
            "bg-black/70 backdrop-blur-sm",
            "rounded-full shadow-lg",
            "leading-tight max-w-full",
            debugMode && "border-2 border-yellow-500"
          )}
          style={{ 
            fontSize: '12px',
            lineHeight: '1.2',
            wordWrap: 'break-word',
            hyphens: 'auto',
            textShadow: '0 1px 2px rgba(0,0,0,0.9)'
          }}
        >
          {icon.label}
        </div>
      </div>
    </button>
  )
}