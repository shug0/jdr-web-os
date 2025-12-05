/**
 * Centralized environment detection and URL configuration for JDR Coffee apps
 */

export type AppId = 'web' | 'combien' | 'pnj' | 'admin'

export type DeploymentEnvironment = 'production' | 'local' | 'development'

/**
 * Detect the current environment based on hostname
 */
export function detectEnvironment(): DeploymentEnvironment {
  if (typeof window === 'undefined') {
    // Server-side: assume production
    return 'production'
  }

  const hostname = window.location.hostname

  // Production: .jdr.coffee domains
  if (hostname.endsWith('.jdr.coffee') || hostname === 'jdr.coffee') {
    return 'production'
  }

  // Local testing: .jdr.local domains
  if (hostname.endsWith('.jdr.local') || hostname === 'jdr.local') {
    return 'local'
  }

  // Development: localhost
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'development'
  }

  // Default to production for safety
  return 'production'
}

/**
 * Check if we're in a development-like environment (local or development)
 * Note: Different from utils/env isDevelopment() which checks NODE_ENV
 * This one checks the hostname/domain
 */
export function isDevEnvironment(): boolean {
  const env = detectEnvironment()
  return env === 'development' || env === 'local'
}

/**
 * App configuration
 */
const APP_CONFIG = {
  web: {
    production: 'https://os.jdr.coffee',
    local: 'https://jdr.local',
    development: { port: 3000 },
  },
  combien: {
    production: 'https://combien.jdr.coffee',
    local: 'https://combien.jdr.local',
    development: { port: 3001 },
  },
  pnj: {
    production: 'https://pnj.jdr.coffee',
    local: 'https://pnj.jdr.local',
    development: { port: 3002 },
  },
  admin: {
    production: 'https://admin.jdr.coffee',
    local: 'https://admin.jdr.local',
    development: { port: 3003 },
  },
} as const

/**
 * Get the URL for a specific app based on current environment
 */
export function getAppUrl(appId: AppId, port?: number): string {
  const env = detectEnvironment()
  const config = APP_CONFIG[appId]

  switch (env) {
    case 'production':
      return config.production

    case 'local':
      return config.local

    case 'development': {
      const appPort = port || config.development.port
      return `http://localhost:${appPort}`
    }
  }
}

/**
 * Get all app URLs for the current environment
 */
export function getAllAppUrls(): Record<AppId, string> {
  return {
    web: getAppUrl('web'),
    combien: getAppUrl('combien'),
    pnj: getAppUrl('pnj'),
    admin: getAppUrl('admin'),
  }
}

/**
 * Get the current app ID based on hostname
 */
export function getCurrentAppId(): AppId | null {
  if (typeof window === 'undefined') return null

  const hostname = window.location.hostname

  // Check for subdomain patterns
  if (hostname.includes('combien')) return 'combien'
  if (hostname.includes('pnj')) return 'pnj'
  if (hostname.includes('admin')) return 'admin'

  // Check for ports (development mode)
  const port = window.location.port
  if (port === '3000') return 'web'
  if (port === '3001') return 'combien'
  if (port === '3002') return 'pnj'
  if (port === '3003') return 'admin'

  // Default to web
  return 'web'
}

/**
 * Navigate to another app
 */
export function navigateToApp(appId: AppId): void {
  if (typeof window === 'undefined') return
  const url = getAppUrl(appId)
  window.location.href = url
}

/**
 * Open app in new tab
 */
export function openAppInNewTab(appId: AppId): void {
  if (typeof window === 'undefined') return
  const url = getAppUrl(appId)
  window.open(url, '_blank', 'noopener,noreferrer')
}
