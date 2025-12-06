import { createClient as createSupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Browser client with anon key (for client components)
export const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey)

// Server-side client with service role (for API routes)
export function createServerClient() {
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  return createSupabaseClient(supabaseUrl, supabaseServiceKey)
}

// Alias for API routes - creates server client
export function createClient() {
  // For API routes, use service role key if available, otherwise anon key
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (serviceKey) {
    return createSupabaseClient(supabaseUrl, serviceKey)
  }
  return createSupabaseClient(supabaseUrl, supabaseAnonKey)
}

// Re-export for convenience
export { createSupabaseClient }
