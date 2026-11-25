import type { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/server'

/**
 * Verifies whether a Supabase authenticated user is authorized as a site administrator.
 * - If ADMIN_EMAILS is configured (comma-separated), the user's email must match or
 *   have `app_metadata.role === 'admin'`.
 * - Otherwise, any authenticated Supabase user who is not explicitly marked as a non-admin
 *   role ('user' | 'tenant') is accepted (preserving single-owner Supabase setups).
 */
export function isAdminUser(user: User | null | undefined): boolean {
  if (!user) return false

  const appRole = typeof user.app_metadata?.role === 'string'
    ? user.app_metadata.role.toLowerCase()
    : undefined

  if (appRole === 'admin' || appRole === 'superadmin') {
    return true
  }

  const rawAllowlist = process.env.ADMIN_EMAILS?.trim()
  if (rawAllowlist) {
    const allowedEmails = rawAllowlist
      .split(',')
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean)

    if (allowedEmails.length > 0) {
      const userEmail = user.email?.trim().toLowerCase()
      return Boolean(userEmail && allowedEmails.includes(userEmail))
    }
  }

  if (appRole && appRole !== 'admin') {
    return false
  }

  return true
}

export async function requireAdmin() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !isAdminUser(user)) {
    return { supabase: null, user: null, error: 'Unauthorized' as const }
  }

  return { supabase, user: user!, error: null }
}

/**
 * Validates that a URL uses an allowed http/https protocol (prevents javascript: / data: XSS).
 */
export function isSafeHttpUrl(rawUrl: string): boolean {
  if (!rawUrl || typeof rawUrl !== 'string') return false
  try {
    const parsed = new URL(rawUrl.trim())
    return parsed.protocol === 'https:' || parsed.protocol === 'http:'
  } catch {
    return false
  }
}

/**
 * Sanitizes href values for anchor tags (allows relative paths, http/https, mailto, tel).
 */
export function sanitizeHref(rawUrl: string | null | undefined, fallback = '#'): string {
  if (!rawUrl || typeof rawUrl !== 'string') return fallback
  const trimmed = rawUrl.trim()
  if (!trimmed) return fallback
  if (trimmed.startsWith('/') || trimmed.startsWith('#')) {
    // Reject protocol-relative URLs like //evil.com
    if (trimmed.startsWith('//')) return fallback
    return trimmed
  }
  try {
    const parsed = new URL(trimmed)
    if (['https:', 'http:', 'mailto:', 'tel:'].includes(parsed.protocol)) {
      return trimmed
    }
  } catch {
    return fallback
  }
  return fallback
}

const PRIVATE_IPV4_PATTERNS = [
  /^127\./,
  /^10\./,
  /^192\.168\./,
  /^169\.254\./,
  /^0\./,
  /^100\.(6[4-9]|[7-9]\d|1[0-1]\d|12[0-7])\./,
  /^172\.(1[6-9]|2\d|3[0-1])\./,
]

/**
 * Validates an outbound webhook URL against SSRF (blocks non-HTTP(S), localhost,
 * private RFC1918/link-local IPs, cloud metadata hosts, and local hostnames).
 */
export function assertPublicWebhookUrl(rawUrl: string): { ok: true; url: string } | { ok: false; error: string } {
  if (!rawUrl || typeof rawUrl !== 'string') {
    return { ok: false, error: 'Webhook URL is required' }
  }

  let parsed: URL
  try {
    parsed = new URL(rawUrl.trim())
  } catch {
    return { ok: false, error: 'Invalid webhook URL format' }
  }

  if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
    return { ok: false, error: 'Webhook URL must use http:// or https://' }
  }

  if (parsed.username || parsed.password) {
    return { ok: false, error: 'Webhook URL must not embed credentials' }
  }

  const hostname = parsed.hostname.toLowerCase().replace(/^\[|\]$/g, '')

  if (
    hostname === 'localhost' ||
    hostname === '::1' ||
    hostname === '0.0.0.0' ||
    hostname.endsWith('.local') ||
    hostname.endsWith('.internal') ||
    hostname.endsWith('.localhost') ||
    hostname === 'metadata.google.internal'
  ) {
    return { ok: false, error: 'Webhook URL cannot target local or internal hosts' }
  }

  if (PRIVATE_IPV4_PATTERNS.some((pattern) => pattern.test(hostname))) {
    return { ok: false, error: 'Webhook URL cannot target private IP addresses' }
  }

  // Block IPv6 private/link-local ranges (fc00::/7, fe80::/10, ::ffff:127.x/10.x/etc.)
  if (
    hostname.startsWith('fc') ||
    hostname.startsWith('fd') ||
    hostname.startsWith('fe80:') ||
    hostname.startsWith('::ffff:')
  ) {
    return { ok: false, error: 'Webhook URL cannot target private IPv6 ranges' }
  }

  return { ok: true, url: parsed.toString() }
}

const ALLOWED_IMAGE_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
])

const ALLOWED_IMAGE_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif'])
const MAX_IMAGE_BYTES = 5 * 1024 * 1024 // 5 MB

export function validateImageFile(file: File): string | null {
  if (!file) return 'No file provided'
  if (file.size > MAX_IMAGE_BYTES) {
    return 'Image file must be 5 MB or smaller'
  }
  const ext = file.name.split('.').pop()?.toLowerCase() || ''
  if (!ALLOWED_IMAGE_EXTENSIONS.has(ext) || (file.type && !ALLOWED_IMAGE_MIME_TYPES.has(file.type))) {
    return 'Only JPG, PNG, WebP, GIF, and AVIF images are allowed'
  }
  return null
}
