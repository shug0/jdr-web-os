"use client";

import { Button } from '@workspace/ui/components/button';
import { Tooltip, TooltipTrigger, TooltipContent } from '@workspace/ui/components/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from '@workspace/ui/components/dropdown-menu';
import { Settings, ExternalLink } from 'lucide-react';
import { useAppConfig } from '../hooks/use-app-config';
import { useEnvironment } from '../hooks/use-environment';
import { AdaptiveLink } from './adaptive-link';
import { ClientOnlyLink } from './client-only-link';
import type { AppKey } from '../types';

interface OSNavBarProps {
  currentApp: AppKey;
  actions?: React.ReactNode;
}

export function OSNavBar({ currentApp, actions }: OSNavBarProps) {
  const appConfig = useAppConfig(currentApp);
  const { getAppUrl } = useEnvironment();
  
  const currentTime = new Date().toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  });

  const currentDate = new Date().toLocaleDateString('fr-FR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  });

  return (
    <header className="fixed top-0 left-0 right-0 h-10 bg-background/90 backdrop-blur-md border-b border-border flex items-center justify-between px-2 sm:px-4 shadow-sm z-[9999]">
      {/* App Name (left) */}
      <div className="flex items-center">
        <span className="text-sm font-medium text-foreground">
          {appConfig.name}
        </span>
      </div>

      {/* Logo & Actions (center) */}
      <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-4">
        <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-md overflow-hidden bg-muted/30">
          <ClientOnlyLink 
            fallbackHref="https://os.jdr.coffee"
            getClientHref={() => getAppUrl('web')}
            className="block w-full h-full"
          >
            <img
              src="/logo/cofe.png"
              alt="JDR Coffee"
              className="w-full h-full object-contain pixelated"
              style={{ imageRendering: 'pixelated' }}
            />
          </ClientOnlyLink>
        </div>
        
        {actions && (
          <div className="flex items-center gap-2">
            {actions}
          </div>
        )}
      </div>

      {/* System Tray (right) */}
      <div className="flex items-center gap-2 sm:gap-4">
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
    </header>
  );
}