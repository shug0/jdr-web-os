'use client'

import { useRef, useEffect } from 'react'
import { useSharedContext } from '@workspace/ui/shared-context'
import { getAppUrl } from '../../utils/app-urls'

interface ExternalAppWindowProps {
  appId: 'combien' | 'pnj' | 'admin'
}

export function ExternalAppWindow({ appId }: ExternalAppWindowProps) {
  const baseUrl = getAppUrl(appId)
  const windowModeUrl = `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}windowMode=true`
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const { context } = useSharedContext()

  // Notify iframe when context changes
  useEffect(() => {
    if (!iframeRef.current?.contentWindow) return

    // Wait a bit for iframe to be fully loaded
    const timer = setTimeout(() => {
      if (iframeRef.current?.contentWindow) {
        try {
          iframeRef.current.contentWindow.postMessage(
            {
              type: 'jdr-context-update',
              context,
            },
            baseUrl
          )
        } catch (error) {
          // Silently fail if iframe is not accessible
          console.debug('Could not send message to iframe:', error)
        }
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [context, baseUrl])

  return (
    <div className="w-full h-full flex flex-col bg-background">
      <div className="flex-1 overflow-hidden rounded-md">
        <iframe
          ref={iframeRef}
          src={windowModeUrl}
          className="w-full h-full border-0"
          title={appId}
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
        />
      </div>
      <div className="p-2 border-t border-border bg-muted/30 text-xs text-muted-foreground">
        <a 
          href={baseUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="hover:text-foreground transition-colors"
        >
          Ouvrir dans un nouvel onglet ↗
        </a>
      </div>
    </div>
  )
}