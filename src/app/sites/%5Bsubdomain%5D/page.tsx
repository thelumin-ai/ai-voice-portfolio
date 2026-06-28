import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getTemplateById } from '@/lib/templates'
import { 
  Phone, 
  CheckCircle, 
  Mail, 
  Calendar, 
  ArrowRight, 
  Github, 
  Linkedin, 
  Twitter, 
  Globe, 
  Cpu, 
  Bot, 
  Sparkles, 
  AlertCircle 
} from 'lucide-react'

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
    description: `Contact and services showcase for ${tenant.company_name} built using next-gen automation solutions.`,
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
  const bio = (tenant.bio || []) as string[]
  const skills = (tenant.skills || []) as string[]
  const ctaText = tenant.cta_text || 'Book Consultation'
  const consultationLink = tenant.consultation_link || '#'

  // 3. Resolve Theme Details
  const theme = getTemplateById(tenant.template_id || 'agency_automation_cyber')

  // 4. Resolve Layout Order
  const layout = (tenant.layout_structure || ['hero', 'services', 'about', 'consultation']) as string[]
  const visible = (tenant.visible_sections || ['hero', 'services', 'about', 'consultation']) as string[]

  // Rendering Helper
  const renderSection = (sectionId: string) => {
    if (!visible.includes(sectionId)) return null

    switch (sectionId) {
      case 'hero':
        return (
          <header key="hero" className="relative z-10 pt-24 pb-28 text-center max-w-3xl mx-auto px-6">
            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset mb-6 ${theme.accentBg} ${theme.accent} ${theme.accentBorder}`}>
              <span className="relative flex h-2 w-2 mr-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${theme.btn.split(' ')[0]}`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${theme.btn.split(' ')[0]}`}></span>
              </span>
              Next-Gen Automation Specialist
            </span>

            <h1 className={`text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight mb-6 ${theme.isDark ? 'text-white' : 'text-zinc-900'}`}>
              {title}
            </h1>

            <p className={`text-base sm:text-lg max-w-xl mx-auto mb-8 leading-relaxed ${theme.text}`}>
              {bio[0] || 'Designing intelligent automated systems and workflow pipelines.'}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={consultationLink}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 font-bold text-sm rounded-lg transition-colors ${theme.btn}`}
              >
                <span>{ctaText}</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </header>
        )
      case 'services':
        return (
          <section key="services" className={`relative z-10 max-w-5xl mx-auto px-6 py-20 border-t w-full ${theme.accentBorder.replace('border-', 'border-t-')}`}>
            <div className="text-center max-w-xl mx-auto mb-16">
              <h2 className={`text-2xl sm:text-4xl font-extrabold ${theme.isDark ? 'text-white' : 'text-zinc-900'}`}>Solutions &amp; Capabilities</h2>
              <p className={`text-sm mt-3 ${theme.text}`}>Tailored solutions built to reduce overheads, handle workflows, and streamline operations.</p>
            </div>

            {(!services || services.length === 0) ? (
              <div className={`p-8 border border-dashed rounded-2xl text-center text-zinc-500 bg-zinc-900/5 ${theme.accentBorder}`}>
                <AlertCircle className="w-8 h-8 mx-auto text-zinc-400 mb-2" />
                <p className="text-sm">No services listed yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {services.map(s => {
                  const ServiceIcon = iconMap[s.icon || 'Phone'] || Phone
                  return (
                    <div key={s.id} className={`p-6 rounded-2xl border backdrop-blur-sm flex items-start gap-4 ${theme.cardBg}`}>
                      <div className={`p-3 rounded-xl ${theme.accentBg} ${theme.accent}`}>
                        <ServiceIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className={`font-bold text-lg ${theme.isDark ? 'text-white' : 'text-zinc-900'}`}>{s.title}</h3>
                        <p className={`text-sm mt-2 leading-relaxed ${theme.text}`}>{s.description}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </section>
        )
      case 'about':
        return (
          <section key="about" className={`relative z-10 max-w-5xl mx-auto px-6 py-20 border-t w-full ${theme.accentBorder.replace('border-', 'border-t-')}`}>
            <div className="flex flex-col md:flex-row gap-12 items-start">
              <div className="w-full md:w-1/2 space-y-6">
                <h2 className={`text-2xl sm:text-4xl font-extrabold ${theme.isDark ? 'text-white' : 'text-zinc-900'}`}>About Us</h2>
                {bio.slice(1).map((para: string, i: number) => (
                  <p key={i} className={`text-base leading-relaxed ${theme.text}`}>{para}</p>
                ))}
              </div>

              <div className="w-full md:w-1/2">
                <div className={`p-6 rounded-2xl border ${theme.cardBg}`}>
                  <h3 className={`font-bold mb-4 ${theme.isDark ? 'text-white' : 'text-zinc-900'}`}>Core Specializations</h3>
                  <ul className="space-y-3">
                    {skills.map((skill: string, index: number) => (
                      <li key={index} className={`flex items-center text-sm ${theme.isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
                        <CheckCircle className={`w-4 h-4 mr-3 flex-shrink-0 ${theme.accent}`} />
                        <span>{skill}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>
        )
      case 'consultation':
        return (
          <section key="consultation" className={`relative z-10 max-w-3xl mx-auto px-6 py-24 text-center border-t w-full ${theme.accentBorder.replace('border-', 'border-t-')}`}>
            <h2 className={`text-3xl sm:text-4xl font-extrabold mb-4 ${theme.isDark ? 'text-white' : 'text-zinc-900'}`}>Ready to automate your operations?</h2>
            <p className={`text-sm max-w-lg mx-auto mb-8 ${theme.text}`}>Schedule an integration assessment call to discuss your triggers, workflows, and goals.</p>
            <a
              href={consultationLink}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 px-8 py-3.5 font-bold text-sm rounded-lg transition-colors shadow ${theme.btn}`}
            >
              <Calendar className="w-4 h-4" />
              <span>{ctaText}</span>
            </a>
          </section>
        )
      default:
        return null
    }
  }

  return (
    <div className={`min-h-screen flex flex-col selection:bg-blue-600/30 overflow-hidden relative ${theme.bg} ${theme.font}`}>
      
      {/* Background glow animations */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] opacity-25 pointer-events-none z-0">
        <div className={`absolute inset-0 bg-gradient-to-b via-transparent blur-3xl rounded-full ${theme.glow}`} />
      </div>

      {/* Header / Navbar */}
      <nav className={`sticky top-0 z-50 w-full border-b backdrop-blur-md relative z-10 ${theme.isDark ? 'bg-black/80 border-white/5' : 'bg-white/80 border-black/5'}`}>
        <div className="container mx-auto px-6 h-16 flex items-center justify-between max-w-5xl">
          <Link href={`/sites/${resolvedParams.subdomain}`} className={`text-lg font-bold tracking-tight hover:opacity-90 transition-opacity ${theme.isDark ? 'text-white' : 'text-zinc-900'}`}>
            {companyName}
          </Link>
          <a
            href={consultationLink}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center justify-center rounded-lg px-4 py-2 text-xs font-semibold transition-colors ${theme.btn}`}
          >
            {ctaText}
          </a>
        </div>
      </nav>

      {/* Dynamic Content Sections */}
      <main className="flex-grow">
        {layout.map((sectionId) => renderSection(sectionId))}
      </main>

      {/* Footer */}
      <footer className={`mt-auto border-t py-8 text-center text-xs relative z-10 ${theme.isDark ? 'border-white/5 text-zinc-500' : 'border-zinc-200 text-zinc-600'}`}>
        <div className="container mx-auto px-6 flex flex-col sm:flex-row items-center justify-between max-w-5xl gap-4">
          <p>{tenant.footer_text || `© ${new Date().getFullYear()} ${companyName}. All rights reserved.`}</p>
          <div className="flex gap-4">
            {tenant.linkedin_url && (
              <a href={tenant.linkedin_url} target="_blank" rel="noopener noreferrer" className={`transition-colors ${theme.isDark ? 'hover:text-white' : 'hover:text-black'}`}>
                <Linkedin className="w-4 h-4" />
              </a>
            )}
            {tenant.github_url && (
              <a href={tenant.github_url} target="_blank" rel="noopener noreferrer" className={`transition-colors ${theme.isDark ? 'hover:text-white' : 'hover:text-black'}`}>
                <Github className="w-4 h-4" />
              </a>
            )}
            {tenant.twitter_url && (
              <a href={tenant.twitter_url} target="_blank" rel="noopener noreferrer" className={`transition-colors ${theme.isDark ? 'hover:text-white' : 'hover:text-black'}`}>
                <Twitter className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </footer>

    </div>
  )
}
