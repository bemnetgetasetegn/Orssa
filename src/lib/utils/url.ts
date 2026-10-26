import { headers } from 'next/headers'

/**
 * Dynamically resolves the base URL of the running application.
 * - In local development: dynamically detects whatever port is being used (3000, 3001, etc.)
 * - In production: uses request host or VERCEL_URL / NEXT_PUBLIC_APP_URL
 */
export async function getBaseUrl(): Promise<string> {
  // 1. If explicit production domain is configured in env (e.g. https://www.orsa.com), prioritize it
  if (
    process.env.NEXT_PUBLIC_APP_URL &&
    !process.env.NEXT_PUBLIC_APP_URL.includes('localhost') &&
    !process.env.NEXT_PUBLIC_APP_URL.includes('127.0.0.1')
  ) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, '')
  }

  // 2. Dynamically extract from incoming request headers (works on localhost:3000, 3001, preview branches, etc.)
  try {
    const headerList = await headers()
    const host = headerList.get('x-forwarded-host') || headerList.get('host')
    const proto =
      headerList.get('x-forwarded-proto') ||
      (host?.includes('localhost') || host?.includes('127.0.0.1') ? 'http' : 'https')

    if (host) {
      return `${proto}://${host}`
    }
  } catch {
    // Fallback if executed outside of an incoming request context
  }

  // 3. Vercel deployment automatic domain variables
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }

  // 4. Default fallback
  return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
}
