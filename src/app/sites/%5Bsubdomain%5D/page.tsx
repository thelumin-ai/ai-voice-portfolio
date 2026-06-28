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

// Inline Moving Lead submission handler action
async function submitMovingLead(formData: FormData) {
  'use server'
  const tenantId = formData.get('tenant_id') as string
  const name = formData.get('name') as string
  const phone = formData.get('phone') as string
  const fromCity = formData.get('fromCity') as string
  const toCity = formData.get('toCity') as string
  const date = formData.get('date') as string
  const propType = formData.get('propType') as string

  const supabase = await createClient()
  await supabase
    .from('saas_leads')
    .insert({
      tenant_id: tenantId,
      name,
      phone,
      email: 'not-provided@moving.com',
      message: `Moving Request: From ${fromCity} to ${toCity} on ${date}. Property Size: ${propType}.`
    })

  revalidatePath(`/sites/[subdomain]`)
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
  const ctaText = tenant.cta_text || 'Book Consultation'
  const consultationLink = tenant.consultation_link || '#'

  // Resolve Theme Details
  const theme = getTemplateById(tenant.template_id || 'agency_automation_cyber')

  // Resolve Layout Order
  const layout = (tenant.layout_structure || ['hero', 'services', 'about', 'consultation']) as string[]
  const visible = (tenant.visible_sections || ['hero', 'services', 'about', 'consultation']) as string[]

  // ==========================================
  // LAYOUT 11: GAINLOVE (CHARITY)
  // ==========================================
  const renderGainloveSection = (sectionId: string) => {
    if (!visible.includes(sectionId)) return null

    switch (sectionId) {
      case 'hero':
        return (
          <header key="hero" className="max-w-5xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="inline-block text-[#d97706] font-bold text-xs uppercase tracking-wider">
                Gainlove Global Aid Network
              </span>
              <h1 className="text-4xl sm:text-5xl font-serif font-extrabold text-stone-900 leading-tight">
                {title}
              </h1>
              <p className="text-stone-600 text-sm leading-relaxed max-w-md">
                {bio[0]}
              </p>
              <div>
                <a
                  href={consultationLink}
                  className="inline-block px-6 py-3 bg-stone-900 text-white font-bold text-xs rounded hover:bg-stone-800 transition-colors shadow"
                >
                  DONATE NOW
                </a>
              </div>
            </div>
            {/* Pill-shape overlapping mockup from screenshot */}
            <div className="flex gap-4 justify-center items-center select-none pointer-events-none">
              <div className="w-20 h-52 bg-stone-200 border-4 border-white shadow rounded-full rotate-12 transform translate-y-6 overflow-hidden flex items-end justify-center">
                <span className="text-[10px] text-stone-400 font-bold uppercase mb-4">Support</span>
              </div>
              <div className="w-20 h-64 bg-stone-300 border-4 border-white shadow rounded-full rotate-12 overflow-hidden flex items-center justify-center">
                <span className="text-[10px] text-stone-500 font-bold uppercase">Justice</span>
              </div>
              <div className="w-20 h-52 bg-stone-200 border-4 border-white shadow rounded-full rotate-12 transform -translate-y-6 overflow-hidden flex items-start justify-center">
                <span className="text-[10px] text-stone-400 font-bold uppercase mt-4">Equality</span>
              </div>
            </div>
          </header>
        )
      case 'services':
        return (
          <section key="services" className="max-w-5xl mx-auto px-6 py-16 border-t border-stone-200">
            <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
              <h2 className="text-2xl font-serif font-extrabold text-stone-900">Our Programs</h2>
              <p className="text-xs text-stone-500">Working directly inside communities to scale opportunities and aid networks.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {services?.map(s => (
                <div key={s.id} className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-sm flex flex-col justify-between">
                  <div className="h-28 bg-stone-100 flex items-center justify-center text-stone-400 font-bold uppercase text-xs border-b border-stone-100">
                    Program Area
                  </div>
                  <div className="p-5 space-y-3 flex-grow">
                    <h3 className="font-serif font-bold text-base text-stone-900">{s.title}</h3>
                    <p className="text-xs text-stone-600 leading-relaxed">{s.description}</p>
                  </div>
                  <div className="p-5 pt-0">
                    <a href={consultationLink} className="block text-center py-2 bg-stone-900 hover:bg-stone-800 text-white font-bold text-[10px] rounded uppercase tracking-wider">
                      LEARN MORE
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )
      case 'about':
        return (
          <section key="about" className="max-w-5xl mx-auto px-6 py-16 border-t border-stone-200 grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-4">
              <h2 className="text-2xl font-serif font-extrabold text-stone-900">About Our Network</h2>
              {bio.slice(1).map((para, i) => (
                <p key={i} className="text-stone-600 text-sm leading-relaxed">{para}</p>
              ))}
            </div>
            <div className="bg-white border border-stone-200 p-6 rounded-xl space-y-4 shadow-sm">
              <h3 className="font-serif font-bold text-sm text-stone-900">Support Competencies</h3>
              <div className="grid grid-cols-1 gap-2">
                {skills.map((skill, index) => (
                  <div key={index} className="flex items-center gap-2 text-xs text-stone-700">
                    <CheckCircle className="w-4 h-4 text-[#d97706] flex-shrink-0" />
                    <span>{skill}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )
      case 'consultation':
        return (
          <section key="consultation" className="max-w-3xl mx-auto px-6 py-16 text-center border-t border-stone-200 space-y-4">
            <h2 className="text-3xl font-serif font-bold text-stone-900">Welcome to the Global Network</h2>
            <p className="text-xs text-stone-500 max-w-md mx-auto">Get involved today or book a consulting call with our aid coordinators.</p>
            <div className="flex justify-center gap-3">
              <a href={consultationLink} className="px-5 py-2.5 bg-[#d97706] text-white hover:bg-amber-600 text-xs font-bold rounded">
                GET INVOLVED
              </a>
              <a href={consultationLink} className="px-5 py-2.5 bg-stone-900 text-white hover:bg-stone-800 text-xs font-bold rounded">
                DONATE NOW
              </a>
            </div>
          </section>
        )
      default:
        return null
    }
  }

  // ==========================================
  // LAYOUT 12: EWEBOT (SEO AGENCY)
  // ==========================================
  const renderEwebotSection = (sectionId: string) => {
    if (!visible.includes(sectionId)) return null

    switch (sectionId) {
      case 'hero':
        return (
          <header key="hero" className="max-w-5xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="inline-block text-[#6366f1] font-bold text-xs uppercase tracking-wider">
                SEO &amp; Growth Agency
              </span>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-800 leading-tight">
                {title}
              </h1>
              <p className="text-slate-500 text-sm leading-relaxed">
                {bio[0]}
              </p>
              <div className="flex gap-3">
                <a href={consultationLink} className="px-6 py-3 bg-[#4f46e5] text-white hover:bg-[#4338ca] font-bold text-xs rounded-lg shadow-md transition-colors">
                  CONTACT TODAY
                </a>
              </div>
            </div>
            {/* Wave shape mockup from screenshot */}
            <div className="relative h-64 bg-indigo-50 border border-indigo-100 rounded-3xl overflow-hidden flex items-center justify-center shadow-inner">
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 via-transparent to-purple-500/10" />
              <div className="text-center p-6 space-y-2 relative z-10">
                <Globe className="w-12 h-12 mx-auto text-[#6366f1] animate-pulse" />
                <span className="text-xs font-bold text-indigo-900 block">SEO &amp; Web Audit Tools</span>
              </div>
            </div>
          </header>
        )
      case 'services':
        return (
          <section key="services" className="max-w-5xl mx-auto px-6 py-16 border-t border-slate-100">
            <div className="text-center max-w-xl mx-auto mb-12">
              <span className="text-xs font-bold text-[#6366f1] uppercase tracking-widest block mb-2">CARE FEATURES</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800">Provide Awesome Service With Our Tools</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {services?.map(s => {
                const IconComp = iconMap[s.icon || 'Cpu'] || Cpu
                return (
                  <div key={s.id} className="bg-white border border-slate-100 p-6 rounded-2xl shadow-lg shadow-slate-100/40 hover:shadow-indigo-100/50 transition-all text-center space-y-4">
                    <div className="p-3 bg-indigo-50 text-[#6366f1] rounded-xl inline-block">
                      <IconComp className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-base text-slate-800">{s.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">{s.description}</p>
                  </div>
                )
              })}
            </div>
          </section>
        )
      case 'about':
        return (
          <section key="about" className="max-w-5xl mx-auto px-6 py-16 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-4">
              <span className="text-xs font-bold text-[#6366f1] uppercase tracking-wider block">WHY CHOOSE US</span>
              <h2 className="text-2xl font-extrabold text-slate-800">Boosts Your Website Traffic!</h2>
              {bio.slice(1).map((para, i) => (
                <p key={i} className="text-slate-500 text-sm leading-relaxed">{para}</p>
              ))}
            </div>
            {/* Stats list from screenshot */}
            <div className="grid grid-cols-3 gap-4 text-center items-center bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <div>
                <span className="text-3xl font-extrabold text-[#6366f1] block">20+</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase mt-1 block">Employees</span>
              </div>
              <div className="border-l border-r border-slate-200">
                <span className="text-3xl font-extrabold text-[#6366f1] block">150+</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase mt-1 block">Projects</span>
              </div>
              <div>
                <span className="text-3xl font-extrabold text-[#6366f1] block">100+</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase mt-1 block">Clients</span>
              </div>
            </div>
          </section>
        )
      default:
        return null
    }
  }

  // ==========================================
  // LAYOUT 13: SARVAM (INDUSTRIAL MANUFACTURING)
  // ==========================================
  const renderSarvamSection = (sectionId: string) => {
    if (!visible.includes(sectionId)) return null

    switch (sectionId) {
      case 'hero':
        return (
          <header key="hero" className="max-w-5xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="inline-block text-[#f97316] font-bold text-xs uppercase tracking-wider border-l-2 border-[#f97316] pl-2">
                ISO 9001:2015 Certified
              </span>
              <h1 className="text-3xl sm:text-5xl font-extrabold text-[#1e3a8a] leading-tight">
                {title}
              </h1>
              <p className="text-slate-600 text-sm leading-relaxed">
                {bio[0]}
              </p>
              <div className="flex gap-3">
                <a href={consultationLink} className="px-6 py-3 bg-[#1e3a8a] text-white hover:bg-[#172554] font-bold text-xs rounded transition-colors shadow">
                  Explore Products
                </a>
              </div>
            </div>
            <div className="bg-slate-200 border border-slate-300 rounded-xl h-56 flex items-center justify-center text-slate-400 text-xs font-bold uppercase relative overflow-hidden select-none pointer-events-none">
              <div className="absolute inset-0 bg-slate-900/10" />
              <span>Pipe Manufacturing Showcase</span>
            </div>
          </header>
        )
      case 'services':
        return (
          <section key="services" className="max-w-5xl mx-auto px-6 py-16 border-t border-slate-200">
            <div className="text-center max-w-xl mx-auto mb-12">
              <h2 className="text-2xl font-extrabold text-[#1e3a8a]">Our PVC Pipe Products</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {services?.map(s => (
                <div key={s.id} className="bg-white border border-slate-200 p-5 rounded-lg shadow-sm flex flex-col justify-between">
                  <div className="h-24 bg-slate-100 flex items-center justify-center text-slate-400 font-bold uppercase text-[10px] mb-4">
                    Industrial Fit Specs
                  </div>
                  <h3 className="font-bold text-sm text-[#1e3a8a] mb-2">{s.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed mb-4">{s.description}</p>
                  <a href={consultationLink} className="text-center py-2 bg-[#f97316] hover:bg-[#ea580c] text-white text-[10px] font-bold rounded uppercase tracking-wider block">
                    Product Details
                  </a>
                </div>
              ))}
            </div>
          </section>
        )
      case 'about':
        return (
          <section key="about" className="max-w-5xl mx-auto px-6 py-16 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-4">
              <h2 className="text-2xl font-extrabold text-[#1e3a8a]">Why Choose Sarvam Pipes?</h2>
              {bio.slice(1).map((para, i) => (
                <p key={i} className="text-slate-655 text-sm leading-relaxed">{para}</p>
              ))}
            </div>
            <div className="bg-[#1e3a8a] p-6 rounded-xl text-white space-y-4">
              <h3 className="font-bold text-sm text-[#f97316]">Core Competencies</h3>
              <div className="grid grid-cols-2 gap-4">
                {skills.map((skill, index) => (
                  <div key={index} className="flex items-center gap-2 text-xs">
                    <CheckCircle className="w-4 h-4 text-[#f97316] flex-shrink-0" />
                    <span>{skill}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )
      default:
        return null
    }
  }

  // ==========================================
  // LAYOUT 14: MOVEAUS (MOVING)
  // ==========================================
  const renderMoveausSection = (sectionId: string) => {
    if (!visible.includes(sectionId)) return null

    switch (sectionId) {
      case 'hero':
        return (
          <header key="hero" className="max-w-5xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="inline-block text-[#ea580c] font-bold text-xs uppercase tracking-wider">
                Full-Service Moving &amp; Storage
              </span>
              <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-800 leading-tight">
                {title}
              </h1>
              <p className="text-zinc-600 text-sm leading-relaxed">
                {bio[0]}
              </p>
              <div className="flex gap-3">
                <a href="#quote-form" className="px-6 py-3 bg-[#ea580c] text-white hover:bg-[#d97706] font-bold text-xs rounded transition-colors shadow">
                  GET A MOVING QUOTE
                </a>
              </div>
            </div>
            <div className="bg-zinc-100 border border-zinc-200 rounded-xl h-56 flex items-center justify-center text-zinc-400 text-xs font-bold uppercase relative overflow-hidden select-none pointer-events-none">
              <span>Transit &amp; Removals Vehicle Mock</span>
            </div>
          </header>
        )
      case 'services':
        return (
          <section key="services" className="max-w-5xl mx-auto px-6 py-16 border-t border-zinc-200">
            <div className="text-center max-w-xl mx-auto mb-12">
              <h2 className="text-2xl font-bold text-slate-800">Our Moving Services</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {services?.map(s => (
                <div key={s.id} className="bg-white border border-zinc-200 p-5 rounded-lg shadow-sm">
                  <h3 className="font-bold text-sm text-[#ea580c] mb-2">{s.title}</h3>
                  <p className="text-xs text-zinc-500 leading-relaxed">{s.description}</p>
                </div>
              ))}
            </div>
          </section>
        )
      case 'consultation':
        return (
          <section key="consultation" id="quote-form" className="max-w-3xl mx-auto px-6 py-16 border-t border-zinc-200">
            <div className="bg-slate-50 border border-zinc-200 p-8 rounded-2xl shadow-sm space-y-6">
              <div className="text-center space-y-2">
                <h3 className="text-xl font-bold text-slate-800">Planning a Move Soon?</h3>
                <p className="text-xs text-zinc-500">Get a fast, obligation-free quote from our relocation specialists.</p>
              </div>

              {/* Server Action Form submitting directly into the database */}
              <form action={submitMovingLead} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="hidden" name="tenant_id" value={tenant.id} />
                
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Your Name</label>
                  <input required name="name" type="text" placeholder="John Doe" className="w-full p-2 text-xs border border-zinc-300 rounded bg-white text-zinc-800 focus:outline-none focus:ring-1 focus:ring-[#ea580c]" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Phone Number</label>
                  <input required name="phone" type="tel" placeholder="+1 555-5555" className="w-full p-2 text-xs border border-zinc-300 rounded bg-white text-zinc-800 focus:outline-none focus:ring-1 focus:ring-[#ea580c]" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Moving From</label>
                  <input required name="fromCity" type="text" placeholder="City or Zip Code" className="w-full p-2 text-xs border border-zinc-300 rounded bg-white text-zinc-800 focus:outline-none focus:ring-1 focus:ring-[#ea580c]" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Moving To</label>
                  <input required name="toCity" type="text" placeholder="City or Zip Code" className="w-full p-2 text-xs border border-zinc-300 rounded bg-white text-zinc-800 focus:outline-none focus:ring-1 focus:ring-[#ea580c]" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Property Size</label>
                  <select name="propType" className="w-full p-2 text-xs border border-zinc-300 rounded bg-white text-zinc-800 focus:outline-none focus:ring-1 focus:ring-[#ea580c]">
                    <option value="1-bed">1 Bedroom House/Apartment</option>
                    <option value="2-bed">2 Bedroom House/Apartment</option>
                    <option value="3-bed+">3+ Bedroom House</option>
                    <option value="office">Office Space / Commercial</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Moving Date</label>
                  <input required name="date" type="date" className="w-full p-2 text-xs border border-zinc-300 rounded bg-white text-zinc-800 focus:outline-none focus:ring-1 focus:ring-[#ea580c]" />
                </div>

                <div className="md:col-span-2 pt-2">
                  <button type="submit" className="w-full py-3 bg-[#ea580c] hover:bg-[#d97706] text-white font-bold text-xs uppercase tracking-wider rounded transition-colors cursor-pointer shadow">
                    GET MY FREE QUOTE
                  </button>
                </div>
              </form>
            </div>
          </section>
        )
      default:
        return null
    }
  }

  // ==========================================
  // LAYOUT 15: AUSROOFING (ROOFING)
  // ==========================================
  const renderAusroofingSection = (sectionId: string) => {
    if (!visible.includes(sectionId)) return null

    switch (sectionId) {
      case 'hero':
        return (
          <header key="hero" className="max-w-5xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="inline-block text-[#ea580c] font-bold text-xs uppercase tracking-wider">
                Australia's Roofing Specialists
              </span>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight">
                {title}
              </h1>
              <p className="text-slate-400 text-sm leading-relaxed">
                {bio[0]}
              </p>
              <div className="flex gap-3">
                <a href="#inspection" className="px-6 py-3 bg-[#ea580c] text-white hover:bg-[#d97706] font-bold text-xs rounded transition-colors shadow">
                  BOOK INSPECTION
                </a>
              </div>
            </div>
            <div className="bg-slate-950 border border-slate-800 rounded-xl h-56 flex items-center justify-center text-slate-500 text-xs font-bold uppercase relative overflow-hidden select-none pointer-events-none">
              <span>Shingles Roof Restoration Mock</span>
            </div>
          </header>
        )
      case 'services':
        return (
          <section key="services" className="max-w-5xl mx-auto px-6 py-16 border-t border-slate-800">
            <div className="text-center max-w-xl mx-auto mb-12">
              <h2 className="text-2xl font-extrabold text-white">Our Roofing Services</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {services?.map(s => (
                <div key={s.id} className="bg-slate-950 border border-slate-800 p-5 rounded-lg shadow-sm">
                  <h3 className="font-bold text-sm text-[#ea580c] mb-2">{s.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{s.description}</p>
                </div>
              ))}
            </div>
          </section>
        )
      case 'about':
        return (
          <section key="about" className="max-w-5xl mx-auto px-6 py-16 border-t border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-4">
              <h2 className="text-2xl font-extrabold text-white">Roof Repair &amp; Restoration</h2>
              {bio.slice(1).map((para, i) => (
                <p key={i} className="text-slate-400 text-sm leading-relaxed">{para}</p>
              ))}
            </div>
            {/* Before / after mock card */}
            <div className="bg-slate-950 border border-slate-850 p-6 rounded-xl space-y-4">
              <h3 className="font-bold text-sm text-[#ea580c]">10-Year Workmanship Warranty</h3>
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-3 bg-red-950/20 border border-red-900/30 text-red-400 rounded-lg">
                  <span className="text-[10px] uppercase font-bold block">BEFORE</span>
                  <span className="text-xs font-semibold mt-1 block">Rusted &amp; Leaking</span>
                </div>
                <div className="p-3 bg-green-955/20 border border-green-900/30 text-green-400 rounded-lg">
                  <span className="text-[10px] uppercase font-bold block">AFTER</span>
                  <span className="text-xs font-semibold mt-1 block">Restored &amp; Protected</span>
                </div>
              </div>
            </div>
          </section>
        )
      default:
        return null
    }
  }

  // ==========================================
  // LAYOUT A: MODERN DARK GRID
  // ==========================================
  const renderModernDarkSection = (sectionId: string) => {
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
            <h2 className={`text-3xl sm:text-4xl font-extrabold mb-4 ${theme.isDark ? 'text-white' : 'text-zinc-900'}`}>Ready to automate?</h2>
            <p className={`text-sm max-w-lg mx-auto mb-8 ${theme.text}`}>Schedule an integration assessment call to discuss your triggers and goals.</p>
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

  // ==========================================
  // LAYOUT B: CORPORATE SPLIT-SCREEN
  // ==========================================
  const renderSplitScreenSection = (sectionId: string) => {
    if (!visible.includes(sectionId)) return null

    switch (sectionId) {
      case 'services':
        return (
          <div key="services" className="space-y-6">
            <h2 className={`text-2xl font-bold border-b pb-2 ${theme.isDark ? 'text-white border-zinc-800' : 'text-zinc-900 border-zinc-200'}`}>
              Solutions &amp; Capabilities
            </h2>
            {(!services || services.length === 0) ? (
              <p className={`text-sm italic ${theme.text}`}>No services listed yet.</p>
            ) : (
              <div className="space-y-4">
                {services.map(s => {
                  const ServiceIcon = iconMap[s.icon || 'Phone'] || Phone
                  return (
                    <div key={s.id} className={`p-5 rounded-xl border flex items-start gap-4 transition-all ${theme.cardBg}`}>
                      <div className={`p-2.5 rounded-lg ${theme.accentBg} ${theme.accent}`}>
                        <ServiceIcon className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className={`font-bold text-base ${theme.isDark ? 'text-white' : 'text-zinc-900'}`}>{s.title}</h4>
                        <p className={`text-xs mt-1.5 leading-relaxed ${theme.text}`}>{s.description}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )
      case 'about':
        return (
          <div key="about" className="space-y-6">
            <h2 className={`text-2xl font-bold border-b pb-2 ${theme.isDark ? 'text-white border-zinc-800' : 'text-zinc-900 border-zinc-200'}`}>
              About Our Practice
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                {bio.slice(1).map((para: string, i: number) => (
                  <p key={i} className={`text-sm leading-relaxed ${theme.text}`}>{para}</p>
                ))}
              </div>
              <div className={`p-5 rounded-xl border ${theme.cardBg}`}>
                <h4 className={`font-bold text-sm mb-3 ${theme.isDark ? 'text-white' : 'text-zinc-900'}`}>Core Competencies</h4>
                <ul className="space-y-2">
                  {skills.map((skill: string, index: number) => (
                    <li key={index} className={`flex items-center text-xs ${theme.isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
                      <CheckCircle className={`w-3.5 h-3.5 mr-2.5 flex-shrink-0 ${theme.accent}`} />
                      <span>{skill}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  // ==========================================
  // LAYOUT C: MINIMALIST LIST LAYOUT
  // ==========================================
  const renderMinimalistListSection = (sectionId: string) => {
    if (!visible.includes(sectionId)) return null

    switch (sectionId) {
      case 'hero':
        return (
          <header key="hero" className="max-w-2xl mx-auto py-20 border-b border-zinc-200 dark:border-zinc-800">
            <h1 className={`text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 ${theme.isDark ? 'text-white' : 'text-zinc-900'}`}>
              {title}
            </h1>
            <p className={`text-base sm:text-lg mb-8 leading-relaxed max-w-xl ${theme.text}`}>
              {bio[0] || 'Designing intelligent automated systems and workflow pipelines.'}
            </p>
            <a
              href={consultationLink}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1.5 px-6 py-2.5 font-bold text-xs rounded-md transition-colors ${theme.btn}`}
            >
              <span>{ctaText}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </header>
        )
      case 'services':
        return (
          <section key="services" className="max-w-2xl mx-auto py-16 border-b border-zinc-200 dark:border-zinc-800">
            <h2 className={`text-xl font-bold uppercase tracking-wider mb-10 ${theme.isDark ? 'text-white' : 'text-zinc-900'}`}>
              Selected Works
            </h2>
            {(!services || services.length === 0) ? (
              <p className={`text-sm italic ${theme.text}`}>No items listed yet.</p>
            ) : (
              <div className="space-y-12">
                {services.map((s, idx) => (
                  <div key={s.id} className="flex flex-col sm:flex-row sm:items-start gap-4 pb-8 border-b border-zinc-100 dark:border-zinc-900 last:border-0 last:pb-0">
                    <span className="text-xs font-semibold text-zinc-400 font-mono">0{idx + 1}.</span>
                    <div>
                      <h3 className={`font-bold text-lg mb-2 ${theme.isDark ? 'text-white' : 'text-zinc-900'}`}>{s.title}</h3>
                      <p className={`text-sm leading-relaxed ${theme.text}`}>{s.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )
      case 'about':
        return (
          <section key="about" className="max-w-2xl mx-auto py-16 border-b border-zinc-200 dark:border-zinc-800">
            <h2 className={`text-xl font-bold uppercase tracking-wider mb-8 ${theme.isDark ? 'text-white' : 'text-zinc-900'}`}>
              Profile Info
            </h2>
            <div className="space-y-6 text-sm leading-relaxed">
              {bio.slice(1).map((para: string, i: number) => (
                <p key={i} className={theme.text}>{para}</p>
              ))}
              <div className="pt-4">
                <h4 className={`font-bold text-xs uppercase tracking-wider mb-3 ${theme.isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
                  Competencies
                </h4>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill: string, index: number) => (
                    <span 
                      key={index} 
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${
                        theme.isDark ? 'bg-zinc-800/40 border-zinc-800 text-zinc-300' : 'bg-zinc-100 border-zinc-200 text-zinc-800'
                      }`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )
      case 'consultation':
        return (
          <section key="consultation" className="max-w-2xl mx-auto py-20 text-center">
            <h2 className={`text-2xl font-bold mb-3 ${theme.isDark ? 'text-white' : 'text-zinc-900'}`}>Let's Connect</h2>
            <p className={`text-sm mb-6 max-w-md mx-auto ${theme.text}`}>Book a call to review your automation operations.</p>
            <a
              href={consultationLink}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1.5 px-6 py-2.5 font-bold text-xs rounded-md transition-colors ${theme.btn}`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{ctaText}</span>
            </a>
          </section>
        )
      default:
        return null
    }
  }

  // ==========================================
  // RENDER SELECTION & LAYOUT ROUTING
  // ==========================================
  return (
    <div className={`min-h-screen flex flex-col selection:bg-blue-600/30 overflow-x-hidden relative ${theme.bg} ${theme.font}`}>
      
      {/* Background glow animations */}
      {theme.layoutType === 'modern_dark' && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] opacity-25 pointer-events-none z-0">
          <div className={`absolute inset-0 bg-gradient-to-b via-transparent blur-3xl rounded-full ${theme.glow}`} />
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
        {theme.layoutType === 'gainlove' ? (
          <div className="w-full">
            {layout.map((sectionId) => renderGainloveSection(sectionId))}
          </div>
        ) : theme.layoutType === 'ewebot' ? (
          <div className="w-full">
            {layout.map((sectionId) => renderEwebotSection(sectionId))}
          </div>
        ) : theme.layoutType === 'sarvam' ? (
          <div className="w-full">
            {layout.map((sectionId) => renderSarvamSection(sectionId))}
          </div>
        ) : theme.layoutType === 'moveaus' ? (
          <div className="w-full">
            {layout.map((sectionId) => renderMoveausSection(sectionId))}
          </div>
        ) : theme.layoutType === 'ausroofing' ? (
          <div className="w-full">
            {layout.map((sectionId) => renderAusroofingSection(sectionId))}
          </div>
        ) : theme.layoutType === 'split_screen' ? (
          <div className="container mx-auto px-6 py-12 max-w-5xl relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              {/* Left sticky column */}
              <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${theme.accentBg} ${theme.accent} ${theme.accentBorder}`}>
                  Corporate Counsel
                </span>
                <h1 className={`text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight ${theme.isDark ? 'text-white' : 'text-zinc-900'}`}>
                  {title}
                </h1>
                <p className={`text-sm leading-relaxed ${theme.text}`}>
                  {bio[0] || 'Designing intelligent automated systems and workflow pipelines.'}
                </p>
                <div className="pt-4">
                  <a
                    href={consultationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full inline-flex items-center justify-center gap-2 py-3 px-5 font-bold text-xs rounded-lg transition-colors shadow ${theme.btn}`}
                  >
                    <span>{ctaText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Right scrollable column */}
              <div className="lg:col-span-8 space-y-16">
                {layout.map((sectionId) => renderSplitScreenSection(sectionId))}
              </div>
            </div>
          </div>
        ) : theme.layoutType === 'minimalist_list' ? (
          <div className="container mx-auto px-6 py-12 relative z-10">
            {layout.map((sectionId) => renderMinimalistListSection(sectionId))}
          </div>
        ) : (
          <div className="w-full">
            {layout.map((sectionId) => renderModernDarkSection(sectionId))}
          </div>
        )}
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
