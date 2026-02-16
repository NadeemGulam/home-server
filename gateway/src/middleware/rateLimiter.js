// Token Bucket Rate Limiter with Redis
// Returns 429 Too Many Requests when limit exceeded

/**
 * Token Bucket Algorithm:
 * - Each client (IP) gets a bucket with a max capacity of tokens
 * - Tokens refill at a constant rate (e.g., 10 tokens/second)
 * - Each request consumes 1 token
 * - If no tokens available, request is rejected with 429
 * - Allows bursts (if bucket is full) but prevents sustained abuse
 * 
 * Storage: Redis (shared across all gateway instances, survives restarts)
 */

const redis = require('../config/redis');

// Configuration
const BUCKET_CAPACITY = 100; // Max tokens in bucket
const REFILL_RATE = 10; // Tokens added per second
const COST_PER_REQUEST = 1; // Tokens consumed per request
const BUCKET_TTL = 300; // Expire bucket after 5 minutes of inactivity

class TokenBucket {
  constructor() {
    this.capacity = BUCKET_CAPACITY;
    this.tokens = BUCKET_CAPACITY; // Start with full bucket
    this.lastRefill = Date.now();
    this.refillRate = REFILL_RATE;
  }

  // Refill tokens based on time elapsed
  refill() {
    const now = Date.now();
    const timeElapsed = (now - this.lastRefill) / 1000; // seconds
    const tokensToAdd = timeElapsed * this.refillRate;

    this.tokens = Math.min(this.capacity, this.tokens + tokensToAdd);
    this.lastRefill = now;
  }

  // Try to consume tokens, return true if successful
  consume(tokens = COST_PER_REQUEST) {
    this.refill(); // Refill before checking

    if (this.tokens >= tokens) {
      this.tokens -= tokens;
      return true;
    }
    return false;
  }

  // Get current token count (for debugging/headers)
  getTokens() {
    this.refill();
    return Math.floor(this.tokens);
  }

  // Serialize to JSON for Redis storage
  toJSON() {
    return {
      capacity: this.capacity,
      tokens: this.tokens,
      lastRefill: this.lastRefill,
      refillRate: this.refillRate
    };
  }

  // Deserialize from Redis
  static fromJSON(data) {
    const bucket = new TokenBucket();
    bucket.capacity = data.capacity;
    bucket.tokens = data.tokens;
    bucket.lastRefill = data.lastRefill;
    bucket.refillRate = data.refillRate;
    return bucket;
  }
}

// Helper: Get bucket from Redis
async function getBucket(clientId) {
  const key = `ratelimit:${clientId}`;
  const data = await redis.get(key);
  
  if (data) {
    return TokenBucket.fromJSON(JSON.parse(data));
  }
  
  // Create new bucket if doesn't exist
  return new TokenBucket();
}

// Helper: Save bucket to Redis
async function saveBucket(clientId, bucket) {
  const key = `ratelimit:${clientId}`;
  await redis.setex(key, BUCKET_TTL, JSON.stringify(bucket.toJSON()));
}

// Middleware function (async)
module.exports = async (req, res, next) => {
  try {
    // Get client identifier (IP address)
    const clientId = req.ip || req.connection.remoteAddress || 'unknown';

    // Get bucket from Redis
    const bucket = await getBucket(clientId);

    // Try to consume a token
    if (bucket.consume()) {
      // Save updated bucket back to Redis
      await saveBucket(clientId, bucket);

      // Success - add rate limit headers
      res.setHeader('X-RateLimit-Limit', BUCKET_CAPACITY);
      res.setHeader('X-RateLimit-Remaining', bucket.getTokens());
      res.setHeader('X-RateLimit-Reset', Math.ceil(bucket.lastRefill / 1000) + Math.ceil((BUCKET_CAPACITY - bucket.getTokens()) / REFILL_RATE));
      
      next();
    } else {
      // Rate limit exceeded
      res.setHeader('X-RateLimit-Limit', BUCKET_CAPACITY);
      res.setHeader('X-RateLimit-Remaining', 0);
      res.setHeader('Retry-After', Math.ceil((COST_PER_REQUEST - bucket.getTokens()) / REFILL_RATE));
      
      res.status(429).json({
        error: 'Too Many Requests',
        message: `Rate limit exceeded. Please try again in ${Math.ceil((COST_PER_REQUEST - bucket.getTokens()) / REFILL_RATE)} seconds.`,
        limit: BUCKET_CAPACITY,
        refillRate: `${REFILL_RATE} requests/second`
      });
    }
  } catch (error) {
    // If Redis fails, log error but allow request through (fail open)
    console.error('Rate limiter error:', error);
    next();
  }
};
