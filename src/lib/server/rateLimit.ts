interface RateLimitEntry {
  count: number
  resetAt: number
}

const store = new Map<string, RateLimitEntry>()

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  retryAfterSeconds: number
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  return request.headers.get('x-real-ip')?.trim() || 'unknown'
}

export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now()

  // Periodically prune expired entries to prevent unbounded memory growth
  if (store.size > 2000) {
    for (const [k, v] of store.entries()) {
      if (v.resetAt <= now) store.delete(k)
    }
  }

  const existing = store.get(key)
  if (!existing || existing.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + windowMs })
    return { allowed: true, remaining: limit - 1, retryAfterSeconds: Math.ceil(windowMs / 1000) }
  }

  if (existing.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
    }
  }

  existing.count += 1
  return {
    allowed: true,
    remaining: Math.max(0, limit - existing.count),
    retryAfterSeconds: Math.ceil((existing.resetAt - now) / 1000),
  }
}

export async function checkRateLimitAsync(
  key: string,
  limit: number,
  windowMs: number
): Promise<RateLimitResult> {
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL?.trim()
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN?.trim()

  if (!redisUrl || !redisToken) {
    return checkRateLimit(key, limit, windowMs)
  }

  try {
    const baseUrl = redisUrl.replace(/\/+$/, '')
    const namespacedKey = `rl:${key}`
    const response = await fetch(`${baseUrl}/pipeline`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${redisToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([
        ['INCR', namespacedKey],
        ['PTTL', namespacedKey],
      ]),
      signal: AbortSignal.timeout(2000),
    })

    if (!response.ok) {
      return checkRateLimit(key, limit, windowMs)
    }

    const payload = (await response.json()) as Array<{ result?: unknown }>
    const count = Number(payload?.[0]?.result)
    let pttl = Number(payload?.[1]?.result)

    if (!Number.isFinite(count)) {
      return checkRateLimit(key, limit, windowMs)
    }

    if (count === 1 || !Number.isFinite(pttl) || pttl < 0) {
      await fetch(
        `${baseUrl}/pexpire/${encodeURIComponent(namespacedKey)}/${windowMs}`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${redisToken}` },
          signal: AbortSignal.timeout(2000),
        }
      ).catch(() => null)
      pttl = windowMs
    }

    const retryAfterSeconds = Math.max(1, Math.ceil(pttl / 1000))
    if (count > limit) {
      return {
        allowed: false,
        remaining: 0,
        retryAfterSeconds,
      }
    }

    return {
      allowed: true,
      remaining: Math.max(0, limit - count),
      retryAfterSeconds,
    }
  } catch {
    return checkRateLimit(key, limit, windowMs)
  }
}
