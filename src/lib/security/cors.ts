const ALLOWED_ORIGIN_PATTERNS = [
  /^https?:\/\/(www\.)?orssa\.net$/,
  /^https?:\/\/admin\.orssa\.net$/,
  /^https?:\/\/employee\.orssa\.net$/,
  /^http:\/\/localhost(:\d+)?$/,
  /^http:\/\/[a-z0-9-]+\.localhost(:\d+)?$/,
  /^http:\/\/127\.0\.0\.1(:\d+)?$/,
]

export function isAllowedOrigin(origin: string | null | undefined): boolean {
  if (!origin) return false
  return ALLOWED_ORIGIN_PATTERNS.some((pattern) => pattern.test(origin))
}

export function getCorsHeaders(origin: string | null | undefined): Record<string, string> {
  const allowed = isAllowedOrigin(origin)
  return {
    'Access-Control-Allow-Origin': allowed && origin ? origin : 'null',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Max-Age': '86400',
  }
}
