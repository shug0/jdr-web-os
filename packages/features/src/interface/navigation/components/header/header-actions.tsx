'use client'

import { cn } from '@workspace/ui/lib/utils'

interface HeaderActionsProps {
  children?: React.ReactNode
  centered?: boolean
  className?: string
}

export function HeaderActions({ children, centered = false, className }: HeaderActionsProps) {
  if (!children) return null
  
  return (
    <div className={cn(
      "flex items-center gap-2",
      centered && "absolute left-1/2 transform -translate-x-1/2",
      className
    )}>
      {children}
    </div>
  )
}