import { getSiteSettings } from './actions'
import { SettingsForm } from './SettingsForm'

export default async function SettingsAdminPage() {
  const { data: settings } = await getSiteSettings()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">General Settings</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Manage global configuration for your website.</p>
      </div>

      <SettingsForm initialData={settings!} />
    </div>
  )
}
