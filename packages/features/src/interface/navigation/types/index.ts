export interface NavigationItem {
  label: string;
  href: string;
  icon?: string;
}

export interface AppConfig {
  key: string;
  name: string;
  domain: string;
  icon: string;
  navItems: NavigationItem[];
}

export type AppKey = 'combien' | 'pnj' | 'web';