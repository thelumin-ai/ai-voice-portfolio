'use server'

import { createClient } from '@/lib/supabase/server'
import { getTemplateById, PREBUILT_CONTENT } from '@/lib/templates'
import { revalidatePath } from 'next/cache'

export async function updateBuilderConfig(templateId: string, layoutStructure: string[], visibleSections: string[]) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { error } = await supabase
    .from('saas_tenants')
    .update({
      template_id: templateId,
      layout_structure: layoutStructure,
      visible_sections: visibleSections
    })
    .eq('user_id', user.id)

  if (error) return { error: error.message }

  revalidatePath('/saas/dashboard/builder')
  return { success: true }
}

export async function applyPrebuiltContent(templateId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  // Extract industry ID from template ID (e.g. `legal_practice_advmarc` -> `legal_practice`)
  const parts = templateId.split('_')
  const suffixes = ['advmarc', 'consult', 'dycrw', 'renthu', 'estate_teal', 'gainlove']
  let industryId = parts.slice(0, -1).join('_')
  const lastTwo = parts.slice(-2).join('_')
  if (suffixes.includes(lastTwo)) {
    industryId = parts.slice(0, -2).join('_')
  }

  const content = PREBUILT_CONTENT[industryId]
  if (!content) return { error: 'No prebuilt content found for this industry' }

  // Fetch tenant ID
  const { data: tenant } = await supabase
    .from('saas_tenants')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!tenant) return { error: 'No tenant found' }

  // Update tenant bio and skills
  const { error: tenantErr } = await supabase
    .from('saas_tenants')
    .update({
      title: content.title,
      bio: content.bio,
      skills: content.skills
    })
    .eq('id', tenant.id)

  if (tenantErr) return { error: tenantErr.message }

  // Delete previous services
  await supabase
    .from('saas_services')
    .delete()
    .eq('tenant_id', tenant.id)

  // Insert new services
  const servicesToInsert = content.services.map((srv, idx) => ({
    tenant_id: tenant.id,
    title: srv.title,
    description: srv.description,
    display_order: idx + 1
  }))

  const { error: servicesErr } = await supabase
    .from('saas_services')
    .insert(servicesToInsert)

  if (servicesErr) return { error: servicesErr.message }

  revalidatePath('/saas/dashboard/builder')
  return { success: true }
}
