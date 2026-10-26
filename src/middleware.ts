import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh session if expired
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  // Protected application routes (Admin & Employee portals)
  const isAdminRoute = pathname.startsWith('/admin')
  const isEmployeeRoute = pathname.startsWith('/employee')
  const isProtectedRoute = isAdminRoute || isEmployeeRoute

  // Unauthenticated user trying to access protected routes
  if (!user && isProtectedRoute) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Authenticated user trying to access login page
  if (user && pathname === '/login') {
    // If accessing with an employee ref token, allow the login page to handle session switching / dedicated verification
    if (!request.nextUrl.searchParams.has('ref')) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role, account_status')
        .eq('id', user.id)
        .single()

      if (profile?.account_status === 'suspended') {
        await supabase.auth.signOut()
        return NextResponse.redirect(new URL('/login?error=account_suspended', request.url))
      }

      if (profile?.role === 'super_admin' || profile?.role === 'sub_admin') {
        return NextResponse.redirect(new URL('/admin', request.url))
      } else if (profile?.role === 'employee') {
        return NextResponse.redirect(new URL('/employee', request.url))
      }
    }
  }

  // Role-based access control for authenticated users
  if (user && (isAdminRoute || isEmployeeRoute)) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, account_status')
      .eq('id', user.id)
      .single()

    // Check account status
    if (profile?.account_status === 'suspended') {
      await supabase.auth.signOut()
      return NextResponse.redirect(new URL('/login?error=account_suspended', request.url))
    }

    if (!profile) {
      await supabase.auth.signOut()
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // Employee trying to access admin routes
    if (isAdminRoute && profile.role === 'employee') {
      return NextResponse.redirect(new URL('/employee', request.url))
    }

    // Admin/sub-admin trying to access employee routes
    if (isEmployeeRoute && (profile.role === 'super_admin' || profile.role === 'sub_admin')) {
      return NextResponse.redirect(new URL('/admin', request.url))
    }

    // Sub-admin trying to access restricted admin routes
    if (profile.role === 'sub_admin') {
      const subAdminRestrictedRoutes = [
        '/admin/sub-admins',
        '/admin/letters/templates',
        '/admin/audit-logs',
        '/admin/settings',
        '/admin/reports',
      ]
      const isRestricted = subAdminRestrictedRoutes.some((route) =>
        pathname.startsWith(route)
      )
      if (isRestricted) {
        return NextResponse.redirect(new URL('/admin/employees', request.url))
      }
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files with extensions
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
