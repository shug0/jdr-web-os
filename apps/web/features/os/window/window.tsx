'use client'

import { useRef, useCallback, useState, useEffect } from 'react'
import { Button } from '@workspace/ui/components/button'
import { cn } from '@workspace/ui/lib/utils'
import type { WindowInstance } from '../schemas'
import { Square, X, Maximize2 } from 'lucide-react'
import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { useOSStore } from '../stores/os-store'
import { useMobile } from '../hooks/use-mobile'

export function Window({
  window: windowInstance,
  children
}: { window: WindowInstance; children: React.ReactNode }) {
  // Store actions
  const { 
    closeWindow, 
    maximizeWindow, 
    focusWindow,
    moveWindow,
    resizeWindow 
  } = useOSStore()
  
  const isMobile = useMobile()
  const windowRef = useRef<HTMLDivElement>(null)
  
  // Resize state (declared before useDraggable)
  const [isResizing, setIsResizing] = useState(false)
  const [resizeDirection, setResizeDirection] = useState<string>('')
  const [resizeStart, setResizeStart] = useState({ 
    width: 0, height: 0, x: 0, y: 0, posX: 0, posY: 0 
  })
  const [hoveredEdge, setHoveredEdge] = useState<string>('')
  const resizeThrottleRef = useRef<number | null>(null)
  
  // Resize constraints helper
  const getResizeConstraints = useCallback(() => {
    const minWidth = 300
    const minHeight = 200
    const maxWidth = Math.min(window.innerWidth - 40, 1400)
    const maxHeight = Math.min(window.innerHeight - 80, 1000)
    return { minWidth, minHeight, maxWidth, maxHeight }
  }, [])
  
  // @dnd-kit draggable setup
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging
  } = useDraggable({
    id: windowInstance.id,
    disabled: windowInstance.isMaximized || isMobile || isResizing // Disable drag when maximized, on mobile, or while resizing
  })

  // Handle window focus on click
  const handleWindowClick = useCallback(() => {
    focusWindow(windowInstance.id)
  }, [focusWindow, windowInstance.id])
  
  // Clear hover state when dragging starts
  useEffect(() => {
    if (isDragging) {
      setHoveredEdge('')
    }
  }, [isDragging])
  
  // Handle drag transform
  const dragStyle = transform ? {
    transform: CSS.Translate.toString(transform)
  } : undefined

  // Additional resize functionality
  
  // Handle resize mouse/touch down
  const handleResizeStart = useCallback((e: React.MouseEvent | React.TouchEvent, direction: string) => {
    e.preventDefault()
    e.stopPropagation()
    
    setIsResizing(true)
    setResizeDirection(direction)
    setHoveredEdge('') // Clear hover state when starting resize
    focusWindow(windowInstance.id)
    
    const clientX = 'touches' in e ? e.touches[0]?.clientX ?? 0 : e.clientX
    const clientY = 'touches' in e ? e.touches[0]?.clientY ?? 0 : e.clientY
    
    setResizeStart({
      width: windowInstance.size.width,
      height: windowInstance.size.height,
      x: clientX,
      y: clientY,
      posX: windowInstance.position.x,
      posY: windowInstance.position.y
    })
  }, [windowInstance.size, windowInstance.position, focusWindow, windowInstance.id])
  
  // Handle resize mouse/touch move
  const handleResizeMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!isResizing || !resizeDirection) return
    
    const clientX = 'touches' in e ? e.touches[0]?.clientX ?? 0 : e.clientX
    const clientY = 'touches' in e ? e.touches[0]?.clientY ?? 0 : e.clientY
    
    // Fix for Firefox: check if coordinates are 0 (bug when mouse is released)
    if (!clientX || !clientY || (clientX === 0 && clientY === 0)) return
    
    // Throttle with requestAnimationFrame for smooth performance
    if (resizeThrottleRef.current) {
      cancelAnimationFrame(resizeThrottleRef.current)
    }
    
    resizeThrottleRef.current = requestAnimationFrame(() => {
      const deltaX = clientX - resizeStart.x
      const deltaY = clientY - resizeStart.y
      const constraints = getResizeConstraints()
      
      let newSize = { ...windowInstance.size }
      let newPosition = { ...windowInstance.position }
      
      // Resize calculation based on direction
      switch (resizeDirection) {
        case 'se': // bottom-right
          newSize = {
            width: Math.max(constraints.minWidth, Math.min(constraints.maxWidth, resizeStart.width + deltaX)),
            height: Math.max(constraints.minHeight, Math.min(constraints.maxHeight, resizeStart.height + deltaY))
          }
          break
        case 'e': // right
          newSize = {
            width: Math.max(constraints.minWidth, Math.min(constraints.maxWidth, resizeStart.width + deltaX)),
            height: resizeStart.height // Use stable reference from start
          }
          break
        case 's': // bottom
          newSize = {
            width: resizeStart.width, // Use stable reference from start
            height: Math.max(constraints.minHeight, Math.min(constraints.maxHeight, resizeStart.height + deltaY))
          }
          break
        case 'w': { // left
          const newWidthW = Math.max(constraints.minWidth, Math.min(constraints.maxWidth, resizeStart.width - deltaX))
          newSize = {
            width: newWidthW,
            height: resizeStart.height // Use stable reference from start
          }
          newPosition = {
            x: resizeStart.posX + resizeStart.width - newWidthW,
            y: resizeStart.posY // Use stable reference from start
          }
          break
        }
        default:
          return
      }
      
      // Update position if it changed (only for W resize direction)
      if (resizeDirection === 'w') {
        if (newPosition.x !== windowInstance.position.x || newPosition.y !== windowInstance.position.y) {
          moveWindow(windowInstance.id, newPosition)
        }
      }
      
      resizeWindow(windowInstance.id, newSize)
    })
  }, [isResizing, resizeStart, resizeDirection, windowInstance.size, windowInstance.position, resizeWindow, moveWindow, windowInstance.id, getResizeConstraints])
  
  // Handle resize end
  const handleResizeEnd = useCallback(() => {
    setIsResizing(false)
    setResizeDirection('')
    setHoveredEdge('') // Clear any remaining hover state
    if (resizeThrottleRef.current) {
      cancelAnimationFrame(resizeThrottleRef.current)
      resizeThrottleRef.current = null
    }
  }, [])
  
  // Event listeners for resize
  useEffect(() => {
    if (isResizing) {
      const handleMouseMove = (e: MouseEvent) => handleResizeMove(e)
      const handleMouseUp = () => handleResizeEnd()
      const handleTouchMove = (e: TouchEvent) => handleResizeMove(e)
      const handleTouchEnd = () => handleResizeEnd()
      
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.addEventListener('touchmove', handleTouchMove, { passive: false })
      document.addEventListener('touchend', handleTouchEnd)
      document.body.style.userSelect = 'none'
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
        document.removeEventListener('touchmove', handleTouchMove)
        document.removeEventListener('touchend', handleTouchEnd)
        document.body.style.userSelect = ''
      }
    }
  }, [isResizing, handleResizeMove, handleResizeEnd])



  const windowStyle = {
    ...dragStyle, // Apply drag transform
    ...(windowInstance.isMaximized
      ? {
          position: 'fixed' as const,
          top: 40,
          left: 0,
          width: '100vw',
          height: 'calc(100vh - 40px)',
          zIndex: windowInstance.zIndex
        }
      : {
          position: 'fixed' as const,
          left: windowInstance.position.x,
          top: windowInstance.position.y,
          width: windowInstance.size.width,
          height: windowInstance.size.height,
          zIndex: windowInstance.zIndex
        }
    )
  }

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "border border-border bg-card shadow-lg rounded-lg",
        "flex flex-col overflow-hidden",
        isDragging && "cursor-grabbing",
        "select-none backdrop-blur-sm",
        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        "transition-opacity duration-200",
        // Effet de bordure au hover des handles de resize
        hoveredEdge === 'e' && "border-r-primary/60",
        hoveredEdge === 's' && "border-b-primary/60", 
        hoveredEdge === 'w' && "border-l-primary/60",
        // Effet pendant le resize actif
        isResizing && resizeDirection === 'e' && "border-r-primary",
        isResizing && resizeDirection === 's' && "border-b-primary",
        isResizing && resizeDirection === 'w' && "border-l-primary"
      )}
      style={{
        ...windowStyle,
        touchAction: 'manipulation' // Critical for mobile touch
      }}
      onClick={handleWindowClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleWindowClick()
        }
      }}
      // biome-ignore lint/a11y/useSemanticElements: <dialog> element would break window functionality and semantics
      role="dialog"
      aria-label={`Fenêtre ${windowInstance.title}`}
      aria-modal="false"
    >
      {/* Window Header */}
      <div
        className={cn(
          "flex items-center justify-between",
          "bg-muted border-b border-border",
          "px-4 py-2 h-10 rounded-t-lg",
          !windowInstance.isMaximized && !isMobile && "cursor-grab active:cursor-grabbing",
          isMobile && "touch-manipulation" // Better touch on mobile
        )}
        {...(isResizing ? {} : attributes)}
        {...(isResizing ? {} : listeners)}
        style={{ touchAction: isResizing ? 'auto' : 'none' }} // Allow touch during resize, prevent during drag
      >
        <h3 className="text-sm font-medium text-foreground truncate">
          {windowInstance.title}
        </h3>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "h-6 w-6 p-0 rounded-full",
              "hover:bg-secondary transition-colors",
              "focus:ring-2 focus:ring-ring focus:ring-offset-2"
            )}
            onClick={(e) => {
              e.stopPropagation()
              maximizeWindow(windowInstance.id)
            }}
            aria-label={windowInstance.isMaximized 
              ? `Restaurer ${windowInstance.title}` 
              : `Maximiser ${windowInstance.title}`
            }
            title={windowInstance.isMaximized ? "Restaurer" : "Maximiser"}
          >
            {windowInstance.isMaximized ? (
              <Square className="h-3 w-3 text-foreground/70" aria-hidden="true" />
            ) : (
              <Maximize2 className="h-3 w-3 text-foreground/70" aria-hidden="true" />
            )}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "h-6 w-6 p-0 rounded-full",
              "hover:bg-destructive/20 hover:text-destructive transition-colors",
              "focus:ring-2 focus:ring-destructive focus:ring-offset-2"
            )}
            onClick={(e) => {
              e.stopPropagation()
              closeWindow(windowInstance.id)
            }}
            aria-label={`Fermer ${windowInstance.title}`}
            title="Fermer"
          >
            <X className="h-3 w-3 text-foreground/70 hover:text-destructive" aria-hidden="true" />
          </Button>
        </div>
      </div>

      {/* Window Content */}
      <div className="flex-1 overflow-auto bg-background relative">
        {children}
        
        {/* 
          CRITICAL: Overlay pour résoudre les conflits iframe/resize
          
          Problème résolu : Les fenêtres contenant des iframes (contrairement aux fenêtres 
          avec du contenu statique) interceptent les événements de souris, empêchant le 
          resize de fonctionner correctement.
          
          Solution : Cet overlay transparent est affiché uniquement pendant le resize.
          Il couvre entièrement le contenu de la fenêtre (y compris les iframes) et 
          empêche l'interception des événements mouse/touch par les éléments enfants.
          
          Fonctionnement :
          - z-index élevé (z-50) pour être au-dessus du contenu
          - bg-transparent pour rester invisible
          - Curseur approprié selon la direction du resize
          - Activé seulement pendant isResizing
          
          Sans cet overlay, les iframes capturent les événements mousemove/mouseup
          et cassent la fonctionnalité de resize.
        */}
        {isResizing && (
          <div 
            className="absolute inset-0 z-50 bg-transparent"
            style={{ 
              cursor: resizeDirection === 'e' ? 'e-resize' : 
                     resizeDirection === 's' ? 's-resize' :
                     resizeDirection === 'w' ? 'w-resize' :
                     resizeDirection === 'se' ? 'se-resize' : 'default'
            }}
          />
        )}
      </div>

      {/* Resize Handles */}
      {windowInstance.isResizable && !windowInstance.isMaximized && (
        <>
          {/* Bottom-right corner handle (primary handle) */}
          <div
            className={cn(
              "absolute bottom-0 right-0 cursor-se-resize",
              "bg-muted/30 hover:bg-primary/20 transition-colors duration-200",
              isMobile ? "w-8 h-8 rounded-tl-xl" : "w-4 h-4 rounded-tl-sm",
              isResizing && resizeDirection === 'se' && "bg-primary/30"
            )}
            style={{ touchAction: 'none' }}
            onMouseDown={(e) => handleResizeStart(e, 'se')}
            onTouchStart={(e) => handleResizeStart(e, 'se')}
          />
          
          {/* Edge handles - hidden on mobile for better UX */}
          {!isMobile && (
            <>
              {/* 
                NOTE: Design UX des handles de resize
                
                1. Pas de handle pour le bord haut (retiré car problématique avec iframes)
                2. Zone cliquable large (16px) pour l'accessibilité
                3. Aucun background visible pour éviter l'encombrement visuel
                4. Seule la bordure de la fenêtre change de couleur au hover/resize
                5. État hover géré via setHoveredEdge pour un contrôle précis
              */}
              
              {/* Right edge */}
              <div
                className="absolute right-0 top-4 bottom-4 w-4 cursor-e-resize"
                style={{ touchAction: 'none' }}
                onMouseDown={(e) => handleResizeStart(e, 'e')}
                onMouseEnter={() => !isDragging && setHoveredEdge('e')}
                onMouseLeave={() => setHoveredEdge('')}
              />
              
              {/* Bottom edge */}
              <div
                className="absolute bottom-0 left-4 right-4 h-4 cursor-s-resize"
                style={{ touchAction: 'none' }}
                onMouseDown={(e) => handleResizeStart(e, 's')}
                onMouseEnter={() => !isDragging && setHoveredEdge('s')}
                onMouseLeave={() => setHoveredEdge('')}
              />
              
              {/* Left edge */}
              <div
                className="absolute left-0 top-4 bottom-4 w-4 cursor-w-resize"
                style={{ touchAction: 'none' }}
                onMouseDown={(e) => handleResizeStart(e, 'w')}
                onMouseEnter={() => !isDragging && setHoveredEdge('w')}
                onMouseLeave={() => setHoveredEdge('')}
              />
              
            </>
          )}
        </>
      )}
    </div>
  )
}