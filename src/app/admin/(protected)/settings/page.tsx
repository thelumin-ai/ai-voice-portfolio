import { getAdminSiteSettings } from './actions'
import { SettingsForm } from './SettingsForm'

const fallbackSettings = {
  contact_email: '',
  footer_text: '',
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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">General Settings</h1>
        <p className="text-zinc-400 mt-1">Manage global configuration for your website.</p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm">
          Could not load saved settings from Supabase ({error}). Showing default values.
        </div>
      )}

      <SettingsForm initialData={settings || fallbackSettings} />
    </div>
  )
}
