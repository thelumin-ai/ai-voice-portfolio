import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import BuilderWorkspace from './BuilderWorkspace'

export const dynamic = 'force-dynamic'

export default async function SaaSBuilderPage() {
  const supabase = await createClient()

  // Get current user session
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/saas/login')
  }

  // Fetch tenant details from database
  const { data: tenant, error } = await supabase
    .from('saas_tenants')
    .select('template_id, layout_structure, visible_sections')
    .eq('id', user.id)
    .single()

  if (error || !tenant) {
    // If no tenant setup yet, redirect to settings to set up profile
    redirect('/saas/dashboard/settings')
  }

  // Set default fallbacks if database values are null/empty
  const fallbackTenant = {
    template_id: tenant.template_id || 'agency_automation_cyber',
    layout_structure: tenant.layout_structure || ['hero', 'services', 'about', 'consultation', 'footer'],
    visible_sections: tenant.visible_sections || ['hero', 'services', 'about', 'consultation']
  }

  return (
    <div className="py-6">
      <BuilderWorkspace initialTenant={fallbackTenant} />
    </div>
  )
}
