"use client";

import { Coffee, Menu } from 'lucide-react';
import { Button } from '@workspace/ui/components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu';
import { NavigationItems } from './navigation-items';
import { AppSwitcher } from './app-switcher';
import { ThemeToggle } from './theme-toggle';
import { AdaptiveLink } from './adaptive-link';
import { ClientOnlyLink } from './client-only-link';
import { useAppConfig } from '../hooks/use-app-config';
import { useEnvironment } from '../hooks/use-environment';
import type { AppKey } from '../types';

interface NavBarProps {
  currentApp: AppKey;
  actions?: React.ReactNode;
}

export function NavBar({ currentApp, actions }: NavBarProps) {
  const appConfig = useAppConfig(currentApp);
  const { getAppUrl } = useEnvironment();
  
  return (
    <header className="border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-12 items-center justify-between">
          {/* Logo et Navigation (left) */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="gap-2" asChild>
              <ClientOnlyLink 
                fallbackHref="https://os.jdr.coffee"
                getClientHref={() => getAppUrl('web')}
                className="flex items-center gap-2"
              >
                <Coffee className="h-4 w-4" />
                <span className="font-medium">jdr.coffee</span>
              </ClientOnlyLink>
            </Button>
            <NavigationItems currentApp={currentApp} />
          </div>

          {/* Nom de l'app (center) */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <span className="font-medium text-sm text-muted-foreground">
              {appConfig.name}
            </span>
          </div>

          {/* Actions (right) */}
          <div className="flex items-center gap-2">
            {actions}
            <ThemeToggle />
            <AppSwitcher currentApp={currentApp} />
            
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
        </div>
      </div>
    </header>
  );
}