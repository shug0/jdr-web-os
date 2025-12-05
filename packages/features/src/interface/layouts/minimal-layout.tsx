'use client'

import { WindowLayout } from '@workspace/ui/layouts/window-layout'

interface MinimalLayoutProps {
  children: React.ReactNode
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

export function MinimalLayout({ 
  children, 
  metadata = {},
  lang = "fr"
}: MinimalLayoutProps) {
  return (
    <WindowLayout metadata={metadata} lang={lang}>
      <main className="p-4">
        {children}
      </main>
    </WindowLayout>
  )
}