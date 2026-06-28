import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import BuilderWorkspace from './BuilderWorkspace'
import ProfileSetupForm from '../settings/ProfileSetupForm'

export default async function SaasBuilderPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/saas/login')

  const { data: tenant } = await supabase
    .from('saas_tenants')
    .select('id, template_id, layout_structure, visible_sections, company_name, subdomain')
    .eq('user_id', user.id)
    .maybeSingle()

  return (
    <div className="h-full">
      {tenant ? (
        <BuilderWorkspace initialTenant={tenant} />
      ) : (
        <div className="space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
            <h1 className="text-xl font-bold">Configure Subdomain Prefix</h1>
            <p className="text-xs text-zinc-400 mt-1">
              Please enter your business details below to enable the Visual Builder.
            </p>
          </div>
          <ProfileSetupForm />
        </div>
      )}
    </div>
  )
}
