'use server'

import { createClient } from '@/lib/supabase/server'
import { seoSchema, SeoFormValues } from '@/lib/validations/seo'
import { revalidatePath } from 'next/cache'

export async function getSeoSettings() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('seo_settings')
    .select('*')
    .order('page_path', { ascending: true })

  if (error) {
    console.error('Error fetching SEO settings:', error)
    return { error: 'Failed to fetch SEO settings' }
  }

  return { data }
}

export async function getSeoSetting(id: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('seo_settings')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching SEO setting:', error)
    return { error: 'Failed to fetch SEO setting' }
  }

  return { data }
}

export async function createSeoSetting(data: SeoFormValues) {
  const supabase = await createClient()
  
  const validatedData = seoSchema.parse(data)

  const { error } = await supabase
    .from('seo_settings')
    .insert([
      {
        page_path: validatedData.page_path,
        title: validatedData.title,
        description: validatedData.description,
        keywords: validatedData.keywords,
        og_image_url: validatedData.og_image_url,
      }
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
  const supabase = await createClient()
  
  const validatedData = seoSchema.parse(data)

  const { error } = await supabase
    .from('seo_settings')
    .update({
        page_path: validatedData.page_path,
        title: validatedData.title,
        description: validatedData.description,
        keywords: validatedData.keywords,
        og_image_url: validatedData.og_image_url,
        updated_at: new Date().toISOString()
    })
    .eq('id', id)

  if (error) {
    console.error('Error updating SEO setting:', error)
    return { error: error.message }
  }

  revalidatePath('/admin/seo')
  revalidatePath(validatedData.page_path)
  return { success: true }
}

export async function deleteSeoSetting(id: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('seo_settings')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting SEO setting:', error)
    return { error: error.message }
  }

  revalidatePath('/admin/seo')
  return { success: true }
}
