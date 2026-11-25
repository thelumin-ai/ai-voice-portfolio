'use server'

import { createPublicClient } from '@/lib/supabase/public'
import { revalidatePath } from 'next/cache'
import { portfolioSchema, PortfolioFormValues } from '@/lib/validations/portfolio'
import { requireAdmin } from '@/lib/auth/admin'
import { deleteStorageFileByUrl } from '@/lib/storage'

/**
 * Public-safe portfolio loader: returns ONLY published projects and strips secret
 * Retell API keys (only Vapi public client keys are kept for client-side WebRTC SDK).
 */
export async function getPublicPortfolioProjects() {
  try {
    const supabase = createPublicClient()
    const { data, error } = await supabase
      .from('portfolio_projects')
      .select(
        'id, title, industry_tag, short_description, case_study_body, metrics, integrations, media_files, project_type, media_url, api_key, cover_image_url, voice_platform, status, is_featured, display_order, created_at'
      )
      .eq('status', 'published')
      .order('display_order', { ascending: true })

    if (error) {
      console.error('Error fetching public portfolio projects:', error)
      return []
    }

    return (data || []).map((project) => ({
      ...project,
      // Never expose secret Retell API keys to browser clients; Retell calls resolve keys server-side
      api_key: project.voice_platform === 'retell' ? null : project.api_key,
    }))
  } catch (error) {
    console.error('Error fetching public portfolio projects:', error)
    return []
  }
}

/**
 * Admin-only portfolio loader (includes drafts, archived items, and config fields).
 */
export async function getPortfolioProjects() {
  const auth = await requireAdmin()
  if (auth.error || !auth.supabase) {
    return []
  }

  const { data, error } = await auth.supabase
    .from('portfolio_projects')
    .select('*')
    .order('display_order', { ascending: true })

  if (error) {
    console.error('Error fetching portfolio projects:', error)
    return []
  }

  return data || []
}

export async function getPortfolioProject(id: string) {
  const auth = await requireAdmin()
  if (auth.error || !auth.supabase) {
    return null
  }

  const { data, error } = await auth.supabase
    .from('portfolio_projects')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching portfolio project:', error)
    return null
  }

  return data
}

export async function createPortfolioProject(values: PortfolioFormValues) {
  const auth = await requireAdmin()
  if (auth.error || !auth.supabase) {
    return { error: 'Unauthorized' }
  }

  const parsed = portfolioSchema.safeParse(values)
  if (!parsed.success) {
    const firstError = parsed.error.issues?.[0]?.message || 'Invalid form data'
    return { error: firstError }
  }

  const { id: _id, ...dataToInsert } = parsed.data
  void _id

  const { data, error } = await auth.supabase
    .from('portfolio_projects')
    .insert([dataToInsert])
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/portfolio')
  revalidatePath('/portfolio')
  revalidatePath('/')
  return { data }
}

export async function updatePortfolioProject(id: string, values: PortfolioFormValues) {
  const auth = await requireAdmin()
  if (auth.error || !auth.supabase) {
    return { error: 'Unauthorized' }
  }

  const parsed = portfolioSchema.safeParse(values)
  if (!parsed.success) {
    const firstError = parsed.error.issues?.[0]?.message || 'Invalid form data'
    return { error: firstError }
  }

  const { data: existing } = await auth.supabase
    .from('portfolio_projects')
    .select('cover_image_url')
    .eq('id', id)
    .maybeSingle()

  const { id: _id, ...dataToUpdate } = parsed.data
  void _id

  const { data, error } = await auth.supabase
    .from('portfolio_projects')
    .update(dataToUpdate)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  if (existing?.cover_image_url && existing.cover_image_url !== parsed.data.cover_image_url) {
    await deleteStorageFileByUrl(auth.supabase, existing.cover_image_url)
  }

  revalidatePath('/admin/portfolio')
  revalidatePath('/portfolio')
  revalidatePath('/')
  return { data }
}

export async function deletePortfolioProject(id: string) {
  const auth = await requireAdmin()
  if (auth.error || !auth.supabase) {
    return { error: 'Unauthorized' }
  }

  const { data: existing } = await auth.supabase
    .from('portfolio_projects')
    .select('cover_image_url')
    .eq('id', id)
    .maybeSingle()

  const { error } = await auth.supabase
    .from('portfolio_projects')
    .delete()
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  if (existing?.cover_image_url) {
    await deleteStorageFileByUrl(auth.supabase, existing.cover_image_url)
  }

  revalidatePath('/admin/portfolio')
  revalidatePath('/portfolio')
  revalidatePath('/')
  return { success: true }
}

export async function reorderPortfolioProjects(items: { id: string; display_order: number }[]) {
  const auth = await requireAdmin()
  if (auth.error || !auth.supabase) {
    return { error: 'Unauthorized' }
  }

  const results = await Promise.all(
    items.map((item) =>
      auth.supabase!
        .from('portfolio_projects')
        .update({ display_order: item.display_order })
        .eq('id', item.id)
    )
  )

  const failed = results.find((r) => r.error)
  if (failed?.error) {
    console.error('Error reordering portfolio projects:', failed.error)
    return { error: failed.error.message || 'Failed to reorder portfolio projects' }
  }

  revalidatePath('/admin/portfolio')
  revalidatePath('/portfolio')
  revalidatePath('/')
  return { success: true }
}
