// CLIENT-SIDE EXPORTS ONLY
// For use in client components and browser environment

// Auth hooks and providers
export * from './auth/hooks'
export * from './auth/providers'

// Client-side Supabase
export { createClient } from './clients/supabase/client'

// HTTP client
export { createApiClient, fetchWithTimeout } from './clients/http'

// Providers
export * from './providers'

// Re-export commonly used types
export type { Database, NotionProxy, NotionProxyData } from './clients/supabase/types'