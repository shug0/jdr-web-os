'use client'

import { Coffee } from 'lucide-react'
import { Button } from '@workspace/ui/components/button'
import { cn } from '@workspace/ui/lib/utils'
import { ClientOnlyLink } from '../client-only-link'
import { useEnvironment } from '../../hooks/use-environment'

interface HeaderLogoProps {
  variant?: 'os' | 'web'
  className?: string
}

export function HeaderLogo({ variant = 'os', className }: HeaderLogoProps) {
  const { getAppUrl } = useEnvironment()
  
  if (variant === 'os') {
    // Version OS - petit logo centré
    return (
      <div className={cn(
        "absolute left-1/2 transform -translate-x-1/2",
        "w-6 h-6 sm:w-7 sm:h-7 rounded-md overflow-hidden bg-muted/30",
        className
      )}>
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
    )
  }
  
  // Version web - logo avec texte
  return (
    <Button 
      variant="ghost" 
      size="sm" 
      className={cn("gap-2", className)} 
      asChild
    >
      <ClientOnlyLink
        fallbackHref="https://os.jdr.coffee"
        getClientHref={() => getAppUrl('web')}
        className="flex items-center gap-2"
      >
        <Coffee className="h-4 w-4" />
        <span className="font-medium">jdr.coffee</span>
      </ClientOnlyLink>
    </Button>
  )
}