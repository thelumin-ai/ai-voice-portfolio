'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { getTemplateById, PREBUILT_CONTENT } from '@/lib/templates'
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

const iconMap: Record<string, any> = {
  Phone,
  Bot,
  Cpu,
  Sparkles
}

function SaaSPreviewContent() {
  const searchParams = useSearchParams()

  const templateId = searchParams.get('template_id') || 'agency_automation_cyber'
  
  // Extract industry ID from template ID (e.g. `real_estate_royal_gold` -> `real_estate`)
  const parts = templateId.split('_')
  const suffixes = ['cyber', 'corp_dark', 'corp_light', 'royal_gold', 'eco_teal', 'sunset', 'performance', 'minimalist', 'violet_aurora', 'steel_industrial', 'gainlove', 'ewebot', 'sarvam', 'moveaus', 'ausroofing']
  let industryId = parts.slice(0, -1).join('_')
  const lastTwo = parts.slice(-2).join('_')
  if (suffixes.includes(lastTwo)) {
    industryId = parts.slice(0, -2).join('_')
  }

  // Get prebuilt copy fallback for selected industry
  const content = PREBUILT_CONTENT[industryId] || PREBUILT_CONTENT['automation_agency']

  // Parse layout structures from query params
  const layoutRaw = searchParams.get('layout')
  const layout = layoutRaw ? layoutRaw.split(',') : ['hero', 'services', 'about', 'consultation']
  
  const visibleRaw = searchParams.get('visible')
  const visible = visibleRaw ? visibleRaw.split(',') : ['hero', 'services', 'about', 'consultation']

  const companyName = searchParams.get('companyName') || 'Preview Portfolio'
  const title = searchParams.get('title') || content.title
  const bio = content.bio
  const skills = content.skills
  const services = content.services.map((s, idx) => ({
    id: `service-preview-${idx}`,
    ...s
  }))

  const ctaText = 'Book Consultation'
  const consultationLink = '#'

  // Resolve Theme Styling
  const theme = getTemplateById(templateId)

  // ==========================================
  // LAYOUT 11: GAINLOVE (CHARITY)
  // ==========================================
  const renderGainloveSection = (sectionId: string) => {
    if (!visible.includes(sectionId)) return null

    switch (sectionId) {
      case 'hero':
        return (
          <header key="hero" className="max-w-5xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="inline-block text-[#d97706] font-bold text-[10px] uppercase tracking-wider">
                Gainlove Global Aid Network
              </span>
              <h1 className="text-3xl sm:text-4xl font-serif font-extrabold text-stone-900 leading-tight">
                {title}
              </h1>
              <p className="text-stone-600 text-xs leading-relaxed">
                {bio[0]}
              </p>
              <div>
                <span className="inline-block px-5 py-2.5 bg-stone-900 text-white font-bold text-[10px] rounded shadow">
                  DONATE NOW
                </span>
              </div>
            </div>
            {/* Overlapping pill shape decoration */}
            <div className="flex gap-3 justify-center items-center select-none pointer-events-none opacity-90 scale-95">
              <div className="w-16 h-40 bg-stone-200 border-2 border-white shadow rounded-full rotate-12 transform translate-y-4 overflow-hidden" />
              <div className="w-16 h-48 bg-stone-300 border-2 border-white shadow rounded-full rotate-12 overflow-hidden" />
              <div className="w-16 h-40 bg-stone-200 border-2 border-white shadow rounded-full rotate-12 transform -translate-y-4 overflow-hidden" />
            </div>
          </header>
        )
      case 'services':
        return (
          <section key="services" className="max-w-5xl mx-auto px-6 py-12 border-t border-stone-200">
            <div className="text-center max-w-xl mx-auto mb-10">
              <h2 className="text-xl font-serif font-extrabold text-stone-900">Our Programs</h2>
              <p className="text-[10px] text-stone-500 mt-1">Direct aid and educational initiatives inside active communities.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {services.map(s => (
                <div key={s.id} className="bg-white border border-stone-200 rounded-lg p-5 flex flex-col justify-between shadow-sm">
                  <div className="space-y-2 mb-4">
                    <h3 className="font-serif font-bold text-sm text-stone-900">{s.title}</h3>
                    <p className="text-[11px] text-stone-600 leading-relaxed">{s.description}</p>
                  </div>
                  <span className="block text-center py-1.5 bg-stone-900 text-white font-bold text-[9px] rounded uppercase tracking-wider">
                    LEARN MORE
                  </span>
                </div>
              ))}
            </div>
          </section>
        )
      case 'about':
        return (
          <section key="about" className="max-w-5xl mx-auto px-6 py-12 border-t border-stone-200 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <h2 className="text-xl font-serif font-extrabold text-stone-900">About Our Network</h2>
              {bio.slice(1).map((para, i) => (
                <p key={i} className="text-stone-600 text-xs leading-relaxed">{para}</p>
              ))}
            </div>
            <div className="bg-white border border-stone-200 p-5 rounded-lg space-y-3 shadow-sm">
              <h3 className="font-serif font-bold text-xs text-stone-900">Capabilities</h3>
              <div className="grid grid-cols-1 gap-1.5">
                {skills.map((skill, index) => (
                  <div key={index} className="flex items-center gap-2 text-xs text-stone-700">
                    <CheckCircle className="w-3.5 h-3.5 text-[#d97706]" />
                    <span>{skill}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )
      case 'consultation':
        return (
          <section key="consultation" className="max-w-xl mx-auto px-6 py-12 text-center border-t border-stone-200 space-y-3">
            <h2 className="text-xl font-serif font-bold text-stone-900">Welcome to the Global Network</h2>
            <p className="text-[10px] text-stone-500">Get in touch with local program coordinators.</p>
            <div className="flex justify-center gap-2">
              <span className="px-4 py-2 bg-[#d97706] text-white text-[10px] font-bold rounded">GET INVOLVED</span>
              <span className="px-4 py-2 bg-stone-900 text-white text-[10px] font-bold rounded">DONATE NOW</span>
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
          <header key="hero" className="max-w-5xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="inline-block text-[#6366f1] font-bold text-[10px] tracking-wider uppercase">
                SEO &amp; Growth Agency
              </span>
              <h1 className="text-3xl font-extrabold text-slate-800 leading-tight">
                {title}
              </h1>
              <p className="text-slate-500 text-xs leading-relaxed">
                {bio[0]}
              </p>
              <div>
                <span className="px-5 py-2.5 bg-[#4f46e5] text-white font-bold text-[10px] rounded-lg shadow-sm">
                  CONTACT TODAY
                </span>
              </div>
            </div>
            {/* Wave frame decoration */}
            <div className="h-44 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 to-purple-500/5" />
              <Globe className="w-10 h-10 text-[#6366f1] animate-pulse" />
            </div>
          </header>
        )
      case 'services':
        return (
          <section key="services" className="max-w-5xl mx-auto px-6 py-12 border-t border-slate-100">
            <div className="text-center max-w-xl mx-auto mb-8">
              <span className="text-[10px] font-bold text-[#6366f1] uppercase tracking-wider block mb-1">CARE FEATURES</span>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-800">Provide Awesome Service With Our Tools</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {services.map(s => {
                const IconComp = iconMap[s.icon || 'Cpu'] || Cpu
                return (
                  <div key={s.id} className="bg-white border border-slate-100 p-5 rounded-xl shadow-md shadow-slate-100/30 text-center space-y-3">
                    <div className="p-2.5 bg-indigo-50 text-[#6366f1] rounded-lg inline-block">
                      <IconComp className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-sm text-slate-800">{s.title}</h3>
                    <p className="text-[11px] text-slate-500 leading-relaxed">{s.description}</p>
                  </div>
                )
              })}
            </div>
          </section>
        )
      case 'about':
        return (
          <section key="about" className="max-w-5xl mx-auto px-6 py-12 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <span className="text-[10px] font-bold text-[#6366f1] uppercase tracking-wider block">WHY CHOOSE US</span>
              <h2 className="text-lg font-extrabold text-slate-800">Boosts Your Website Traffic!</h2>
              {bio.slice(1).map((para, i) => (
                <p key={i} className="text-slate-500 text-xs leading-relaxed">{para}</p>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-2 text-center bg-slate-50 p-4 rounded-xl border border-slate-100 items-center">
              <div>
                <span className="text-xl font-extrabold text-[#6366f1] block">20+</span>
                <span className="text-[8px] text-slate-400 font-bold uppercase block">Employees</span>
              </div>
              <div className="border-l border-r border-slate-200">
                <span className="text-xl font-extrabold text-[#6366f1] block">150+</span>
                <span className="text-[8px] text-slate-400 font-bold uppercase block">Projects</span>
              </div>
              <div>
                <span className="text-xl font-extrabold text-[#6366f1] block">100+</span>
                <span className="text-[8px] text-slate-400 font-bold uppercase block">Clients</span>
              </div>
            </div>
          </section>
        )
      default:
        return null
    }
  }

  // ==========================================
  // LAYOUT 13: SARVAM (INDUSTRIAL)
  // ==========================================
  const renderSarvamSection = (sectionId: string) => {
    if (!visible.includes(sectionId)) return null

    switch (sectionId) {
      case 'hero':
        return (
          <header key="hero" className="max-w-5xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="inline-block text-[#f97316] font-bold text-[10px] uppercase tracking-wider border-l border-[#f97316] pl-2">
                Industrial Manufacturing
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1e3a8a] leading-tight">
                {title}
              </h1>
              <p className="text-slate-600 text-xs leading-relaxed">
                {bio[0]}
              </p>
              <div>
                <span className="inline-block px-5 py-2.5 bg-[#1e3a8a] text-white font-bold text-[10px] rounded">
                  Explore Products
                </span>
              </div>
            </div>
            <div className="bg-slate-200 border border-slate-350 rounded-lg h-40 flex items-center justify-center text-slate-400 text-[10px] font-bold uppercase relative overflow-hidden">
              <span>SARVAM PVC Fittings Preview</span>
            </div>
          </header>
        )
      case 'services':
        return (
          <section key="services" className="max-w-5xl mx-auto px-6 py-12 border-t border-slate-200">
            <div className="text-center max-w-xl mx-auto mb-8">
              <h2 className="text-lg font-bold text-[#1e3a8a]">Our PVC Pipe Products</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {services.map(s => (
                <div key={s.id} className="bg-white border border-slate-200 p-4 rounded flex flex-col justify-between shadow-sm">
                  <div className="mb-3">
                    <h3 className="font-bold text-xs text-[#1e3a8a] mb-1.5">{s.title}</h3>
                    <p className="text-[11px] text-slate-500 leading-relaxed">{s.description}</p>
                  </div>
                  <span className="text-center py-1 bg-[#f97316] text-white text-[9px] font-bold rounded uppercase tracking-wider">
                    Product Details
                  </span>
                </div>
              ))}
            </div>
          </section>
        )
      case 'about':
        return (
          <section key="about" className="max-w-5xl mx-auto px-6 py-12 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <h2 className="text-lg font-bold text-[#1e3a8a]">Why Choose Sarvam Pipes?</h2>
              {bio.slice(1).map((para, i) => (
                <p key={i} className="text-slate-655 text-xs leading-relaxed">{para}</p>
              ))}
            </div>
            <div className="bg-[#1e3a8a] p-5 rounded-lg text-white space-y-3">
              <h3 className="font-bold text-xs text-[#f97316]">Core Competencies</h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {skills.map((skill, index) => (
                  <div key={index} className="flex items-center gap-1.5 text-[11px]">
                    <CheckCircle className="w-3.5 h-3.5 text-[#f97316]" />
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
          <header key="hero" className="max-w-5xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="inline-block text-[#ea580c] font-bold text-[10px] tracking-wider uppercase">
                Full-Service Moving &amp; Storage
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 leading-tight">
                {title}
              </h1>
              <p className="text-zinc-655 text-xs leading-relaxed">
                {bio[0]}
              </p>
              <div>
                <span className="inline-block px-5 py-2.5 bg-[#ea580c] text-white font-bold text-[10px] rounded transition-colors shadow">
                  GET A MOVING QUOTE
                </span>
              </div>
            </div>
            <div className="bg-zinc-100 border border-zinc-200 rounded-lg h-40 flex items-center justify-center text-zinc-400 text-xs font-bold uppercase">
              <span>Transit Vehicle Mockup</span>
            </div>
          </header>
        )
      case 'services':
        return (
          <section key="services" className="max-w-5xl mx-auto px-6 py-12 border-t border-zinc-200">
            <div className="text-center max-w-xl mx-auto mb-8">
              <h2 className="text-lg font-bold text-slate-800">Our Moving Services</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {services.map(s => (
                <div key={s.id} className="bg-white border border-zinc-200 p-4 rounded-lg shadow-sm">
                  <h3 className="font-bold text-xs text-[#ea580c] mb-1.5">{s.title}</h3>
                  <p className="text-[11px] text-zinc-500 leading-relaxed">{s.description}</p>
                </div>
              ))}
            </div>
          </section>
        )
      case 'consultation':
        return (
          <section key="consultation" className="max-w-xl mx-auto px-6 py-12 border-t border-zinc-200">
            <div className="bg-slate-50 border border-zinc-200 p-6 rounded-xl space-y-4">
              <div className="text-center space-y-1">
                <h3 className="font-bold text-sm text-slate-800">Planning a Move Soon?</h3>
                <p className="text-[10px] text-zinc-500">Get a quick estimate from our relocation crew.</p>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <input disabled type="text" placeholder="Your Name" className="p-2 border rounded bg-white text-zinc-400 select-none" />
                <input disabled type="text" placeholder="Phone Number" className="p-2 border rounded bg-white text-zinc-400 select-none" />
                <input disabled type="text" placeholder="Moving From" className="p-2 border rounded bg-white text-zinc-400 select-none" />
                <input disabled type="text" placeholder="Moving To" className="p-2 border rounded bg-white text-zinc-400 select-none" />
              </div>
              <button disabled className="w-full py-2 bg-[#ea580c] text-white font-bold text-[10px] uppercase rounded select-none opacity-80">
                GET MY FREE QUOTE
              </button>
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
          <header key="hero" className="max-w-5xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="inline-block text-[#ea580c] font-bold text-[10px] tracking-wider uppercase">
                Australia's Roofing Specialists
              </span>
              <h1 className="text-3xl font-extrabold text-white leading-tight">
                {title}
              </h1>
              <p className="text-slate-400 text-xs leading-relaxed">
                {bio[0]}
              </p>
              <div>
                <span className="inline-block px-5 py-2.5 bg-[#ea580c] text-white font-bold text-[10px] rounded transition-colors shadow">
                  BOOK INSPECTION
                </span>
              </div>
            </div>
            <div className="bg-slate-950 border border-slate-800 rounded-lg h-40 flex items-center justify-center text-slate-500 text-xs font-bold uppercase">
              <span>Restoration Preview Mock</span>
            </div>
          </header>
        )
      case 'services':
        return (
          <section key="services" className="max-w-5xl mx-auto px-6 py-12 border-t border-slate-800">
            <div className="text-center max-w-xl mx-auto mb-8">
              <h2 className="text-lg font-bold text-white">Our Roofing Services</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {services.map(s => (
                <div key={s.id} className="bg-slate-950 border border-slate-800 p-4 rounded-lg shadow-sm">
                  <h3 className="font-bold text-xs text-[#ea580c] mb-1.5">{s.title}</h3>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{s.description}</p>
                </div>
              ))}
            </div>
          </section>
        )
      case 'about':
        return (
          <section key="about" className="max-w-5xl mx-auto px-6 py-12 border-t border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <h2 className="text-lg font-bold text-white">Roof Repair &amp; Restoration</h2>
              {bio.slice(1).map((para, i) => (
                <p key={i} className="text-slate-400 text-xs leading-relaxed">{para}</p>
              ))}
            </div>
            <div className="bg-slate-950 border border-slate-850 p-5 rounded-lg space-y-3">
              <h3 className="font-bold text-xs text-[#ea580c]">Roof Inspection Standards</h3>
              <div className="grid grid-cols-2 gap-2 text-center text-xs">
                <div className="p-2 bg-red-950/20 border border-red-900/30 text-red-400 rounded">
                  <span className="text-[8px] uppercase block font-bold">BEFORE</span>
                  <span className="text-[10px] mt-0.5 block">Leaking Rust</span>
                </div>
                <div className="p-2 bg-green-950/20 border border-green-900/30 text-green-400 rounded">
                  <span className="text-[8px] uppercase block font-bold">AFTER</span>
                  <span className="text-[10px] mt-0.5 block">Restored Clean</span>
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
          <header key="hero" className="relative z-10 pt-20 pb-24 text-center max-w-3xl mx-auto px-6">
            <span className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] font-semibold ring-1 ring-inset mb-6 ${theme.accentBg} ${theme.accent} ${theme.accentBorder}`}>
              <span className="relative flex h-2 w-2 mr-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${theme.btn.split(' ')[0]}`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${theme.btn.split(' ')[0]}`}></span>
              </span>
              Next-Gen Automation Specialist
            </span>
            <h1 className={`text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight mb-6 ${theme.isDark ? 'text-white' : 'text-zinc-900'}`}>
              {title}
            </h1>
            <p className={`text-sm sm:text-base max-w-lg mx-auto mb-8 leading-relaxed ${theme.text}`}>
              {bio[0]}
            </p>
            <div className="flex justify-center">
              <a
                href={consultationLink}
                className={`inline-flex items-center gap-1.5 px-6 py-2.5 font-bold text-xs rounded-lg transition-colors ${theme.btn}`}
              >
                <span>{ctaText}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </header>
        )
      case 'services':
        return (
          <section key="services" className={`relative z-10 max-w-5xl mx-auto px-6 py-16 border-t w-full ${theme.accentBorder.replace('border-', 'border-t-')}`}>
            <div className="text-center max-w-xl mx-auto mb-12">
              <h2 className={`text-xl sm:text-3xl font-extrabold ${theme.isDark ? 'text-white' : 'text-zinc-900'}`}>Solutions &amp; Capabilities</h2>
              <p className={`text-xs mt-2 ${theme.text}`}>Tailored solutions built to reduce overheads, handle workflows, and streamline operations.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services.map(s => {
                const ServiceIcon = iconMap[s.icon || 'Phone'] || Phone
                return (
                  <div key={s.id} className={`p-5 rounded-xl border flex items-start gap-4 ${theme.cardBg}`}>
                    <div className={`p-2.5 rounded-lg ${theme.accentBg} ${theme.accent}`}>
                      <ServiceIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className={`font-bold text-base ${theme.isDark ? 'text-white' : 'text-zinc-900'}`}>{s.title}</h3>
                      <p className={`text-xs mt-1.5 leading-relaxed ${theme.text}`}>{s.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )
      case 'about':
        return (
          <section key="about" className={`relative z-10 max-w-5xl mx-auto px-6 py-16 border-t w-full ${theme.accentBorder.replace('border-', 'border-t-')}`}>
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="w-full md:w-1/2 space-y-4">
                <h2 className={`text-xl sm:text-3xl font-extrabold ${theme.isDark ? 'text-white' : 'text-zinc-900'}`}>About Us</h2>
                {bio.slice(1).map((para: string, i: number) => (
                  <p key={i} className={`text-sm leading-relaxed ${theme.text}`}>{para}</p>
                ))}
              </div>
              <div className="w-full md:w-1/2">
                <div className={`p-5 rounded-xl border ${theme.cardBg}`}>
                  <h3 className={`font-bold text-sm mb-3 ${theme.isDark ? 'text-white' : 'text-zinc-900'}`}>Core Specializations</h3>
                  <ul className="space-y-2">
                    {skills.map((skill: string, index: number) => (
                      <li key={index} className={`flex items-center text-xs ${theme.isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
                        <CheckCircle className={`w-3.5 h-3.5 mr-2 flex-shrink-0 ${theme.accent}`} />
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
          <section key="consultation" className={`relative z-10 max-w-2xl mx-auto px-6 py-16 text-center border-t w-full ${theme.accentBorder.replace('border-', 'border-t-')}`}>
            <h2 className={`text-2xl sm:text-3xl font-extrabold mb-3 ${theme.isDark ? 'text-white' : 'text-zinc-900'}`}>Ready to automate?</h2>
            <p className={`text-xs max-w-md mx-auto mb-6 ${theme.text}`}>Schedule an integration assessment call to discuss your triggers and goals.</p>
            <a
              href={consultationLink}
              className={`inline-flex items-center gap-1.5 px-6 py-2.5 font-bold text-xs rounded-lg transition-colors shadow ${theme.btn}`}
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
  // LAYOUT B: CORPORATE SPLIT-SCREEN
  // ==========================================
  const renderSplitScreenSection = (sectionId: string) => {
    if (!visible.includes(sectionId)) return null

    switch (sectionId) {
      case 'services':
        return (
          <div key="services" className="space-y-6">
            <h2 className={`text-xl font-bold border-b pb-2 ${theme.isDark ? 'text-white border-zinc-800' : 'text-zinc-900 border-zinc-200'}`}>
              Solutions &amp; Capabilities
            </h2>
            <div className="space-y-4">
              {services.map(s => {
                const ServiceIcon = iconMap[s.icon || 'Phone'] || Phone
                return (
                  <div key={s.id} className={`p-4 rounded-xl border flex items-start gap-4 transition-all ${theme.cardBg}`}>
                    <div className={`p-2.5 rounded-lg ${theme.accentBg} ${theme.accent}`}>
                      <ServiceIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className={`font-bold text-sm ${theme.isDark ? 'text-white' : 'text-zinc-900'}`}>{s.title}</h4>
                      <p className={`text-[11px] mt-1 leading-relaxed ${theme.text}`}>{s.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )
      case 'about':
        return (
          <div key="about" className="space-y-6">
            <h2 className={`text-xl font-bold border-b pb-2 ${theme.isDark ? 'text-white border-zinc-800' : 'text-zinc-900 border-zinc-200'}`}>
              About Our Practice
            </h2>
            <div className="space-y-4">
              {bio.slice(1).map((para, i) => (
                <p key={i} className={`text-xs leading-relaxed ${theme.text}`}>{para}</p>
              ))}
            </div>
            <div className={`p-4 rounded-xl border ${theme.cardBg}`}>
              <h4 className={`font-bold text-xs mb-3 ${theme.isDark ? 'text-white' : 'text-zinc-900'}`}>Core Competencies</h4>
              <ul className="space-y-2">
                {skills.map((skill, index) => (
                  <li key={index} className={`flex items-center text-xs ${theme.isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
                    <CheckCircle className={`w-3.5 h-3.5 mr-2.5 flex-shrink-0 ${theme.accent}`} />
                    <span>{skill}</span>
                  </li>
                ))}
              </ul>
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
          <header key="hero" className="max-w-2xl mx-auto py-16 border-b border-zinc-200 dark:border-zinc-800">
            <h1 className={`text-3xl sm:text-4xl font-extrabold tracking-tight mb-4 ${theme.isDark ? 'text-white' : 'text-zinc-900'}`}>
              {title}
            </h1>
            <p className={`text-sm sm:text-base mb-8 leading-relaxed max-w-lg ${theme.text}`}>
              {bio[0]}
            </p>
            <a
              href={consultationLink}
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
            <h2 className={`text-base font-bold uppercase tracking-wider mb-8 ${theme.isDark ? 'text-white' : 'text-zinc-900'}`}>
              Selected Works
            </h2>
            <div className="space-y-8">
              {services.map((s, idx) => (
                <div key={s.id} className="flex gap-4 pb-6 border-b border-zinc-100 dark:border-zinc-900 last:border-0 last:pb-0">
                  <span className="text-xs font-semibold text-zinc-400 font-mono">0{idx + 1}.</span>
                  <div>
                    <h3 className={`font-bold text-base mb-1.5 ${theme.isDark ? 'text-white' : 'text-zinc-900'}`}>{s.title}</h3>
                    <p className={`text-xs leading-relaxed ${theme.text}`}>{s.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )
      case 'about':
        return (
          <section key="about" className="max-w-2xl mx-auto py-16 border-b border-zinc-200 dark:border-zinc-800">
            <h2 className={`text-base font-bold uppercase tracking-wider mb-6 ${theme.isDark ? 'text-white' : 'text-zinc-900'}`}>
              Profile Info
            </h2>
            <div className="space-y-4 text-xs leading-relaxed">
              {bio.slice(1).map((para, i) => (
                <p key={i} className={theme.text}>{para}</p>
              ))}
              <div className="pt-4">
                <h4 className={`font-bold text-[10px] uppercase tracking-wider mb-2.5 ${theme.isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
                  Competencies
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {skills.map((skill, index) => (
                    <span 
                      key={index} 
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium border ${
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
          <section key="consultation" className="max-w-2xl mx-auto py-16 text-center">
            <h2 className={`text-xl font-bold mb-2 ${theme.isDark ? 'text-white' : 'text-zinc-900'}`}>Let's Connect</h2>
            <p className={`text-xs mb-5 max-w-xs mx-auto ${theme.text}`}>Book a call to review your automation operations.</p>
            <a
              href={consultationLink}
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
  // RENDER DYNAMIC CANVAS LAYOUT ROUTER
  // ==========================================
  return (
    <div className={`min-h-screen flex flex-col selection:bg-blue-600/30 overflow-x-hidden relative ${theme.bg} ${theme.font} select-none`}>
      
      {/* Background glow animations */}
      {theme.layoutType === 'modern_dark' && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[400px] opacity-25 pointer-events-none z-0">
          <div className={`absolute inset-0 bg-gradient-to-b via-transparent blur-3xl rounded-full ${theme.glow}`} />
        </div>
      )}

      {/* Dynamic Header / Navbar */}
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
          <div className="mx-auto px-6 py-8 max-w-5xl relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left sticky column */}
              <div className="lg:col-span-4 space-y-4">
                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ring-1 ring-inset ${theme.accentBg} ${theme.accent} ${theme.accentBorder}`}>
                  Corporate Style
                </span>
                <h1 className={`text-2xl font-extrabold tracking-tight leading-tight ${theme.isDark ? 'text-white' : 'text-zinc-900'}`}>
                  {title}
                </h1>
                <p className={`text-xs leading-relaxed ${theme.text}`}>
                  {bio[0]}
                </p>
                <div className="pt-2">
                  <span className={`inline-flex items-center justify-center gap-1.5 py-2 px-4 font-bold text-[10px] rounded-lg ${theme.btn}`}>
                    <span>{ctaText}</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>

              {/* Right scrollable column */}
              <div className="lg:col-span-8 space-y-12">
                {layout.map((sectionId) => renderSplitScreenSection(sectionId))}
              </div>
            </div>
          </div>
        ) : theme.layoutType === 'minimalist_list' ? (
          <div className="mx-auto px-6 py-8 relative z-10">
            {layout.map((sectionId) => renderMinimalistListSection(sectionId))}
          </div>
        ) : (
          <div className="w-full">
            {layout.map((sectionId) => renderModernDarkSection(sectionId))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className={`border-t py-6 text-center text-[10px] relative z-10 ${theme.isDark ? 'border-white/5 text-zinc-500' : 'border-zinc-200 text-zinc-600'}`}>
        <div className="mx-auto px-6 flex items-center justify-between max-w-5xl gap-4">
          <p>© {new Date().getFullYear()} {companyName}. All rights reserved.</p>
          <div className="flex gap-3">
            <Linkedin className="w-3.5 h-3.5" />
            <Github className="w-3.5 h-3.5" />
            <Twitter className="w-3.5 h-3.5" />
          </div>
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
