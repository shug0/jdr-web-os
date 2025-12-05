import { getAppUrl as getConfigAppUrl, type AppId } from '@workspace/foundation/config'

export function getAppUrl(appId: 'combien' | 'pnj' | 'admin'): string {
  // Use centralized config
  return getConfigAppUrl(appId as AppId)
}

export function openExternalApp(appId: 'combien' | 'pnj' | 'admin') {
  const url = getAppUrl(appId)
  window.location.href = url
}