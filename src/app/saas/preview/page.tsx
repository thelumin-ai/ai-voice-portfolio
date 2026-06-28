'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { getTemplateById, PREBUILT_CONTENT } from '@/lib/templates'
import NonprofitAboutPage from '@/app/templates/nonprofit-001/about/page'
import NonprofitServicesPage from '@/app/templates/nonprofit-001/services/page'
import NonprofitContactPage from '@/app/templates/nonprofit-001/contact/page'
import AgencyAboutPage from '@/app/templates/agency-002/about/page'
import AgencyServicesPage from '@/app/templates/agency-002/services/page'
import AgencyContactPage from '@/app/templates/agency-002/contact/page'
import { 
  Phone, 
  Search, 
  User, 
  ArrowRight, 
  Heart, 
  Cpu, 
  Bot, 
  Sparkles, 
  Scale
} from 'lucide-react'

function SaaSPreviewContent() {
  const searchParams = useSearchParams()

  const templateId = searchParams.get('template_id') || 'legal_practice_advmarc'
  const activePage = searchParams.get('page') || 'home'
  
  // Extract industry ID from template ID (e.g. `legal_practice_advmarc` -> `legal_practice`)
  const parts = templateId.split('_')
  const suffixes = ['advmarc', 'consult', 'dycrw', 'renthu', 'estate_teal', 'gainlove', 'agency-002']
  let industryId = parts.slice(0, -1).join('_')
  const lastTwo = parts.slice(-2).join('_')
  if (suffixes.includes(lastTwo)) {
    industryId = parts.slice(0, -2).join('_')
  }

  // Get prebuilt copy fallback for selected industry
  const content = PREBUILT_CONTENT[industryId] || PREBUILT_CONTENT['legal_practice']

  // Parse layout structures from query params
  const layoutRaw = searchParams.get('layout')
  const layout = layoutRaw ? layoutRaw.split(',') : ['hero', 'services', 'about']
  
  const visibleRaw = searchParams.get('visible')
  const visible = visibleRaw ? visibleRaw.split(',') : ['hero', 'services', 'about']

  const companyName = searchParams.get('companyName') || 'Preview Portfolio'
  const title = searchParams.get('title') || content.title
  const bio = content.bio
  const skills = content.skills
  const services = content.services.map((s, idx) => ({
    id: `service-preview-${idx}`,
    ...s
  }))

  const ctaText = 'Fale Conosco'
  const consultationLink = '#'

  // Resolve Theme Styling
  const theme = getTemplateById(templateId)

  // ==========================================
  // RENDER DYNAMIC CANVAS BY ACTIVE PAGE
  // ==========================================
  if (theme.layoutType === 'gainlove') {
    if (activePage === 'about') {
      return <NonprofitAboutPage />
    }
    if (activePage === 'services') {
      return <NonprofitServicesPage />
    }
    if (activePage === 'contact') {
      return <NonprofitContactPage />
    }
  }

  if (theme.id.includes('agency-002')) {
    if (activePage === 'about') {
      return <AgencyAboutPage />
    }
    if (activePage === 'services') {
      return <AgencyServicesPage />
    }
    if (activePage === 'contact') {
      return <AgencyContactPage />
    }
  }

  // ==========================================
  // LAYOUT 1: GRUPO ADVMARC (LAW FIRM) - DEFAULT PREVIEW
  // ==========================================
  const renderAdvmarcSection = (sectionId: string) => {
    if (!visible.includes(sectionId)) return null

    switch (sectionId) {
      case 'hero':
        return (
          <header key="hero" className="max-w-5xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
            <div className="md:col-span-7 space-y-4">
              <span className="inline-block text-[#c5a880] font-bold text-[10px] uppercase tracking-widest">
                Grupo ADVMARC
              </span>
              <h1 className="text-3xl sm:text-4xl font-serif font-extrabold text-white leading-tight">
                Advocacia e Soluções:<br />
                <span className="text-[#c5a880]">Seu Advogado</span>
              </h1>
              <p className="text-stone-400 text-xs leading-relaxed max-w-md">
                {bio[0]}
              </p>
              <div>
                <span className="inline-block px-5 py-2.5 bg-[#c5a880] text-black font-bold text-[10px] rounded hover:bg-[#b09670] transition-all">
                  FALE CONOSCO
                </span>
              </div>
            </div>
            <div className="md:col-span-5 flex justify-center opacity-85 select-none pointer-events-none">
              <div className="w-56 h-60 border border-stone-850 rounded-t-full bg-gradient-to-b from-[#c5a880]/5 to-transparent p-4 flex flex-col items-center justify-center">
                <Scale className="w-20 h-20 text-[#c5a880] mb-2 animate-pulse" />
                <span className="text-[8px] text-[#c5a880] font-bold tracking-widest uppercase">Justitia</span>
              </div>
            </div>
          </header>
        )
      case 'services':
        return (
          <section key="services" className="max-w-5xl mx-auto px-6 py-12 border-t border-stone-850 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center mb-8">
              <div className="md:col-span-4 flex justify-center">
                <Scale className="w-32 h-32 text-[#c5a880]/30" />
              </div>
              <div className="md:col-span-8 space-y-2">
                <h2 className="text-xl sm:text-2xl font-serif font-extrabold text-white leading-tight">
                  Nossa ampla <span className="text-[#c5a880]">experiência jurídica</span>
                </h2>
                <p className="text-stone-400 text-xs leading-relaxed">
                  {bio[1]}
                </p>
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4 text-center py-6 border-t border-b border-stone-850 mb-8">
              <div>
                <span className="text-xl font-extrabold text-[#c5a880] block font-serif">+200</span>
                <span className="text-[8px] text-stone-500 font-bold uppercase tracking-wider block">Casos por ano</span>
              </div>
              <div className="border-l border-r border-stone-850">
                <span className="text-xl font-extrabold text-[#c5a880] block font-serif">65%</span>
                <span className="text-[8px] text-stone-500 font-bold uppercase tracking-wider block">Veredictos</span>
              </div>
              <div>
                <span className="text-xl font-extrabold text-[#c5a880] block font-serif">90%</span>
                <span className="text-[8px] text-stone-500 font-bold uppercase tracking-wider block">Satisfação</span>
              </div>
            </div>

            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {services.map(s => (
                <div key={s.id} className="bg-[#1c1c1c] border border-stone-850 p-5 rounded-lg space-y-3">
                  <h3 className="font-serif font-bold text-xs text-white border-b border-[#c5a880]/10 pb-1.5">{s.title}</h3>
                  <p className="text-[11px] text-stone-400 leading-relaxed">{s.description}</p>
                </div>
              ))}
            </div>
          </section>
        )
      case 'about':
        return (
          <section key="about" className="max-w-5xl mx-auto px-6 py-12 border-t border-stone-850 relative z-10">
            <h2 className="text-xl font-serif font-bold text-white text-center mb-8">Nossos <span className="text-[#c5a880]">advogados</span></h2>
            <div className="grid grid-cols-5 gap-3 text-center">
              {['Marcos Polirsa', 'Andria Koli', 'Cesar Octagon', 'Marcia Oliveira', 'Roberto Silva'].map((lawyer, idx) => (
                <div key={idx} className="bg-[#1c1c1c] border border-stone-850 rounded-lg p-3">
                  <div className="w-8 h-8 rounded-full bg-stone-900 mx-auto mb-2 text-[10px] flex items-center justify-center font-bold text-stone-400">
                    {lawyer.charAt(0)}
                  </div>
                  <h4 className="font-bold text-[10px] text-white truncate">{lawyer}</h4>
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
          <header key="hero" className="max-w-5xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center relative z-10">
            <div className="space-y-4">
              <span className="inline-block text-[#0f4c81] font-bold text-[10px] uppercase tracking-wider border-l border-[#f26522] pl-2">
                Business Advisory Partners
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 leading-tight">
                We Are Business Consultants Dedicated To Driving Success
              </h1>
              <p className="text-slate-500 text-xs leading-relaxed">
                {bio[0]}
              </p>
              <div>
                <span className="inline-block px-5 py-2.5 bg-[#0f4c81] text-white font-bold text-[10px] rounded">
                  SCHEDULE CONSULTATION
                </span>
              </div>
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-xl h-40 flex items-center justify-center text-slate-400 text-xs font-bold uppercase relative overflow-hidden select-none pointer-events-none">
              <span>Consulting Panel Mock</span>
            </div>
          </header>
        )
      case 'services':
        return (
          <section key="services" className="max-w-5xl mx-auto px-6 py-12 border-t border-slate-100 relative z-10">
            <div className="text-center max-w-xl mx-auto mb-8">
              <h2 className="text-lg font-extrabold text-slate-800">Discover The Core Principles That Guide Us</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {services.map(s => (
                <div key={s.id} className="bg-white border border-slate-100 p-5 rounded-xl shadow-md space-y-3">
                  <div className="p-2 bg-blue-50 text-[#0f4c81] rounded-lg inline-block">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-sm text-slate-800">{s.title}</h3>
                  <p className="text-[11px] text-slate-500 leading-relaxed">{s.description}</p>
                </div>
              ))}
            </div>

            <div className="bg-[#0f4c81] text-white p-6 rounded-xl grid grid-cols-4 gap-2 text-center text-xs">
              <div>
                <span className="text-lg font-extrabold text-[#f26522] block">680+</span>
                <span className="text-[8px] text-slate-300 font-bold uppercase block mt-0.5">Trust Us</span>
              </div>
              <div>
                <span className="text-lg font-extrabold text-[#f26522] block">1.3k</span>
                <span className="text-[8px] text-slate-300 font-bold uppercase block mt-0.5">Projects</span>
              </div>
              <div>
                <span className="text-lg font-extrabold text-[#f26522] block">97%</span>
                <span className="text-[8px] text-slate-300 font-bold uppercase block mt-0.5">Success</span>
              </div>
              <div>
                <span className="text-lg font-extrabold text-[#f26522] block">15Y</span>
                <span className="text-[8px] text-slate-300 font-bold uppercase block mt-0.5">Years</span>
              </div>
            </div>
          </section>
        )
      case 'about':
        return (
          <section key="about" className="max-w-xl mx-auto px-6 py-12 text-center border-t border-slate-100 space-y-4">
            <h2 className="text-lg font-extrabold text-slate-800">Ready to discuss your business goals?</h2>
            <span className="inline-block px-5 py-2.5 bg-[#f26522] text-white font-bold text-[10px] rounded">
              GET A QUOTE
            </span>
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
          <header key="hero" className="max-w-5xl mx-auto px-6 py-12 relative z-10 space-y-8">
            <div className="space-y-3 max-w-xl">
              <span className="inline-block text-[#d4af37] font-bold text-[10px] uppercase tracking-widest">
                Exclusive Luxury Estates
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                {title}
              </h1>
              <p className="text-zinc-555 text-xs leading-relaxed">
                {bio[0]}
              </p>
            </div>

            <div className="bg-[#121212] border border-zinc-850 p-3 rounded-lg grid grid-cols-4 gap-2 items-center text-xs">
              <div className="p-1">
                <span className="text-[8px] uppercase font-bold text-zinc-505 block">Location</span>
                <span className="text-[10px] text-white block mt-0.5 font-semibold">Suburbs</span>
              </div>
              <div className="p-1">
                <span className="text-[8px] uppercase font-bold text-zinc-505 block">Type</span>
                <span className="text-[10px] text-white block mt-0.5 font-semibold">Villa</span>
              </div>
              <div className="p-1">
                <span className="text-[8px] uppercase font-bold text-zinc-505 block">Budget</span>
                <span className="text-[10px] text-[#d4af37] block mt-0.5 font-semibold">$2.5M+</span>
              </div>
              <span className="py-2 bg-[#d4af37] text-black text-center font-bold text-[10px] rounded uppercase tracking-wider block">
                SEARCH
              </span>
            </div>
          </header>
        )
      case 'services':
        return (
          <section key="services" className="max-w-5xl mx-auto px-6 py-12 border-t border-zinc-850 relative z-10">
            <div className="text-center max-w-xl mx-auto mb-8">
              <h2 className="text-lg font-bold text-white">Search Premium Near You</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {services.map(s => (
                <div key={s.id} className="bg-[#121212] border border-zinc-850 p-4 rounded-lg">
                  <div className="h-24 bg-zinc-900 rounded mb-3 flex items-center justify-center text-zinc-655 text-xs font-semibold">
                    Property Preview
                  </div>
                  <h3 className="font-bold text-xs text-white mb-1.5">{s.title}</h3>
                  <p className="text-[11px] text-zinc-500 leading-relaxed">{s.description}</p>
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
          <header key="hero" className="max-w-5xl mx-auto px-6 py-12 relative z-10 space-y-6">
            <div className="space-y-3 max-w-xl">
              <span className="inline-block text-[#0f2c59] font-bold text-[10px] uppercase tracking-wider">
                Rent H&amp;U Rentals
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0f2c59] leading-tight">
                {title}
              </h1>
              <p className="text-slate-505 text-xs leading-relaxed">
                {bio[0]}
              </p>
            </div>

            <div className="bg-white border border-slate-200 p-3 rounded-lg shadow grid grid-cols-4 gap-2 items-center text-xs">
              <div className="p-1">
                <span className="text-[8px] uppercase font-bold text-slate-400 block">Street</span>
                <span className="text-[10px] text-[#0f2c59] block mt-0.5 font-semibold">123 Street</span>
              </div>
              <div className="p-1">
                <span className="text-[8px] uppercase font-bold text-slate-400 block">Type</span>
                <span className="text-[10px] text-[#0f2c59] block mt-0.5 font-semibold">Apartment</span>
              </div>
              <div className="p-1">
                <span className="text-[8px] uppercase font-bold text-slate-400 block">Price</span>
                <span className="text-[10px] text-[#0f2c59] block mt-0.5 font-semibold">€ 2.5k / mo</span>
              </div>
              <span className="py-2 bg-[#0f2c59] text-white text-center font-bold text-[10px] rounded uppercase tracking-wider block">
                SEARCH
              </span>
            </div>
          </header>
        )
      case 'services':
        return (
          <section key="services" className="max-w-5xl mx-auto px-6 py-12 border-t border-slate-200 relative z-10">
            <div className="text-center max-w-xl mx-auto mb-8">
              <h2 className="text-lg font-extrabold text-[#0f2c59]">Most Viewed Properties</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {services.map(s => (
                <div key={s.id} className="bg-white border border-slate-100 rounded-lg overflow-hidden shadow-sm flex flex-col justify-between">
                  <div className="h-28 bg-slate-100 flex items-center justify-center text-slate-400 text-xs font-semibold">
                    Listing Photos
                  </div>
                  <div className="p-4 space-y-1">
                    <h3 className="font-bold text-xs text-[#0f2c59]">{s.title}</h3>
                    <p className="text-[11px] text-slate-555 leading-relaxed">{s.description}</p>
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
          <header key="hero" className="max-w-5xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center relative z-10">
            <div className="space-y-4">
              <h1 className="text-3xl font-extrabold text-[#004d40] leading-tight">
                {title}
              </h1>
              <p className="text-teal-855 text-xs leading-relaxed">
                {bio[0]}
              </p>
              <div>
                <span className="inline-block px-5 py-2.5 bg-[#ff7f50] text-white font-bold text-[10px] rounded shadow">
                  GET STARTED
                </span>
              </div>
            </div>
            <div className="bg-teal-100 border border-teal-200 rounded-xl h-40 flex items-center justify-center text-teal-655 text-xs font-bold uppercase relative overflow-hidden select-none pointer-events-none">
              <span>Modern Complex Mock</span>
            </div>
          </header>
        )
      case 'services':
        return (
          <section key="services" className="max-w-5xl mx-auto px-6 py-12 border-t border-teal-200 relative z-10">
            <div className="text-center max-w-xl mx-auto mb-8">
              <h2 className="text-lg font-bold text-[#004d40]">Featured Listings</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {services.map(s => (
                <div key={s.id} className="bg-white border border-teal-100 p-4 rounded-lg shadow-sm">
                  <h3 className="font-bold text-xs text-[#004d40] mb-1.5">{s.title}</h3>
                  <p className="text-[11px] text-teal-855 leading-relaxed">{s.description}</p>
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
  // DEFAULT CANVAS FALLBACK
  // ==========================================
  return (
    <div className={`min-h-screen flex flex-col selection:bg-blue-600/30 overflow-x-hidden relative ${theme.bg} ${theme.font} select-none`}>
      <nav className={`w-full border-b backdrop-blur-md relative z-10 ${theme.isDark ? 'bg-black/80 border-white/5' : 'bg-white/80 border-black/5'}`}>
        <div className="mx-auto px-6 h-14 flex items-center justify-between max-w-5xl">
          <span className={`text-base font-bold tracking-tight ${theme.isDark ? 'text-white' : 'text-zinc-900'}`}>
            {companyName}
          </span>
          <span className={`inline-flex items-center justify-center rounded-lg px-3 py-1.5 text-[10px] font-semibold ${theme.btn}`}>
            {ctaText}
          </span>
        </div>
      </nav>

      <main className="flex-grow">
        <div className="w-full">
          {layout.map((sectionId) => renderAdvmarcSection(sectionId))}
        </div>
      </main>

      <footer className={`border-t py-6 text-center text-[10px] relative z-10 ${theme.isDark ? 'border-white/5 text-zinc-500' : 'border-zinc-200 text-zinc-650'}`}>
        <div className="mx-auto px-6 flex items-center justify-between max-w-5xl gap-4">
          <p>© {new Date().getFullYear()} {companyName}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default function SaaSPreviewPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center text-zinc-500 text-sm">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 animate-spin text-blue-500" />
          <span>Generating preview canvas...</span>
        </div>
      </div>
    }>
      <SaaSPreviewContent />
    </Suspense>
  )
}
