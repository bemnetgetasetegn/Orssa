import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { validateServerEnv } from '@/lib/env'

// Server-side Supabase client (uses cookies for auth)
export async function createClient() {
  const cookieStore = await cookies()
  const env = validateServerEnv()

  return createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          const isProd = process.env.NODE_ENV === 'production'
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              const secureOpts = {
                ...options,
                secure: isProd ? true : options?.secure,
                sameSite: (options?.sameSite || 'lax') as 'lax' | 'strict' | 'none',
                path: '/',
              }
              cookieStore.set(name, value, secureOpts)
            })
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}

// Admin client using service role key (SERVER ONLY - never expose to browser)
export function createAdminClient() {
  const { createClient } = require('@supabase/supabase-js')
  const env = validateServerEnv()
  
  return createClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}
