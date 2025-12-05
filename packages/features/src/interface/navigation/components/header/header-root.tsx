'use client'

import { cn } from '@workspace/ui/lib/utils'
import type { AppKey } from '../../types'

interface HeaderRootProps {
  children: React.ReactNode
  currentApp: AppKey
  className?: string
}

export function HeaderRoot({ children, currentApp, className }: HeaderRootProps) {
  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 h-10 bg-background/90 backdrop-blur-md border-b border-border",
        "flex items-center justify-between px-2 sm:px-4 shadow-sm z-[9999]",
        className
      )}
      data-current-app={currentApp}
    >
      {children}
    </header>
  )
}