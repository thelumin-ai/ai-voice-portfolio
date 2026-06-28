import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { getTemplateById } from '@/lib/templates'
import NonprofitAboutPage from '@/app/templates/nonprofit-001/about/page'
import AgencyAboutPage from '@/app/templates/agency-002/about/page'

interface PageProps {
  params: Promise<{ subdomain: string }>
}

export default async function DynamicAboutPage({ params }: PageProps) {
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
    return <NonprofitAboutPage />
  }
  if (theme.id.includes('agency-002')) {
    return <AgencyAboutPage />
  }

  // Fallback if other templates don't have about page yet
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-zinc-400 text-xs">
      <span>About page is not configured for this template structure.</span>
    </div>
  )
}
