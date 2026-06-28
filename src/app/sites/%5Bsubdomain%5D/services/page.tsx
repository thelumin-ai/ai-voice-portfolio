import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { getTemplateById } from '@/lib/templates'
import NonprofitServicesPage from '@/app/templates/nonprofit-001/services/page'

interface PageProps {
  params: Promise<{ subdomain: string }>
}

export default async function DynamicServicesPage({ params }: PageProps) {
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

  // Resolve template rendering by layoutType
  if (theme.layoutType === 'gainlove') {
    return <NonprofitServicesPage />
  }

  // Fallback if other templates don't have services page yet
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-zinc-400 text-xs">
      <span>Services page is not configured for this template structure.</span>
    </div>
  )
}
