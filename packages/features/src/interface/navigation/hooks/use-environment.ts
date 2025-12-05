"use client";

import { useState, useEffect } from 'react';
import { isDevEnvironment, getAppUrl as getConfigAppUrl, type AppId } from '@workspace/foundation/config';

export function useEnvironment() {
  const [isDev, setIsDev] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setIsDev(isDevEnvironment());
  }, []);

  const getAppUrl = (appKey: string, port?: number): string => {
    // Use centralized config
    return getConfigAppUrl(appKey as AppId, port);
  };

  return {
    isDev,
    isClient,
    getAppUrl
  };
}