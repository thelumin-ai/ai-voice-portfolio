import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Settings, Briefcase, Users, Eye, ArrowUpRight, CheckCircle, Globe } from 'lucide-react'

export default async function SaasDashboardOverview() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  // Fetch tenant stats and profile info
  const { data: tenant } = await supabase
    .from('saas_tenants')
    .select('*')
    .eq('id', user.id)
    .maybeSingle()

  const subdomain = tenant?.subdomain || 'unknown'
  const companyName = tenant?.company_name || 'My Portfolio'

  // Fetch services count
  const { count: servicesCount } = await supabase
    .from('saas_services')
    .select('id', { count: 'exact', head: true })
    .eq('tenant_id', user.id)

  // Fetch leads count
  const { count: leadsCount } = await supabase
    .from('saas_leads')
    .select('id', { count: 'exact', head: true })
    .eq('tenant_id', user.id)

  return (
    <div className="space-y-8">
      
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-zinc-900 bg-zinc-950 p-8 shadow-sm">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 blur-[100px] rounded-full pointer-events-none" />
        
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Welcome back, {companyName}!
        </h1>
        <p className="text-sm text-zinc-400 mt-2 max-w-xl">
          Manage your AI voice automation portfolio, track inbound leads, configure integrations, and preview your live site.
        </p>

        <div className="mt-6 flex flex-wrap gap-4">
          <a
            href={`/sites/${subdomain}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow transition-colors"
          >
            <span>View Live Website</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-xl border border-zinc-900 bg-zinc-950/40">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">Services Listed</p>
              <h3 className="text-3xl font-extrabold text-white mt-2">{servicesCount || 0}</h3>
            </div>
            <div className="p-2.5 bg-blue-500/10 text-blue-500 rounded-lg">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[11px] text-zinc-600 mt-4">Total custom voice agency solutions active</p>
        </div>

        <div className="p-6 rounded-xl border border-zinc-900 bg-zinc-950/40">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">Inbound Leads</p>
              <h3 className="text-3xl font-extrabold text-white mt-2">{leadsCount || 0}</h3>
            </div>
            <div className="p-2.5 bg-green-500/10 text-green-500 rounded-lg">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[11px] text-zinc-600 mt-4">Leads captured from calls or forms</p>
        </div>

        <div className="p-6 rounded-xl border border-zinc-900 bg-zinc-950/40">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">Site Access</p>
              <h3 className="text-sm font-bold text-blue-400 mt-3 truncate max-w-[180px]">
                {subdomain}.yourplatform.com
              </h3>
            </div>
            <div className="p-2.5 bg-purple-500/10 text-purple-500 rounded-lg">
              <Globe className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[11px] text-zinc-600 mt-4">Subdomain routing target</p>
        </div>
      </div>

      {/* Quick Launch Checklist */}
      <div className="p-6 rounded-xl border border-zinc-900 bg-zinc-950/30">
        <h2 className="text-lg font-bold text-white mb-4">Onboarding Steps</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-sm text-zinc-300">Account created and subdomain allocated</span>
          </div>

          <div className="flex items-center gap-3">
            <CheckCircle className={`w-5 h-5 ${tenant?.title ? 'text-green-500' : 'text-zinc-700'}`} />
            <span className="text-sm text-zinc-300">Set up bio, profile title, and skills</span>
            {!tenant?.title && (
              <Link href="/saas/dashboard/settings" className="text-xs text-blue-500 hover:underline ml-auto">
                Finish setup
              </Link>
            )}
          </div>

          <div className="flex items-center gap-3">
            <CheckCircle className={`w-5 h-5 ${(servicesCount && servicesCount > 0) ? 'text-green-500' : 'text-zinc-700'}`} />
            <span className="text-sm text-zinc-300">Add at least one voice or automation solution</span>
            {(!servicesCount || servicesCount === 0) && (
              <Link href="/saas/dashboard/services" className="text-xs text-blue-500 hover:underline ml-auto">
                Add service
              </Link>
            )}
          </div>
        </div>
      </div>

    </div>
  )
}
