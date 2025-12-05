"use client";

import { useSupabase } from '../providers/supabase-auth-provider';

/**
 * Hook focused on session management
 */
export function useSession() {
  const { session, user, loading } = useSupabase();
  
  return {
    session,
    user,
    isLoading: loading,
    isActive: !!session,
    expiresAt: session?.expires_at,
    accessToken: session?.access_token,
  };
}