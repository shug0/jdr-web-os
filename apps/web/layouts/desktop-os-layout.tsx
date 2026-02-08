'use client'

import { useEffect } from 'react'
import { WindowLayout } from '@workspace/ui/layouts/window-layout'
import { Wallpaper } from '@workspace/ui/wallpaper'
import { Taskbar } from '@workspace/ui/taskbar'
import { Desktop, WindowManager } from '@/features/os'
import { useOSStore } from '@/features/os/stores/os-store'
import { useAppRegistry } from '@/features/os/hooks/use-app-registry'
import { useMobile } from '@/features/os/hooks/use-mobile'
import { createAppOpener } from '@/features/os/utils/app-opener'
import { DEFAULT_APPS } from '@/features/os/utils/default-apps'

interface DesktopOSLayoutProps {
  children?: React.ReactNode
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

export function DesktopOSLayout({ 
  children,
  metadata = {},
  lang = "fr"
}: DesktopOSLayoutProps) {
  const {
    desktop,
    windows,
    openApp,
    moveIcon,
    closeContextMenu,
    registerApp,
    focusWindow
  } = useOSStore()

  const { apps } = useAppRegistry()
  const isMobile = useMobile()

  // Create app opener with mobile-aware logic
  const appOpener = createAppOpener({
    isMobile,
    onOpenInWindow: openApp
  })

  // Register default apps with the OS store
  useEffect(() => {
    for (const app of DEFAULT_APPS) {
      registerApp(app)
    }
  }, [registerApp])
  
  // Register apps from registry with the OS store
  useEffect(() => {
    for (const app of apps) {
      registerApp(app)
    }
  }, [apps, registerApp])

  // Global click handler for closing context menus
  useEffect(() => {
    const handleClick = () => closeContextMenu()
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [closeContextMenu])

  return (
    <WindowLayout metadata={metadata} lang={lang}>
      <main
        className="relative min-h-screen overflow-hidden"
        onClick={closeContextMenu}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            closeContextMenu()
          }
        }}
      >
        {/* Wallpaper */}
        <Wallpaper />

        {/* Desktop with Icons */}
        <Desktop
          icons={desktop.icons}
          onIconDoubleClick={(appId) => openApp(appId)}
          onIconMove={moveIcon}
          onContextMenu={(position) => {
            // Pour le moment, ne rien faire avec le context menu
          }}
        />

        {/* Window Manager */}
        <WindowManager />

        {/* Taskbar */}
        <Taskbar currentApp="web" />

        {/* Optional children content */}
        {children}
      </main>
    </WindowLayout>
  )
}