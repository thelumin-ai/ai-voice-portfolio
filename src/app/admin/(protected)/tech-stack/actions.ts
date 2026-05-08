'use server'

import { createClient } from '@/lib/supabase/server'
import { techStackSchema, TechStackFormValues } from '@/lib/validations/techStack'
import { revalidatePath } from 'next/cache'

export async function getTechStack() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
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
  const supabase = await createClient()
  
  const { data, error } = await supabase
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
  const supabase = await createClient()
  
  const validatedData = techStackSchema.parse(data)

  const { error } = await supabase
    .from('tech_stack')
    .insert([
      {
        name: validatedData.name,
        category: validatedData.category,
        icon_url: validatedData.icon_url,
        status: validatedData.status,
        display_order: validatedData.display_order,
      }
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
  const supabase = await createClient()
  
  const validatedData = techStackSchema.parse(data)

  const { error } = await supabase
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
  const supabase = await createClient()
  
  const { error } = await supabase
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
  const supabase = await createClient()

  for (const item of items) {
    const { error } = await supabase
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
