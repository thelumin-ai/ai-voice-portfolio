import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import ProfileSetupForm from './settings/ProfileSetupForm'
import { Sparkles, Globe, Edit, ExternalLink, Settings } from 'lucide-react'

export default async function SaasDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/saas/login')

  const { data: tenant } = await supabase
    .from('saas_tenants')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle()

  return (
    <div className="space-y-6">
      
      {!tenant ? (
        <div className="space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
            <h1 className="text-xl font-bold">Welcome to Builder Portal</h1>
            <p className="text-xs text-zinc-400 mt-1">
              Please complete your basic profile setup below to initialize your subdomain.
            </p>
          </div>
          <ProfileSetupForm />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Header row */}
          <div>
            <h1 className="text-xl font-bold">My Websites</h1>
            <p className="text-xs text-zinc-400 mt-1">
              Manage your active website preview and content deployments.
            </p>
          </div>

          {/* Website projects card grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-zinc-900/60 border border-zinc-850 p-6 rounded-2xl flex flex-col justify-between h-56 hover:border-zinc-700 transition-all">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
                    <Globe className="w-5 h-5" />
                  </div>
                  <span className="px-2 py-0.5 text-[9px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-md">
                    Published
                  </span>
                </div>
                <h3 className="font-bold text-sm text-white">{tenant.company_name}</h3>
                <p className="text-[11px] text-zinc-500 mt-1">{tenant.subdomain}.abimbola.ai</p>
              </div>

              <div className="flex items-center gap-2 border-t border-zinc-800/80 pt-4 mt-4 text-xs font-semibold">
                <Link
                  href="/saas/dashboard/builder"
                  className="flex-grow flex items-center justify-center gap-1.5 py-2 px-3 bg-zinc-850 hover:bg-zinc-800 text-white rounded-lg border border-zinc-800 hover:border-zinc-750 transition-all cursor-pointer"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Customize</span>
                </Link>
                <a
                  href={`http://${tenant.subdomain}.localhost:3000`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-zinc-850 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 hover:border-zinc-750 rounded-lg transition-all"
                  title="Visit Live Subdomain"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
