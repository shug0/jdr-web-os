import type { OSApp } from '../schemas'
import { CombienApp, PNJApp, AboutApp, LmdltWikiApp, DcWikiApp, JdrUniverselWikiApp, JdrAriaWikiApp } from '../components/apps'

export const DEFAULT_APPS: OSApp[] = [
  {
    id: 'combien',
    name: 'Combien',
    icon: 'https://combien.jdr.coffee/coins/coins_6.png',
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
    icon: '/icons/npc.png',
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
    icon: '/icons/pixel-foods/Meals/soup_ramen.png',
    description: 'Informations sur JDR Coffee et ses outils',
    component: AboutApp,
    defaultSize: { width: 600, height: 500 },
    minSize: { width: 400, height: 300 },
    isResizable: true,
    allowMultipleInstances: false,
    category: 'system'
  },
  {
    id: 'lmdlt-wiki',
    name: 'LMDLT',
    icon: '/icons/wiki/lmdlt.jpeg',
    description: 'Le Mythe de la Taverne (podcast actual play de jdr)',
    component: LmdltWikiApp,
    defaultSize: { width: 1200, height: 800 },
    minSize: { width: 800, height: 600 },
    isResizable: true,
    allowMultipleInstances: false,
    category: 'tools',
    externalUrl: 'https://lmdlt.wiki.jdr.coffee/'
  },
  {
    id: 'dc-wiki',
    name: 'Donjons & Chatons',
    icon: '/icons/wiki/d&c.png',
    description: 'Donjons & Chatons Wiki',
    component: DcWikiApp,
    defaultSize: { width: 1200, height: 800 },
    minSize: { width: 800, height: 600 },
    isResizable: true,
    allowMultipleInstances: false,
    category: 'tools',
    externalUrl: 'https://chatons.wiki.jdr.coffee/'
  },
  {
    id: 'jdr-universel-wiki',
    name: 'JDR Universel',
    icon: '/icons/pixel-fantasy/books/book_18.png',
    description: 'Wiki JDR Universel',
    component: JdrUniverselWikiApp,
    defaultSize: { width: 1200, height: 800 },
    minSize: { width: 800, height: 600 },
    isResizable: true,
    allowMultipleInstances: false,
    category: 'tools',
    externalUrl: 'https://jdr-wiki.notion.site/?pvs=74'
  },
  {
    id: 'jdr-aria-wiki',
    name: 'JDR Aria',
    icon: '/icons/wiki/aria.png',
    description: 'Wiki JDR Aria',
    component: JdrAriaWikiApp,
    defaultSize: { width: 1200, height: 800 },
    minSize: { width: 800, height: 600 },
    isResizable: true,
    allowMultipleInstances: false,
    category: 'tools',
    externalUrl: 'https://aria-wiki.notion.site/?pvs=74'
  }
]