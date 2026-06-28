'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateBuilderConfig(
  templateId: string,
  layoutStructure: string[],
  visibleSections: string[]
) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Unauthorized session.' }
  }

  const { error } = await supabase
    .from('saas_tenants')
    .update({
      template_id: templateId,
      layout_structure: layoutStructure,
      visible_sections: visibleSections
    })
    .eq('id', user.id)

  if (error) {
    console.error('Error updating builder config:', error)
    return { error: error.message }
  }

  revalidatePath('/saas/dashboard/builder')
  return { success: true }
}

export async function applyPrebuiltContent(templateId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Unauthorized session.' }
  }

  // Extract industry ID from template ID (e.g. `real_estate_royal_gold` -> `real_estate`)
  const parts = templateId.split('_')
  if (parts.length < 2) {
    return { error: 'Invalid template structure selected.' }
  }

  const suffixes = ['cyber', 'corp_dark', 'corp_light', 'royal_gold', 'eco_teal', 'sunset', 'performance', 'minimalist', 'violet_aurora', 'steel_industrial']
  let industryId = parts.slice(0, -1).join('_')
  const lastTwo = parts.slice(-2).join('_')
  if (suffixes.includes(lastTwo)) {
    industryId = parts.slice(0, -2).join('_')
  }

  // Import PREBUILT_CONTENT dynamically inside runtime
  const { PREBUILT_CONTENT } = require('@/lib/templates')
  const content = PREBUILT_CONTENT[industryId]
  if (!content) {
    return { error: `No pre-built content found for industry: ${industryId}` }
  }

  // 1. Update saas_tenants profile details
  const { error: tenantError } = await supabase
    .from('saas_tenants')
    .update({
      title: content.title,
      bio: content.bio,
      skills: content.skills,
      template_id: templateId
    })
    .eq('id', user.id)

  if (tenantError) {
    console.error('Error seeding tenant profile:', tenantError)
    return { error: tenantError.message }
  }

  // 2. Clear old services and insert pre-built ones
  const { error: deleteError } = await supabase
    .from('saas_services')
    .delete()
    .eq('tenant_id', user.id)

  if (deleteError) {
    console.error('Error clearing old services:', deleteError)
    return { error: deleteError.message }
  }

  const servicesPayload = content.services.map((s: any, idx: number) => ({
    tenant_id: user.id,
    title: s.title,
    description: s.description,
    icon: s.icon,
    display_order: idx
  }))

  const { error: insertError } = await supabase
    .from('saas_services')
    .insert(servicesPayload)

  if (insertError) {
    console.error('Error inserting prebuilt services:', insertError)
    return { error: insertError.message }
  }

  revalidatePath('/saas/dashboard')
  revalidatePath('/saas/dashboard/builder')
  revalidatePath('/saas/dashboard/services')
  revalidatePath('/saas/dashboard/settings')
  return { success: true }
}
