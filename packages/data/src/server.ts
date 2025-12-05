// SERVER-SIDE EXPORTS ONLY
// For use in server components, API routes, and middleware

// Server-side Supabase
export { 
  createClient, 
  createMiddlewareClient, 
  createAdminClient 
} from './clients/supabase/server'

// Supabase queries (server-side operations)
export * from './clients/supabase/queries'

// Auth middleware
export { updateSession } from './auth/middleware'

// HTTP client (also works on server)
export { createApiClient, fetchWithTimeout } from './clients/http'

// Re-export commonly used types
export type { Database, NotionProxy, NotionProxyData } from './clients/supabase/types'