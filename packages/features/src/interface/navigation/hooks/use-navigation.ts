import { useCallback } from 'react';
import type { AppKey } from '../types';
import { useEnvironment } from './use-environment';

export function useNavigation() {
  const { getAppUrl } = useEnvironment();

  const navigateToApp = useCallback((appKey: AppKey) => {
    const url = getAppUrl(appKey);
    window.location.href = url;
  }, [getAppUrl]);

  const isCurrentApp = useCallback((appKey: AppKey, currentApp: AppKey) => {
    return appKey === currentApp;
  }, []);

  return {
    navigateToApp,
    isCurrentApp
  };
}