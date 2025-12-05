"use client";

import { useSupabase } from '../providers/supabase-auth-provider';

/**
 * Simplified auth hook that provides common auth operations
 */
export function useAuth() {
  const { user, session, loading, signIn, signOut, signUp, resetPassword } = useSupabase();
  
  return {
    // State
    user,
    session,
    isLoading: loading,
    isAuthenticated: !!user,
    
    // Actions
    signIn,
    signOut,
    signUp,
    resetPassword,
  };
}