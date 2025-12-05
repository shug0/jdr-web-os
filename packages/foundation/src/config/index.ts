// Export configuration utilities
// @ts-ignore - MJS file doesn't have TypeScript declarations
export { baseNextConfig, createNextConfig } from './next-config.mjs'

// Export environment utilities
export {
  detectEnvironment,
  isDevEnvironment,
  getAppUrl,
  getAllAppUrls,
  getCurrentAppId,
  navigateToApp,
  openAppInNewTab,
  type AppId,
  type DeploymentEnvironment,
} from './environment'