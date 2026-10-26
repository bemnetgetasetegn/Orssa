import crypto from 'crypto'

// Generate a cryptographically secure random password
// Meets complexity requirements: uppercase, lowercase, numbers, special chars
export function generateSecurePassword(length: number = 16): string {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const lowercase = 'abcdefghijklmnopqrstuvwxyz'
  const numbers = '0123456789'
  const special = '!@#$%^&*()_+-=[]{}|;:,.<>?'
  const allChars = uppercase + lowercase + numbers + special

  let password = ''
  
  // Ensure at least one of each required type
  password += uppercase[crypto.randomInt(0, uppercase.length)]
  password += lowercase[crypto.randomInt(0, lowercase.length)]
  password += numbers[crypto.randomInt(0, numbers.length)]
  password += special[crypto.randomInt(0, special.length)]
  
  // Fill the rest randomly
  for (let i = 4; i < length; i++) {
    password += allChars[crypto.randomInt(0, allChars.length)]
  }
  
  // Shuffle the password to avoid predictable patterns
  return password
    .split('')
    .sort(() => crypto.randomInt(0, 2) - 0.5)
    .join('')
}

// Generate an opaque reference token for employee login links
export function generateLoginRef(): string {
  return crypto.randomBytes(32).toString('hex')
}

// Generate a unique employee code prefix hash
export function generateUniqueId(): string {
  return crypto.randomBytes(16).toString('hex')
}

// Mask a passport number for display (show only last 4 chars)
export function maskPassportNumber(passport: string): string {
  if (passport.length <= 4) return '****'
  const visible = passport.slice(-4)
  const masked = '*'.repeat(passport.length - 4)
  return masked + visible
}

// Mask an email for display
export function maskEmail(email: string): string {
  const [local, domain] = email.split('@')
  if (!domain) return email
  const maskedLocal = local.length <= 2 
    ? '*'.repeat(local.length)
    : local[0] + '*'.repeat(local.length - 2) + local[local.length - 1]
  return `${maskedLocal}@${domain}`
}

// Safe template variable interpolation (no code execution)
export function interpolateTemplate(
  template: string,
  variables: Record<string, string | undefined>
): string {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    const value = variables[key]
    if (value === undefined || value === null) return match
    // Escape HTML entities to prevent XSS
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
  })
}

// Format date consistently
export function formatDate(date: string | Date | null): string {
  if (!date) return 'N/A'
  try {
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }).format(new Date(date))
  } catch {
    return 'Invalid date'
  }
}

// Format date for PDF
export function formatDateForPdf(date: string | Date | null): string {
  if (!date) return 'N/A'
  try {
    return new Intl.DateTimeFormat('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date(date))
  } catch {
    return 'Invalid date'
  }
}

// Build employee login URL with opaque ref
export function buildLoginUrl(baseUrl: string, refToken: string): string {
  // Only use the ref token for pre-filling the login form hint
  // NOT for authentication itself
  return `${baseUrl}/login?ref=${refToken}`
}

// Generate a unique storage path for employee photos
export function generatePhotoStoragePath(employeeId: string, fileExtension: string): string {
  const uniqueId = crypto.randomBytes(8).toString('hex')
  const sanitizedExt = fileExtension.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()
  return `employees/${employeeId}/${uniqueId}.${sanitizedExt}`
}

// Generate a unique storage path for PDFs
export function generatePdfStoragePath(employeeId: string, letterId: string, version: number): string {
  const uniqueId = crypto.randomBytes(8).toString('hex')
  return `letters/${employeeId}/${letterId}/v${version}-${uniqueId}.pdf`
}
