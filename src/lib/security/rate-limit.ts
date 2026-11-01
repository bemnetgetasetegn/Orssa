interface RateLimitRecord {
  count: number
  resetAt: number
}

// Global in-memory storage for sliding window rate limiting
const store = new Map<string, RateLimitRecord>()

// Clean up stale records periodically
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now()
    for (const [key, record] of store.entries()) {
      if (now > record.resetAt) {
        store.delete(key)
      }
    }
  }, 60 * 1000)
}

export interface RateLimitOptions {
  limit: number
  windowMs: number
}

export interface RateLimitResult {
  success: boolean
  remaining: number
  resetAt: number
  retryAfterSeconds?: number
}

/**
 * Checks if an action is allowed under the rate limit for the given key.
 * @param key Unique identifier (e.g. IP + action name, or email + action name)
 * @param options limit and window in milliseconds
 */
export function checkRateLimit(
  key: string,
  options: RateLimitOptions = { limit: 10, windowMs: 60 * 1000 }
): RateLimitResult {
  const now = Date.now()
  const record = store.get(key)

  if (!record || now > record.resetAt) {
    const newRecord: RateLimitRecord = {
      count: 1,
      resetAt: now + options.windowMs,
    }
    store.set(key, newRecord)
    return {
      success: true,
      remaining: options.limit - 1,
      resetAt: newRecord.resetAt,
    }
  }

  if (record.count >= options.limit) {
    const retryAfterSeconds = Math.ceil((record.resetAt - now) / 1000)
    return {
      success: false,
      remaining: 0,
      resetAt: record.resetAt,
      retryAfterSeconds,
    }
  }

  record.count += 1
  return {
    success: true,
    remaining: options.limit - record.count,
    resetAt: record.resetAt,
  }
}

/**
 * Resets rate limit for a key upon successful event (e.g. valid login)
 */
export function resetRateLimit(key: string): void {
  store.delete(key)
}
