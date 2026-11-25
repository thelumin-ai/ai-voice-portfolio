import type { SupabaseClient } from '@supabase/supabase-js'

export function extractStoragePathFromUrl(
  url: string | null | undefined,
  bucket = 'portfolio_media'
): string | null {
  if (!url || typeof url !== 'string') return null
  const trimmed = url.trim()
  if (!trimmed) return null

  try {
    const parsed = new URL(trimmed)
    const marker = `/storage/v1/object/public/${bucket}/`
    const idx = parsed.pathname.indexOf(marker)
    if (idx === -1) return null
    const relativePath = parsed.pathname.slice(idx + marker.length)
    if (!relativePath) return null
    return decodeURIComponent(relativePath)
  } catch {
    return null
  }
}

export async function deleteStorageFileByUrl(
  supabase: SupabaseClient,
  url: string | null | undefined,
  bucket = 'portfolio_media'
): Promise<boolean> {
  const path = extractStoragePathFromUrl(url, bucket)
  if (!path) return false

  try {
    const { error } = await supabase.storage.from(bucket).remove([path])
    if (error) {
      console.error(`Failed to delete stale storage object "${path}":`, error.message)
      return false
    }
    return true
  } catch (err) {
    console.error(`Unexpected error deleting storage object "${path}":`, err)
    return false
  }
}
