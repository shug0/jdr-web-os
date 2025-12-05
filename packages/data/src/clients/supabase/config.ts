import { getSupabasePublicUrl, getSupabaseAnonKey, getSupabaseServiceRoleKey } from '@workspace/foundation'

// Environment configuration for Supabase
export const supabaseConfig = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
};

// Validate required environment variables
if (typeof window === 'undefined') {
  // Server-side validation
  if (!supabaseConfig.url) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL');
  }
  if (!supabaseConfig.anonKey) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }
  if (!supabaseConfig.serviceRoleKey) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY');
  }
}