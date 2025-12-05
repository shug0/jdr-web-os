'use client'

import { cn } from '@workspace/ui/lib/utils'
import { NavigationItems } from '../navigation-items'
import type { AppKey } from '../../types'

interface HeaderNavigationProps {
  currentApp?: AppKey
  className?: string
}

export function HeaderNavigation({ currentApp, className }: HeaderNavigationProps) {
  if (!currentApp) return null
  
  return (
    <div className={cn("flex items-center", className)}>
      <NavigationItems currentApp={currentApp} />
    </div>
  )
}