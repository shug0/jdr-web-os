'use client'

import { useEffect } from 'react'
import { useOSStore } from '../stores/os-store'
import { DEFAULT_APPS } from '../utils/default-apps'
import { distributeIconsInZones, calculateAbsolutePosition, calculateGridConfig } from '../utils'
import type { DesktopIcon } from '../schemas'

export function useOSInitialization() {
  const { registerApp, addDesktopIcon, desktop } = useOSStore()

  useEffect(() => {
    // Registrer toutes les apps par défaut (idempotent)
    for (const app of DEFAULT_APPS) {
      registerApp(app)
    }
  }, [registerApp])

  useEffect(() => {
    // Créer les icônes desktop uniquement si aucune icône n'existe encore
    if (desktop.icons.length === 0) {
      const gridConfig = calculateGridConfig()
      const zoneMappings = distributeIconsInZones(DEFAULT_APPS.length)
      
      for (const [index, app] of DEFAULT_APPS.entries()) {
        const zoneMapping = zoneMappings[index]
        if (!zoneMapping) continue
        
        const position = calculateAbsolutePosition(
          zoneMapping.zoneIndex,
          zoneMapping.relativePosition,
          gridConfig
        )
        
        const iconData: DesktopIcon = {
          id: `desktop-icon-${app.id}`,
          appId: app.id,
          position,
          label: app.name,
          icon: app.icon
        }
        addDesktopIcon(iconData)
      }
    }
  }, [addDesktopIcon, desktop.icons.length])
}