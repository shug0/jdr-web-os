'use client'

import { Button } from '@workspace/ui/components/button'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuTrigger, 
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent
} from '@workspace/ui/components/dropdown-menu'
import { Settings, Sun, Moon, Monitor, Shield, Palette, ExternalLink } from 'lucide-react'
import { useThemeContext } from '../theme/theme-provider'
import { getAppUrl } from '@workspace/foundation/config'

export function ThemeToggle() {
  const { theme, setTheme } = useThemeContext()

  const openAdminApp = () => {
    const adminUrl = getAppUrl('admin')
    window.open(adminUrl, '_blank')
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 sm:h-7 sm:w-7 p-0 rounded-md hover:bg-black/10 transition-colors duration-200"
          aria-label="Paramètres"
        >
          <Settings className="w-3 h-3 sm:w-4 sm:h-4 text-foreground/70" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        side="bottom" 
        sideOffset={5}
        className="min-w-48"
        align="end"
      >
        
        {/* Theme Section */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="cursor-pointer">
            <Palette className="w-4 h-4 mr-2" />
            Thème
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem 
              onClick={() => setTheme('system')}
              className="cursor-pointer"
            >
              <Monitor className="w-4 h-4 mr-2" />
              Système
              {theme === 'system' && <span className="ml-auto text-xs text-blue-500">●</span>}
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setTheme('light')}
              className="cursor-pointer"
            >
              <Sun className="w-4 h-4 mr-2" />
              Clair
              {theme === 'light' && <span className="ml-auto text-xs text-blue-500">●</span>}
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setTheme('dark')}
              className="cursor-pointer"
            >
              <Moon className="w-4 h-4 mr-2" />
              Sombre
              {theme === 'dark' && <span className="ml-auto text-xs text-blue-500">●</span>}
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSeparator />
        
        {/* Admin Section */}
        <DropdownMenuItem 
          onClick={openAdminApp}
          className="cursor-pointer"
        >
          <Shield className="w-4 h-4 mr-2" />
          Administration
          <ExternalLink className="w-3 h-3 ml-auto text-muted-foreground" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}