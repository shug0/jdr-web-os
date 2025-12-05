import { openExternalApp } from './app-urls'

export type OpenMode = 'window' | 'direct'

/**
 * Interface pour le gestionnaire d'ouverture d'applications
 */
export interface AppOpener {
  /**
   * Ouvre une app externe directement dans un nouvel onglet
   */
  openDirect: (appId: 'combien' | 'pnj' | 'admin') => void
  
  /**
   * Ouvre une app dans une fenêtre OS (pour apps intégrées)
   */
  openInWindow: (appId: string) => void
  
  /**
   * Ouvre une app selon le mode approprié
   * - Mobile: toujours direct
   * - Desktop: window pour icônes desktop, direct pour menu header
   */
  openApp: (appId: 'combien' | 'pnj' | 'admin', mode: OpenMode) => void
}

/**
 * Créer un gestionnaire d'ouverture d'applications
 */
export function createAppOpener({
  isMobile,
  onOpenInWindow
}: {
  isMobile: boolean
  onOpenInWindow: (appId: string) => void
}): AppOpener {
  
  const openDirect = (appId: 'combien' | 'pnj' | 'admin') => {
    openExternalApp(appId)
  }

  const openInWindow = (appId: string) => {
    onOpenInWindow(appId)
  }

  const openApp = (appId: 'combien' | 'pnj' | 'admin', mode: OpenMode) => {
    // En mobile, toujours ouvrir directement
    if (isMobile) {
      openDirect(appId)
      return
    }

    // En desktop, respecter le mode demandé
    if (mode === 'direct') {
      openDirect(appId)
    } else {
      openInWindow(appId)
    }
  }

  return {
    openDirect,
    openInWindow,
    openApp
  }
}