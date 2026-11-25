'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  ArrowDown,
  ArrowUp,
  ArrowUpRight,
  Briefcase,
  Clock,
  Eye,
  EyeOff,
  FileEdit,
  FileText,
  FolderKanban,
  Layers,
  LayoutGrid,
  ListOrdered,
  MessageSquare,
  Palette,
  PlayCircle,
  PlusCircle,
  RotateCcw,
  Search,
  SlidersHorizontal,
  TrendingUp,
  Users,
  Wrench,
  type LucideIcon,
} from 'lucide-react'
import type { DashboardRecentBlog, DashboardRecentLead } from '@/lib/types'
import {
  DASHBOARD_WIDGET_META,
  type DashboardWidgetId,
} from '@/lib/admin/preferences'
import { useAdminPreferences } from '@/components/admin/AdminPreferencesContext'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import {
  AdminEmptyState,
  AdminErrorBanner,
  AdminStatusBadge,
} from '@/components/admin/AdminStates'
import { Button } from '@/components/ui/button'

interface DashboardClientProps {
  stats: {
    portfolioCount: number
    totalLeadsCount: number
    recentLeadCount: number
    publishedBlogsCount: number
  }
  moduleCounts: {
    useCases: number
    services: number
    testimonials: number
    techStack: number
    processSteps: number
    playground: number
    seo: number
  }
  recentLeads: DashboardRecentLead[]
  recentBlogs: DashboardRecentBlog[]
  errors: string[]
}

function formatSafeDate(raw: string | null | undefined): string {
  if (!raw) return '—'
  const d = new Date(raw)
  return Number.isNaN(d.getTime()) ? '—' : d.toLocaleDateString()
}

