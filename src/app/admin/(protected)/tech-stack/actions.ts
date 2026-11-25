'use server'

import { createPublicClient } from '@/lib/supabase/public'
import { techStackSchema, TechStackFormValues } from '@/lib/validations/techStack'
import { requireAdmin } from '@/lib/auth/admin'
import { revalidatePath } from 'next/cache'

export async function getPublishedTechStack() {
  try {
    const supabase = createPublicClient()
    const { data, error } = await supabase
      .from('tech_stack')
      .select('*')
      .eq('status', 'published')
      .order('display_order', { ascending: true })

    if (error) {
      console.error('Error fetching published tech stack:', error)
      return { error: 'Failed to fetch tech stack' }
    }

    return { data }
  } catch (error) {
    console.error('Error fetching published tech stack:', error)
    return { error: 'Failed to fetch tech stack' }
  }
}

export async function getTechStack() {
  const auth = await requireAdmin()
  if (auth.error || !auth.supabase) {
    return { error: 'Unauthorized' }
  }

  const { data, error } = await auth.supabase
    .from('tech_stack')
    .select('*')
    .order('display_order', { ascending: true })

  if (error) {
    console.error('Error fetching tech stack:', error)
    return { error: 'Failed to fetch tech stack' }
  }

  return { data }
}

export async function getTechItem(id: string) {
  const auth = await requireAdmin()
  if (auth.error || !auth.supabase) {
    return { error: 'Unauthorized' }
  }

  const { data, error } = await auth.supabase
    .from('tech_stack')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching tech item:', error)
    return { error: 'Failed to fetch tech item' }
  }

  return { data }
}

export async function createTechItem(data: TechStackFormValues) {
  const auth = await requireAdmin()
  if (auth.error || !auth.supabase) {
    return { error: 'Unauthorized' }
  }

  const parsed = techStackSchema.safeParse(data)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || 'Invalid tech stack data' }
  }

  const validatedData = parsed.data

  const { error } = await auth.supabase
    .from('tech_stack')
    .insert([
      {
        name: validatedData.name,
        category: validatedData.category,
        icon_url: validatedData.icon_url,
        status: validatedData.status,
        display_order: validatedData.display_order,
      },
    ])

  if (error) {
    console.error('Error creating tech item:', error)
    return { error: error.message }
  }

  revalidatePath('/admin/tech-stack')
  revalidatePath('/')
  return { success: true }
}

export async function updateTechItem(id: string, data: TechStackFormValues) {
  const auth = await requireAdmin()
  if (auth.error || !auth.supabase) {
    return { error: 'Unauthorized' }
  }

  const parsed = techStackSchema.safeParse(data)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || 'Invalid tech stack data' }
  }

  const validatedData = parsed.data

  const { error } = await auth.supabase
    .from('tech_stack')
    .update({
      name: validatedData.name,
      category: validatedData.category,
      icon_url: validatedData.icon_url,
      status: validatedData.status,
      display_order: validatedData.display_order,
    })
    .eq('id', id)

  if (error) {
    console.error('Error updating tech item:', error)
    return { error: error.message }
  }

  revalidatePath('/admin/tech-stack')
  revalidatePath('/')
  return { success: true }
}

export async function deleteTechItem(id: string) {
  const auth = await requireAdmin()
  if (auth.error || !auth.supabase) {
    return { error: 'Unauthorized' }
  }

  const { error } = await auth.supabase
    .from('tech_stack')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting tech item:', error)
    return { error: error.message }
  }

  revalidatePath('/admin/tech-stack')
  revalidatePath('/')
  return { success: true }
}

export async function updateTechStackOrder(items: { id: string; display_order: number }[]) {
  const auth = await requireAdmin()
  if (auth.error || !auth.supabase) {
    return { error: 'Unauthorized' }
  }

  for (const item of items) {
    const { error } = await auth.supabase
      .from('tech_stack')
      .update({ display_order: item.display_order })
      .eq('id', item.id)

    if (error) {
      console.error('Error updating order:', error)
      return { error: 'Failed to update order' }
    }
  }

  revalidatePath('/admin/tech-stack')
  revalidatePath('/')
  return { success: true }
}
