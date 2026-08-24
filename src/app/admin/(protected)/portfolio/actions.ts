'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { portfolioSchema, PortfolioFormValues } from '@/lib/validations/portfolio'

export async function getPortfolioProjects() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('portfolio_projects')
    .select('*')
    .order('display_order', { ascending: true })

  if (error) {
    console.error('Error fetching portfolio projects:', error)
    return []
  }

  return data
}

export async function getPortfolioProject(id: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('portfolio_projects')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching portfolio project:', error)
    return null
  }

  return data
}

export async function createPortfolioProject(values: PortfolioFormValues) {
  const supabase = await createClient()
  
  // Validate input
  const parsed = portfolioSchema.safeParse(values)
  if (!parsed.success) {
    const firstError = parsed.error.issues?.[0]?.message || 'Invalid form data'
    return { error: firstError }
  }

  const { id, ...dataToInsert } = parsed.data

  const { data, error } = await supabase
    .from('portfolio_projects')
    .insert([dataToInsert])
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/portfolio')
  revalidatePath('/')
  return { data }
}

export async function updatePortfolioProject(id: string, values: PortfolioFormValues) {
  const supabase = await createClient()
  
  // Validate input
  const parsed = portfolioSchema.safeParse(values)
  if (!parsed.success) {
    const firstError = parsed.error.issues?.[0]?.message || 'Invalid form data'
    return { error: firstError }
  }

  const { id: _id, ...dataToUpdate } = parsed.data

  const { data, error } = await supabase
    .from('portfolio_projects')
    .update(dataToUpdate)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/portfolio')
  revalidatePath('/')
  return { data }
}

export async function deletePortfolioProject(id: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('portfolio_projects')
    .delete()
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/portfolio')
  revalidatePath('/')
  return { success: true }
}

export async function reorderPortfolioProjects(items: { id: string; display_order: number }[]) {
  const supabase = await createClient()
  
  // Updating multiple rows in Supabase requires iterating or using a stored procedure.
  // For simplicity and since array size is small, we can update in a loop or Promise.all
  
  const promises = items.map(item => 
    supabase
      .from('portfolio_projects')
      .update({ display_order: item.display_order })
      .eq('id', item.id)
  )

  await Promise.all(promises)

  revalidatePath('/admin/portfolio')
  revalidatePath('/')
  return { success: true }
}
