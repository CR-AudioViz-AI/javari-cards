// ============================================================================
// UNIVERSAL SUPABASE CLIENT - CR AUDIOVIZ AI ECOSYSTEM
// Centralized database connection for all apps
// Dependency-free version (only requires @supabase/supabase-js)
// ============================================================================

import { createClient as supabaseCreateClient, SupabaseClient } from '@supabase/supabase-js';

// Centralized Supabase configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://kteobfyferrukqeolofj.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0ZW9iZnlmZXJydWtxZW9sb2ZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxOTcyNjYsImV4cCI6MjA3NzU1NzI2Nn0.uy-jlF_z6qVb8qogsNyGDLHqT4HhmdRhLrW7zPv3qhY';

// Standard client for general use
export const supabase: SupabaseClient = supabaseCreateClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Browser client for auth (SSR-safe singleton pattern)
let browserClient: SupabaseClient | null = null;

/**
 * createClient - Zero-argument wrapper for Supabase client
 * Used by pages that import { createClient } from '@/lib/supabase'
 * Automatically uses centralized URL and key configuration
 */
export function createClient(): SupabaseClient {
  if (typeof window === 'undefined') {
    // Server-side: return new client each time
    return supabaseCreateClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  
  // Client-side: return singleton for performance
  if (!browserClient) {
    browserClient = supabaseCreateClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    });
  }
  return browserClient;
}

// Alias for explicit browser client usage
export function createSupabaseBrowserClient(): SupabaseClient {
  return createClient();
}

// Server client for API routes (uses service role key for elevated permissions)
export function createSupabaseServerClient(): SupabaseClient {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    console.warn('SUPABASE_SERVICE_ROLE_KEY not set, using anon key');
    return supabaseCreateClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  return supabaseCreateClient(SUPABASE_URL, serviceKey);
}

export { SUPABASE_URL, SUPABASE_ANON_KEY };
