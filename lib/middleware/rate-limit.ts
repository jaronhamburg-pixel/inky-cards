import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

export interface RateLimitConfig {
  /** Maximum number of requests in the window */
  maxRequests: number;
  /** Window size in milliseconds */
  windowMs: number;
}

export const RATE_LIMITS = {
  auth: { maxRequests: 5, windowMs: 60 * 1000 } as RateLimitConfig,       // 5/min
  generate: { maxRequests: 10, windowMs: 60 * 1000 } as RateLimitConfig,   // 10/min
  general: { maxRequests: 60, windowMs: 60 * 1000 } as RateLimitConfig,    // 60/min
};

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetMs: number;
}

function createRatelimiter(config: RateLimitConfig): Ratelimit | null {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return null;
  }

  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });

  const windowSec = `${Math.round(config.windowMs / 1000)} s` as `${number} s`;

  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(config.maxRequests, windowSec),
    analytics: true,
  });
}

const limiters = new Map<RateLimitConfig, Ratelimit | null>();

function getLimiter(config: RateLimitConfig): Ratelimit | null {
  if (!limiters.has(config)) {
    limiters.set(config, createRatelimiter(config));
  }
  return limiters.get(config)!;
}

export async function checkRateLimit(key: string, config: RateLimitConfig): Promise<RateLimitResult> {
  const limiter = getLimiter(config);

  // Graceful fallback: no Redis configured (dev/build)
  if (!limiter) {
    return { allowed: true, remaining: config.maxRequests, resetMs: config.windowMs };
  }

  try {
    const result = await limiter.limit(key);
    return {
      allowed: result.success,
      remaining: result.remaining,
      resetMs: result.reset - Date.now(),
    };
  } catch (error) {
    // Fail open: if Redis is unreachable, allow the request
    console.error('[rate-limit] Redis error, failing open:', error);
    return { allowed: true, remaining: config.maxRequests, resetMs: config.windowMs };
  }
}
