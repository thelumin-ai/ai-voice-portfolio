'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  Briefcase,
  FileEdit,
  FileText,
  FolderOpen,
  Globe,
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

interface NavItem {
  name: string
  href: string
  icon: LucideIcon
}

interface NavGroup {
  label: string
  items: NavItem[]
}

const mainNavGroups: NavGroup[] = [
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
      { name: 'SEO & Meta', href: '/admin/seo', icon: Globe },
    ],
  },
]

const footerNavItems: NavItem[] = [
  { name: 'Settings', href: '/admin/settings', icon: Settings },
]

interface AdminSidebarProps {
  branding: AdminBranding
  collapsed?: boolean
  onExpandAndSearch?: () => void
  onNavigate?: () => void
  onClose?: () => void
  className?: string
}

export function AdminSidebar({
  branding,
  collapsed = false,
  onExpandAndSearch,
  onNavigate,
  onClose,
  className = '',
}: AdminSidebarProps) {
  const pathname = usePathname()
  const searchInputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState('')
  const [railTooltip, setRailTooltip] = useState<{ label: string; top: number } | null>(null)

  const logoUrl = branding.logoUrl.trim()
  const hasValidLogo =
    Boolean(logoUrl) &&
    (isSafeHttpUrl(logoUrl) || (logoUrl.startsWith('/') && !logoUrl.startsWith('//')))
  const monogram = (branding.brandName || 'AP').slice(0, 2).toUpperCase()

  const normalizedQuery = query.trim().toLowerCase()
  const filteredGroups = normalizedQuery
    ? mainNavGroups
        .map((group) => ({
          ...group,
          items: group.items.filter((item) =>
            item.name.toLowerCase().includes(normalizedQuery)
          ),
        }))
        .filter((group) => group.items.length > 0)
    : mainNavGroups

  const handleRailTooltip = (label: string | null, rect?: DOMRect) => {
    if (!collapsed || !label || !rect) {
      setRailTooltip(null)
      return
    }
    setRailTooltip({
      label,
      top: rect.top + rect.height / 2,
    })
  }

  const handleCollapsedSearchClick = () => {
    setRailTooltip(null)
    if (onExpandAndSearch) {
      onExpandAndSearch()
      window.setTimeout(() => {
        searchInputRef.current?.focus()
      }, 80)
    }
  }

  return (
    <div
      onMouseLeave={() => setRailTooltip(null)}
      className={`${
        collapsed ? 'w-[62px]' : 'w-[248px]'
      } shrink-0 bg-adm-surface border-r border-adm-border flex flex-col h-full transition-[width] duration-200 ease-out select-none relative ${className}`}
    >
      {/* Top Brand Header */}
      <div
        className={`h-14 flex items-center ${
          collapsed ? 'justify-center px-2' : 'justify-between px-4'
        } shrink-0`}
      >
        <Link
          href="/admin/dashboard"
          onClick={onNavigate}
          onMouseEnter={(e) => handleRailTooltip(branding.brandName, e.currentTarget.getBoundingClientRect())}
          onMouseLeave={() => handleRailTooltip(null)}
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
            <span className="text-[15px] font-bold tracking-tight text-adm-text truncate">
              {branding.brandName}
            </span>
          )}
        </Link>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation menu"
            className="md:hidden p-1.5 rounded-lg text-adm-muted hover:text-adm-text hover:bg-adm-surface-2"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* ElevenLabs-style Quick Search Pill / Circular Rail Button */}
      <div className={collapsed ? 'px-2 pb-2 flex justify-center shrink-0' : 'px-3 pb-2 shrink-0'}>
        {collapsed ? (
          <button
            type="button"
            onClick={handleCollapsedSearchClick}
            aria-label="Quick search navigation"
            onMouseEnter={(e) => handleRailTooltip('Quick search', e.currentTarget.getBoundingClientRect())}
            onMouseLeave={() => handleRailTooltip(null)}
            className="h-9 w-9 rounded-full border border-adm-border bg-adm-surface-2/50 flex items-center justify-center text-adm-muted hover:text-adm-text hover:bg-adm-surface-2 transition-colors"
          >
            <Search className="h-4 w-4" />
          </button>
        ) : (
          <div className="relative flex items-center">
            <Search className="h-3.5 w-3.5 text-adm-subtle absolute left-3 pointer-events-none" />
            <input
              ref={searchInputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Quick search..."
              aria-label="Filter navigation"
              className="w-full h-8 pl-8 pr-7 rounded-full border border-adm-border bg-adm-surface-2/50 text-xs text-adm-text placeholder:text-adm-subtle focus:outline-none focus:border-adm-accent/60 transition-colors"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                aria-label="Clear search"
                className="absolute right-2.5 text-adm-subtle hover:text-adm-text"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Scrollable Navigation Items */}
      <nav
        onScroll={() => setRailTooltip(null)}
        className={`flex-1 overflow-y-auto custom-scrollbar ${
          collapsed ? 'py-2 px-2 space-y-2' : 'py-2 px-3 space-y-4'
        }`}
      >
        {filteredGroups.map((group, groupIdx) => (
          <div key={group.label}>
            {!collapsed ? (
              <p className="px-2.5 mb-1 text-[11px] font-medium text-adm-subtle">
                {group.label}
              </p>
            ) : (
              groupIdx > 0 && <div className="mx-2 my-1.5 border-t border-adm-border/60" />
            )}
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon
                const isActive =
                  pathname === item.href || pathname.startsWith(`${item.href}/`)
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => {
                        setRailTooltip(null)
                        onNavigate?.()
                      }}
                      onMouseEnter={(e) =>
                        handleRailTooltip(item.name, e.currentTarget.getBoundingClientRect())
                      }
                      onMouseLeave={() => handleRailTooltip(null)}
                      className={`flex items-center transition-colors ${
                        collapsed
                          ? 'h-9 w-9 mx-auto justify-center rounded-xl'
                          : 'px-2.5 py-2 rounded-lg text-[13px] font-medium'
                      } ${
                        isActive
                          ? 'bg-adm-accent-soft text-adm-accent font-semibold'
                          : 'text-adm-muted hover:bg-adm-surface-2 hover:text-adm-text'
                      }`}
                    >
                      <Icon
                        className={`h-[18px] w-[18px] shrink-0 ${
                          collapsed ? '' : 'mr-2.5'
                        } ${isActive ? 'text-adm-accent' : 'text-adm-muted'}`}
                      />
                      {!collapsed && <span className="truncate">{item.name}</span>}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}

        {!collapsed && filteredGroups.length === 0 && (
          <p className="px-2.5 py-4 text-xs text-adm-subtle text-center">
            No matching sections
          </p>
        )}
      </nav>

      {/* Bottom Pinned System Actions (ElevenLabs-style footer rail) */}
      <div
        className={`border-t border-adm-border shrink-0 ${
          collapsed ? 'py-2.5 px-2 space-y-1' : 'p-2.5 space-y-0.5'
        }`}
      >
        {footerNavItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => {
                setRailTooltip(null)
                onNavigate?.()
              }}
              onMouseEnter={(e) =>
                handleRailTooltip(item.name, e.currentTarget.getBoundingClientRect())
              }
              onMouseLeave={() => handleRailTooltip(null)}
              className={`flex items-center transition-colors ${
                collapsed
                  ? 'h-9 w-9 mx-auto justify-center rounded-xl'
                  : 'px-3 py-2 rounded-lg text-[13px] font-medium'
              } ${
                isActive
                  ? 'bg-adm-accent-soft text-adm-accent font-semibold'
                  : 'text-adm-muted hover:bg-adm-surface-2 hover:text-adm-text'
              }`}
            >
              <Icon
                className={`h-[18px] w-[18px] shrink-0 ${
                  collapsed ? '' : 'mr-3'
                } ${isActive ? 'text-adm-accent' : 'text-adm-muted'}`}
              />
              {!collapsed && <span className="truncate">{item.name}</span>}
            </Link>
          )
        })}

        <LogoutButton collapsed={collapsed} onHoverTooltip={handleRailTooltip} />
      </div>

      {/* Floating Unclipped Pill Tooltip for Collapsed Rail */}
      {collapsed && railTooltip && (
        <div
          style={{ top: `${railTooltip.top}px`, left: '68px' }}
          className="fixed z-50 -translate-y-1/2 rounded-md bg-zinc-900 px-2.5 py-1 text-xs font-medium text-white shadow-lg border border-white/10 pointer-events-none whitespace-nowrap"
        >
          {railTooltip.label}
        </div>
      )}
    </div>
  )
}
