import { headers } from 'next/headers'

export type SubdomainType = 'main' | 'admin' | 'employee'

/**
 * Extracts the active subdomain ('main' | 'admin' | 'employee') from a host header.
 */
export function extractSubdomain(hostHeader: string | null | undefined): SubdomainType {
  if (!hostHeader) return 'main'
  const hostname = hostHeader.split(':')[0].toLowerCase()

  if (
    hostname.startsWith('admin.') ||
    hostname === 'admin.localhost' ||
    hostname.startsWith('admin-')
  ) {
    return 'admin'
  }

  if (
    hostname.startsWith('employee.') ||
    hostname === 'employee.localhost' ||
    hostname.startsWith('employee-')
  ) {
    return 'employee'
  }

  return 'main'
}

/**
 * Resolves the root domain (e.g. 'orssa.net' or 'localhost:3000').
 */
export function getRootDomain(hostHeader?: string | null): {
  domain: string
  isLocal: boolean
  port: string
} {
  const rootDomainEnv = process.env.NEXT_PUBLIC_ROOT_DOMAIN?.trim()
  const host = hostHeader?.trim() || ''

  // If host includes localhost or 127.0.0.1
  if (host.includes('localhost') || host.includes('127.0.0.1')) {
    const portMatch = host.match(/:(\d+)/)
    const port = portMatch ? portMatch[1] : '3000'
    return { domain: 'localhost', isLocal: true, port }
  }

  // If configured with custom production domain
  if (rootDomainEnv && !rootDomainEnv.includes('localhost')) {
    return { domain: rootDomainEnv, isLocal: false, port: '' }
  }

  // If host matches orssa.net
  if (host.includes('orssa.net')) {
    return { domain: 'orssa.net', isLocal: false, port: '' }
  }

  // Fallback to localhost if no production indicator
  return { domain: 'localhost', isLocal: true, port: '3000' }
}

export interface SubdomainUrls {
  mainUrl: string
  adminUrl: string
  employeeUrl: string
  isLocal: boolean
}

/**
 * Generates absolute URLs for all 3 portals based on environment.
 */
export function getSubdomainUrls(hostHeader?: string | null): SubdomainUrls {
  const { domain, isLocal, port } = getRootDomain(hostHeader)

  if (isLocal) {
    const portSuffix = port ? `:${port}` : ':3000'
    return {
      mainUrl: `http://localhost${portSuffix}`,
      adminUrl: `http://admin.localhost${portSuffix}`,
      employeeUrl: `http://employee.localhost${portSuffix}`,
      isLocal: true,
    }
  }

  // Production or custom domain (e.g. orssa.net)
  return {
    mainUrl: `https://${domain}`,
    adminUrl: `https://admin.${domain}`,
    employeeUrl: `https://employee.${domain}`,
    isLocal: false,
  }
}

/**
 * Asynchronously extracts host from current request headers and returns subdomain URLs.
 */
export async function getRequestSubdomainUrls(): Promise<SubdomainUrls> {
  try {
    const headerList = await headers()
    const host = headerList.get('x-forwarded-host') || headerList.get('host')
    return getSubdomainUrls(host)
  } catch {
    return getSubdomainUrls(process.env.NEXT_PUBLIC_APP_URL || null)
  }
}

/**
 * Get the dedicated employee base URL.
 */
export async function getEmployeeBaseUrl(): Promise<string> {
  const urls = await getRequestSubdomainUrls()
  return urls.employeeUrl
}

/**
 * Get the dedicated admin base URL.
 */
export async function getAdminBaseUrl(): Promise<string> {
  const urls = await getRequestSubdomainUrls()
  return urls.adminUrl
}

/**
 * Get the main marketing base URL.
 */
export async function getMainBaseUrl(): Promise<string> {
  const urls = await getRequestSubdomainUrls()
  return urls.mainUrl
}

/**
 * Dynamically resolves the base URL of the running application for backward compatibility.
 */
export async function getBaseUrl(): Promise<string> {
  try {
    const headerList = await headers()
    const host = headerList.get('x-forwarded-host') || headerList.get('host')
    const proto =
      headerList.get('x-forwarded-proto') ||
      (host?.includes('localhost') || host?.includes('127.0.0.1') ? 'http' : 'https')

    if (host) {
      return `${proto}://${host}`
    }
  } catch {}

  const urls = await getRequestSubdomainUrls()
  return urls.mainUrl
}
