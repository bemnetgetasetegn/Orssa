/**
 * Strips HTML tags, script elements, javascript: protocols, and non-printable control characters.
 */
export function sanitizeString(input: unknown): string {
  if (typeof input !== 'string') return ''

  return input
    // Remove null bytes and non-printable control characters (except newline and tab)
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    // Strip HTML tags and script elements
    .replace(/<[^>]*>?/gm, '')
    // Remove javascript: pseudo-protocols
    .replace(/javascript\s*:/gi, '')
    // Trim extraneous whitespace
    .trim()
}

/**
 * Sanitizes an object of string fields recursively.
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  const result: any = Array.isArray(obj) ? [] : {}

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      result[key] = sanitizeString(value)
    } else if (value !== null && typeof value === 'object') {
      result[key] = sanitizeObject(value)
    } else {
      result[key] = value
    }
  }

  return result
}
