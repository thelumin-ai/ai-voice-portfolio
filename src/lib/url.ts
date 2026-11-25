/**
 * Client-and-server-safe URL and upload validation helpers.
 * Never imports server-only modules like next/headers.
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

export function sanitizeHref(rawUrl: string | null | undefined, fallback = '#'): string {
  if (!rawUrl || typeof rawUrl !== 'string') return fallback
  const trimmed = rawUrl.trim()
  if (!trimmed) return fallback
  if (trimmed.startsWith('/') || trimmed.startsWith('#')) {
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
