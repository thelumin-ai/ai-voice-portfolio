import { getLeads } from './actions'
import { LeadList } from './LeadList'

export default async function LeadTrackerAdminPage() {
  const { data: leads } = await getLeads()

  return (
    <div className="space-y-6">
      <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800/50 backdrop-blur-sm">
        <h1 className="text-2xl font-black text-white tracking-tight mb-1">Lead Tracker</h1>
        <p className="text-sm text-zinc-400">Manage and track inbound leads from your website.</p>
      </div>

      <LeadList initialLeads={leads || []} />
    </div>
  )
}
