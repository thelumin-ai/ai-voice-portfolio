import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { SettingsForm } from './SettingsForm'
import ProfileSetupForm from './ProfileSetupForm'

export default async function SaasSettingsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/saas/login')
  }

  // Fetch tenant profile from database
  const { data: tenant } = await supabase
    .from('saas_tenants')
    .select('*')
    .eq('id', user.id)
    .maybeSingle()

  if (!tenant) {
    return <ProfileSetupForm />
  }

  // Format initial values securely
  const initialData = {
    company_name: tenant.company_name || '',
    title: tenant.title || '',
    bio: tenant.bio || [],
    skills: tenant.skills || [],
    cta_text: tenant.cta_text || 'Book Consultation',
    linkedin_url: tenant.linkedin_url || '',
    github_url: tenant.github_url || '',
    twitter_url: tenant.twitter_url || '',
    consultation_provider: tenant.consultation_provider || 'calendly',
    consultation_link: tenant.consultation_link || '',
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold text-white tracking-tight">Profile &amp; Settings</h1>
        <p className="text-sm text-zinc-500 mt-1">Configure your personal portfolio metadata, contact channels, and template visuals.</p>
      </div>

      <SettingsForm initialData={initialData} />
    </div>
  )
}
