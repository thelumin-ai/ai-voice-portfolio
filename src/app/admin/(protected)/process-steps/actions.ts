'use server'

import { createPublicClient } from '@/lib/supabase/public'
import { processStepSchema, ProcessStepFormValues } from '@/lib/validations/processStep'
import { requireAdmin } from '@/lib/auth/admin'
import { revalidatePath } from 'next/cache'

export async function getPublishedProcessSteps() {
  try {
    const supabase = createPublicClient()
    const { data, error } = await supabase
      .from('process_steps')
      .select('*')
      .eq('status', 'published')
      .order('display_order', { ascending: true })

    if (error) {
      console.error('Error fetching published process steps:', error)
      return { error: 'Failed to fetch process steps' }
    }

    return { data }
  } catch (error) {
    console.error('Error fetching published process steps:', error)
    return { error: 'Failed to fetch process steps' }
  }
}

export async function getProcessSteps() {
  const auth = await requireAdmin()
  if (auth.error || !auth.supabase) {
    return { error: 'Unauthorized' }
  }

  const { data, error } = await auth.supabase
    .from('process_steps')
    .select('*')
    .order('display_order', { ascending: true })

  if (error) {
    console.error('Error fetching process steps:', error)
    return { error: 'Failed to fetch process steps' }
  }

  return { data }
}

export async function getProcessStep(id: string) {
  const auth = await requireAdmin()
  if (auth.error || !auth.supabase) {
    return { error: 'Unauthorized' }
  }

  const { data, error } = await auth.supabase
    .from('process_steps')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching process step:', error)
    return { error: 'Failed to fetch process step' }
  }

  return { data }
}

export async function createProcessStep(data: ProcessStepFormValues) {
  const auth = await requireAdmin()
  if (auth.error || !auth.supabase) {
    return { error: 'Unauthorized' }
  }

  const parsed = processStepSchema.safeParse(data)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || 'Invalid process step data' }
  }

  const validatedData = parsed.data

  const { error } = await auth.supabase
    .from('process_steps')
    .insert([
      {
        title: validatedData.title,
        description: validatedData.description,
        icon_url: validatedData.icon_url,
        status: validatedData.status,
        display_order: validatedData.display_order,
      },
    ])

  if (error) {
    console.error('Error creating process step:', error)
    return { error: error.message }
  }

  revalidatePath('/admin/process-steps')
  revalidatePath('/')
  return { success: true }
}

export async function updateProcessStep(id: string, data: ProcessStepFormValues) {
  const auth = await requireAdmin()
  if (auth.error || !auth.supabase) {
    return { error: 'Unauthorized' }
  }

  const parsed = processStepSchema.safeParse(data)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || 'Invalid process step data' }
  }

  const validatedData = parsed.data

  const { error } = await auth.supabase
    .from('process_steps')
    .update({
      title: validatedData.title,
      description: validatedData.description,
      icon_url: validatedData.icon_url,
      status: validatedData.status,
      display_order: validatedData.display_order,
    })
    .eq('id', id)

  if (error) {
    console.error('Error updating process step:', error)
    return { error: error.message }
  }

  revalidatePath('/admin/process-steps')
  revalidatePath('/')
  return { success: true }
}

export async function deleteProcessStep(id: string) {
  const auth = await requireAdmin()
  if (auth.error || !auth.supabase) {
    return { error: 'Unauthorized' }
  }

  const { error } = await auth.supabase
    .from('process_steps')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting process step:', error)
    return { error: error.message }
  }

  revalidatePath('/admin/process-steps')
  revalidatePath('/')
  return { success: true }
}

export async function updateProcessStepOrder(items: { id: string; display_order: number }[]) {
  const auth = await requireAdmin()
  if (auth.error || !auth.supabase) {
    return { error: 'Unauthorized' }
  }

  for (const item of items) {
    const { error } = await auth.supabase
      .from('process_steps')
      .update({ display_order: item.display_order })
      .eq('id', item.id)

    if (error) {
      console.error('Error updating order:', error)
      return { error: 'Failed to update order' }
    }
  }

  revalidatePath('/admin/process-steps')
  revalidatePath('/')
  return { success: true }
}
