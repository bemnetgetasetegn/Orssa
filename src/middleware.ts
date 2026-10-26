import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { extractSubdomain, getSubdomainUrls } from '@/lib/utils/url'

function redirectWithCookies(
  destination: string | URL,
  request: NextRequest,
  responseWithCookies: NextResponse
) {
  const targetUrl = typeof destination === 'string' ? new URL(destination, request.url) : destination
  const redirectRes = NextResponse.redirect(targetUrl)
  responseWithCookies.cookies.getAll().forEach((c) => {
    redirectRes.cookies.set(c.name, c.value, c)
  })
  return redirectRes
}

function rewriteWithCookies(
  destination: string | URL,
  request: NextRequest,
  responseWithCookies: NextResponse,
  customHeaders?: Headers
) {
  const targetUrl = typeof destination === 'string' ? new URL(destination, request.url) : destination
  const rewriteRes = NextResponse.rewrite(targetUrl, {
    request: {
      headers: customHeaders || request.headers,
    },
  })
  responseWithCookies.cookies.getAll().forEach((c) => {
    rewriteRes.cookies.set(c.name, c.value, c)
  })
  return rewriteRes
}

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  // 1. Initialize Supabase Client
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

  // 2. Refresh session if expired
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 3. Extract Host, Subdomain, and Subdomain URLs
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || ''
  const hostname = host.split(':')[0].toLowerCase()
  const subdomain = extractSubdomain(host)
  const { mainUrl, adminUrl, employeeUrl, isLocal } = getSubdomainUrls(host)
  const pathname = request.nextUrl.pathname
  const search = request.nextUrl.search

  // Check if accessing from standard localhost root without subdomain prefix
  const isPlainLocalhost = isLocal && (hostname === 'localhost' || hostname === '127.0.0.1')

  // Fetch user profile if user is logged in
  let userProfile: { role: string; account_status: string } | null = null
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, account_status')
      .eq('id', user.id)
      .single()

    userProfile = profile

    // If account suspended, sign out immediately
    if (userProfile?.account_status === 'suspended') {
      await supabase.auth.signOut()
      const loginTarget = subdomain === 'employee' ? `${employeeUrl}/login?error=account_suspended` : `${adminUrl}/login?error=account_suspended`
      return redirectWithCookies(loginTarget, request, supabaseResponse)
    }
  }

  // Marketing pages list
  const isMarketingPage =
    pathname === '/about' ||
    pathname === '/contact' ||
    pathname === '/faq' ||
    pathname.startsWith('/destinations')

  // Reserved non-ref paths
  const reservedPaths = [
    'login',
    'admin',
    'employee',
    'auth',
    'api',
    '_next',
    'about',
    'contact',
    'faq',
    'destinations',
    'favicon.ico',
    'robots.txt',
    'sitemap.xml',
  ]

  // =========================================================================
  // SUBDOMAIN: ADMIN (admin.orssa.net / admin.localhost)
  // =========================================================================
  if (subdomain === 'admin') {
    // A. Marketing pages requested on admin subdomain -> redirect to marketing site
    if (isMarketingPage) {
      return redirectWithCookies(`${mainUrl}${pathname}${search}`, request, supabaseResponse)
    }

    // B. Employee portal requested on admin subdomain -> redirect to employee subdomain
    if (pathname.startsWith('/employee')) {
      return redirectWithCookies(`${employeeUrl}${pathname}${search}`, request, supabaseResponse)
    }

    // C. Root path '/' on admin subdomain
    if (pathname === '/') {
      if (!user) {
        return redirectWithCookies(new URL('/login', request.url), request, supabaseResponse)
      }
      if (userProfile?.role === 'employee') {
        return redirectWithCookies(`${employeeUrl}/employee`, request, supabaseResponse)
      }
      if (userProfile?.role === 'sub_admin') {
        return redirectWithCookies(new URL('/admin/employees', request.url), request, supabaseResponse)
      }
      return redirectWithCookies(new URL('/admin', request.url), request, supabaseResponse)
    }

    // D. Login page on admin subdomain
    if (pathname === '/login') {
      if (user && userProfile) {
        if (userProfile.role === 'employee') {
          // Candidates not permitted in admin portal
          return redirectWithCookies(`${employeeUrl}/employee`, request, supabaseResponse)
        }
        if (userProfile.role === 'sub_admin') {
          return redirectWithCookies(new URL('/admin/employees', request.url), request, supabaseResponse)
        }
        return redirectWithCookies(new URL('/admin', request.url), request, supabaseResponse)
      }
      // Pass x-subdomain header to render Admin Login UI
      const reqHeaders = new Headers(request.headers)
      reqHeaders.set('x-subdomain', 'admin')
      return NextResponse.next({
        request: {
          headers: reqHeaders,
        },
      })
    }

    // E. Protected /admin routes
    if (pathname.startsWith('/admin')) {
      if (!user) {
        return redirectWithCookies(new URL('/login', request.url), request, supabaseResponse)
      }
      if (userProfile?.role === 'employee') {
        // Strict boundary: candidate cannot view admin pages
        return redirectWithCookies(`${employeeUrl}/employee`, request, supabaseResponse)
      }
      if (userProfile?.role === 'sub_admin') {
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
          return redirectWithCookies(new URL('/admin/employees', request.url), request, supabaseResponse)
        }
      }
    }

    return supabaseResponse
  }

  // =========================================================================
  // SUBDOMAIN: EMPLOYEE (employee.orssa.net / employee.localhost)
  // =========================================================================
  if (subdomain === 'employee') {
    // A. Marketing pages requested on employee subdomain -> redirect to marketing site
    if (isMarketingPage) {
      return redirectWithCookies(`${mainUrl}${pathname}${search}`, request, supabaseResponse)
    }

    // B. Admin routes requested on employee subdomain -> redirect to admin subdomain
    if (pathname.startsWith('/admin')) {
      return redirectWithCookies(`${adminUrl}${pathname}${search}`, request, supabaseResponse)
    }

    // C. Root path '/' on employee subdomain
    if (pathname === '/') {
      if (!user) {
        return redirectWithCookies(new URL('/login', request.url), request, supabaseResponse)
      }
      if (userProfile?.role === 'super_admin' || userProfile?.role === 'sub_admin') {
        return redirectWithCookies(`${adminUrl}/admin`, request, supabaseResponse)
      }
      return redirectWithCookies(new URL('/employee', request.url), request, supabaseResponse)
    }

    // D. Private candidate login link pattern: employee.orssa.net/<refToken>
    // If path is a single path segment like "/c79b91a8...", rewrite to "/login?ref=c79b91a8..."
    const segments = pathname.split('/').filter(Boolean)
    if (segments.length === 1 && !reservedPaths.includes(segments[0])) {
      const refToken = segments[0]
      return rewriteWithCookies(new URL(`/login?ref=${encodeURIComponent(refToken)}`, request.url), request, supabaseResponse)
    }

    // E. Login page on employee subdomain
    if (pathname === '/login') {
      if (user && userProfile && !request.nextUrl.searchParams.has('ref')) {
        if (userProfile.role === 'super_admin' || userProfile.role === 'sub_admin') {
          return redirectWithCookies(`${adminUrl}/admin`, request, supabaseResponse)
        }
        return redirectWithCookies(new URL('/employee', request.url), request, supabaseResponse)
      }
      // Pass x-subdomain header to render Employee Login UI
      const reqHeaders = new Headers(request.headers)
      reqHeaders.set('x-subdomain', 'employee')
      return NextResponse.next({
        request: {
          headers: reqHeaders,
        },
      })
    }

    // F. Protected /employee routes
    if (pathname.startsWith('/employee')) {
      if (!user) {
        return redirectWithCookies(new URL('/login', request.url), request, supabaseResponse)
      }
      if (userProfile?.role === 'super_admin' || userProfile?.role === 'sub_admin') {
        // Staff accounts cannot access candidate portal
        return redirectWithCookies(`${adminUrl}/admin`, request, supabaseResponse)
      }
    }

    return supabaseResponse
  }

  // =========================================================================
  // SUBDOMAIN: MAIN (orssa.net / www.orssa.net / plain localhost dev)
  // =========================================================================
  if (!isPlainLocalhost) {
    // In production on orssa.net:
    // If accessing admin routes on main domain, redirect to admin.orssa.net
    if (pathname.startsWith('/admin')) {
      return redirectWithCookies(`${adminUrl}${pathname}${search}`, request, supabaseResponse)
    }
    // If accessing employee routes on main domain, redirect to employee.orssa.net
    if (pathname.startsWith('/employee')) {
      return redirectWithCookies(`${employeeUrl}${pathname}${search}`, request, supabaseResponse)
    }
    // If accessing /login on main domain:
    if (pathname === '/login') {
      if (request.nextUrl.searchParams.has('ref')) {
        return redirectWithCookies(`${employeeUrl}/login${search}`, request, supabaseResponse)
      }
      // Redirect unreferenced login to admin portal or show portal choice
      return redirectWithCookies(`${adminUrl}/login`, request, supabaseResponse)
    }
  } else {
    // Local development fallback on plain localhost:3000
    // Allows full role-based flow without requiring local DNS changes if developer chooses
    if (pathname.startsWith('/admin')) {
      if (!user) {
        return redirectWithCookies(new URL('/login', request.url), request, supabaseResponse)
      }
      if (userProfile?.role === 'employee') {
        return redirectWithCookies(new URL('/employee', request.url), request, supabaseResponse)
      }
      if (userProfile?.role === 'sub_admin') {
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
          return redirectWithCookies(new URL('/admin/employees', request.url), request, supabaseResponse)
        }
      }
    }

    if (pathname.startsWith('/employee')) {
      if (!user) {
        return redirectWithCookies(new URL('/login', request.url), request, supabaseResponse)
      }
      if (userProfile?.role === 'super_admin' || userProfile?.role === 'sub_admin') {
        return redirectWithCookies(new URL('/admin', request.url), request, supabaseResponse)
      }
    }

    if (pathname === '/login' && user && userProfile && !request.nextUrl.searchParams.has('ref')) {
      if (userProfile.role === 'super_admin') {
        return redirectWithCookies(new URL('/admin', request.url), request, supabaseResponse)
      } else if (userProfile.role === 'sub_admin') {
        return redirectWithCookies(new URL('/admin/employees', request.url), request, supabaseResponse)
      } else if (userProfile.role === 'employee') {
        return redirectWithCookies(new URL('/employee', request.url), request, supabaseResponse)
      }
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files with extensions (.svg, .png, .jpg, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
