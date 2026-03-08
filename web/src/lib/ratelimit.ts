import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url:   process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

// Chat: 1 message per 2 seconds
export const chatRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(1, '2 s'),
  prefix:  'turbomindz:chat',
})

// API: 100 requests per minute
export const apiRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, '1 m'),
  prefix:  'turbomindz:api',
})

// Auth: 10 attempts per 15 minutes
export const authRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '15 m'),
  prefix:  'turbomindz:auth',
})
