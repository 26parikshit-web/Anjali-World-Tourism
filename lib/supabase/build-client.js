import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// Build-time client that doesn't use cookies (for static generation)
export function createBuildClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  
  if (!url || !key) {
    return null
  }
  
  return createSupabaseClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false
    }
  })
}
