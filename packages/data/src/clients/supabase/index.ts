// Export Supabase client utilities
export { createClient } from './client'
export { createClient as createServerClient, createMiddlewareClient, createAdminClient } from './server'
export { supabaseConfig } from './config'
export * from './queries'
export type * from './types'