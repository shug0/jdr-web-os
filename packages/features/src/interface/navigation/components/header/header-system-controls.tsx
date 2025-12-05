'use client'

import { Button } from '@workspace/ui/components/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from '@workspace/ui/components/dropdown-menu'
import { Settings, ExternalLink, Menu } from 'lucide-react'
import { cn } from '@workspace/ui/lib/utils'
import { ThemeToggle } from '../theme-toggle'
import { AppSwitcher } from '../app-switcher'
import { useEnvironment } from '../../hooks/use-environment'
import type { AppKey } from '../../types'

interface HeaderSystemControlsProps {
  variant?: 'os' | 'web'
  currentApp?: AppKey
  className?: string
}

export function HeaderSystemControls({ variant = 'os', currentApp, className }: HeaderSystemControlsProps) {
  const { getAppUrl } = useEnvironment()
  
  const currentTime = new Date().toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  })

  const currentDate = new Date().toLocaleDateString('fr-FR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  })
  
  if (variant === 'os') {
    // Version OS - Settings + Clock
    return (
      <div className={cn("flex items-center gap-2 sm:gap-4", className)}>
        {/* Settings Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 sm:h-7 sm:w-7 p-0 rounded-md hover:bg-secondary/40 transition-colors focus:ring-2 focus:ring-ring focus:ring-offset-2"
              aria-label="Menu paramètres"
            >
              <Settings className="w-3 h-3 sm:w-4 sm:h-4 text-foreground/70" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            side="bottom" 
            sideOffset={5}
            className="min-w-40"
          >
            <DropdownMenuItem asChild>
              <a
                href={getAppUrl('admin')}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center"
              >
                <Settings className="w-4 h-4 mr-2" />
                Administration
                <ExternalLink className="w-3 h-3 ml-auto opacity-50" />
              </a>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Clock */}
        <div className="px-2 sm:px-3 py-1 rounded-md hover:bg-secondary/30 transition-colors">
          {/* Desktop: Date and Time side by side */}
          <div className="hidden sm:flex items-center gap-3">
            <div className="text-xs text-muted-foreground">
              {currentDate}
            </div>
            <div className="text-xs font-medium text-foreground">
              {currentTime}
            </div>
          </div>
          
          {/* Mobile: Date and Time stacked */}
          <div className="sm:hidden flex flex-col items-center justify-center min-w-12">
            <div className="text-xs font-medium text-foreground leading-none">
              {currentTime}
            </div>
            <div className="text-xs text-muted-foreground leading-none">
              {currentDate}
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  // Version web - Theme + AppSwitcher + Mobile Menu
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <ThemeToggle />
      {currentApp && <AppSwitcher currentApp={currentApp} />}
      
      {/* Menu mobile */}
      <div className="md:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <Menu className="h-4 w-4" />
              <span className="sr-only">Menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {/* Menu items pour mobile si nécessaire */}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}