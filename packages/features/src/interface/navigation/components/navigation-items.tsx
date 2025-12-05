"use client";

import { Button } from '@workspace/ui/components/button';
import { useAppConfig } from '../hooks/use-app-config';
import { usePathnameAdaptive } from '../hooks/use-pathname';
import { AdaptiveLink } from './adaptive-link';
import type { AppKey } from '../types';

interface NavigationItemsProps {
  currentApp: AppKey;
}

export function NavigationItems({ currentApp }: NavigationItemsProps) {
  const appConfig = useAppConfig(currentApp);
  const pathname = usePathnameAdaptive();

  if (!appConfig.navItems.length) return null;

  return (
    <div className="flex items-center gap-1">
      {appConfig.navItems.map((item) => (
        <Button
          key={item.href}
          variant={pathname === item.href ? 'secondary' : 'ghost'}
          size="sm"
          asChild
        >
          <AdaptiveLink href={item.href}>{item.label}</AdaptiveLink>
        </Button>
      ))}
    </div>
  );
}