import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Phone, CheckCircle, Mail, Calendar, ArrowRight, Github, Linkedin, Twitter, Globe, Cpu, Bot, Sparkles, AlertCircle } from 'lucide-react'

interface PageProps {
  params: Promise<{ subdomain: string }>
}

const iconMap: Record<string, any> = {
  Phone,
  Bot,
  Cpu,
  Sparkles
}

export async function generateMetadata({ params }: PageProps) {
  const resolvedParams = await params
  const supabase = await createClient()

  const { data: tenant } = await supabase
    .from('saas_tenants')
    .select('company_name, title')
    .eq('subdomain', resolvedParams.subdomain)
    .maybeSingle()

  if (!tenant) return { title: 'Site Not Found' }

  return {
    title: `${tenant.company_name} | ${tenant.title}`,
    description: `Contact and services showcase for ${tenant.company_name} built using voice automation technologies.`,
  }
}

export default async function SaasTenantPage({ params }: PageProps) {
  const resolvedParams = await params
  const supabase = await createClient()

  // 1. Fetch tenant data
  const { data: tenant, error: tenantError } = await supabase
    .from('saas_tenants')
    .select('*')
    .eq('subdomain', resolvedParams.subdomain)
    .maybeSingle()

  if (tenantError || !tenant) {
    notFound()
  }

  // 2. Fetch tenant services
  const { data: services } = await supabase
    .from('saas_services')
    .select('*')
    .eq('tenant_id', tenant.id)
    .order('display_order', { ascending: true })

  const companyName = tenant.company_name
  const title = tenant.title
  const bio = tenant.bio || []
  const skills = tenant.skills || []
  const ctaText = tenant.cta_text || 'Book Consultation'
  const consultationLink = tenant.consultation_link || '#'

  return (
    <div className="bg-black text-white min-h-screen flex flex-col font-sans selection:bg-blue-600/30 overflow-hidden">
      
      {/* Background glow animations */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] opacity-25 pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600/20 via-indigo-600/10 to-transparent blur-3xl rounded-full" />
      </div>

      {/* Header / Navbar */}
      <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-black/80 backdrop-blur-md relative z-10">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between max-w-5xl">
          <Link href={`/sites/${resolvedParams.subdomain}`} className="text-lg font-bold tracking-tight text-white hover:opacity-90 transition-opacity">
            {companyName}
          </Link>
          <a
            href={consultationLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition-colors"
          >
            {ctaText}
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative z-10 pt-20 pb-24 text-center max-w-3xl mx-auto px-6">
        <span className="inline-flex items-center rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400 ring-1 ring-inset ring-blue-500/20 mb-6">
          <span className="relative flex h-2 w-2 mr-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          Next-Gen AI &amp; Voice Automation Specialist
        </span>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight mb-6">
          {title}
        </h1>

        <p className="text-zinc-400 text-lg sm:text-xl max-w-xl mx-auto mb-8 leading-relaxed">
          {bio[0] || 'Designing intelligent voice agents that qualify leads, automate scheduling, and scale outbound calling operations.'}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={consultationLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-black font-bold text-sm rounded-lg hover:bg-zinc-200 transition-colors"
          >
            <span>{ctaText}</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </header>

      {/* Services Grid */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 py-20 border-t border-white/5 w-full">
        <div className="text-center max-w-xl mx-auto mb-16">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white">Solutions &amp; Capabilities</h2>
          <p className="text-zinc-400 text-sm mt-3">Tailored conversational AI agents built to reduce churn, lower overheads, and streamline operations.</p>
        </div>

        {(!services || services.length === 0) ? (
          <div className="p-8 border border-dashed border-zinc-800 bg-zinc-900/10 rounded-2xl text-center text-zinc-500">
            <AlertCircle className="w-8 h-8 mx-auto text-zinc-700 mb-2" />
            <p className="text-sm">No services listed yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map(s => {
              const ServiceIcon = iconMap[s.icon || 'Phone'] || Phone
              return (
                <div key={s.id} className="p-6 rounded-2xl border border-zinc-900 bg-zinc-950/40 backdrop-blur-sm flex items-start gap-4">
                  <div className="p-3 bg-blue-600/10 text-blue-500 rounded-xl">
                    <ServiceIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg">{s.title}</h3>
                    <p className="text-sm text-zinc-400 mt-2 leading-relaxed">{s.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* About & Skills Section */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 py-20 border-t border-white/5 w-full">
        <div className="flex flex-col md:flex-row gap-12 items-start">
          <div className="w-full md:w-1/2 space-y-6">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">About the Engineer</h2>
            {(bio as string[]).slice(1).map((para: string, i: number) => (
              <p key={i} className="text-zinc-400 text-base leading-relaxed">{para}</p>
            ))}
          </div>

          <div className="w-full md:w-1/2">
            <div className="p-6 rounded-2xl border border-zinc-900 bg-zinc-900/20">
              <h3 className="font-bold text-white mb-4">Core Technology Focus</h3>
              <ul className="space-y-3">
                {(skills as string[]).map((skill: string, index: number) => (
                  <li key={index} className="flex items-center text-zinc-300 text-sm">
                    <CheckCircle className="w-4 h-4 text-blue-500 mr-3 flex-shrink-0" />
                    <span>{skill}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Consultation Section */}
      <section className="relative z-10 max-w-3xl mx-auto px-6 py-24 text-center border-t border-white/5 w-full">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">Ready to automate your operations?</h2>
        <p className="text-zinc-400 text-sm max-w-lg mx-auto mb-8">Schedule an integration assessment call to discuss your CRM triggers, voice models, and call volumes.</p>
        <a
          href={consultationLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-lg transition-colors shadow"
        >
          <Calendar className="w-4 h-4" />
          <span>{ctaText}</span>
        </a>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-white/5 py-8 text-center text-zinc-500 text-xs relative z-10">
        <div className="container mx-auto px-6 flex flex-col sm:flex-row items-center justify-between max-w-5xl gap-4">
          <p>{tenant.footer_text || `© ${new Date().getFullYear()} ${companyName}. All rights reserved.`}</p>
          <div className="flex gap-4">
            {tenant.linkedin_url && (
              <a href={tenant.linkedin_url} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            )}
            {tenant.github_url && (
              <a href={tenant.github_url} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                <Github className="w-4 h-4" />
              </a>
            )}
            {tenant.twitter_url && (
              <a href={tenant.twitter_url} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </footer>

    </div>
  )
}
