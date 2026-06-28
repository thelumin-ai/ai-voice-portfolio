import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { getTemplateById } from '@/lib/templates'
import NonprofitContactPage from '@/app/templates/nonprofit-001/contact/page'
import AgencyContactPage from '@/app/templates/agency-002/contact/page'
import ManufacturingContactPage from '@/app/templates/manufacturing-003/contact/page'

interface PageProps {
  params: Promise<{ subdomain: string }>
}

export default async function DynamicContactPage({ params }: PageProps) {
  const resolvedParams = await params
  const supabase = await createClient()

  const { data: tenant } = await supabase
    .from('saas_tenants')
    .select('template_id')
    .eq('subdomain', resolvedParams.subdomain)
    .maybeSingle()

  if (!tenant) {
    notFound()
  }

  const theme = getTemplateById(tenant.template_id || 'legal_practice_advmarc')

  // Resolve template rendering by layoutType / template id
  if (theme.layoutType === 'gainlove') {
    return <NonprofitContactPage />
  }
  if (theme.id.includes('agency-002')) {
    return <AgencyContactPage />
  }
  if (theme.id.includes('manufacturing-003')) {
    return <ManufacturingContactPage />
  }

  // Fallback if other templates don't have contact page yet
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-zinc-400 text-xs">
      <span>Contact page is not configured for this template structure.</span>
    </div>
  )
}
