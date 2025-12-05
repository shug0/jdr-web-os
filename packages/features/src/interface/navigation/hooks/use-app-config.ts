import { APPS } from '../config/apps';
import type { AppKey, AppConfig } from '../types';

export function useAppConfig(currentApp: AppKey): AppConfig {
  return APPS[currentApp];
}

export function useAllApps(): AppConfig[] {
  return Object.values(APPS);
}