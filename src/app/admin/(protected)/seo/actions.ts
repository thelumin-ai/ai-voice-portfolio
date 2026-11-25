'use server'

import { createPublicClient } from '@/lib/supabase/public'
import { seoSchema, SeoFormValues } from '@/lib/validations/seo'
import { requireAdmin } from '@/lib/auth/admin'
import { deleteStorageFileByUrl } from '@/lib/storage'
import { revalidatePath } from 'next/cache'
import { cache } from 'react'

export const getSeoSettings = cache(async () => {
  try {
    const supabase = createPublicClient()

    const { data, error } = await supabase
      .from('seo_settings')
      .select('*')
      .order('page_path', { ascending: true })

    if (error) {
      console.error('Error fetching SEO settings:', error)
      return { error: 'Failed to fetch SEO settings' }
    }

    return { data }
  } catch (error) {
    console.error('Error fetching SEO settings:', error)
    return { error: 'Failed to fetch SEO settings' }
  }
})

export async function getAdminSeoSettings() {
  const auth = await requireAdmin()
  if (auth.error || !auth.supabase) {
    return { error: 'Unauthorized' }
  }

  const { data, error } = await auth.supabase
    .from('seo_settings')
    .select('*')
    .order('page_path', { ascending: true })

  if (error) {
    console.error('Error fetching admin SEO settings:', error)
    return { error: error.message || 'Failed to fetch SEO settings' }
  }

  return { data }
}

export async function getSeoSetting(id: string) {
  const auth = await requireAdmin()
  if (auth.error || !auth.supabase) {
    return { error: 'Unauthorized' }
  }

  const { data, error } = await auth.supabase
    .from('seo_settings')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching SEO setting:', error)
    return { error: error.message || 'Failed to fetch SEO setting' }
  }

  return { data }
}

export async function createSeoSetting(data: SeoFormValues) {
  const auth = await requireAdmin()
  if (auth.error || !auth.supabase) {
    return { error: 'Unauthorized' }
  }

  const parsed = seoSchema.safeParse(data)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || 'Invalid SEO setting data' }
  }

  const validatedData = parsed.data

  const { error } = await auth.supabase
    .from('seo_settings')
    .insert([
      {
        page_path: validatedData.page_path,
        title: validatedData.title,
        description: validatedData.description,
        keywords: validatedData.keywords,
        og_image_url: validatedData.og_image_url,
      },
    ])

  if (error) {
    console.error('Error creating SEO setting:', error)
    return { error: error.message }
  }

  revalidatePath('/admin/seo')
  revalidatePath(validatedData.page_path)
  return { success: true }
}

export async function updateSeoSetting(id: string, data: SeoFormValues) {
  const auth = await requireAdmin()
  if (auth.error || !auth.supabase) {
    return { error: 'Unauthorized' }
  }

  const parsed = seoSchema.safeParse(data)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || 'Invalid SEO setting data' }
  }

  const validatedData = parsed.data

  const { data: current } = await auth.supabase
    .from('seo_settings')
    .select('page_path, og_image_url')
    .eq('id', id)
    .maybeSingle()

  const { error } = await auth.supabase
    .from('seo_settings')
    .update({
      page_path: validatedData.page_path,
      title: validatedData.title,
      description: validatedData.description,
      keywords: validatedData.keywords,
      og_image_url: validatedData.og_image_url,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)

  if (error) {
    console.error('Error updating SEO setting:', error)
    return { error: error.message }
  }

  if (current?.og_image_url && current.og_image_url !== (validatedData.og_image_url || '')) {
    await deleteStorageFileByUrl(auth.supabase, current.og_image_url)
  }

  revalidatePath('/admin/seo')
  revalidatePath(validatedData.page_path)
  if (current?.page_path && current.page_path !== validatedData.page_path) {
    revalidatePath(current.page_path)
  }
  return { success: true }
}

export async function deleteSeoSetting(id: string) {
  const auth = await requireAdmin()
  if (auth.error || !auth.supabase) {
    return { error: 'Unauthorized' }
  }

  const { data: current } = await auth.supabase
    .from('seo_settings')
    .select('page_path, og_image_url')
    .eq('id', id)
    .maybeSingle()

  const { error } = await auth.supabase
    .from('seo_settings')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting SEO setting:', error)
    return { error: error.message }
  }

  if (current?.og_image_url) {
    await deleteStorageFileByUrl(auth.supabase, current.og_image_url)
  }

  revalidatePath('/admin/seo')
  if (current?.page_path) {
    revalidatePath(current.page_path)
  }
  return { success: true }
}
