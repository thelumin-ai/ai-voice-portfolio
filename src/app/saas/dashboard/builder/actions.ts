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
