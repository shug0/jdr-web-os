'use client'

import { cn } from '@workspace/ui/lib/utils'
import { useAppConfig } from '../../hooks/use-app-config'
import type { AppKey } from '../../types'

interface HeaderAppNameProps {
  currentApp?: AppKey
  position?: 'left' | 'center'
  className?: string
}

export function HeaderAppName({ currentApp, position = 'left', className }: HeaderAppNameProps) {
  const appConfig = useAppConfig(currentApp!)
  
  if (!currentApp) return null
  
  const baseClasses = "text-sm font-medium text-foreground"
  
  const positionClasses = {
    left: "",
    center: "absolute left-1/2 transform -translate-x-1/2"
  }
  
  return (
    <div className={cn(
      baseClasses,
      positionClasses[position],
      className
    )}>
      {appConfig.name}
    </div>
  )
}