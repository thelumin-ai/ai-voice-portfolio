import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { LayoutDashboard, Settings, Briefcase, LogOut, Globe, User } from 'lucide-react'
import { SaaSLogoutButton } from './SaaSLogoutButton'

// Custom side navigation for SaaS users
const saasNavigation = [
  { name: 'Console Overview', href: '/saas/dashboard', icon: LayoutDashboard },
  { name: 'Profile & Settings', href: '/saas/dashboard/settings', icon: Settings },
  { name: 'Services / Solutions', href: '/saas/dashboard/services', icon: Briefcase },
]

export default async function SaaSProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Redirect to saas login if not authenticated
  if (!user) {
    redirect('/saas/login')
  }

  // Fetch tenant profile details to display subdomain
  const { data: tenant } = await supabase
    .from('saas_tenants')
    .select('subdomain, company_name')
    .eq('id', user.id)
    .maybeSingle()

  const subdomain = tenant?.subdomain || 'your-subdomain'
  const companyName = tenant?.company_name || 'My Portfolio'

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-blue-500/30">
      
      {/* Sidebar */}
      <div className="w-64 bg-zinc-950 border-r border-zinc-900 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-zinc-900">
          <Link href="/saas/dashboard" className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <span className="text-xs text-white">S3</span>
            </span>
            SaaS Console
          </Link>
        </div>
        
        {/* Navigation list */}
        <nav className="flex-grow py-6">
          <ul className="space-y-1.5 px-3">
            {saasNavigation.map((item) => {
              const Icon = item.icon
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100 transition-colors"
                  >
                    <Icon className="mr-3 h-5 w-5 text-zinc-500" />
                    {item.name}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Live Site Link & Profile details */}
        <div className="p-4 border-t border-zinc-900 bg-zinc-950/50 flex flex-col gap-3">
          <a
            href={`/sites/${subdomain}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2 px-3 border border-zinc-800 hover:border-zinc-700 bg-zinc-900 text-zinc-300 text-xs font-semibold rounded-md transition-colors"
          >
            <Globe className="w-4 h-4" />
            <span>Visit Live Site</span>
          </a>

          <SaaSLogoutButton />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-[300px] bg-blue-600/5 blur-[120px] pointer-events-none z-0" />

        {/* Top Header bar */}
        <header className="h-16 border-b border-zinc-900/50 bg-zinc-950/80 backdrop-blur-md flex items-center justify-between px-8 relative z-10">
          <div className="flex flex-col">
            <h2 className="text-xs font-semibold text-zinc-400 tracking-wider uppercase">Tenant Console</h2>
            <p className="text-[10px] text-zinc-600 font-mono tracking-tight">{subdomain}.yourplatform.com</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center overflow-hidden">
              <span className="text-xs font-bold text-zinc-300">{user.email?.charAt(0).toUpperCase()}</span>
            </div>
            <span className="text-sm font-medium text-zinc-300 hidden sm:block">{user.email}</span>
          </div>
        </header>

        {/* Page Content area */}
        <main className="flex-1 overflow-y-auto p-8 relative z-10 custom-scrollbar">
          <div className="max-w-4xl mx-auto">
            {children}
          </div>
        </main>
      </div>

    </div>
  )
}
