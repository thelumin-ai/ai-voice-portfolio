'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createService(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Unauthorized session.' }
  }

  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const icon = formData.get('icon') as string || 'Phone'

  if (!title || !description) {
    return { error: 'Title and description are required.' }
  }

  const { error } = await supabase
    .from('saas_services')
    .insert({
      tenant_id: user.id,
      title,
      description,
      icon,
    })

  if (error) {
    console.error('Error creating service:', error)
    return { error: error.message }
  }

  revalidatePath('/saas/dashboard/services')
  return { success: true }
}

export async function deleteService(serviceId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Unauthorized session.' }
  }

  const { error } = await supabase
    .from('saas_services')
    .delete()
    .eq('id', serviceId)
    .eq('tenant_id', user.id) // Security check

  if (error) {
    console.error('Error deleting service:', error)
    return { error: error.message }
  }

  revalidatePath('/saas/dashboard/services')
  return { success: true }
}
