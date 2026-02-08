'use client'

import { cn } from '@workspace/ui/lib/utils'
import type { DesktopIcon } from '../schemas'
import { DesktopIconComponent } from './desktop-icon'
import { DEFAULT_APPS } from '../utils/default-apps'

interface IconGroupProps {
  title: string
  icons: DesktopIcon[]
  onIconDoubleClick: (appId: string) => void
  onIconMove: (iconId: string, position: { x: number; y: number }) => void
}


export function IconGroup({ 
  title, 
  icons, 
  onIconDoubleClick, 
  onIconMove 
}: IconGroupProps) {
  if (icons.length === 0) return null

  return (
    <div className={cn(
      "rounded-xl overflow-hidden",
      "bg-black/20 backdrop-blur-sm", 
      "border border-white/10",
      "shadow-lg",
      "w-full md:w-fit h-fit" // Full width sur mobile, fit sur desktop
    )}>
        {/* Header du groupe - style fenêtre OS */}
        <div className={cn(
          "bg-black/30 backdrop-blur-sm",
          "border-b border-white/10",
          "pl-3 pr-2 py-1.5 sm:pl-4 sm:pr-3 sm:py-2"
        )}>
          <h3 className={cn(
            "text-xs sm:text-sm font-medium text-white text-left uppercase whitespace-nowrap"
          )}
          style={{ textShadow: '1px 1px 0px rgba(0,0,0,0.8)' }}>
            {title}
          </h3>
        </div>

        {/* Conteneur des icônes */}
        <div className={cn(
          "flex items-start justify-center gap-2 sm:gap-3 px-2 py-2 sm:px-3 sm:py-3"
        )}>
        {icons.map((icon) => {
          const app = DEFAULT_APPS.find(app => app.id === icon.appId)
          
          return (
            <div 
              key={icon.id} 
              className="relative cursor-pointer select-none flex flex-col items-center justify-start p-1 sm:p-2 rounded-lg hover:bg-white/10 transition-colors"
              onClick={() => {
                if (app?.externalUrl) {
                  // Ouvrir directement dans un nouvel onglet pour les apps externes
                  window.open(app.externalUrl, '_blank')
                } else {
                  // Comportement normal pour les apps internes
                  onIconDoubleClick(icon.appId)
                }
              }}
            >
            {/* Icône */}
            <div className="mb-1 sm:mb-2">
              <div className="w-8 h-8 sm:w-12 sm:h-12 flex items-center justify-center">
                {icon.icon ? (
                  <img
                    src={icon.icon}
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
              {icon.label}
            </div>
          </div>
        )})}
        </div>
    </div>
  )
}