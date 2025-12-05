import { createMiddlewareClient } from "../clients/supabase/server";
import type { NextRequest, NextResponse } from "next/server";
import type { User } from "@supabase/supabase-js";

export async function updateSession(request: NextRequest): Promise<{ user: User | null; response: NextResponse }> {
  const { supabase, supabaseResponse } = await createMiddlewareClient(request);
  
  // Get the current user
  const { data: { user } } = await supabase.auth.getUser();
  
  // Return the response (which might have new cookies set)
  return { user, response: supabaseResponse };
}