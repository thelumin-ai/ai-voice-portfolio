'use server'

import { createClient } from '@/lib/supabase/server'
import { playgroundAppSchema, PlaygroundAppFormValues } from '@/lib/validations/playground'
import { revalidatePath } from 'next/cache'

export async function getPlaygroundApps() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('playground_apps')
    .select('*')
    .order('display_order', { ascending: true })

  if (error) {
    console.error('Error fetching playground apps:', error)
    return { error: 'Failed to fetch playground apps' }
  }

  return { data }
}

export async function getPlaygroundApp(id: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('playground_apps')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching playground app:', error)
    return { error: 'Failed to fetch playground app' }
  }

  return { data }
}

export async function createPlaygroundApp(data: PlaygroundAppFormValues) {
  const supabase = await createClient()
  
  const validatedData = playgroundAppSchema.parse(data)

  const { error } = await supabase
    .from('playground_apps')
    .insert([
      {
        title: validatedData.title,
        description: validatedData.description,
        category: validatedData.category,
        embed_url: validatedData.embed_url,
        status: validatedData.status,
        display_order: validatedData.display_order,
      }
    ])

  if (error) {
    console.error('Error creating playground app:', error)
    return { error: error.message }
  }

  revalidatePath('/admin/playground')
  revalidatePath('/playground')
  return { success: true }
}

export async function updatePlaygroundApp(id: string, data: PlaygroundAppFormValues) {
  const supabase = await createClient()
  
  const validatedData = playgroundAppSchema.parse(data)

  const { error } = await supabase
    .from('playground_apps')
    .update({
        title: validatedData.title,
        description: validatedData.description,
        category: validatedData.category,
        embed_url: validatedData.embed_url,
        status: validatedData.status,
        display_order: validatedData.display_order,
    })
    .eq('id', id)

  if (error) {
    console.error('Error updating playground app:', error)
    return { error: error.message }
  }

  revalidatePath('/admin/playground')
  revalidatePath('/playground')
  return { success: true }
}

export async function deletePlaygroundApp(id: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('playground_apps')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting playground app:', error)
    return { error: error.message }
  }

  revalidatePath('/admin/playground')
  revalidatePath('/playground')
  return { success: true }
}

export async function updatePlaygroundOrder(items: { id: string; display_order: number }[]) {
  const supabase = await createClient()

  for (const item of items) {
    const { error } = await supabase
      .from('playground_apps')
      .update({ display_order: item.display_order })
      .eq('id', item.id)

    if (error) {
      console.error('Error updating order:', error)
      return { error: 'Failed to update order' }
    }
  }

  revalidatePath('/admin/playground')
  revalidatePath('/playground')
  return { success: true }
}
