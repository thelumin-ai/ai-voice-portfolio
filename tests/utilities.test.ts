import test from 'node:test'
import assert from 'node:assert/strict'
import { isSafeHttpUrl, sanitizeHref, validateImageFile } from '../src/lib/url.ts'
import { extractStoragePathFromUrl } from '../src/lib/storage.ts'
import { getErrorMessage } from '../src/lib/errors.ts'
import { serializeJsonLd } from '../src/lib/seo/jsonLd.ts'

test('isSafeHttpUrl accepts http/https and rejects unsafe protocols', () => {
  assert.equal(isSafeHttpUrl('https://example.com/path?a=1'), true)
  assert.equal(isSafeHttpUrl('http://localhost:3000'), true)
  assert.equal(isSafeHttpUrl('javascript:alert(1)'), false)
  assert.equal(isSafeHttpUrl('data:text/html,<script>alert(1)</script>'), false)
  assert.equal(isSafeHttpUrl('not a url'), false)
})

test('sanitizeHref preserves safe links and blocks protocol injection', () => {
  assert.equal(sanitizeHref('/use-cases'), '/use-cases')
  assert.equal(sanitizeHref('#consultation'), '#consultation')
  assert.equal(sanitizeHref('mailto:hello@example.com'), 'mailto:hello@example.com')
  assert.equal(sanitizeHref('https://example.com'), 'https://example.com')
  assert.equal(sanitizeHref('//evil.com/phish', '/safe'), '/safe')
  assert.equal(sanitizeHref('javascript:alert(1)', '/safe'), '/safe')
  assert.equal(sanitizeHref(null, '/fallback'), '/fallback')
})

test('validateImageFile allows valid image formats within 5 MB and rejects invalid files', () => {
  const validPng = new File([new Uint8Array(128)], 'cover.png', { type: 'image/png' })
  assert.equal(validateImageFile(validPng), null)

  const invalidType = new File(['<svg></svg>'], 'vector.svg', { type: 'image/svg+xml' })
  assert.equal(validateImageFile(invalidType), 'Only JPG, PNG, WebP, GIF, and AVIF images are allowed')

  const oversized = new File([new Uint8Array(5 * 1024 * 1024 + 1)], 'huge.jpg', {
    type: 'image/jpeg',
  })
  assert.equal(validateImageFile(oversized), 'Image file must be 5 MB or smaller')
})

test('extractStoragePathFromUrl parses Supabase public bucket paths safely', () => {
  const url =
    'https://abcxyz.supabase.co/storage/v1/object/public/portfolio_media/covers/demo%201.png'
  assert.equal(extractStoragePathFromUrl(url), 'covers/demo 1.png')
  assert.equal(
    extractStoragePathFromUrl('https://abcxyz.supabase.co/storage/v1/object/public/other_bucket/x.png'),
    null
  )
  assert.equal(extractStoragePathFromUrl('https://unsplash.com/photo.jpg'), null)
  assert.equal(extractStoragePathFromUrl(''), null)
})

test('getErrorMessage extracts messages cleanly from Error, objects, and strings', () => {
  assert.equal(getErrorMessage(new Error('Boom')), 'Boom')
  assert.equal(getErrorMessage({ message: 'Object error' }), 'Object error')
  assert.equal(getErrorMessage('Plain failure'), 'Plain failure')
  assert.equal(getErrorMessage(42, 'Fallback message'), 'Fallback message')
})

test('serializeJsonLd escapes closing script characters to prevent HTML breakout', () => {
  const output = serializeJsonLd({
    '@type': 'BlogPosting',
    headline: 'Hello </script><script>alert(1)</script>',
  })
  assert.equal(output.includes('<'), false)
  assert.equal(output.includes('\\u003c/script>'), true)
})
