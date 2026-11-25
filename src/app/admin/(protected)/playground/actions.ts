'use server'

import { createPublicClient } from '@/lib/supabase/public'
import { playgroundAppSchema, PlaygroundAppFormValues } from '@/lib/validations/playground'
import { requireAdmin } from '@/lib/auth/admin'
import { revalidatePath } from 'next/cache'

export async function getPublishedPlaygroundApps() {
  try {
    const supabase = createPublicClient()
    const { data, error } = await supabase
      .from('playground_apps')
      .select('*')
      .eq('status', 'published')
      .order('display_order', { ascending: true })

    if (error) {
      console.error('Error fetching published playground apps:', error)
      return { error: 'Failed to fetch playground apps' }
    }

    return { data }
  } catch (error) {
    console.error('Error fetching published playground apps:', error)
    return { error: 'Failed to fetch playground apps' }
  }
}

export async function getPlaygroundApps() {
  const auth = await requireAdmin()
  if (auth.error || !auth.supabase) {
    return { error: 'Unauthorized' }
  }

  const { data, error } = await auth.supabase
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
  const auth = await requireAdmin()
  if (auth.error || !auth.supabase) {
    return { error: 'Unauthorized' }
  }

  const { data, error } = await auth.supabase
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
  const auth = await requireAdmin()
  if (auth.error || !auth.supabase) {
    return { error: 'Unauthorized' }
  }

  const parsed = playgroundAppSchema.safeParse(data)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || 'Invalid playground app data' }
  }

  const validatedData = parsed.data

  const { error } = await auth.supabase
    .from('playground_apps')
    .insert([
      {
        title: validatedData.title,
        description: validatedData.description,
        category: validatedData.category,
        embed_url: validatedData.embed_url,
        status: validatedData.status,
        display_order: validatedData.display_order,
      },
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
  const auth = await requireAdmin()
  if (auth.error || !auth.supabase) {
    return { error: 'Unauthorized' }
  }

  const parsed = playgroundAppSchema.safeParse(data)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || 'Invalid playground app data' }
  }

  const validatedData = parsed.data

  const { error } = await auth.supabase
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
  const auth = await requireAdmin()
  if (auth.error || !auth.supabase) {
    return { error: 'Unauthorized' }
  }

  const { error } = await auth.supabase
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
  const auth = await requireAdmin()
  if (auth.error || !auth.supabase) {
    return { error: 'Unauthorized' }
  }

  for (const item of items) {
    const { error } = await auth.supabase
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
