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
  AlertCircle,
  Search,
  Scale
} from 'lucide-react'
import { revalidatePath } from 'next/cache'

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

  // Fetch tenant data
  const { data: tenant, error: tenantError } = await supabase
    .from('saas_tenants')
    .select('*')
    .eq('subdomain', resolvedParams.subdomain)
    .maybeSingle()

  if (tenantError || !tenant) {
    notFound()
  }

  // Fetch tenant services
  const { data: services } = await supabase
    .from('saas_services')
    .select('*')
    .eq('tenant_id', tenant.id)
    .order('display_order', { ascending: true })

  const companyName = tenant.company_name
  const title = tenant.title
  const bio = (tenant.bio || []) as string[]
  const skills = (tenant.skills || []) as string[]
  const ctaText = tenant.cta_text || 'Fale Conosco'
  const consultationLink = tenant.consultation_link || '#'

  // Resolve Theme Details
  const theme = getTemplateById(tenant.template_id || 'legal_practice_advmarc')

  // Resolve Layout Order
  const layout = (tenant.layout_structure || ['hero', 'services', 'about']) as string[]
  const visible = (tenant.visible_sections || ['hero', 'services', 'about']) as string[]

  // ==========================================
  // LAYOUT 1: GRUPO ADVMARC (LAW FIRM)
  // ==========================================
  const renderAdvmarcSection = (sectionId: string) => {
    if (!visible.includes(sectionId)) return null

    switch (sectionId) {
      case 'hero':
        return (
          <header key="hero" className="max-w-5xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-12 gap-12 items-center relative z-10">
            <div className="md:col-span-7 space-y-6">
              <span className="inline-block text-[#c5a880] font-bold text-xs uppercase tracking-widest border-b border-[#c5a880]/30 pb-1">
                Grupo ADVMARC
              </span>
              <h1 className="text-4xl sm:text-5xl font-serif font-extrabold text-white leading-tight">
                Advocacia e Soluções:<br />
                <span className="text-[#c5a880]">Seu Advogado</span>
              </h1>
              <p className="text-stone-400 text-sm leading-relaxed max-w-lg">
                {bio[0] || 'No ADVMARC, suas necessidades legais são o centro de tudo o que fazemos. Com uma equipe experiente e dedicada, oferecemos soluções completas.'}
              </p>
              <div>
                <a
                  href={consultationLink}
                  className="inline-block px-6 py-3 bg-[#c5a880] text-black font-bold text-xs rounded hover:bg-[#b09670] transition-all shadow-lg shadow-[#c5a880]/10"
                >
                  FALE CONOSCO
                </a>
              </div>
            </div>
            {/* Elegant Scales & Lady of Justice silhouette mockup */}
            <div className="md:col-span-5 flex justify-center select-none pointer-events-none opacity-80">
              <div className="relative w-72 h-80 border border-stone-850 rounded-t-full bg-gradient-to-b from-[#c5a880]/10 to-transparent p-6 flex flex-col items-center justify-center">
                <Scale className="w-28 h-28 text-[#c5a880] mb-4 animate-pulse" />
                <span className="text-[10px] text-[#c5a880] font-bold tracking-widest uppercase">Justitia</span>
              </div>
            </div>
          </header>
        )
      case 'services':
        return (
          <section key="services" className="max-w-5xl mx-auto px-6 py-20 border-t border-stone-850 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center mb-16">
              <div className="md:col-span-5 flex justify-center">
                <Scale className="w-48 h-48 text-[#c5a880]/40" />
              </div>
              <div className="md:col-span-7 space-y-4">
                <span className="text-xs text-stone-500 font-bold uppercase tracking-widest block">24/7 Atendimento</span>
                <h2 className="text-3xl font-serif font-extrabold text-white leading-tight">
                  Nossa ampla <span className="text-[#c5a880]">experiência jurídica</span>
                </h2>
                <p className="text-stone-400 text-sm leading-relaxed">
                  {bio[1] || 'Com quase três décadas de atuação no mercado, nossa ampla experiência nos posiciona para entregar excelência.'}
                </p>
              </div>
            </div>

            {/* Circular Statistics bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center py-8 border-t border-b border-stone-850 mb-16">
              <div className="space-y-1">
                <span className="text-3xl font-extrabold text-[#c5a880] block font-serif">+200</span>
                <span className="text-[10px] text-stone-500 font-bold uppercase tracking-wider block">Casos por ano</span>
              </div>
              <div className="space-y-1 border-t sm:border-t-0 sm:border-l sm:border-r border-stone-850 py-4 sm:py-0">
                <span className="text-3xl font-extrabold text-[#c5a880] block font-serif">65%</span>
                <span className="text-[10px] text-stone-500 font-bold uppercase tracking-wider block">Veredictos favoráveis</span>
              </div>
              <div className="space-y-1">
                <span className="text-3xl font-extrabold text-[#c5a880] block font-serif">90%</span>
                <span className="text-[10px] text-stone-500 font-bold uppercase tracking-wider block">Satisfação do cliente</span>
              </div>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {services?.map(s => (
                <div key={s.id} className="bg-[#1c1c1c] border border-stone-850 p-6 rounded-xl space-y-4 shadow-md">
                  <h3 className="font-serif font-bold text-base text-white border-b border-[#c5a880]/20 pb-2">{s.title}</h3>
                  <p className="text-xs text-stone-400 leading-relaxed">{s.description}</p>
                </div>
              ))}
            </div>
          </section>
        )
      case 'about':
        return (
          <section key="about" className="max-w-5xl mx-auto px-6 py-20 border-t border-stone-850 relative z-10">
            <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
              <h2 className="text-3xl font-serif font-bold text-white">Nossos <span className="text-[#c5a880]">advogados</span></h2>
              <p className="text-xs text-stone-500">Contamos com uma equipe altamente qualificada nas mais diversas áreas do direito.</p>
            </div>
            
            {/* Lawyers profile cards mock list */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { name: 'Marcos Polirsa', role: 'Direito Imobiliário' },
                { name: 'Andria Koli', role: 'Direito Civil' },
                { name: 'Cesar Octagon', role: 'Direito Tributário' },
                { name: 'Marcia Oliveira', role: 'Direito da Família' },
                { name: 'Roberto Silva', role: 'Direito Trabalhista' }
              ].map((lawyer, idx) => (
                <div key={idx} className="bg-[#1c1c1c] border border-stone-850 rounded-xl overflow-hidden shadow text-center flex flex-col justify-between">
                  <div className="h-32 bg-stone-900 flex items-center justify-center border-b border-stone-850 text-stone-500 font-bold text-sm">
                    {lawyer.name.charAt(0)}
                  </div>
                  <div className="p-3">
                    <h4 className="font-bold text-xs text-white truncate">{lawyer.name}</h4>
                    <p className="text-[10px] text-[#c5a880] mt-1 truncate">{lawyer.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )
      default:
        return null
    }
  }

  // ==========================================
  // LAYOUT 2: CONSULT (BUSINESS CONSULTING)
  // ==========================================
  const renderConsultSection = (sectionId: string) => {
    if (!visible.includes(sectionId)) return null

    switch (sectionId) {
      case 'hero':
        return (
          <header key="hero" className="max-w-5xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
            <div className="space-y-6">
              <span className="inline-block text-[#0f4c81] font-bold text-xs uppercase tracking-wider border-l-2 border-[#f26522] pl-2">
                Business Advisory Partners
              </span>
              <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-800 leading-tight">
                We Are Business Consultants <span className="text-[#0f4c81]">Dedicated To Driving Your Success</span>
              </h1>
              <p className="text-slate-500 text-sm leading-relaxed">
                {bio[0]}
              </p>
              <div>
                <a href={consultationLink} className="inline-block px-6 py-3 bg-[#0f4c81] text-white hover:bg-[#0c3c66] font-bold text-xs rounded transition-colors shadow">
                  SCHEDULE CONSULTATION
                </a>
              </div>
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-2xl h-60 flex items-center justify-center text-slate-400 text-xs font-bold uppercase relative overflow-hidden select-none pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 to-transparent" />
              <span>Consulting Panel Mock</span>
            </div>
          </header>
        )
      case 'services':
        return (
          <section key="services" className="max-w-5xl mx-auto px-6 py-16 border-t border-slate-100 relative z-10">
            <div className="text-center max-w-xl mx-auto mb-12">
              <span className="text-xs font-bold text-[#f26522] uppercase tracking-wider block mb-2">OUR SERVICES</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800">Discover The Core Principles That Guide Us</h2>
            </div>
            
            {/* Services Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              {services?.map(s => (
                <div key={s.id} className="bg-white border border-slate-100 p-6 rounded-2xl shadow-lg shadow-slate-200/50 hover:shadow-[#0f4c81]/10 transition-all space-y-4">
                  <div className="p-3 bg-blue-50 text-[#0f4c81] rounded-xl inline-block">
                    <Cpu className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-base text-slate-800">{s.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{s.description}</p>
                </div>
              ))}
            </div>

            {/* Statistics Banner */}
            <div className="bg-[#0f4c81] text-white p-8 rounded-2xl grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <span className="text-3xl font-extrabold text-[#f26522] block">680+</span>
                <span className="text-[10px] text-slate-300 font-bold uppercase mt-1 block">Businesses Trust Us</span>
              </div>
              <div>
                <span className="text-3xl font-extrabold text-[#f26522] block">1,354+</span>
                <span className="text-[10px] text-slate-300 font-bold uppercase mt-1 block">Projects Done</span>
              </div>
              <div>
                <span className="text-3xl font-extrabold text-[#f26522] block">97%</span>
                <span className="text-[10px] text-slate-300 font-bold uppercase mt-1 block">Success Rate</span>
              </div>
              <div>
                <span className="text-3xl font-extrabold text-[#f26522] block">15Y+</span>
                <span className="text-[10px] text-slate-300 font-bold uppercase mt-1 block">Years Experience</span>
              </div>
            </div>
          </section>
        )
      case 'about':
        return (
          <section key="about" className="max-w-3xl mx-auto px-6 py-16 text-center border-t border-slate-100 space-y-6">
            <h2 className="text-2xl font-extrabold text-slate-800">Ready to discuss your business goals?</h2>
            <p className="text-xs text-slate-500 max-w-md mx-auto">{bio[1]}</p>
            <a href={consultationLink} className="inline-block px-6 py-3 bg-[#f26522] text-white hover:bg-orange-600 font-bold text-xs rounded transition-colors shadow">
              GET A QUOTE
            </a>
          </section>
        )
      default:
        return null
    }
  }

  // ==========================================
  // LAYOUT 3: DYCRW (LUXURY REAL ESTATE)
  // ==========================================
  const renderDycrwSection = (sectionId: string) => {
    if (!visible.includes(sectionId)) return null

    switch (sectionId) {
      case 'hero':
        return (
          <header key="hero" className="max-w-5xl mx-auto px-6 py-20 relative z-10 space-y-12">
            <div className="space-y-4 max-w-2xl">
              <span className="inline-block text-[#d4af37] font-bold text-xs uppercase tracking-widest">
                Exclusive Luxury Estates
              </span>
              <h1 className="text-4xl sm:text-6xl font-extrabold text-white leading-tight">
                {title}
              </h1>
              <p className="text-zinc-500 text-sm leading-relaxed">
                {bio[0]}
              </p>
            </div>

            {/* Dynamic Search bar mockup */}
            <div className="bg-[#121212] border border-zinc-850 p-4 rounded-xl grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
              <div className="p-2 border-r border-zinc-850 last:border-0">
                <span className="text-[9px] uppercase font-bold text-zinc-500 block">Location</span>
                <span className="text-xs text-white block mt-1 font-semibold">Luxury Suburbs</span>
              </div>
              <div className="p-2 border-r border-zinc-850 last:border-0">
                <span className="text-[9px] uppercase font-bold text-zinc-500 block">Property Type</span>
                <span className="text-xs text-white block mt-1 font-semibold">Private Villa</span>
              </div>
              <div className="p-2 border-r border-zinc-850 last:border-0">
                <span className="text-[9px] uppercase font-bold text-zinc-500 block">Budget</span>
                <span className="text-xs text-[#d4af37] block mt-1 font-semibold">$2,500,000+</span>
              </div>
              <a href={consultationLink} className="w-full py-3 bg-[#d4af37] hover:bg-[#c19e2e] text-black text-center font-bold text-xs rounded uppercase tracking-wider block">
                SEARCH
              </a>
            </div>
          </header>
        )
      case 'services':
        return (
          <section key="services" className="max-w-5xl mx-auto px-6 py-16 border-t border-zinc-850 relative z-10">
            <div className="text-center max-w-xl mx-auto mb-12">
              <h2 className="text-2xl font-extrabold text-white">Search Premium Near You</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {services?.map(s => (
                <div key={s.id} className="bg-[#121212] border border-zinc-850 p-5 rounded-xl flex flex-col justify-between">
                  <div className="h-36 bg-zinc-900 rounded-lg mb-4 flex items-center justify-center text-zinc-600 text-xs uppercase font-bold">
                    Property Preview
                  </div>
                  <h3 className="font-bold text-sm text-white mb-2">{s.title}</h3>
                  <p className="text-xs text-zinc-500 leading-relaxed mb-4">{s.description}</p>
                </div>
              ))}
            </div>
          </section>
        )
      default:
        return null
    }
  }

  // ==========================================
  // LAYOUT 4: RENT H&U (RENTAL PORTAL)
  // ==========================================
  const renderRenthulSection = (sectionId: string) => {
    if (!visible.includes(sectionId)) return null

    switch (sectionId) {
      case 'hero':
        return (
          <header key="hero" className="max-w-5xl mx-auto px-6 py-20 relative z-10 space-y-8">
            <div className="space-y-4 max-w-xl">
              <span className="inline-block text-[#0f2c59] font-bold text-xs uppercase tracking-wider">
                Rent H&amp;U Rentals
              </span>
              <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0f2c59] leading-tight">
                {title}
              </h1>
              <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                {bio[0]}
              </p>
            </div>

            {/* Rent search bar */}
            <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-md grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
              <div className="p-2 border-r border-slate-100 last:border-0">
                <span className="text-[9px] uppercase font-bold text-slate-400 block">City Street</span>
                <span className="text-xs text-[#0f2c59] block mt-1 font-semibold">123 Street, New York</span>
              </div>
              <div className="p-2 border-r border-slate-100 last:border-0">
                <span className="text-[9px] uppercase font-bold text-slate-400 block">Typology</span>
                <span className="text-xs text-[#0f2c59] block mt-1 font-semibold">Luxury Apartment</span>
              </div>
              <div className="p-2 border-r border-slate-100 last:border-0">
                <span className="text-[9px] uppercase font-bold text-slate-400 block">Budget</span>
                <span className="text-xs text-[#0f2c59] block mt-1 font-semibold">€ 2.500 / month</span>
              </div>
              <a href={consultationLink} className="w-full py-3 bg-[#0f2c59] hover:bg-slate-800 text-white text-center font-bold text-xs rounded uppercase tracking-wider block">
                SEARCH
              </a>
            </div>
          </header>
        )
      case 'services':
        return (
          <section key="services" className="max-w-5xl mx-auto px-6 py-16 border-t border-slate-200 relative z-10">
            <div className="text-center max-w-xl mx-auto mb-12">
              <h2 className="text-2xl font-extrabold text-[#0f2c59]">Most Viewed Properties</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {services?.map(s => (
                <div key={s.id} className="bg-white border border-slate-100 rounded-xl overflow-hidden shadow-sm flex flex-col justify-between">
                  <div className="h-40 bg-slate-100 flex items-center justify-center text-slate-400 text-xs font-semibold">
                    Listing Photos
                  </div>
                  <div className="p-5 space-y-2">
                    <h3 className="font-bold text-sm text-[#0f2c59]">{s.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">{s.description}</p>
                  </div>
                  <div className="p-5 pt-0 border-t border-slate-50 flex items-center justify-between">
                    <span className="text-[#0f2c59] font-bold text-xs">Verified</span>
                    <a href={consultationLink} className="text-xs font-bold text-[#0f2c59] hover:underline">View Details</a>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )
      default:
        return null
    }
  }

  // ==========================================
  // LAYOUT 5: TEAL & SALMON REAL ESTATE
  // ==========================================
  const renderEstateTealSection = (sectionId: string) => {
    if (!visible.includes(sectionId)) return null

    switch (sectionId) {
      case 'hero':
        return (
          <header key="hero" className="max-w-5xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl font-extrabold text-[#004d40] leading-tight">
                {title}
              </h1>
              <p className="text-teal-850 text-sm leading-relaxed">
                {bio[0]}
              </p>
              <div>
                <a href={consultationLink} className="inline-block px-6 py-3 bg-[#ff7f50] text-white hover:bg-[#e06d40] font-bold text-xs rounded transition-colors shadow">
                  GET STARTED
                </a>
              </div>
            </div>
            <div className="bg-teal-100 border border-teal-200 rounded-2xl h-56 flex items-center justify-center text-teal-650 text-xs font-bold uppercase relative overflow-hidden select-none pointer-events-none">
              <span>Modern Complex Mock</span>
            </div>
          </header>
        )
      case 'services':
        return (
          <section key="services" className="max-w-5xl mx-auto px-6 py-16 border-t border-teal-200 relative z-10">
            <div className="text-center max-w-xl mx-auto mb-12">
              <h2 className="text-2xl font-bold text-[#004d40]">Featured Listings</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {services?.map(s => (
                <div key={s.id} className="bg-white border border-teal-100 p-5 rounded-xl shadow-sm">
                  <h3 className="font-bold text-sm text-[#004d40] mb-2">{s.title}</h3>
                  <p className="text-xs text-teal-800 leading-relaxed">{s.description}</p>
                </div>
              ))}
            </div>
          </section>
        )
      default:
        return null
    }
  }

  // ==========================================
  // RENDER DYNAMIC PUBLIC LAYOUT ROUTER
  // ==========================================
  return (
    <div className={`min-h-screen flex flex-col selection:bg-blue-600/30 overflow-x-hidden relative ${theme.bg} ${theme.font}`}>
      
      {/* Background glow animations */}
      {theme.layoutType === 'advmarc' && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] opacity-25 pointer-events-none z-0">
          <div className="absolute inset-0 bg-gradient-to-b via-transparent blur-3xl rounded-full from-[#c5a880]/15 to-transparent" />
        </div>
      )}

      {/* Dynamic Header / Navbar */}
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

      {/* Main Content Router */}
      <main className="flex-grow">
        {theme.layoutType === 'advmarc' ? (
          <div className="w-full">
            {layout.map((sectionId) => renderAdvmarcSection(sectionId))}
          </div>
        ) : theme.layoutType === 'consult' ? (
          <div className="w-full">
            {layout.map((sectionId) => renderConsultSection(sectionId))}
          </div>
        ) : theme.layoutType === 'dycrw' ? (
          <div className="w-full">
            {layout.map((sectionId) => renderDycrwSection(sectionId))}
          </div>
        ) : theme.layoutType === 'renthu' ? (
          <div className="w-full">
            {layout.map((sectionId) => renderRenthulSection(sectionId))}
          </div>
        ) : theme.layoutType === 'estate_teal' ? (
          <div className="w-full">
            {layout.map((sectionId) => renderEstateTealSection(sectionId))}
          </div>
        ) : (
          <div className="w-full">
            {layout.map((sectionId) => renderAdvmarcSection(sectionId))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className={`mt-auto border-t py-8 text-center text-xs relative z-10 ${theme.isDark ? 'border-white/5 text-zinc-500' : 'border-zinc-200 text-zinc-650'}`}>
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
