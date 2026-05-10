'use server'

import { createClient } from '@/lib/supabase/server'
import { serviceSchema, ServiceFormValues } from '@/lib/validations/service'
import { revalidatePath } from 'next/cache'

export async function getServices() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
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
  const supabase = await createClient()
  
  const { data, error } = await supabase
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
  const supabase = await createClient()
  const validatedData = serviceSchema.parse(data)

  const { error } = await supabase
    .from('services')
    .insert([{
        title: validatedData.title,
        description: validatedData.description,
        icon_name: validatedData.icon_name,
        status: validatedData.status,
        display_order: validatedData.display_order,
    }])

  if (error) return { error: error.message }

  revalidatePath('/admin/services')
  revalidatePath('/')
  return { success: true }
}

export async function updateService(id: string, data: ServiceFormValues) {
  const supabase = await createClient()
  const validatedData = serviceSchema.parse(data)

  const { error } = await supabase
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
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('services')
    .delete()
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/admin/services')
  revalidatePath('/')
  return { success: true }
}

export async function updateServiceOrder(items: { id: string; display_order: number }[]) {
  const supabase = await createClient()

  for (const item of items) {
    const { error } = await supabase
      .from('services')
      .update({ display_order: item.display_order })
      .eq('id', item.id)

    if (error) return { error: 'Failed to update order' }
  }

  revalidatePath('/admin/services')
  revalidatePath('/')
  return { success: true }
}
