'use client'

import { cn } from '@workspace/ui/lib/utils'
import { Z_INDEX } from '@workspace/foundation/constants'
import { AppNavigation } from './app-navigation'
import { ThemeToggle } from './settings-menu'
import { Clock } from './clock'

interface TaskbarProps {
  currentApp?: string
  className?: string
}

export function Taskbar({ currentApp, className }: TaskbarProps) {
  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0",
        "h-10 bg-background/90 backdrop-blur-md border-b border-border",
        "flex items-center justify-between",
        "px-2 sm:px-4",
        "shadow-sm",
        className
      )}
      style={{ zIndex: Z_INDEX.TASKBAR }}
    >
      {/* Left Section - App Navigation */}
      <div className="flex items-center">
        <AppNavigation currentApp={currentApp} />
      </div>

      {/* Center Section - Logo */}
      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-md overflow-hidden bg-muted/30 hover:bg-black/10 transition-colors duration-200 cursor-pointer">
          <img
            src="/logo/cofe.png"
            alt="JDR Coffee"
            className="w-full h-full object-contain pixel-art"
            style={{ imageRendering: 'pixelated' }}
          />
        </div>
      </div>

      {/* Right Section - Theme Toggle + Clock */}
      <div className="flex items-center gap-2">
        <Clock />
        <ThemeToggle />
      </div>
    </header>
  )
}