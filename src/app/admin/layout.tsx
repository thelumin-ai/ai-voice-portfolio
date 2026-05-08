import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
  LayoutDashboard,
  FolderOpen,
  Briefcase,
  Layers,
  MessageSquare,
  Wrench,
  ListOrdered,
  Users,
  PlayCircle,
  Search,
  FileText,
  Settings,
  LogOut
} from 'lucide-react'
import { LogoutButton } from './LogoutButton'

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

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Portfolio', href: '/admin/portfolio', icon: FolderOpen },
    { name: 'Services/Solutions', href: '/admin/solutions', icon: Briefcase },
    { name: 'Use Cases', href: '/admin/use-cases', icon: Layers },
    { name: 'Testimonials', href: '/admin/testimonials', icon: MessageSquare },
    { name: 'Tech Stack', href: '/admin/tech-stack', icon: Wrench },
    { name: 'Process Steps', href: '/admin/process', icon: ListOrdered },
    { name: 'Lead Tracker', href: '/admin/leads', icon: Users },
    { name: 'Playground Manager', href: '/admin/playground', icon: PlayCircle },
    { name: 'SEO & Meta', href: '/admin/seo', icon: Search },
    { name: 'Blog/Insights', href: '/admin/blog', icon: FileText },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ]

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-zinc-950 transition-colors duration-300">
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-zinc-900 border-r border-gray-200 dark:border-white/10 flex flex-col transition-colors duration-300">
        <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-white/10">
          <h1 className="text-lg font-bold text-gray-900 dark:text-white">Admin Panel</h1>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                  >
                    <Icon className="mr-3 h-5 w-5 text-gray-400 dark:text-gray-500" />
                    {item.name}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-white/10">
          <LogoutButton />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-white/10 flex items-center justify-between px-6 transition-colors duration-300">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Dashboard</h2>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600 dark:text-gray-400">{user.email}</span>
            {/* Theme toggle could go here */}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
