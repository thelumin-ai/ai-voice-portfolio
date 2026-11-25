'use server'

import { createPublicClient } from '@/lib/supabase/public'
import { serviceSchema, ServiceFormValues } from '@/lib/validations/service'
import { requireAdmin } from '@/lib/auth/admin'
import { revalidatePath } from 'next/cache'

export async function getPublishedServices() {
  try {
    const supabase = createPublicClient()
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('status', 'published')
      .order('display_order', { ascending: true })

    if (error) {
      console.error('Error fetching published services:', error)
      return { error: 'Failed to fetch services' }
    }

    return { data }
  } catch (error) {
    console.error('Error fetching published services:', error)
    return { error: 'Failed to fetch services' }
  }
}

export async function getServices() {
  const auth = await requireAdmin()
  if (auth.error || !auth.supabase) {
    return { error: 'Unauthorized' }
  }

  const { data, error } = await auth.supabase
    .from('services')
    .select('*')
    .order('display_order', { ascending: true })

  if (error) {
    console.error('Error fetching services:', error)
    return { error: 'Failed to fetch services' }
  }

  return { data }
}

export async function getService(id: string) {
  const auth = await requireAdmin()
  if (auth.error || !auth.supabase) {
    return { error: 'Unauthorized' }
  }

  const { data, error } = await auth.supabase
    .from('services')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching service:', error)
    return { error: 'Failed to fetch service' }
  }

  return { data }
}

export async function createService(data: ServiceFormValues) {
  const auth = await requireAdmin()
  if (auth.error || !auth.supabase) {
    return { error: 'Unauthorized' }
  }

  const parsed = serviceSchema.safeParse(data)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || 'Invalid service data' }
  }

  const validatedData = parsed.data

  const { error } = await auth.supabase
    .from('services')
    .insert([
      {
        title: validatedData.title,
        description: validatedData.description,
        icon_name: validatedData.icon_name,
        status: validatedData.status,
        display_order: validatedData.display_order,
      },
    ])

  if (error) return { error: error.message }

  revalidatePath('/admin/services')
  revalidatePath('/')
  return { success: true }
}

export async function updateService(id: string, data: ServiceFormValues) {
  const auth = await requireAdmin()
  if (auth.error || !auth.supabase) {
    return { error: 'Unauthorized' }
  }

  const parsed = serviceSchema.safeParse(data)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || 'Invalid service data' }
  }

  const validatedData = parsed.data

  const { error } = await auth.supabase
    .from('services')
    .update({
      title: validatedData.title,
      description: validatedData.description,
      icon_name: validatedData.icon_name,
      status: validatedData.status,
      display_order: validatedData.display_order,
    })
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/admin/services')
  revalidatePath('/')
  return { success: true }
}

export async function deleteService(id: string) {
  const auth = await requireAdmin()
  if (auth.error || !auth.supabase) {
    return { error: 'Unauthorized' }
  }

  const { error } = await auth.supabase
    .from('services')
    .delete()
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/admin/services')
  revalidatePath('/')
  return { success: true }
}

export async function updateServiceOrder(items: { id: string; display_order: number }[]) {
  const auth = await requireAdmin()
  if (auth.error || !auth.supabase) {
    return { error: 'Unauthorized' }
  }

  for (const item of items) {
    const { error } = await auth.supabase
      .from('services')
      .update({ display_order: item.display_order })
      .eq('id', item.id)

    if (error) return { error: 'Failed to update order' }
  }

  revalidatePath('/admin/services')
  revalidatePath('/')
  return { success: true }
}
