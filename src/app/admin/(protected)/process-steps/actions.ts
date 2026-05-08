'use server'

import { createClient } from '@/lib/supabase/server'
import { processStepSchema, ProcessStepFormValues } from '@/lib/validations/processStep'
import { revalidatePath } from 'next/cache'

export async function getProcessSteps() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
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
  const supabase = await createClient()
  
  const { data, error } = await supabase
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
  const supabase = await createClient()
  
  const validatedData = processStepSchema.parse(data)

  const { error } = await supabase
    .from('process_steps')
    .insert([
      {
        title: validatedData.title,
        description: validatedData.description,
        icon_url: validatedData.icon_url,
        status: validatedData.status,
        display_order: validatedData.display_order,
      }
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
  const supabase = await createClient()
  
  const validatedData = processStepSchema.parse(data)

  const { error } = await supabase
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
  const supabase = await createClient()
  
  const { error } = await supabase
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
  const supabase = await createClient()

  for (const item of items) {
    const { error } = await supabase
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
