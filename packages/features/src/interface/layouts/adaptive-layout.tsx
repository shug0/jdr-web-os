'use client'

import { Suspense, useEffect, useState } from 'react'
import { WindowLayout } from '@workspace/ui/layouts/window-layout'
import { MinimalLayout } from './minimal-layout'
import { StandaloneBrandLayout } from './standalone-brand-layout'

interface AdaptiveLayoutProps {
  children: React.ReactNode
  currentApp: string
  metadata?: {
    title?: string
    description?: string
    icons?: {
      icon?: string
      apple?: string
    }
    generator?: string
  }
  lang?: string
}

function AdaptiveLayoutContent({ 
  children, 
  currentApp, 
  metadata = {},
  lang = "fr"
}: AdaptiveLayoutProps) {
  const [searchParams, setSearchParams] = useState<URLSearchParams | null>(null)
  const [isClient, setIsClient] = useState(false)
  
  useEffect(() => {
    // Only access URLSearchParams on client side
    setSearchParams(new URLSearchParams(window.location.search))
    setIsClient(true)
  }, [])
  
  // Show loader until we've determined the context on client side
  if (!isClient) {
    return (
      <WindowLayout metadata={metadata} lang={lang}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-sm text-muted-foreground">Chargement...</div>
        </div>
      </WindowLayout>
    )
  }
  
  const isIframeMode = searchParams?.get('iframe') === 'true' || searchParams?.get('windowMode') === 'true'
  
  if (isIframeMode) {
    return <MinimalLayout metadata={metadata} lang={lang}>{children}</MinimalLayout>
  }
  
  return (
    <StandaloneBrandLayout currentApp={currentApp} metadata={metadata} lang={lang}>
      {children}
    </StandaloneBrandLayout>
  )
}

export function AdaptiveLayout(props: AdaptiveLayoutProps) {
  return (
    <Suspense fallback={
      <WindowLayout metadata={props.metadata} lang={props.lang}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-sm text-muted-foreground">Chargement...</div>
        </div>
      </WindowLayout>
    }>
      <AdaptiveLayoutContent {...props} />
    </Suspense>
  )
}