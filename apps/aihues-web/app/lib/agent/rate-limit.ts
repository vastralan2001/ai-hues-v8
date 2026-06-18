import { Redis } from '@upstash/redis';

export interface LimitCheck {
  allowed: boolean;
  retryAfter?: number;
  remainingRequests?: number;
  remainingTokens?: number;
}

interface MemoryBucket {
  count: number;
  resetAt: number;
  tokens: number;
  tokensResetAt: number;
}

const RATE_WINDOW_MS = 60_000;
const RATE_LIMIT = 30;
const TOKEN_WINDOW_MS = 86_400_000; // 24h
const DEFAULT_TOKEN_BUDGET = Number(
  process.env.AIHUES_DAILY_TOKEN_BUDGET || 10_000
);

function getRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  try {
    return new Redis({ url, token });
  } catch {
    return null;
  }
}

class MemoryLimiter {
  private buckets = new Map<string, MemoryBucket>();

  private getBucket(ip: string): MemoryBucket {
    const now = Date.now();
    const existing = this.buckets.get(ip);
    if (!existing || now > existing.resetAt) {
      const fresh: MemoryBucket = {
        count: 0,
        resetAt: now + RATE_WINDOW_MS,
        tokens: 0,
        tokensResetAt: now + TOKEN_WINDOW_MS,
      };
      this.buckets.set(ip, fresh);
      return fresh;
    }
    return existing;
  }

  async checkRequest(ip: string): Promise<LimitCheck> {
    const bucket = this.getBucket(ip);
    if (bucket.count >= RATE_LIMIT) {
      return {
        allowed: false,
        retryAfter: Math.ceil((bucket.resetAt - Date.now()) / 1000),
        remainingRequests: 0,
      };
    }
    bucket.count += 1;
    return {
      allowed: true,
      remainingRequests: Math.max(0, RATE_LIMIT - bucket.count),
    };
  }

  async consumeTokens(ip: string, tokens: number): Promise<LimitCheck> {
    const bucket = this.getBucket(ip);
    if (bucket.tokens + tokens > DEFAULT_TOKEN_BUDGET) {
      return {
        allowed: false,
        retryAfter: Math.ceil((bucket.tokensResetAt - Date.now()) / 1000),
        remainingTokens: Math.max(0, DEFAULT_TOKEN_BUDGET - bucket.tokens),
      };
    }
    bucket.tokens += tokens;
    return {
      allowed: true,
      remainingTokens: Math.max(0, DEFAULT_TOKEN_BUDGET - bucket.tokens),
    };
  }
}

class RedisLimiter {
  private redis: Redis;

  constructor(redis: Redis) {
    this.redis = redis;
  }

  async checkRequest(ip: string): Promise<LimitCheck> {
    const key = `agent:rate:${ip}`;
    const now = Date.now();
    const windowStart = now - (now % RATE_WINDOW_MS) + RATE_WINDOW_MS;
    const ttl = Math.ceil((windowStart - now) / 1000);

    const pipeline = this.redis.pipeline();
    pipeline.incr(key);
    pipeline.expire(key, ttl);
    const [countRes] = (await pipeline.exec()) as [number, unknown];
    const count = typeof countRes === 'number' ? countRes : 1;

    if (count > RATE_LIMIT) {
      return {
        allowed: false,
        retryAfter: ttl,
        remainingRequests: 0,
      };
    }
    return {
      allowed: true,
      remainingRequests: Math.max(0, RATE_LIMIT - count),
    };
  }

  async consumeTokens(ip: string, tokens: number): Promise<LimitCheck> {
    const key = `agent:tokens:${ip}`;
    const now = Date.now();
    const windowStart = now - (now % TOKEN_WINDOW_MS) + TOKEN_WINDOW_MS;
    const ttl = Math.ceil((windowStart - now) / 1000);

    const current = await this.redis.get<number>(key);
    const used = typeof current === 'number' ? current : 0;

    if (used + tokens > DEFAULT_TOKEN_BUDGET) {
      return {
        allowed: false,
        retryAfter: ttl,
        remainingTokens: Math.max(0, DEFAULT_TOKEN_BUDGET - used),
      };
    }

    await this.redis.incrby(key, tokens);
    await this.redis.expire(key, ttl);
    return {
      allowed: true,
      remainingTokens: Math.max(0, DEFAULT_TOKEN_BUDGET - used - tokens),
    };
  }
}

let limiter: MemoryLimiter | RedisLimiter | null = null;

export function getAgentLimiter(): MemoryLimiter | RedisLimiter {
  if (!limiter) {
    const redis = getRedis();
    if (redis) {
      console.log('[Agent Limit] Using Upstash Redis backend');
      limiter = new RedisLimiter(redis);
    } else {
      console.log(
        '[Agent Limit] UPSTASH_REDIS_REST_URL/TOKEN not set; using in-memory backend'
      );
      limiter = new MemoryLimiter();
    }
  }
  return limiter;
}
