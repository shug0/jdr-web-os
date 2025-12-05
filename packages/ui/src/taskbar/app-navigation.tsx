'use client'

import { Button } from '@workspace/ui/components/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from '@workspace/ui/components/dropdown-menu'
import { cn } from '@workspace/ui/lib/utils'
import { Menu, ExternalLink } from 'lucide-react'
import { getAppUrl, detectEnvironment, type AppId } from '@workspace/foundation/config'

interface AppNavigationProps {
  currentApp?: string
}

interface AppLink {
  id: AppId
  name: string
  icon: string
}

const APPS: readonly AppLink[] = [
  {
    id: 'web',
    name: 'Accueil',
    icon: '/logo/cofe.png'
  },
  {
    id: 'combien',
    name: 'Combien',
    icon: '/icons/pixel-fantasy/coins/coin_3.png'
  },
  {
    id: 'pnj',
    name: 'PNJ',
    icon: '/icons/pixel-fantasy/helmets/helmet_1.png'
  },
] as const

export function AppNavigation({ currentApp }: AppNavigationProps) {
  // Use centralized environment detection
  const appLinks = APPS.map(app => ({
    ...app,
    href: getAppUrl(app.id)
  }))
  
  const handleAppClick = (href: string) => {
    window.location.href = href
  }

  return (
    <>
      {/* Desktop App Links */}
      <div className="hidden sm:flex items-center gap-2">
        {appLinks.map((app) => (
          <Button
            key={app.id}
            variant="ghost"
            size="sm"
            onClick={() => handleAppClick(app.href)}
            className={cn(
              "h-7 px-3 text-xs font-medium hover:bg-black/10 transition-colors duration-200 cursor-pointer",
              currentApp === app.id && "bg-muted/50"
            )}
          >
            {app.name}
          </Button>
        ))}
      </div>

      {/* Mobile Applications Menu */}
      <div className="sm:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs font-medium hover:bg-black/10 transition-colors duration-200"
              aria-label="Menu Applications"
            >
              <Menu className="w-3 h-3 mr-1" />
              Apps
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            side="bottom" 
            sideOffset={5}
            className="min-w-48"
          >
            {appLinks.map((app) => (
              <DropdownMenuItem 
                key={app.id}
                onClick={() => handleAppClick(app.href)}
                className={cn(
                  "cursor-pointer",
                  currentApp === app.id && "bg-muted/50"
                )}
              >
                <img 
                  src={app.icon} 
                  alt={app.name} 
                  className="w-4 h-4 mr-3 pixelated"
                  style={{ imageRendering: 'pixelated' }}
                />
                {app.name}
                {currentApp !== app.id && <ExternalLink className="w-3 h-3 ml-auto opacity-50" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  )
}