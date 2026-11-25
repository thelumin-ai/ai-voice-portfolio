'use server'

import { requireAdmin } from '@/lib/auth/admin'
import { revalidatePath } from 'next/cache'

export async function getLeads() {
  const auth = await requireAdmin()
  if (auth.error || !auth.supabase) {
    return { error: 'Unauthorized' }
  }

  const { data, error } = await auth.supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching leads:', error)
    return { error: error.message || 'Failed to fetch leads' }
  }

  return { data }
}

export async function updateLeadStatus(id: string, status: 'new' | 'contacted' | 'closed') {
  const auth = await requireAdmin()
  if (auth.error || !auth.supabase) {
    return { error: 'Unauthorized' }
  }

  if (!['new', 'contacted', 'closed'].includes(status)) {
    return { error: 'Invalid lead status' }
  }

  const { error } = await auth.supabase
    .from('leads')
    .update({ status })
    .eq('id', id)

  if (error) {
    console.error('Error updating lead status:', error)
    return { error: error.message }
  }

  revalidatePath('/admin/lead-tracker')
  return { success: true }
}

export async function deleteLead(id: string) {
  const auth = await requireAdmin()
  if (auth.error || !auth.supabase) {
    return { error: 'Unauthorized' }
  }

  const { error } = await auth.supabase
    .from('leads')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting lead:', error)
    return { error: error.message }
  }

  revalidatePath('/admin/lead-tracker')
  return { success: true }
}
