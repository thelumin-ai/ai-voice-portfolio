'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function initializeTenantProfile(subdomain: string, companyName: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  // Clean subdomain
  const cleanSubdomain = subdomain.toLowerCase().replace(/[^a-z0-9-]/g, '')
  if (cleanSubdomain.length < 3) return { error: 'Subdomain must be at least 3 characters' }

  // Verify unique
  const { data: existing } = await supabase
    .from('saas_tenants')
    .select('id')
    .eq('subdomain', cleanSubdomain)
    .maybeSingle()

  if (existing) {
    return { error: 'Subdomain is already taken' }
  }

  // Insert tenant record
  const { data: tenant, error: tenantErr } = await supabase
    .from('saas_tenants')
    .insert({
      user_id: user.id,
      subdomain: cleanSubdomain,
      company_name: companyName,
      title: `${companyName} | Portfolio Showcase`,
      layout_structure: ['hero', 'services', 'about'],
      visible_sections: ['hero', 'services', 'about'],
      template_id: 'legal_practice_advmarc',
      bio: [
        `No ${companyName}, oferecemos serviços e soluções completas para resolver seus problemas com a máxima agilidade.`,
        'Com vasta experiência de atuação no mercado, nossa ampla experiência nos posiciona para entregar excelência.'
      ],
      skills: ['Operational Audit', 'Technical Consult', 'Automation Delivery'],
      footer_text: `© ${new Date().getFullYear()} ${companyName}. All rights reserved.`
    })
    .select()
    .single()

  if (tenantErr) {
    return { error: tenantErr.message }
  }

  // Add default services
  const defaultServices = [
    { tenant_id: tenant.id, title: 'Advisory Consultation', description: 'Detailed custom overview matching your target business workflow.', display_order: 1 },
    { tenant_id: tenant.id, title: 'Automation Implementation', description: 'Full stack systems setup and custom dashboard engineering.', display_order: 2 },
  ]

  const { error: servicesErr } = await supabase
    .from('saas_services')
    .insert(defaultServices)

  if (servicesErr) {
    return { error: servicesErr.message }
  }

  revalidatePath('/saas/dashboard')
  return { success: true }
}

export async function updateTenantSettings(data: {
  company_name: string
  title: string
  cta_text: string
  consultation_link: string
  footer_text: string
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { error } = await supabase
    .from('saas_tenants')
    .update(data)
    .eq('user_id', user.id)

  if (error) return { error: error.message }

  revalidatePath('/saas/dashboard')
  return { success: true }
}
