import type { DesktopIcon, IconGroup } from '../schemas'
import { DEFAULT_APPS } from './default-apps'

export interface IconGroupConfig {
  id: string
  title: string
  appIds: string[]
}

/**
 * Configuration des groupes d'icônes avec positionnement responsive
 */
export const ICON_GROUPS_CONFIG: IconGroupConfig[] = [
  {
    id: 'apps',
    title: 'Apps JDR',
    appIds: ['combien', 'pnj']
  },
  {
    id: 'wikis-officiels',
    title: 'Wiki officiels',
    appIds: ['lmdlt-wiki', 'dc-wiki']
  },
  {
    id: 'wikis-non-officiels',
    title: 'Wiki non officiels',
    appIds: ['jdr-universel-wiki', 'jdr-aria-wiki']
  }
]

/**
 * Organise les icônes en groupes - version simplifiée sans positionnement complexe
 */
export function organizeIconsIntoGroups(): { groups: IconGroup[], aboutIcon: DesktopIcon } {
  const groups: IconGroup[] = []

  // Créer les groupes configurés automatiquement
  for (const groupConfig of ICON_GROUPS_CONFIG) {
    const groupIcons: DesktopIcon[] = []
    
    for (const appId of groupConfig.appIds) {
      const app = DEFAULT_APPS.find(a => a.id === appId)
      if (app) {
        groupIcons.push({
          id: `desktop-icon-${app.id}`,
          appId: app.id,
          position: { x: 0, y: 0 }, // Plus besoin de vraie position
          label: app.name,
          icon: app.icon
        })
      }
    }

    if (groupIcons.length > 0) {
      groups.push({
        id: groupConfig.id,
        title: groupConfig.title,
        position: { x: 0, y: 0 }, // Plus besoin de vraie position
        icons: groupIcons
      })
    }
  }

  // Créer l'icône "À propos"
  const aboutApp = DEFAULT_APPS.find(app => app.id === 'about')!
  const aboutIcon: DesktopIcon = {
    id: 'desktop-icon-about',
    appId: 'about',
    position: { x: 0, y: 0 }, // Plus besoin de vraie position
    label: aboutApp.name,
    icon: aboutApp.icon
  }

  return { groups, aboutIcon }
}

/**
 * Vérifie si une icône fait partie d'un groupe
 */
export function isIconInGroup(iconAppId: string): boolean {
  return ICON_GROUPS_CONFIG.some(group => group.appIds.includes(iconAppId))
}

/**
 * Trouve le groupe d'une icône
 */
export function findIconGroup(iconAppId: string): IconGroupConfig | undefined {
  return ICON_GROUPS_CONFIG.find(group => group.appIds.includes(iconAppId))
}