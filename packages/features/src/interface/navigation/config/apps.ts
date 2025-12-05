import type { AppConfig, AppKey } from '../types';

export const APPS: Record<AppKey, AppConfig> = {
  combien: {
    key: 'combien',
    name: 'Combien',
    domain: 'combien.jdr.coffee', // Sera remplacé dynamiquement
    icon: 'Calculator',
    navItems: [
      { label: 'Recherche', href: '/' }
    ]
  },
  pnj: {
    key: 'pnj',
    name: 'PNJ',
    domain: 'pnj.jdr.coffee', // Sera remplacé dynamiquement
    icon: 'Users',
    navItems: [
      { label: 'Générateur', href: '/' }
    ]
  },
  web: {
    key: 'web',
    name: 'Accueil',
    domain: 'os.jdr.coffee', // Sera remplacé dynamiquement
    icon: 'Home',
    navItems: []
  }
};

export const APP_ORDER: AppKey[] = ['web', 'pnj', 'combien'];