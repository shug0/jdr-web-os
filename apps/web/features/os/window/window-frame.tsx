'use client'

import { Button } from '@workspace/ui/components/button'
import { cn } from '@workspace/ui/lib/utils'
import { Square, X, Maximize2, Minus } from 'lucide-react'

export interface WindowAction {
  icon: React.ComponentType<{ className?: string }>
  onClick: () => void
  label: string
  variant?: 'default' | 'destructive' | 'secondary'
}

interface WindowFrameProps {
  title: string
  icon?: string
  children: React.ReactNode
  className?: string
  
  // Window actions (buttons in header)
  onClose?: () => void
  onMinimize?: () => void  
  onMaximize?: () => void
  isMaximized?: boolean
  
  // Additional custom actions
  actions?: WindowAction[]
  
  // Style variants
  variant?: 'default' | 'standalone'
  showControls?: boolean
}

export function WindowFrame({
  title,
  icon,
  children,
  className,
  onClose,
  onMinimize,
  onMaximize,
  isMaximized = false,
  actions = [],
  variant = 'default',
  showControls = true
}: WindowFrameProps) {
  
  // Default action handlers
  const defaultActions: WindowAction[] = []
  
  // Add minimize button if handler provided
  if (onMinimize) {
    defaultActions.push({
      icon: Minus,
      onClick: onMinimize,
      label: 'Réduire',
      variant: 'secondary'
    })
  }
  
  // Add maximize/restore button if handler provided
  if (onMaximize) {
    defaultActions.push({
      icon: isMaximized ? Square : Maximize2,
      onClick: onMaximize,
      label: isMaximized ? 'Restaurer' : 'Maximiser',
      variant: 'secondary'
    })
  }
  
  // Add close button if handler provided
  if (onClose) {
    defaultActions.push({
      icon: X,
      onClick: onClose,
      label: 'Fermer',
      variant: 'destructive'
    })
  }
  
  // Combine default and custom actions
  const allActions = [...defaultActions, ...actions]
  
  return (
    <div className={cn(
      "border border-border bg-card shadow-lg rounded-lg",
      "flex flex-col overflow-hidden",
      "select-none backdrop-blur-sm",
      "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
      variant === 'standalone' && "shadow-2xl bg-background/95 h-full",
      className
    )}>
      {/* Window Header */}
      <div className={cn(
        "flex items-center justify-between",
        "bg-muted border-b border-border",
        "px-4 py-2 h-10 rounded-t-lg",
        variant === 'standalone' && "bg-muted/30"
      )}>
        {/* Title and icon */}
        <div className="flex items-center gap-2 min-w-0">
          {icon && (
            <img 
              src={icon} 
              alt={title}
              className="w-4 h-4 pixelated flex-shrink-0"
              style={{ imageRendering: 'pixelated' }}
            />
          )}
          <h3 className="text-sm font-medium text-foreground truncate">
            {title}
          </h3>
        </div>
        
        {/* Action buttons */}
        {showControls && (
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Custom actions (like macOS style controls) */}
            {actions.map((action, index) => (
              <button
                type="button"
                key={`custom-${action.label}-${index}`}
                onClick={(e) => {
                  e.stopPropagation()
                  action.onClick()
                }}
                aria-label={action.label}
                title={action.label}
                className="transition-opacity hover:opacity-80"
              >
                <action.icon />
              </button>
            ))}
            
            {/* Default actions (minimize, maximize, close) */}
            {defaultActions.map((action, index) => (
              <Button
                key={`default-${action.icon.name || action.label}-${index}`}
                variant="ghost"
                size="sm"
                className={cn(
                  "h-6 w-6 p-0 rounded-full",
                  "transition-colors focus:ring-2 focus:ring-ring focus:ring-offset-2",
                  action.variant === 'destructive' && 
                    "hover:bg-destructive/20 hover:text-destructive focus:ring-destructive",
                  action.variant === 'secondary' && 
                    "hover:bg-secondary",
                  action.variant === 'default' && 
                    "hover:bg-primary/20 hover:text-primary"
                )}
                onClick={(e) => {
                  e.stopPropagation()
                  action.onClick()
                }}
                aria-label={action.label}
                title={action.label}
              >
                <action.icon className={cn(
                  "h-3 w-3",
                  action.variant === 'destructive' ? 
                    "text-foreground/70 hover:text-destructive" : 
                    "text-foreground/70"
                )} />
              </Button>
            ))}
          </div>
        )}
      </div>

      {/* Window Content */}
      <div className="flex-1 overflow-auto bg-background">
        {children}
      </div>
    </div>
  )
}