/**
 * In-memory rate limiter for API routes.
 * For production, use Redis-backed rate limiting.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Periodic cleanup every 5 minutes
setInterval(
  () => {
    const now = Date.now();
    for (const [key, entry] of store) {
      if (entry.resetAt < now) {
        store.delete(key);
      }
    }
  },
  5 * 60 * 1000,
);

export interface RateLimitConfig {
  /** Time window in milliseconds */
  windowMs: number;
  /** Max requests per window */
  max?: number;
  /** Alias for max — max attempts per window */
  maxAttempts?: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
  /** Milliseconds until the window resets */
  retryAfter: number;
}

/**
 * Check if a request should be rate-limited.
 * @param key - Unique identifier (e.g., IP + endpoint)
 * @param config - Rate limit settings
 * @returns Whether the request is allowed and remaining count
 */
export function checkRateLimit(
  key: string,
  config: RateLimitConfig,
): RateLimitResult {
  const now = Date.now();
  const limit = config.max ?? config.maxAttempts ?? 10;
  const entry = store.get(key);

  if (!entry || entry.resetAt < now) {
    // New window
    const resetAt = now + config.windowMs;
    store.set(key, { count: 1, resetAt });
    return { allowed: true, remaining: limit - 1, resetAt, retryAfter: 0 };
  }

  if (entry.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: entry.resetAt,
      retryAfter: entry.resetAt - now,
    };
  }

  entry.count++;
  return {
    allowed: true,
    remaining: limit - entry.count,
    resetAt: entry.resetAt,
    retryAfter: 0,
  };
}

/**
 * Get the rate limit key from an IP string and endpoint.
 */
export function getRateLimitKey(ip: string, endpoint: string): string {
  return `${ip}:${endpoint}`;
}
