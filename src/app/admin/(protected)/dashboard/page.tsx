import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import {
  FolderKanban, Users, FileText, TrendingUp, Layers,
  MessageSquare, Wrench, PlayCircle, PlusCircle, ArrowUpRight,
  Clock, CheckCircle2, AlertCircle
} from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const supabase = await createClient()

  // Fetch counts from all tables in parallel
  const [
    portfolioRes,
    leadsRes,
    blogRes,
    useCasesRes,
    servicesRes,
    testimonialsRes,
    techStackRes,
    playgroundRes,
    recentLeadsRes,
    recentBlogRes,
  ] = await Promise.all([
    supabase.from('portfolio_projects').select('*', { count: 'exact', head: true }),
    supabase.from('leads').select('*', { count: 'exact', head: true }),
    supabase.from('blog_posts').select('*', { count: 'exact', head: true }).eq('status', 'published'),
    supabase.from('use_cases').select('*', { count: 'exact', head: true }),
    supabase.from('services').select('*', { count: 'exact', head: true }),
    supabase.from('testimonials').select('*', { count: 'exact', head: true }),
    supabase.from('tech_stack').select('*', { count: 'exact', head: true }),
    supabase.from('playground_apps').select('*', { count: 'exact', head: true }),
    supabase.from('leads').select('id, name, email, company, created_at').order('created_at', { ascending: false }).limit(5),
    supabase.from('blog_posts').select('id, title, status, created_at, slug').order('created_at', { ascending: false }).limit(5),
  ])

  // Count leads from last 7 days
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  const { count: recentLeadCount } = await supabase
    .from('leads')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', sevenDaysAgo)

  const stats = [
    { label: 'Portfolio Projects', value: portfolioRes.count || 0, icon: FolderKanban, href: '/admin/portfolio', color: 'blue' },
    { label: 'Total Leads', value: leadsRes.count || 0, icon: Users, href: '/admin/lead-tracker', color: 'green' },
    { label: 'New Leads (7d)', value: recentLeadCount || 0, icon: TrendingUp, href: '/admin/lead-tracker', color: 'emerald' },
    { label: 'Published Posts', value: blogRes.count || 0, icon: FileText, href: '/admin/blog', color: 'purple' },
  ]

  const modules = [
    { label: 'Use Cases', count: useCasesRes.count || 0, icon: Layers, href: '/admin/use-cases', color: 'sky' },
    { label: 'Services', count: servicesRes.count || 0, icon: Wrench, href: '/admin/services', color: 'amber' },
    { label: 'Testimonials', count: testimonialsRes.count || 0, icon: MessageSquare, href: '/admin/testimonials', color: 'pink' },
    { label: 'Tech Stack', count: techStackRes.count || 0, icon: Wrench, href: '/admin/tech-stack', color: 'orange' },
    { label: 'Playground Apps', count: playgroundRes.count || 0, icon: PlayCircle, href: '/admin/playground', color: 'indigo' },
  ]

  const recentLeads = recentLeadsRes.data || []
  const recentBlogs = recentBlogRes.data || []

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard</h1>
          <p className="text-zinc-400 mt-1">Overview of your portfolio and business metrics.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/admin/portfolio/new"
            className="flex items-center gap-2 px-4 py-2.5 bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 rounded-xl text-sm font-medium transition-all"
          >
            <PlusCircle className="h-4 w-4" /> Add Project
          </Link>
          <Link
            href="/admin/blog/new"
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-medium transition-all shadow-lg shadow-blue-600/20"
          >
            <PlusCircle className="h-4 w-4" /> New Blog Post
          </Link>
        </div>
      </div>

      {/* Primary Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="group bg-zinc-950 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-700 transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-${stat.color}-500/10 border border-${stat.color}-500/20`}>
                  <Icon className={`h-5 w-5 text-${stat.color}-400`} />
                </div>
                <ArrowUpRight className="h-4 w-4 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
              </div>
              <p className="text-3xl font-bold text-white">{stat.value}</p>
              <p className="text-sm text-zinc-500 mt-1">{stat.label}</p>
            </Link>
          )
        })}
      </div>

      {/* Module Counts */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-bold text-white mb-4">Content Modules</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {modules.map((mod) => {
            const Icon = mod.icon
            return (
              <Link
                key={mod.label}
                href={mod.href}
                className="flex flex-col items-center p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl hover:border-zinc-700 transition-all text-center group"
              >
                <Icon className="h-5 w-5 text-zinc-500 group-hover:text-zinc-300 mb-2 transition-colors" />
                <span className="text-2xl font-bold text-white">{mod.count}</span>
                <span className="text-xs text-zinc-500 mt-1">{mod.label}</span>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Leads */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white">Recent Leads</h2>
            <Link href="/admin/lead-tracker" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">View all →</Link>
          </div>
          {recentLeads.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-8 w-8 text-zinc-700 mx-auto mb-2" />
              <p className="text-sm text-zinc-500">No leads yet. They'll appear here when visitors submit the contact form.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentLeads.map((lead: any) => (
                <div key={lead.id} className="flex items-center justify-between p-3 bg-zinc-900/50 border border-zinc-800/50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                      <span className="text-xs font-bold text-green-400">{lead.name?.[0]?.toUpperCase() || '?'}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{lead.name || 'Unknown'}</p>
                      <p className="text-xs text-zinc-500">{lead.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-zinc-500 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(lead.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Blog Posts */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white">Recent Blog Posts</h2>
            <Link href="/admin/blog" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">View all →</Link>
          </div>
          {recentBlogs.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-8 w-8 text-zinc-700 mx-auto mb-2" />
              <p className="text-sm text-zinc-500">No blog posts yet. Create your first post to start sharing insights.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentBlogs.map((post: any) => (
                <Link
                  key={post.id}
                  href={`/admin/blog/${post.id}`}
                  className="flex items-center justify-between p-3 bg-zinc-900/50 border border-zinc-800/50 rounded-xl hover:border-zinc-700 transition-all group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${post.status === 'published' ? 'bg-green-400' : 'bg-amber-400'}`} />
                    <p className="text-sm font-medium text-white truncate group-hover:text-blue-400 transition-colors">{post.title}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      post.status === 'published'
                        ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {post.status}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
