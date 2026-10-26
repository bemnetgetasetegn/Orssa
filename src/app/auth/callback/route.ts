import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { NextRequest } from 'next/server'

/**
 * Supabase Auth callback handler.
 * Handles magic-link and OAuth flows by exchanging the `code` query param
 * for a session.  After exchange the user is redirected based on their role
 * (or to the `next` param if supplied).
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)

  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/admin'
  const errorDescription = searchParams.get('error_description')

  // Surface any error that came back from the provider
  if (errorDescription) {
    console.error('[auth/callback] Provider error:', errorDescription)
    return NextResponse.redirect(
      `${origin}/login?error=unauthorized`,
    )
  }

  if (code) {
    const supabase = await createClient()

    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error('[auth/callback] Code exchange error:', error.message)
      return NextResponse.redirect(`${origin}/login?error=session_expired`)
    }

    // Validate `next` to prevent open-redirect attacks: only allow relative paths
    const safeNext =
      next.startsWith('/') && !next.startsWith('//') ? next : '/admin'

    return NextResponse.redirect(`${origin}${safeNext}`)
  }

  // No code present — redirect to login
  return NextResponse.redirect(`${origin}/login`)
}
