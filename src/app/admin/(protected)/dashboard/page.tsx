import { createClient } from '@/lib/supabase/server'
import { DashboardClient } from './DashboardClient'
import type { DashboardRecentBlog, DashboardRecentLead } from '@/lib/types'

export const dynamic = 'force-dynamic'

function getRecentCutoffIso(days: number): string {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const sevenDaysAgo = getRecentCutoffIso(7)

  const [
    portfolioRes,
    leadsRes,
    recentLeadCountRes,
    blogRes,
    useCasesRes,
    servicesRes,
    testimonialsRes,
    techStackRes,
    processStepsRes,
    playgroundRes,
    seoRes,
    recentLeadsRes,
    recentBlogRes,
  ] = await Promise.all([
    supabase.from('portfolio_projects').select('*', { count: 'exact', head: true }),
    supabase.from('leads').select('*', { count: 'exact', head: true }),
    supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', sevenDaysAgo),
    supabase
      .from('blog_posts')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'published'),
    supabase.from('use_cases').select('*', { count: 'exact', head: true }),
    supabase.from('services').select('*', { count: 'exact', head: true }),
    supabase.from('testimonials').select('*', { count: 'exact', head: true }),
    supabase.from('tech_stack').select('*', { count: 'exact', head: true }),
    supabase.from('process_steps').select('*', { count: 'exact', head: true }),
    supabase.from('playground_apps').select('*', { count: 'exact', head: true }),
    supabase.from('seo_settings').select('*', { count: 'exact', head: true }),
    supabase
      .from('leads')
      .select('id, name, email, company, created_at')
      .order('created_at', { ascending: false })
      .limit(5),
    supabase
      .from('blog_posts')
      .select('id, title, status, created_at, slug')
      .order('created_at', { ascending: false })
      .limit(5),
  ])

  const queryErrors: Array<{ source: string; err: { message?: string } | null }> = [
    { source: 'Portfolio', err: portfolioRes.error },
    { source: 'Leads', err: leadsRes.error },
    { source: 'Blog Posts', err: blogRes.error },
    { source: 'Use Cases', err: useCasesRes.error },
    { source: 'Services', err: servicesRes.error },
    { source: 'Testimonials', err: testimonialsRes.error },
    { source: 'Tech Stack', err: techStackRes.error },
    { source: 'Process Steps', err: processStepsRes.error },
    { source: 'Playground', err: playgroundRes.error },
    { source: 'SEO', err: seoRes.error },
  ]

  const errors = queryErrors
    .filter((item) => Boolean(item.err?.message))
    .map((item) => `${item.source}: ${item.err?.message}`)

  return (
    <DashboardClient
      stats={{
        portfolioCount: portfolioRes.count || 0,
        totalLeadsCount: leadsRes.count || 0,
        recentLeadCount: recentLeadCountRes.count || 0,
        publishedBlogsCount: blogRes.count || 0,
      }}
      moduleCounts={{
        useCases: useCasesRes.count || 0,
        services: servicesRes.count || 0,
        testimonials: testimonialsRes.count || 0,
        techStack: techStackRes.count || 0,
        processSteps: processStepsRes.count || 0,
        playground: playgroundRes.count || 0,
        seo: seoRes.count || 0,
      }}
      recentLeads={(recentLeadsRes.data || []) as DashboardRecentLead[]}
      recentBlogs={(recentBlogRes.data || []) as DashboardRecentBlog[]}
      errors={errors}
    />
  )
}
