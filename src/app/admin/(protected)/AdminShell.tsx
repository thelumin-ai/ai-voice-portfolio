'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { ExternalLink, Moon, Palette, PanelLeft, Sun } from 'lucide-react'
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
  const { preferences, toggleMode, toggleSidebarCollapsed, setSidebarCollapsed } =
    useAdminPreferences()

  if (prevPathname !== pathname) {
    setPrevPathname(pathname)
    setMobileMenuOpen(false)
  }

  // Escape closes mobile drawer; Ctrl/Cmd+B toggles desktop sidebar like ElevenLabs
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false)
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'b') {
        const target = e.target as HTMLElement | null
        const isEditable =
          target?.tagName === 'INPUT' ||
          target?.tagName === 'TEXTAREA' ||
          target?.isContentEditable
        if (!isEditable) {
          e.preventDefault()
          toggleSidebarCollapsed()
        }
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [mobileMenuOpen, toggleSidebarCollapsed])

  const sectionTitle = getRouteTitle(pathname)
  const sidebarTooltipLabel = preferences.sidebarCollapsed ? 'Open sidebar' : 'Close sidebar'

  return (
    <div
      className="admin-root flex h-screen bg-adm-bg text-adm-text font-sans overflow-hidden"
      data-mode={preferences.mode}
      data-accent={preferences.accent}
      data-density={preferences.density}
    >
      {/* Persistent Sidebar / Compact Icon Rail on Tablet & Desktop (>= 768px) */}
      <aside className="hidden md:flex shrink-0">
        <AdminSidebar
          branding={branding}
          collapsed={preferences.sidebarCollapsed}
          onExpandAndSearch={() => setSidebarCollapsed(false)}
        />
      </aside>

      {/* Mobile Slide-Over Drawer (< 768px) */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 md:hidden flex"
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
        {/* Top Bar — ElevenLabs-style sidebar toggle button right beside the sidebar border */}
        <header className="h-14 border-b border-adm-border bg-adm-surface/95 backdrop-blur-md flex items-center justify-between px-3 sm:px-5 shrink-0 gap-3 relative z-20">
          <div className="flex items-center gap-2 min-w-0">
            {/* Mobile (< 768px) sidebar button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((open) => !open)}
              aria-label={mobileMenuOpen ? 'Close sidebar' : 'Open sidebar'}
              className="md:hidden inline-flex h-8 w-8 items-center justify-center rounded-lg text-adm-muted hover:text-adm-text hover:bg-adm-surface-2 focus:outline-none focus:ring-2 focus:ring-adm-accent/40 transition-colors"
            >
              <PanelLeft className="h-[18px] w-[18px]" />
            </button>

            {/* Desktop & Tablet (>= 768px) ElevenLabs-style sidebar toggle button with instant pill tooltip */}
            <div className="relative hidden md:inline-flex items-center group">
              <button
                type="button"
                onClick={toggleSidebarCollapsed}
                aria-label={sidebarTooltipLabel}
                aria-expanded={!preferences.sidebarCollapsed}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-adm-muted hover:text-adm-text hover:bg-adm-surface-2 focus:outline-none focus:ring-2 focus:ring-adm-accent/40 transition-colors"
              >
                <PanelLeft className="h-[18px] w-[18px]" />
              </button>
              <span
                role="tooltip"
                className="pointer-events-none absolute left-full ml-2 top-1/2 -translate-y-1/2 z-50 rounded-md bg-zinc-900 px-2.5 py-1 text-xs font-medium text-white shadow-lg border border-white/10 whitespace-nowrap opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-150"
              >
                {sidebarTooltipLabel}
              </span>
            </div>

            <div className="h-4 w-px bg-adm-border mx-0.5 hidden sm:block" />

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
              <div className="w-7 h-7 rounded-full bg-adm-accent-soft border border-adm-accent/30 flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-adm-accent">
                  {userEmail ? userEmail.charAt(0).toUpperCase() : 'A'}
                </span>
              </div>
              <span className="text-xs font-medium text-adm-muted hidden xl:block truncate max-w-[180px]">
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
