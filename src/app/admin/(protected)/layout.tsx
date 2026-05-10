import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AdminSidebar } from './AdminSidebar'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-blue-500/30">
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-[300px] bg-blue-600/5 blur-[120px] pointer-events-none z-0" />

        {/* Header */}
        <header className="h-16 border-b border-zinc-900/50 bg-zinc-950/80 backdrop-blur-md flex items-center justify-between px-8 relative z-10">
          <h2 className="text-sm font-semibold text-zinc-400 tracking-wider uppercase">Dashboard Console</h2>
          <div className="flex items-center space-x-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center overflow-hidden">
                 <span className="text-xs font-bold text-zinc-300">{user.email?.charAt(0).toUpperCase()}</span>
              </div>
              <span className="text-sm font-medium text-zinc-300 hidden sm:block">{user.email}</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8 relative z-10 custom-scrollbar">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
