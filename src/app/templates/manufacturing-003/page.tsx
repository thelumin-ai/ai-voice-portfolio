'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { DEFAULT_CONTENT } from './default-content'
import { THEME_CONFIG } from './theme'
import { 
  Phone, 
  Mail, 
  MapPin, 
  Edit3, 
  Eye, 
  ArrowRight,
  Shield,
  Layers,
  Cpu,
  Zap,
  Droplet
} from 'lucide-react'

export default function Manufacturing003Template() {
  const [content, setContent] = useState(DEFAULT_CONTENT)
  const [isEditing, setIsEditing] = useState(false)
  const pathname = usePathname() || ''

  // Dynamic route prefix compiler
  const getPathWithPrefix = (path: string) => {
    if (pathname.startsWith('/templates/manufacturing-003/preview')) {
      return `/templates/manufacturing-003/preview${path === '/' ? '' : path}`
    }
    if (pathname.startsWith('/templates/manufacturing-003')) {
      return `/templates/manufacturing-003${path === '/' ? '' : path}`
    }
    const sitesMatch = pathname.match(/^\/sites\/([^/]+)/)
    if (sitesMatch) {
      return `/sites/${sitesMatch[1]}${path === '/' ? '' : path}`
    }
    return path
  }

  // Edit handlers
  const handleTextChange = (section: string, field: string, value: string) => {
    setContent((prev: any) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
  }

  const handleStatChange = (index: number, field: string, value: string) => {
    setContent((prev: any) => {
      const newStats = [...prev.home.stats]
      newStats[index] = { ...newStats[index], [field]: value }
      return {
        ...prev,
        home: {
          ...prev.home,
          stats: newStats
        }
      }
    })
  }

  return (
    <div className={`min-h-screen bg-[#fafbfe] text-slate-800 ${THEME_CONFIG.font} selection:bg-[#f28500]/20 overflow-x-hidden relative`}>
      
      {/* Interactive Mode Control Overlay */}
      <div className="fixed bottom-6 left-6 z-50 bg-[#0f172a] text-white px-4 py-3 rounded-full flex items-center gap-3 shadow-2xl border border-slate-800">
        <span className="text-[10px] font-sans font-bold tracking-wider uppercase text-slate-400">
          Sandbox Editor:
        </span>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-sans font-semibold transition-all cursor-pointer ${
            isEditing 
              ? 'bg-[#f28500] text-white font-bold' 
              : 'bg-slate-800 text-slate-350 hover:bg-slate-700'
          }`}
        >
          {isEditing ? (
            <>
              <Edit3 className="w-3 h-3" />
              <span>Edit Mode Active</span>
            </>
          ) : (
            <>
              <Eye className="w-3 h-3" />
              <span>Interactive Preview</span>
            </>
          )}
        </button>
      </div>

      {/* 1. Utility Top Bar */}
      <div className="w-full bg-[#0b1c3c] text-slate-300 text-[10px] font-semibold py-2.5 border-b border-white/5 relative z-40">
        <div className="max-w-[1280px] mx-auto px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#f28500]" />
              <span>{content.header.address}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#f28500]" />
              <span>{content.header.phone}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#f28500]" />
              <span>{content.header.email}</span>
            </div>
          </div>
          <span className="text-slate-450 hover:text-white transition-colors cursor-pointer hidden sm:inline">ISO 9001:2015 Certified</span>
        </div>
      </div>

      {/* 2. Main Header Navigation */}
      <nav className="w-full bg-[#ffffff] border-b border-slate-200 sticky top-0 z-45 shadow-sm">
        <div className="max-w-[1280px] mx-auto px-6 h-20 flex items-center justify-between">
          <Link href={getPathWithPrefix('/')} className="flex flex-col text-left">
            {isEditing ? (
              <input
                type="text"
                value={content.header.logoText}
                onClick={(e) => e.preventDefault()}
                onChange={(e) => handleTextChange('header', 'logoText', e.target.value)}
                className="bg-white border border-slate-300 rounded p-1 text-sm font-extrabold text-[#0b1c3c] w-32"
              />
            ) : (
              <span className="font-black text-lg tracking-wider text-[#0b1c3c]">
                {content.header.logoText}
              </span>
            )}
            <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">
              {content.header.slogan}
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-8 text-[11px] font-bold tracking-wider text-slate-650">
            <Link href={getPathWithPrefix('/')} className="hover:text-slate-900 transition-colors text-[#f28500]">HOME</Link>
            <Link href={getPathWithPrefix('/about')} className="hover:text-slate-900 transition-colors">ABOUT US</Link>
            <Link href={getPathWithPrefix('/services')} className="hover:text-slate-900 transition-colors">PRODUCTS</Link>
            <Link href={getPathWithPrefix('/contact')} className="hover:text-slate-900 transition-colors">CONTACT US</Link>
          </div>

          <Link href={getPathWithPrefix('/contact')} className="px-5 py-2.5 bg-[#f28500] hover:bg-[#d97700] text-white font-extrabold text-[10px] tracking-wider rounded uppercase transition-colors shadow">
            {content.header.quoteText}
          </Link>
        </div>
      </nav>

      {/* 3. Hero Section */}
      <section className="relative py-16 lg:py-24 bg-gradient-to-b from-slate-100/50 to-[#fafbfe]">
        <div className="max-w-[1280px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text */}
          <div className="lg:col-span-6 space-y-6">
            {isEditing ? (
              <textarea
                value={content.home.heading}
                onChange={(e) => handleTextChange('home', 'heading', e.target.value)}
                className="w-full bg-white border border-slate-300 rounded p-2 text-3xl font-bold text-[#0b1c3c] leading-tight"
                rows={2}
              />
            ) : (
              <h1 className="text-4xl sm:text-5xl font-black text-[#0b1c3c] leading-tight tracking-tight">
                Your Trusted Partner for <br />
                <span className="text-[#f28500]">PVC Pipes &amp; Fittings</span>
              </h1>
            )}

            {isEditing ? (
              <textarea
                value={content.home.subheading}
                onChange={(e) => handleTextChange('home', 'subheading', e.target.value)}
                className="w-full bg-white border border-slate-300 rounded p-2 text-slate-600 text-sm"
                rows={2}
              />
            ) : (
              <p className="text-slate-500 text-base sm:text-lg leading-relaxed max-w-lg">
                {content.home.subheading}
              </p>
            )}

            <div className="pt-2 flex flex-wrap gap-4 text-xs font-bold tracking-wider uppercase">
              <Link href={getPathWithPrefix('/services')} className="px-6 py-3.5 bg-[#f28500] hover:bg-[#d97700] text-white rounded transition-colors shadow-md">
                {content.home.btnExplore}
              </Link>
              <Link href={getPathWithPrefix('/contact')} className="px-6 py-3.5 bg-white text-[#0b1c3c] hover:bg-slate-50 border border-[#0b1c3c]/10 rounded transition-colors shadow-sm">
                {content.home.btnBrochure}
              </Link>
            </div>
          </div>

          {/* Right Product illustration */}
          <div className="lg:col-span-6 flex justify-center relative select-none pointer-events-none pr-6">
            <div className="w-[320px] h-[220px] sm:w-[460px] sm:h-[300px] bg-slate-200 rounded-2xl overflow-hidden shadow-2xl relative border-2 border-slate-100">
              <img 
                src="https://images.unsplash.com/photo-1542013936693-8848e5740a9a?auto=format&fit=crop&q=80&w=800" 
                alt="PVC Pipes Stock Pile" 
                className="w-full h-full object-cover scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent" />
            </div>
            {/* Background elements */}
            <span className="absolute -bottom-6 -left-6 w-20 h-20 bg-amber-500/5 rounded-full -z-10" />
            <span className="absolute -top-6 -right-6 w-28 h-28 bg-[#0b1c3c]/5 rounded-full -z-10" />
          </div>

        </div>
      </section>

      {/* 4. Products Grid Section */}
      <section className="py-20 bg-white border-t border-b border-slate-100 relative z-10">
        <div className="max-w-[1280px] mx-auto px-6 space-y-16">
          <div className="text-center space-y-3">
            {isEditing ? (
              <input
                type="text"
                value={content.home.productsTitle}
                onChange={(e) => handleTextChange('home', 'productsTitle', e.target.value)}
                className="bg-white border border-slate-300 rounded p-1 text-center font-bold text-[#0b1c3c] text-2xl w-80 mx-auto"
              />
            ) : (
              <h2 className="text-3xl font-black text-[#0b1c3c]">
                {content.home.productsTitle}
              </h2>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {content.home.productsList.map((prod, idx) => (
              <div key={idx} className="bg-[#fafbfe] border border-slate-200/60 p-5 rounded-xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-[210px] text-center">
                <div className="space-y-3">
                  <div className="h-10 w-10 bg-[#0b1c3c]/5 text-[#0b1c3c] rounded-lg flex items-center justify-center mx-auto">
                    <Shield className="w-5 h-5 text-[#f28500]" />
                  </div>
                  <h3 className="font-extrabold text-xs text-[#0b1c3c]">{prod.title}</h3>
                  <p className="text-[10px] text-slate-500 leading-relaxed">{prod.desc}</p>
                </div>
                <Link href={getPathWithPrefix('/services')} className="text-[9px] font-bold text-[#f28500] hover:underline uppercase block tracking-wider">
                  LEARN MORE
                </Link>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link href={getPathWithPrefix('/services')} className="inline-block px-6 py-3 bg-[#f28500] hover:bg-[#d97700] text-white text-[10px] font-bold tracking-wider rounded uppercase transition-colors shadow">
              {content.home.productsBtn}
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Why Choose Us Split Section */}
      <section className="py-20 bg-[#fafbfe] relative z-10">
        <div className="max-w-[1280px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left factory image */}
          <div className="lg:col-span-5 flex justify-center relative select-none pointer-events-none">
            <div className="w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] bg-slate-200 rounded-2xl overflow-hidden shadow-2xl relative border-2 border-slate-100">
              <img 
                src="https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=600" 
                alt="Sarvam Pipes factory assembly" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Right Copy */}
          <div className="lg:col-span-7 space-y-6">
            {isEditing ? (
              <textarea
                value={content.home.whyTitle}
                onChange={(e) => handleTextChange('home', 'whyTitle', e.target.value)}
                className="w-full bg-white border border-slate-300 rounded p-2 text-2xl font-bold text-[#0b1c3c]"
                rows={2}
              />
            ) : (
              <h2 className="text-3xl font-black text-[#0b1c3c] leading-tight">
                {content.home.whyTitle}
              </h2>
            )}

            {isEditing ? (
              <textarea
                value={content.home.whyDesc}
                onChange={(e) => handleTextChange('home', 'whyDesc', e.target.value)}
                className="w-full bg-white border border-slate-300 rounded p-2 text-slate-550 text-xs"
                rows={4}
              />
            ) : (
              <p className="text-slate-550 text-xs sm:text-sm leading-relaxed">
                {content.home.whyDesc}
              </p>
            )}

            {/* Metrics Counter Banner */}
            <div className="grid grid-cols-3 gap-3 bg-[#f28500] text-white p-5 rounded-xl text-center">
              {content.home.stats.map((st, idx) => (
                <div key={idx} className="space-y-1">
                  {isEditing ? (
                    <input
                      type="text"
                      value={st.value}
                      onChange={(e) => handleStatChange(idx, 'value', e.target.value)}
                      className="bg-white border border-slate-300 rounded p-0.5 text-lg font-bold text-slate-800 text-center w-full"
                    />
                  ) : (
                    <span className="text-xl sm:text-2xl font-extrabold block font-sans">
                      {st.value}
                    </span>
                  )}
                  {isEditing ? (
                    <input
                      type="text"
                      value={st.label}
                      onChange={(e) => handleStatChange(idx, 'label', e.target.value)}
                      className="bg-white border border-slate-300 rounded p-0.5 font-bold text-slate-800 text-[8px] text-center w-full"
                    />
                  ) : (
                    <span className="text-[8px] font-bold uppercase tracking-wider block">
                      {st.label}
                    </span>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-2">
              <Link href={getPathWithPrefix('/about')} className="px-6 py-3.5 bg-[#0b1c3c] hover:bg-slate-850 text-white text-[10px] font-bold tracking-wider rounded uppercase transition-colors shadow">
                {content.home.whyBtn}
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* 6. Industries We Serve Grid */}
      <section className="py-20 bg-white border-t border-slate-100 relative z-10 text-center">
        <div className="max-w-[1280px] mx-auto px-6 space-y-16">
          <div className="space-y-3">
            {isEditing ? (
              <input
                type="text"
                value={content.home.industriesTitle}
                onChange={(e) => handleTextChange('home', 'industriesTitle', e.target.value)}
                className="bg-white border border-slate-300 rounded p-1 text-center font-bold text-[#0b1c3c] text-2xl w-80 mx-auto"
              />
            ) : (
              <h2 className="text-3xl font-black text-[#0b1c3c]">
                {content.home.industriesTitle}
              </h2>
            )}
            <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
              {content.home.industriesDesc}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            {[
              { title: 'Plumbing & Construction', icon: Layers },
              { title: 'Agriculture Irrigation', icon: Droplet },
              { title: 'Industrial Applications', icon: Cpu },
              { title: 'Electrical & Telecom', icon: Zap },
              { title: 'Sewerage & Drainage', icon: Shield }
            ].map((ind, idx) => {
              const IconComp = ind.icon
              return (
                <div key={idx} className="bg-[#fafbfe] border border-slate-200/60 p-6 rounded-xl space-y-3 shadow-sm text-center">
                  <div className="p-3 bg-[#f28500]/5 text-[#f28500] rounded-full inline-block">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <h3 className="font-extrabold text-xs text-[#0b1c3c]">{ind.title}</h3>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* 7. Footer */}
      <footer className="bg-[#0b1c3c] text-slate-400 py-16 border-t border-white/5 text-xs relative z-10">
        <div className="max-w-[1280px] mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 text-left mb-12">
          
          <div className="space-y-4">
            <h3 className="font-black text-lg text-white tracking-wider">{content.header.logoText}</h3>
            <p className="text-[11px] text-slate-400 leading-relaxed">{content.header.slogan}</p>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-xs uppercase tracking-wider text-white">Quick Links</h4>
            <div className="flex flex-col gap-2.5 text-[11px]">
              <Link href={getPathWithPrefix('/')} className="hover:text-white transition-colors">Home</Link>
              <Link href={getPathWithPrefix('/about')} className="hover:text-white transition-colors">About Us</Link>
              <Link href={getPathWithPrefix('/services')} className="hover:text-white transition-colors">Products</Link>
              <Link href={getPathWithPrefix('/contact')} className="hover:text-white transition-colors">Contact</Link>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-xs uppercase tracking-wider text-white">Products</h4>
            <div className="flex flex-col gap-2.5 text-[11px]">
              <span className="hover:text-white transition-colors cursor-pointer">uPVC Plumbing</span>
              <span className="hover:text-white transition-colors cursor-pointer">cPVC Fittings</span>
              <span className="hover:text-white transition-colors cursor-pointer">SWR Drainage</span>
              <span className="hover:text-white transition-colors cursor-pointer">Agri Irrigation</span>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-xs uppercase tracking-wider text-white">HQ Office</h4>
            <div className="space-y-3 text-[11px]">
              <div className="flex gap-2 items-center">
                <MapPin className="w-4 h-4 text-[#f28500] flex-shrink-0" />
                <span>{content.contact.address}</span>
              </div>
              <div className="flex gap-2 items-center">
                <Phone className="w-4 h-4 text-[#f28500] flex-shrink-0" />
                <span>{content.header.phone}</span>
              </div>
              <div className="flex gap-2 items-center">
                <Mail className="w-4 h-4 text-[#f28500] flex-shrink-0" />
                <span>{content.header.email}</span>
              </div>
            </div>
          </div>

        </div>

        <div className="max-w-[1280px] mx-auto px-6 border-t border-white/5 pt-8 text-center text-[10px] text-slate-500 font-semibold">
          <p>© {new Date().getFullYear()} {content.header.logoText}. All rights reserved.</p>
        </div>
      </footer>

    </div>
  )
}
