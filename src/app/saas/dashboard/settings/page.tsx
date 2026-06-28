import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import SettingsForm from './SettingsForm'
import ProfileSetupForm from './ProfileSetupForm'

export default async function SaasSettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/saas/login')

  const { data: tenant } = await supabase
    .from('saas_tenants')
    .select('company_name, title, cta_text, consultation_link, footer_text')
    .eq('user_id', user.id)
    .maybeSingle()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold">General Settings</h1>
        <p className="text-xs text-zinc-400 mt-1">
          Update your website meta tag title, primary actions, and footer copyright text.
        </p>
      </div>

      {tenant ? (
        <SettingsForm initialTenant={tenant} />
      ) : (
        <ProfileSetupForm />
      )}
    </div>
  )
}
