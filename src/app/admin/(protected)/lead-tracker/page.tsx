import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { AdminErrorBanner } from '@/components/admin/AdminStates'
import { getLeads } from './actions'
import { LeadList } from './LeadList'

export const dynamic = 'force-dynamic'

export default async function LeadTrackerAdminPage() {
  const { data: leads, error } = await getLeads()

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Lead Tracker"
        description="Manage and track inbound inquiries from your contact forms and estimator."
      />

      {error && <AdminErrorBanner title="Failed to load leads" message={error} />}

      <LeadList initialLeads={leads || []} hasFetchError={Boolean(error)} />
    </div>
  )
}
