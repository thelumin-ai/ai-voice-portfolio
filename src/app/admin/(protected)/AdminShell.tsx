'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { ExternalLink, Menu, Moon, Palette, PanelLeftClose, PanelLeftOpen, Sun } from 'lucide-react'
import type { AdminBranding } from '@/lib/types'
import { AdminPreferencesProvider, useAdminPreferences } from '@/components/admin/AdminPreferencesContext'
import { AdminToastProvider } from '@/components/admin/AdminToast'
import { AdminAppearanceDrawer } from '@/components/admin/AdminAppearanceDrawer'
import { AdminSidebar } from './AdminSidebar'

interface AdminShellProps {
  userEmail: string
  branding: AdminBranding
  children: React.ReactNode
}

const ROUTE_TITLES: Array<{ prefix: string; title: string }> = [
  { prefix: '/admin/dashboard', title: 'Dashboard' },
  { prefix: '/admin/content', title: 'Content Editor' },
  { prefix: '/admin/portfolio', title: 'Portfolio' },
  { prefix: '/admin/services', title: 'Services' },
  { prefix: '/admin/use-cases', title: 'Use Cases' },
  { prefix: '/admin/testimonials', title: 'Testimonials' },
  { prefix: '/admin/tech-stack', title: 'Tech Stack' },
  { prefix: '/admin/process-steps', title: 'Process Steps' },
  { prefix: '/admin/playground', title: 'Playground' },
  { prefix: '/admin/blog', title: 'Blog & Insights' },
  { prefix: '/admin/lead-tracker', title: 'Lead Tracker' },
  { prefix: '/admin/webhooks', title: 'Webhooks' },
  { prefix: '/admin/seo', title: 'SEO & Meta' },
  { prefix: '/admin/settings', title: 'Settings' },
]

function getRouteTitle(pathname: string): string {
  const match = ROUTE_TITLES.find(
    (entry) => pathname === entry.prefix || pathname.startsWith(`${entry.prefix}/`)
  )
  return match?.title || 'Admin Workspace'
}

function AdminShellInner({ userEmail, branding, children }: AdminShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [appearanceOpen, setAppearanceOpen] = useState(false)
  const pathname = usePathname()
  const [prevPathname, setPrevPathname] = useState(pathname)
  const { preferences, toggleMode, toggleSidebarCollapsed } = useAdminPreferences()

  if (prevPathname !== pathname) {
    setPrevPathname(pathname)
    setMobileMenuOpen(false)
  }

  useEffect(() => {
    if (!mobileMenuOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [mobileMenuOpen])

  const sectionTitle = getRouteTitle(pathname)

  return (
    <div
      className="admin-root flex h-screen bg-adm-bg text-adm-text font-sans overflow-hidden"
      data-mode={preferences.mode}
      data-accent={preferences.accent}
      data-density={preferences.density}
    >
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex shrink-0">
        <AdminSidebar
          branding={branding}
          collapsed={preferences.sidebarCollapsed}
        />
      </aside>

      {/* Mobile Slide-Over Drawer */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden flex"
          role="dialog"
          aria-modal="true"
          aria-label="Admin navigation"
        >
          <div
            className="fixed inset-0 bg-black/65 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative z-10 h-full">
            <AdminSidebar
              branding={branding}
              collapsed={false}
              onNavigate={() => setMobileMenuOpen(false)}
              onClose={() => setMobileMenuOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Main Column */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 border-b border-adm-border bg-adm-surface/95 backdrop-blur-md flex items-center justify-between px-4 sm:px-6 shrink-0 gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open navigation menu"
              className="lg:hidden p-2 -ml-1.5 rounded-lg text-adm-muted hover:text-adm-text hover:bg-adm-surface-2 focus:outline-none focus:ring-2 focus:ring-adm-accent/40"
            >
              <Menu className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={toggleSidebarCollapsed}
              aria-label={preferences.sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              title={preferences.sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              className="hidden lg:inline-flex p-2 -ml-1.5 rounded-lg text-adm-muted hover:text-adm-text hover:bg-adm-surface-2 focus:outline-none focus:ring-2 focus:ring-adm-accent/40 transition-colors"
            >
              {preferences.sidebarCollapsed ? (
                <PanelLeftOpen className="w-4 h-4" />
              ) : (
                <PanelLeftClose className="w-4 h-4" />
              )}
            </button>

            <div className="min-w-0 flex items-center gap-2">
              <span className="text-sm font-semibold text-adm-text truncate">{sectionTitle}</span>
              <span className="hidden sm:inline text-adm-subtle">/</span>
              <span className="hidden sm:inline text-xs font-medium text-adm-muted truncate">
                {branding.brandSubtitle}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex items-center gap-1.5 rounded-lg border border-adm-border bg-adm-surface-2/60 px-2.5 py-1.5 text-xs font-medium text-adm-muted transition-colors hover:text-adm-text hover:bg-adm-surface-2"
            >
              <span>View Site</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>

            <button
              type="button"
              onClick={toggleMode}
              aria-label={preferences.mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              title={preferences.mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              className="p-2 rounded-lg border border-adm-border bg-adm-surface-2/60 text-adm-muted hover:text-adm-text hover:bg-adm-surface-2 transition-colors"
            >
              {preferences.mode === 'dark' ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setAppearanceOpen(true)}
              aria-label="Customize appearance"
              className="inline-flex items-center gap-1.5 rounded-lg border border-adm-border bg-adm-surface-2/60 px-2.5 py-1.5 text-xs font-medium text-adm-text transition-colors hover:border-adm-accent/50 hover:bg-adm-surface-2"
            >
              <Palette className="h-3.5 w-3.5 text-adm-accent" />
              <span className="hidden sm:inline">Customize</span>
            </button>

            <div className="flex items-center gap-2 pl-1 sm:pl-2 border-l border-adm-border">
              <div className="w-8 h-8 rounded-full bg-adm-accent-soft border border-adm-accent/30 flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-adm-accent">
                  {userEmail ? userEmail.charAt(0).toUpperCase() : 'A'}
                </span>
              </div>
              <span className="text-xs font-medium text-adm-muted hidden lg:block truncate max-w-[180px]">
                {userEmail}
              </span>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main
          className="flex-1 overflow-y-auto custom-scrollbar"
          style={{ padding: 'var(--adm-pad)' }}
        >
          <div className="max-w-6xl mx-auto">{children}</div>
        </main>
      </div>

      <AdminAppearanceDrawer
        open={appearanceOpen}
        onClose={() => setAppearanceOpen(false)}
      />
    </div>
  )
}

export function AdminShell({ userEmail, branding, children }: AdminShellProps) {
  return (
    <AdminPreferencesProvider>
      <AdminToastProvider>
        <AdminShellInner userEmail={userEmail} branding={branding}>
          {children}
        </AdminShellInner>
      </AdminToastProvider>
    </AdminPreferencesProvider>
  )
}
