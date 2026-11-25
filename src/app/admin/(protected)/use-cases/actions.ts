'use server'

import { createPublicClient } from '@/lib/supabase/public'
import { useCaseSchema, UseCaseFormValues } from '@/lib/validations/useCase'
import { requireAdmin } from '@/lib/auth/admin'
import { deleteStorageFileByUrl } from '@/lib/storage'
import { revalidatePath } from 'next/cache'

export async function getPublishedUseCases() {
  try {
    const supabase = createPublicClient()
    const { data, error } = await supabase
      .from('use_cases')
      .select('*')
      .eq('status', 'published')
      .order('display_order', { ascending: true })

    if (error) return { error: 'Failed to fetch use cases' }
    return { data }
  } catch {
    return { error: 'Failed to fetch use cases' }
  }
}

export async function getPublishedUseCaseBySlug(slug: string) {
  try {
    const supabase = createPublicClient()
    const { data, error } = await supabase
      .from('use_cases')
      .select('*')
      .eq('industry_slug', slug)
      .eq('status', 'published')
      .maybeSingle()

    if (error) return { error: 'Failed to fetch use case by slug' }
    return { data }
  } catch {
    return { error: 'Failed to fetch use case by slug' }
  }
}

export async function getUseCases() {
  const auth = await requireAdmin()
  if (auth.error || !auth.supabase) {
    return { error: 'Unauthorized' }
  }

  const { data, error } = await auth.supabase
    .from('use_cases')
    .select('*')
    .order('display_order', { ascending: true })

  if (error) return { error: error.message || 'Failed to fetch use cases' }
  return { data }
}

export async function getUseCase(id: string) {
  const auth = await requireAdmin()
  if (auth.error || !auth.supabase) {
    return { error: 'Unauthorized' }
  }

  const { data, error } = await auth.supabase
    .from('use_cases')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return { error: error.message || 'Failed to fetch use case' }
  return { data }
}

export async function getUseCaseBySlug(slug: string) {
  const auth = await requireAdmin()
  if (auth.error || !auth.supabase) {
    return { error: 'Unauthorized' }
  }

  const { data, error } = await auth.supabase
    .from('use_cases')
    .select('*')
    .eq('industry_slug', slug)
    .single()

  if (error) return { error: 'Failed to fetch use case by slug' }
  return { data }
}

export async function createUseCase(data: UseCaseFormValues) {
  const auth = await requireAdmin()
  if (auth.error || !auth.supabase) {
    return { error: 'Unauthorized' }
  }

  const parsed = useCaseSchema.safeParse(data)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || 'Invalid use case data' }
  }

  const validatedData = parsed.data

  const { error } = await auth.supabase
    .from('use_cases')
    .insert([{ ...validatedData }])

  if (error) return { error: error.message }

  revalidatePath('/admin/use-cases')
  revalidatePath('/use-cases')
  revalidatePath('/')
  revalidatePath(`/use-cases/${validatedData.industry_slug}`)
  return { success: true }
}

export async function updateUseCase(id: string, data: UseCaseFormValues) {
  const auth = await requireAdmin()
  if (auth.error || !auth.supabase) {
    return { error: 'Unauthorized' }
  }

  const parsed = useCaseSchema.safeParse(data)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || 'Invalid use case data' }
  }

  const validatedData = parsed.data

  const { data: current } = await auth.supabase
    .from('use_cases')
    .select('industry_slug, cover_image_url')
    .eq('id', id)
    .maybeSingle()

  const { error } = await auth.supabase
    .from('use_cases')
    .update({ ...validatedData })
    .eq('id', id)

  if (error) return { error: error.message }

  if (current?.cover_image_url && current.cover_image_url !== validatedData.cover_image_url) {
    await deleteStorageFileByUrl(auth.supabase, current.cover_image_url)
  }

  revalidatePath('/admin/use-cases')
  revalidatePath('/use-cases')
  revalidatePath('/')
  revalidatePath(`/use-cases/${validatedData.industry_slug}`)
  if (current?.industry_slug && current.industry_slug !== validatedData.industry_slug) {
    revalidatePath(`/use-cases/${current.industry_slug}`)
  }
  return { success: true }
}

export async function deleteUseCase(id: string) {
  const auth = await requireAdmin()
  if (auth.error || !auth.supabase) {
    return { error: 'Unauthorized' }
  }

  const { data: current } = await auth.supabase
    .from('use_cases')
    .select('industry_slug, cover_image_url')
    .eq('id', id)
    .maybeSingle()

  const { error } = await auth.supabase
    .from('use_cases')
    .delete()
    .eq('id', id)

  if (error) return { error: error.message }

  if (current?.cover_image_url) {
    await deleteStorageFileByUrl(auth.supabase, current.cover_image_url)
  }

  revalidatePath('/admin/use-cases')
  revalidatePath('/use-cases')
  revalidatePath('/')
  if (current?.industry_slug) {
    revalidatePath(`/use-cases/${current.industry_slug}`)
  }
  return { success: true }
}

export async function updateUseCaseOrder(items: { id: string; display_order: number }[]) {
  const auth = await requireAdmin()
  if (auth.error || !auth.supabase) {
    return { error: 'Unauthorized' }
  }

  for (const item of items) {
    const { error } = await auth.supabase
      .from('use_cases')
      .update({ display_order: item.display_order })
      .eq('id', item.id)

    if (error) return { error: error.message || 'Failed to update order' }
  }

  revalidatePath('/admin/use-cases')
  revalidatePath('/use-cases')
  revalidatePath('/')
  return { success: true }
}