export function DashboardClient({
  stats,
  moduleCounts,
  recentLeads,
  recentBlogs,
  errors,
}: DashboardClientProps) {
  const [customizing, setCustomizing] = useState(false)
  const {
    preferences,
    moveWidget,
    toggleWidgetVisibility,
    resetDashboardWidgets,
  } = useAdminPreferences()

  const hiddenSet = new Set(preferences.hiddenWidgets)
  const visibleWidgets = preferences.widgetOrder.filter((id) => !hiddenSet.has(id))

  const kpiCards: Array<{
    label: string
    value: number
    icon: LucideIcon
    href: string
  }> = [
    {
      label: 'Portfolio Projects',
      value: stats.portfolioCount,
      icon: FolderKanban,
      href: '/admin/portfolio',
    },
    {
      label: 'Total Leads',
      value: stats.totalLeadsCount,
      icon: Users,
      href: '/admin/lead-tracker',
    },
    {
      label: 'New Leads (7d)',
      value: stats.recentLeadCount,
      icon: TrendingUp,
      href: '/admin/lead-tracker',
    },
    {
      label: 'Published Posts',
      value: stats.publishedBlogsCount,
      icon: FileText,
      href: '/admin/blog',
    },
  ]

  const quickActions: Array<{
    label: string
    description: string
    href: string
    icon: LucideIcon
  }> = [
    {
      label: 'Add Project',
      description: 'Publish new portfolio work',
      href: '/admin/portfolio/new',
      icon: FolderKanban,
    },
    {
      label: 'Write Blog Post',
      description: 'Draft with Markdown or AI',
      href: '/admin/blog/new',
      icon: FileText,
    },
    {
      label: 'Add Testimonial',
      description: 'Highlight a client review',
      href: '/admin/testimonials/new',
      icon: MessageSquare,
    },
    {
      label: 'Edit Site Copy',
      description: 'Hero, About & Problem text',
      href: '/admin/content',
      icon: FileEdit,
    },
    {
      label: 'Review Leads',
      description: 'Update inbound lead status',
      href: '/admin/lead-tracker',
      icon: Users,
    },
    {
      label: 'Branding & Logo',
      description: 'Customize admin title & logo',
      href: '/admin/settings#admin-branding',
      icon: Palette,
    },
  ]

  const modules: Array<{
    label: string
    count: number
    icon: LucideIcon
    href: string
  }> = [
    { label: 'Use Cases', count: moduleCounts.useCases, icon: Layers, href: '/admin/use-cases' },
    { label: 'Services', count: moduleCounts.services, icon: Briefcase, href: '/admin/services' },
    {
      label: 'Testimonials',
      count: moduleCounts.testimonials,
      icon: MessageSquare,
      href: '/admin/testimonials',
    },
    { label: 'Tech Stack', count: moduleCounts.techStack, icon: Wrench, href: '/admin/tech-stack' },
    {
      label: 'Process Steps',
      count: moduleCounts.processSteps,
      icon: ListOrdered,
      href: '/admin/process-steps',
    },
    {
      label: 'Playground',
      count: moduleCounts.playground,
      icon: PlayCircle,
      href: '/admin/playground',
    },
    { label: 'SEO Routes', count: moduleCounts.seo, icon: Search, href: '/admin/seo' },
  ]

  const renderWidget = (widgetId: DashboardWidgetId) => {
    switch (widgetId) {
      case 'kpi-stats':
        return (
          <section key="kpi-stats" aria-label="Key Metrics" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {kpiCards.map((stat) => {
              const Icon = stat.icon
              return (
                <Link
                  key={stat.label}
                  href={stat.href}
                  className="group adm-surface p-5 hover:border-adm-accent/50 transition-all"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center border border-adm-accent/25 bg-adm-accent-soft text-adm-accent">
                      <Icon className="h-5 w-5" />
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-adm-subtle group-hover:text-adm-accent transition-colors" />
                  </div>
                  <p className="text-3xl font-bold text-adm-text">{stat.value}</p>
                  <p className="text-sm text-adm-muted mt-1">{stat.label}</p>
                </Link>
              )
            })}
          </section>
        )

      case 'quick-actions':
        return (
          <section key="quick-actions" aria-label="Quick Actions" className="adm-surface adm-card-pad">
            <div className="flex items-center justify-between gap-2 mb-4">
              <h2 className="text-base font-semibold text-adm-text">Quick Actions</h2>
              <span className="adm-hint">Jump directly to common tasks</span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {quickActions.map((action) => {
                const Icon = action.icon
                return (
                  <Link
                    key={action.label}
                    href={action.href}
                    className="group flex items-start gap-3 rounded-xl border border-adm-border bg-adm-surface-2/50 p-3.5 hover:border-adm-accent/50 hover:bg-adm-surface-2 transition-all"
                  >
                    <div className="h-9 w-9 rounded-lg bg-adm-accent-soft text-adm-accent flex items-center justify-center shrink-0">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-adm-text group-hover:text-adm-accent transition-colors">
                        {action.label}
                      </p>
                      <p className="text-xs text-adm-muted mt-0.5 truncate">
                        {action.description}
                      </p>
                    </div>
                  </Link>
                )
              })}
            </div>
          </section>
        )

      case 'content-modules':
        return (
          <section key="content-modules" aria-label="Content Modules" className="adm-surface adm-card-pad">
            <div className="flex items-center justify-between gap-2 mb-4">
              <h2 className="text-base font-semibold text-adm-text">Content Modules</h2>
              <span className="adm-hint">Live database record counts</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              {modules.map((mod) => {
                const Icon = mod.icon
                return (
                  <Link
                    key={mod.label}
                    href={mod.href}
                    className="group flex flex-col items-center p-3.5 bg-adm-surface-2/50 border border-adm-border rounded-xl hover:border-adm-accent/50 hover:bg-adm-surface-2 transition-all text-center"
                  >
                    <Icon className="h-4 w-4 text-adm-subtle group-hover:text-adm-accent mb-2 transition-colors" />
                    <span className="text-2xl font-bold text-adm-text">{mod.count}</span>
                    <span className="text-xs text-adm-muted mt-1">{mod.label}</span>
                  </Link>
                )
              })}
            </div>
          </section>
        )

      case 'recent-leads':
        return (
          <section key="recent-leads" aria-label="Recent Leads" className="adm-surface adm-card-pad min-w-0">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-adm-text">Recent Leads</h2>
              <Link
                href="/admin/lead-tracker"
                className="text-xs font-medium text-adm-accent hover:underline"
              >
                View all →
              </Link>
            </div>
            {recentLeads.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-8 w-8 text-adm-subtle mx-auto mb-2" />
                <p className="text-sm text-adm-muted">
                  No leads yet. Visitors who submit your contact form will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {recentLeads.map((lead) => {
                  const displayName = lead.name?.trim() || 'Unknown'
                  return (
                    <div
                      key={lead.id}
                      className="flex items-center justify-between gap-3 p-3 bg-adm-surface-2/50 border border-adm-border rounded-xl"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="w-8 h-8 rounded-full bg-adm-accent-soft border border-adm-accent/25 flex items-center justify-center shrink-0">
                          <span className="text-xs font-bold text-adm-accent">
                            {displayName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-adm-text truncate">
                            {displayName}
                          </p>
                          <p className="text-xs text-adm-muted truncate">
                            {lead.email || '—'}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-adm-subtle flex items-center gap-1 whitespace-nowrap shrink-0">
                        <Clock className="h-3 w-3" />
                        {formatSafeDate(lead.created_at)}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
          </section>
        )

      case 'recent-posts':
        return (
          <section key="recent-posts" aria-label="Recent Blog Posts" className="adm-surface adm-card-pad min-w-0">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-adm-text">Recent Blog Posts</h2>
              <Link
                href="/admin/blog"
                className="text-xs font-medium text-adm-accent hover:underline"
              >
                View all →
              </Link>
            </div>
            {recentBlogs.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-8 w-8 text-adm-subtle mx-auto mb-2" />
                <p className="text-sm text-adm-muted">
                  No blog posts yet. Create your first post to start sharing insights.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {recentBlogs.map((post) => (
                  <Link
                    key={post.id}
                    href={`/admin/blog/${post.id}`}
                    className="flex items-center justify-between gap-3 p-3 bg-adm-surface-2/50 border border-adm-border rounded-xl hover:border-adm-accent/40 transition-all group"
                  >
                    <p className="text-sm font-medium text-adm-text truncate group-hover:text-adm-accent transition-colors min-w-0">
                      {post.title || 'Untitled Post'}
                    </p>
                    <div className="shrink-0">
                      <AdminStatusBadge status={post.status} />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        )
    }
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Dashboard"
        description="Overview of your portfolio metrics, inbound leads, and content modules."
        actions={
          <>
            <Button
              type="button"
              variant={customizing ? 'default' : 'outline'}
              onClick={() => setCustomizing((prev) => !prev)}
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              {customizing ? 'Done Customizing' : 'Customize Widgets'}
            </Button>
            <Button variant="outline" asChild>
              <Link href="/admin/portfolio/new">
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Project
              </Link>
            </Button>
            <Button asChild>
              <Link href="/admin/blog/new">
                <PlusCircle className="h-4 w-4 mr-2" />
                New Post
              </Link>
            </Button>
          </>
        }
      />

      {errors.length > 0 && (
        <AdminErrorBanner
          title="Some dashboard metrics failed to load"
          message={errors.join(' • ')}
        />
      )}

      {customizing && (
        <div className="adm-surface adm-card-pad space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-adm-border pb-3">
            <div>
              <h2 className="text-sm font-semibold text-adm-text">
                Customize Dashboard Layout
              </h2>
              <p className="adm-hint">
                Reorder sections or toggle visibility. Saved automatically in your browser.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={resetDashboardWidgets}
            >
              <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
              Reset Default Layout
            </Button>
          </div>

          <div className="space-y-2">
            {preferences.widgetOrder.map((widgetId, idx) => {
              const meta = DASHBOARD_WIDGET_META[widgetId]
              const isHidden = hiddenSet.has(widgetId)
              return (
                <div
                  key={widgetId}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-adm-border bg-adm-surface-2/50 px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-adm-text">{meta.label}</p>
                    <p className="text-xs text-adm-muted">{meta.description}</p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      disabled={idx === 0}
                      aria-label={`Move ${meta.label} up`}
                      onClick={() => moveWidget(widgetId, 'up')}
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      disabled={idx === preferences.widgetOrder.length - 1}
                      aria-label={`Move ${meta.label} down`}
                      onClick={() => moveWidget(widgetId, 'down')}
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant={isHidden ? 'outline' : 'secondary'}
                      size="sm"
                      onClick={() => toggleWidgetVisibility(widgetId)}
                      className="min-w-[94px]"
                    >
                      {isHidden ? (
                        <>
                          <EyeOff className="h-3.5 w-3.5 mr-1.5" />
                          Hidden
                        </>
                      ) : (
                        <>
                          <Eye className="h-3.5 w-3.5 mr-1.5" />
                          Visible
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {visibleWidgets.length === 0 ? (
        <div className="adm-surface adm-card-pad">
          <AdminEmptyState
            icon={LayoutGrid}
            title="All dashboard widgets are hidden"
            description="Restore the default dashboard widget layout or toggle individual widgets back on."
            action={
              <Button type="button" size="sm" onClick={resetDashboardWidgets}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Restore Default Widgets
              </Button>
            }
          />
        </div>
      ) : (
        <div className="space-y-6">{visibleWidgets.map((id) => renderWidget(id))}</div>
      )}
    </div>
  )
}
