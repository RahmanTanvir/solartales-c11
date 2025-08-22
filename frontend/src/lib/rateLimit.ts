// Simple in-memory rate limiting (for production, use Redis or database)
interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

export interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
}

export function rateLimit(
  identifier: string,
  config: RateLimitConfig = { windowMs: 60000, maxRequests: 10 } // Default: 10 requests per minute
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const { windowMs, maxRequests } = config;

  // Clean up expired entries
  if (store[identifier] && now > store[identifier].resetTime) {
    delete store[identifier];
  }

  if (!store[identifier]) {
    store[identifier] = {
      count: 1,
      resetTime: now + windowMs
    };
    return {
      allowed: true,
      remaining: maxRequests - 1,
      resetTime: store[identifier].resetTime
    };
  }

  store[identifier].count++;

  const allowed = store[identifier].count <= maxRequests;
  const remaining = Math.max(0, maxRequests - store[identifier].count);

  return {
    allowed,
    remaining,
    resetTime: store[identifier].resetTime
  };
}

// Clean up expired entries periodically (run every 5 minutes)
if (typeof window === 'undefined') { // Only run on server
  setInterval(() => {
    const now = Date.now();
    Object.keys(store).forEach(key => {
      if (now > store[key].resetTime) {
        delete store[key];
      }
    });
  }, 300000); // 5 minutes
}

export function getClientIdentifier(request: Request): string {
  // Try to get a unique identifier for the client
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const userAgent = request.headers.get('user-agent') || '';
  
  const ip = forwarded ? forwarded.split(',')[0] : realIp || 'unknown';
  
  // Create a hash of IP + User Agent for better uniqueness while preserving privacy
  const identifier = `${ip}_${userAgent.slice(0, 50)}`;
  
  return Buffer.from(identifier).toString('base64').slice(0, 32);
}
