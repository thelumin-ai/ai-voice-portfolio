import test from 'node:test'
import assert from 'node:assert/strict'
import {
  getClientIp,
  checkRateLimit,
  checkRateLimitAsync,
} from '../src/lib/server/rateLimit.ts'

test('getClientIp reads first forwarded IP cleanly or falls back to x-real-ip', () => {
  const reqForwarded = new Request('https://example.com', {
    headers: { 'x-forwarded-for': '203.0.113.10, 10.0.0.1' },
  })
  assert.equal(getClientIp(reqForwarded), '203.0.113.10')

  const reqRealIp = new Request('https://example.com', {
    headers: { 'x-real-ip': '198.51.100.7' },
  })
  assert.equal(getClientIp(reqRealIp), '198.51.100.7')

  const reqNone = new Request('https://example.com')
  assert.equal(getClientIp(reqNone), 'unknown')
})

test('checkRateLimit enforces limit and resets after window expiration', async () => {
  const key = `test-sync-${Date.now()}-${Math.random()}`

  const r1 = checkRateLimit(key, 2, 30)
  assert.equal(r1.allowed, true)
  assert.equal(r1.remaining, 1)

  const r2 = checkRateLimit(key, 2, 30)
  assert.equal(r2.allowed, true)
  assert.equal(r2.remaining, 0)

  const r3 = checkRateLimit(key, 2, 30)
  assert.equal(r3.allowed, false)
  assert.equal(r3.remaining, 0)
  assert.ok(r3.retryAfterSeconds >= 1)

  await new Promise((resolve) => setTimeout(resolve, 45))

  const r4 = checkRateLimit(key, 2, 30)
  assert.equal(r4.allowed, true)
  assert.equal(r4.remaining, 1)
})

test('checkRateLimitAsync falls back to in-memory limiter when Upstash env vars are unset', async () => {
  const prevUrl = process.env.UPSTASH_REDIS_REST_URL
  const prevToken = process.env.UPSTASH_REDIS_REST_TOKEN
  delete process.env.UPSTASH_REDIS_REST_URL
  delete process.env.UPSTASH_REDIS_REST_TOKEN

  try {
    const key = `test-async-${Date.now()}-${Math.random()}`
    const first = await checkRateLimitAsync(key, 1, 60_000)
    const second = await checkRateLimitAsync(key, 1, 60_000)

    assert.equal(first.allowed, true)
    assert.equal(second.allowed, false)
  } finally {
    if (prevUrl !== undefined) process.env.UPSTASH_REDIS_REST_URL = prevUrl
    if (prevToken !== undefined) process.env.UPSTASH_REDIS_REST_TOKEN = prevToken
  }
})
