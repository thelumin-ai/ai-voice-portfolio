'use server'

import { createClient } from '@/lib/supabase/server'
import { useCaseSchema, UseCaseFormValues } from '@/lib/validations/useCase'
import { revalidatePath } from 'next/cache'

export async function getUseCases() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('use_cases')
    .select('*')
    .order('display_order', { ascending: true })

  if (error) return { error: 'Failed to fetch use cases' }
  return { data }
}

export async function getUseCase(id: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('use_cases')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return { error: 'Failed to fetch use case' }
  return { data }
}

export async function getUseCaseBySlug(slug: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('use_cases')
    .select('*')
    .eq('industry_slug', slug)
    .single()

  if (error) return { error: 'Failed to fetch use case by slug' }
  return { data }
}

export async function createUseCase(data: UseCaseFormValues) {
  const supabase = await createClient()
  const validatedData = useCaseSchema.parse(data)

  const { error } = await supabase
    .from('use_cases')
    .insert([{
        ...validatedData
    }])

  if (error) return { error: error.message }

  revalidatePath('/admin/use-cases')
  revalidatePath('/')
  revalidatePath(`/use-cases/${validatedData.industry_slug}`)
  return { success: true }
}

export async function updateUseCase(id: string, data: UseCaseFormValues) {
  const supabase = await createClient()
  const validatedData = useCaseSchema.parse(data)

  const { error } = await supabase
    .from('use_cases')
    .update({
        ...validatedData
    })
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/admin/use-cases')
  revalidatePath('/')
  revalidatePath(`/use-cases/${validatedData.industry_slug}`)
  return { success: true }
}

export async function deleteUseCase(id: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('use_cases')
    .delete()
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/admin/use-cases')
  revalidatePath('/')
  return { success: true }
}

export async function updateUseCaseOrder(items: { id: string; display_order: number }[]) {
  const supabase = await createClient()

  for (const item of items) {
    const { error } = await supabase
      .from('use_cases')
      .update({ display_order: item.display_order })
      .eq('id', item.id)

    if (error) return { error: 'Failed to update order' }
  }

  revalidatePath('/admin/use-cases')
  revalidatePath('/')
  return { success: true }
}
