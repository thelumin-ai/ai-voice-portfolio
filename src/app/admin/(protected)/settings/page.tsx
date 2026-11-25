import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { AdminErrorBanner } from '@/components/admin/AdminStates'
import { getAdminSiteSettings } from './actions'
import { SettingsForm } from './SettingsForm'

export const dynamic = 'force-dynamic'

const fallbackSettings = {
  contact_email: '',
  footer_text: '',
  admin_brand_name: '',
  admin_brand_subtitle: '',
  admin_logo_url: '',
  social_links: { twitter: '', linkedin: '', github: '' },
  profile_image_url: '',
  consultation_provider: 'upwork' as const,
  consultation_link_upwork: '',
  consultation_link_fiverr: '',
  consultation_link_calendly: '',
  openai_api_key: '',
  anthropic_api_key: '',
  gemini_api_key: '',
}

export default async function SettingsAdminPage() {
  const { data: settings, error } = await getAdminSiteSettings()

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <AdminPageHeader
        title="General Settings"
        description="Configure admin branding, contact details, social profiles, booking links, and AI API keys."
      />

      {error && (
        <AdminErrorBanner
          title="Could not load saved settings from Supabase"
          message={error}
        />
      )}

      <SettingsForm initialData={settings || fallbackSettings} />
    </div>
  )
}
