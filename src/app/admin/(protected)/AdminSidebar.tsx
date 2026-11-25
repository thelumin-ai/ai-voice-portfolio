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
  Webhook,
  X,
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
  { name: 'Webhook Manager', href: '/admin/webhooks', icon: Webhook },
  { name: 'Playground Manager', href: '/admin/playground', icon: PlayCircle },
  { name: 'SEO & Meta', href: '/admin/seo', icon: Search },
  { name: 'Blog/Insights', href: '/admin/blog', icon: FileText },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
]

interface AdminSidebarProps {
  onNavigate?: () => void
  onClose?: () => void
  className?: string
}

export function AdminSidebar({ onNavigate, onClose, className = '' }: AdminSidebarProps) {
  const pathname = usePathname()

  return (
    <div className={`w-64 shrink-0 bg-zinc-950 border-r border-zinc-900 flex flex-col h-full transition-colors duration-300 ${className}`}>
      <div className="h-16 flex items-center justify-between px-6 border-b border-zinc-900 bg-zinc-950/50 backdrop-blur-sm shrink-0">
        <h1 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
          <span className="w-6 h-6 rounded-md bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <span className="text-xs text-white">AI</span>
          </span>
          Admin Panel
        </h1>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation menu"
            className="lg:hidden p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900"
          >
            <X className="w-5 h-5" />
          </button>
        )}
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
                  onClick={onNavigate}
                  className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-900/20'
                      : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100'
                  }`}
                >
                  <Icon className={`mr-3 h-5 w-5 shrink-0 transition-transform duration-200 ${isActive ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-300 group-hover:scale-110'}`} />
                  <span className="truncate">{item.name}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-zinc-900 bg-zinc-950/50 shrink-0">
        <LogoutButton />
      </div>
    </div>
  )
}
