import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import SaaSLogoutButton from './SaaSLogoutButton'
import { LayoutDashboard, Settings, Compass, HelpCircle, Layers } from 'lucide-react'

interface LayoutProps {
  children: React.ReactNode
}

export default async function SaasDashboardLayout({ children }: LayoutProps) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/saas/login')
  }

  // Fetch tenant profile details to verify profile existence
  const { data: tenant } = await supabase
    .from('saas_tenants')
    .select('subdomain')
    .eq('user_id', user.id)
    .maybeSingle()

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col lg:flex-row">
      
      {/* Sidebar Panel */}
      <aside className="w-full lg:w-[260px] border-b lg:border-b-0 lg:border-r border-zinc-900 bg-zinc-950 flex flex-col justify-between flex-shrink-0">
        <div>
          {/* Logo container */}
          <div className="h-16 flex items-center px-6 border-b border-zinc-900 gap-2">
            <span className="font-bold text-sm tracking-widest text-zinc-400 uppercase">SaaS Portal</span>
            {tenant && (
              <span className="px-2 py-0.5 text-[9px] font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-md">
                Active
              </span>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            <Link
              href="/saas/dashboard"
              className="flex items-center gap-2.5 px-4 py-3 text-zinc-300 hover:text-white hover:bg-zinc-800/40 rounded-xl transition-all text-xs font-semibold"
            >
              <LayoutDashboard className="w-4 h-4 text-zinc-400" />
              <span>Websites & Projects</span>
            </Link>

            <Link
              href="/saas/dashboard/builder"
              className="flex items-center gap-2.5 px-4 py-3 text-zinc-300 hover:text-white hover:bg-zinc-800/40 rounded-xl transition-all text-xs font-semibold"
            >
              <Layers className="w-4 h-4 text-zinc-400" />
              <span>Theme Builder</span>
            </Link>

            <Link
              href="/saas/dashboard/settings"
              className="flex items-center gap-2.5 px-4 py-3 text-zinc-300 hover:text-white hover:bg-zinc-800/40 rounded-xl transition-all text-xs font-semibold"
            >
              <Settings className="w-4 h-4 text-zinc-400" />
              <span>General Settings</span>
            </Link>
          </nav>
        </div>

        {/* Footer controls */}
        <div className="p-4 border-t border-zinc-900">
          <div className="px-4 py-2 text-[10px] text-zinc-500 font-bold truncate">
            {user.email}
          </div>
          <SaaSLogoutButton />
        </div>
      </aside>

      {/* Content wrapper */}
      <div className="flex-grow flex flex-col min-w-0">
        
        {/* Top Header Bar */}
        <header className="h-16 border-b border-zinc-900 flex items-center justify-between px-6 bg-zinc-950">
          <span className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">
            Workspace Panel
          </span>
          <div className="flex items-center gap-4 text-xs font-bold text-zinc-400">
            {tenant ? (
              <a
                href={`http://${tenant.subdomain}.localhost:3000`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white underline transition-colors"
              >
                {tenant.subdomain}.abimbola.ai
              </a>
            ) : (
              <span>Not Configured</span>
            )}
          </div>
        </header>

        {/* Dynamic page container */}
        <main className="flex-grow p-6 overflow-y-auto bg-zinc-950">
          {children}
        </main>
      </div>

    </div>
  )
}
