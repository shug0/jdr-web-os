"use client";

import { ChevronDown, Calculator, Users, Home } from 'lucide-react';
import { Button } from '@workspace/ui/components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu';
import { useAllApps, useAppConfig } from '../hooks/use-app-config';
import { useNavigation } from '../hooks/use-navigation';
import type { AppKey } from '../types';

const iconMap = {
  Calculator,
  Users,
  Home,
};

interface AppSwitcherProps {
  currentApp: AppKey;
}

export function AppSwitcher({ currentApp }: AppSwitcherProps) {
  const allApps = useAllApps();
  const currentAppConfig = useAppConfig(currentApp);
  const { navigateToApp, isCurrentApp } = useNavigation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          Apps
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {allApps.map((app) => {
          const Icon = iconMap[app.icon as keyof typeof iconMap];
          const isCurrent = isCurrentApp(app.key as AppKey, currentApp);
          
          return (
            <DropdownMenuItem
              key={app.key}
              onClick={() => !isCurrent && navigateToApp(app.key as AppKey)}
              className={isCurrent ? 'bg-muted' : ''}
            >
              <Icon className="h-4 w-4 mr-2" />
              {app.name}
              {isCurrent && <span className="ml-auto text-xs text-muted-foreground">actuel</span>}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}