'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  Briefcase,
  FileEdit,
  FileText,
  FolderOpen,
  Layers,
  LayoutDashboard,
  ListOrdered,
  MessageSquare,
  PlayCircle,
  Search,
  Settings,
  Users,
  Webhook,
  Wrench,
  X,
  type LucideIcon,
} from 'lucide-react'
import type { AdminBranding } from '@/lib/types'
import { isSafeHttpUrl } from '@/lib/url'
import { LogoutButton } from './LogoutButton'

interface NavGroup {
  label: string
  items: Array<{
    name: string
    href: string
    icon: LucideIcon
  }>
}

const navGroups: NavGroup[] = [
  {
    label: 'Overview',
    items: [
      { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    ],
  },
  {
    label: 'Content',
    items: [
      { name: 'Content Editor', href: '/admin/content', icon: FileEdit },
      { name: 'Portfolio', href: '/admin/portfolio', icon: FolderOpen },
      { name: 'Services', href: '/admin/services', icon: Briefcase },
      { name: 'Use Cases', href: '/admin/use-cases', icon: Layers },
      { name: 'Testimonials', href: '/admin/testimonials', icon: MessageSquare },
      { name: 'Tech Stack', href: '/admin/tech-stack', icon: Wrench },
      { name: 'Process Steps', href: '/admin/process-steps', icon: ListOrdered },
      { name: 'Playground', href: '/admin/playground', icon: PlayCircle },
      { name: 'Blog & Insights', href: '/admin/blog', icon: FileText },
    ],
  },
  {
    label: 'Growth & SEO',
    items: [
      { name: 'Lead Tracker', href: '/admin/lead-tracker', icon: Users },
      { name: 'Webhooks', href: '/admin/webhooks', icon: Webhook },
      { name: 'SEO & Meta', href: '/admin/seo', icon: Search },
    ],
  },
  {
    label: 'System',
    items: [
      { name: 'Settings', href: '/admin/settings', icon: Settings },
    ],
  },
]

interface AdminSidebarProps {
  branding: AdminBranding
  collapsed?: boolean
  onNavigate?: () => void
  onClose?: () => void
  className?: string
}

export function AdminSidebar({
  branding,
  collapsed = false,
  onNavigate,
  onClose,
  className = '',
}: AdminSidebarProps) {
  const pathname = usePathname()
  const logoUrl = branding.logoUrl.trim()
  const hasValidLogo =
    Boolean(logoUrl) &&
    (isSafeHttpUrl(logoUrl) || (logoUrl.startsWith('/') && !logoUrl.startsWith('//')))
  const monogram = (branding.brandName || 'AP').slice(0, 2).toUpperCase()

  return (
    <div
      className={`${
        collapsed ? 'w-[76px]' : 'w-64'
      } shrink-0 bg-adm-surface border-r border-adm-border flex flex-col h-full transition-all duration-200 ${className}`}
    >
      <div
        className={`h-16 flex items-center ${
          collapsed ? 'justify-center px-3' : 'justify-between px-4'
        } border-b border-adm-border shrink-0`}
      >
        <Link
          href="/admin/dashboard"
          onClick={onNavigate}
          title={branding.brandName}
          className="flex items-center gap-2.5 min-w-0"
        >
          {hasValidLogo ? (
            <div className="h-8 w-8 rounded-lg border border-adm-border bg-adm-surface-2 overflow-hidden flex items-center justify-center shrink-0">
              <Image
                src={logoUrl}
                alt={branding.brandName}
                width={32}
                height={32}
                unoptimized
                className="h-8 w-8 object-contain"
              />
            </div>
          ) : (
            <span className="h-8 w-8 rounded-lg bg-adm-accent text-adm-accent-fg flex items-center justify-center text-xs font-bold shadow-sm shrink-0">
              {monogram}
            </span>
          )}
          {!collapsed && (
            <span className="text-base font-bold tracking-tight text-adm-text truncate">
              {branding.brandName}
            </span>
          )}
        </Link>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation menu"
            className="lg:hidden p-1.5 rounded-lg text-adm-muted hover:text-adm-text hover:bg-adm-surface-2"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-2.5 space-y-5 custom-scrollbar">
        {navGroups.map((group) => (
          <div key={group.label}>
            {!collapsed ? (
              <p className="px-3 mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-adm-subtle">
                {group.label}
              </p>
            ) : (
              <div className="mx-2 mb-2 border-t border-adm-border/70 first:hidden" />
            )}
            <ul className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon
                const isActive =
                  pathname === item.href || pathname.startsWith(`${item.href}/`)
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      title={collapsed ? item.name : undefined}
                      className={`flex items-center ${
                        collapsed ? 'justify-center px-2 py-2.5' : 'px-3 py-2'
                      } text-sm font-medium rounded-lg transition-colors ${
                        isActive
                          ? 'bg-adm-accent text-adm-accent-fg shadow-sm'
                          : 'text-adm-muted hover:bg-adm-surface-2 hover:text-adm-text'
                      }`}
                    >
                      <Icon
                        className={`h-4 w-4 shrink-0 ${
                          collapsed ? '' : 'mr-3'
                        } ${isActive ? 'text-adm-accent-fg' : 'text-adm-subtle'}`}
                      />
                      {!collapsed && <span className="truncate">{item.name}</span>}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="p-3 border-t border-adm-border shrink-0">
        <LogoutButton collapsed={collapsed} />
      </div>
    </div>
  )
}
