import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { AdminErrorBanner } from '@/components/admin/AdminStates'
import ContentForm from './ContentForm'
import { getAdminContentSettings } from './actions'

export const dynamic = 'force-dynamic'

export default async function ContentPage() {
  const { hero, about, problem, error } = await getAdminContentSettings()

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <AdminPageHeader
        title="Content Editor"
        description="Customize the Hero, About, and Problem copy shown on your homepage."
      />

      {error && <AdminErrorBanner title="Failed to load content settings" message={error} />}

      <ContentForm initialHero={hero} initialAbout={about} initialProblem={problem} />
    </div>
  )
}
