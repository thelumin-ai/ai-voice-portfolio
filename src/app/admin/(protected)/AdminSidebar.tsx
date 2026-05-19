'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
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
  FileEdit,
} from 'lucide-react'
import { LogoutButton } from './LogoutButton'

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Content Editor', href: '/admin/content', icon: FileEdit },
  { name: 'Portfolio', href: '/admin/portfolio', icon: FolderOpen },
  { name: 'Services/Solutions', href: '/admin/services', icon: Briefcase },
  { name: 'Use Cases', href: '/admin/use-cases', icon: Layers },
  { name: 'Testimonials', href: '/admin/testimonials', icon: MessageSquare },
  { name: 'Tech Stack', href: '/admin/tech-stack', icon: Wrench },
  { name: 'Process Steps', href: '/admin/process-steps', icon: ListOrdered },
  { name: 'Lead Tracker', href: '/admin/lead-tracker', icon: Users },
  { name: 'Playground Manager', href: '/admin/playground', icon: PlayCircle },
  { name: 'SEO & Meta', href: '/admin/seo', icon: Search },
  { name: 'Blog/Insights', href: '/admin/blog', icon: FileText },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-zinc-950 border-r border-zinc-900 flex flex-col transition-colors duration-300">
      <div className="h-16 flex items-center px-6 border-b border-zinc-900 bg-zinc-950/50 backdrop-blur-sm">
        <h1 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <span className="text-xs text-white">AI</span>
            </span>
            Admin Panel
        </h1>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-6 custom-scrollbar">
        <ul className="space-y-1.5 px-3">
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-900/20' 
                      : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100'
                  }`}
                >
                  <Icon className={`mr-3 h-5 w-5 transition-transform duration-200 ${isActive ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-300 group-hover:scale-110'}`} />
                  {item.name}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-zinc-900 bg-zinc-950/50">
        <LogoutButton />
      </div>
    </div>
  )
}
