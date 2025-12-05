import type { OSApp } from '../schemas'
import { CombienApp, PNJApp, AboutApp } from '../components/apps'

export const DEFAULT_APPS: OSApp[] = [
  {
    id: 'combien',
    name: 'Combien',
    icon: '/icons/pixel-fantasy/coins/coin_3.png',
    description: 'Outil de pricing pour objets médiévaux fantastiques',
    component: CombienApp,
    defaultSize: { width: 1000, height: 700 },
    minSize: { width: 600, height: 400 },
    isResizable: true,
    allowMultipleInstances: false,
    category: 'tools'
  },
  {
    id: 'pnj',
    name: 'PNJ Generator',
    icon: '/icons/pixel-fantasy/helmets/helmet_1.png',
    description: 'Générateur de personnages non-joueurs avec IA',
    component: PNJApp,
    defaultSize: { width: 900, height: 600 },
    minSize: { width: 500, height: 400 },
    isResizable: true,
    allowMultipleInstances: false,
    category: 'tools'
  },
  {
    id: 'about',
    name: 'À propos',
    icon: '/icons/pixel-fantasy/misc/crystalball_1.png',
    description: 'Informations sur JDR Coffee et ses outils',
    component: AboutApp,
    defaultSize: { width: 600, height: 500 },
    minSize: { width: 400, height: 300 },
    isResizable: true,
    allowMultipleInstances: false,
    category: 'system'
  }
]