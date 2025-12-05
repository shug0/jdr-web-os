"use client";

import type { AuthError, AuthResponse, Session, User } from "@supabase/supabase-js";
import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "../../clients/supabase/client";

export type UserType = User | null;

export type SupabaseResponse<T> = {
  data: T;
  error: null | { message: string };
};

type SupabaseContextType = {
  user: UserType;
  session: Session | null;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  signOut: () => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ data: AuthResponse["data"]; error: AuthError | null }>;
  signUp: (email: string, password: string) => Promise<{ data: AuthResponse["data"]; error: AuthError | null }>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
};

const defaultContext: SupabaseContextType = {
  user: null,
  session: null,
  loading: true,
  setLoading: () => {},
  signOut: async () => ({ error: new Error("Non initialisé") }),
  signIn: async () => ({ data: { user: null, session: null }, error: null }),
  signUp: async () => ({ data: { user: null, session: null }, error: null }),
  resetPassword: async () => ({ error: null }),
};

const SupabaseContext = createContext<SupabaseContextType>(defaultContext);

export function useSupabase(): SupabaseContextType {
  const context = useContext(SupabaseContext);
  if (!context) {
    throw new Error("useSupabase must be used within a SupabaseProvider");
  }
  return context;
}

type SupabaseProviderProps = {
  children: ReactNode;
};

export function SupabaseProvider({ children }: SupabaseProviderProps) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<UserType>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getSession().then(({ data: { session } }: { data: { session: Session | null } }) => {
      console.log("🔐 SupabaseProvider: Session retrieved:", {
        userId: session?.user?.id,
        email: session?.user?.email,
        hasSession: !!session,
      });
      setSession(session);
      setUser(session?.user || null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event: string, session: Session | null) => {
      console.log("🔄 SupabaseProvider: Auth state changed:", {
        event: _event,
        userId: session?.user?.id,
        email: session?.user?.email,
        hasSession: !!session,
      });
      setSession(session);
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    const supabase = createClient();
    return await supabase.auth.signOut();
  };

  const signIn = async (email: string, password: string) => {
    const supabase = createClient();
    return await supabase.auth.signInWithPassword({
      email,
      password,
    });
  };

  const signUp = async (email: string, password: string) => {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    return { data, error };
  };

  const resetPassword = async (email: string) => {
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    return { error };
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    setLoading,
  };

  return <SupabaseContext.Provider value={value}>{children}</SupabaseContext.Provider>;
}