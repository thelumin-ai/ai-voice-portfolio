'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { DEFAULT_CONTENT } from './default-content'
import { THEME_CONFIG } from './theme'
import { 
  Phone, 
  Search, 
  Menu, 
  Play, 
  Edit3, 
  Eye, 
  ArrowRight,
  TrendingUp,
  Layers,
  Code,
  Globe
} from 'lucide-react'

export default function Agency002Template() {
  const [content, setContent] = useState(DEFAULT_CONTENT)
  const [isEditing, setIsEditing] = useState(false)
  const pathname = usePathname() || ''

  // Dynamic route prefix compiler
  const getPathWithPrefix = (path: string) => {
    if (pathname.startsWith('/templates/agency-002/preview')) {
      return `/templates/agency-002/preview${path === '/' ? '' : path}`
    }
    if (pathname.startsWith('/templates/agency-002')) {
      return `/templates/agency-002${path === '/' ? '' : path}`
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

  const handleMetricChange = (index: number, field: string, value: string) => {
    setContent((prev: any) => {
      const newMetrics = [...prev.home.metrics]
      newMetrics[index] = { ...newMetrics[index], [field]: value }
      return {
        ...prev,
        home: {
          ...prev.home,
          metrics: newMetrics
        }
      }
    })
  }

  return (
    <div className={`min-h-screen bg-[#ffffff] text-slate-800 ${THEME_CONFIG.font} selection:bg-[#4e31aa]/20 overflow-x-hidden relative`}>
      
      {/* Interactive Mode Control Overlay */}
      <div className="fixed bottom-6 left-6 z-50 bg-[#0f172a] text-white px-4 py-3 rounded-full flex items-center gap-3 shadow-2xl border border-slate-800">
        <span className="text-[10px] font-sans font-bold tracking-wider uppercase text-slate-400">
          Sandbox Editor:
        </span>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-sans font-semibold transition-all cursor-pointer ${
            isEditing 
              ? 'bg-[#4e31aa] text-white font-bold' 
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

      {/* 1. Header Navigation */}
      <nav className="w-full bg-[#ffffff]/90 border-b border-slate-100 sticky top-0 z-45 backdrop-blur-md">
        <div className="max-w-[1280px] mx-auto px-6 h-20 flex items-center justify-between">
          <Link href={getPathWithPrefix('/')} className="flex items-center gap-2">
            <div className="w-6.5 h-6.5 rounded-lg bg-gradient-to-tr from-amber-500 to-[#4e31aa] flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            {isEditing ? (
              <input
                type="text"
                value={content.header.logoText}
                onClick={(e) => e.preventDefault()}
                onChange={(e) => handleTextChange('header', 'logoText', e.target.value)}
                className="bg-white border border-slate-300 rounded p-1 text-sm font-bold text-slate-900 w-24"
              />
            ) : (
              <span className="font-extrabold text-xl tracking-tight text-slate-900">
                {content.header.logoText}
              </span>
            )}
          </Link>

          <div className="hidden lg:flex items-center gap-8 text-[11px] font-bold tracking-wider text-slate-650">
            <Link href={getPathWithPrefix('/')} className="hover:text-slate-900 transition-colors text-[#4e31aa]">HOME</Link>
            <Link href={getPathWithPrefix('/about')} className="hover:text-slate-900 transition-colors">ABOUT</Link>
            <Link href={getPathWithPrefix('/services')} className="hover:text-slate-900 transition-colors">SERVICES</Link>
            <Link href={getPathWithPrefix('/contact')} className="hover:text-slate-900 transition-colors">CONTACT US</Link>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-2 text-[11px] font-bold text-slate-650 border-r border-slate-200 pr-6">
              <span className="text-slate-400">Call Us:</span>
              {isEditing ? (
                <input
                  type="text"
                  value={content.header.phone}
                  onChange={(e) => handleTextChange('header', 'phone', e.target.value)}
                  className="bg-white border border-slate-300 rounded p-0.5 w-32 text-slate-850"
                />
              ) : (
                <span className="text-slate-900 font-extrabold">{content.header.phone}</span>
              )}
            </div>

            <div className="flex items-center gap-4 text-slate-600">
              <Search className="w-4.5 h-4.5 cursor-pointer hover:text-slate-900" />
              <Menu className="w-5 h-5 cursor-pointer hover:text-slate-900" />
            </div>
          </div>
        </div>
      </nav>

      {/* 2. Hero Section */}
      <section className="relative py-16 lg:py-24 bg-[#ffffff]">
        <div className="max-w-[1280px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text */}
          <div className="lg:col-span-6 space-y-6">
            <span className="inline-block text-[10px] font-extrabold text-[#4e31aa] tracking-widest bg-[#4e31aa]/5 px-3 py-1 rounded-md">
              {content.home.badge}
            </span>

            {isEditing ? (
              <textarea
                value={content.home.heading}
                onChange={(e) => handleTextChange('home', 'heading', e.target.value)}
                className="w-full bg-white border border-slate-300 rounded p-2 text-3xl sm:text-5xl font-extrabold text-slate-900 leading-tight"
                rows={2}
              />
            ) : (
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight tracking-tight">
                {content.home.heading}
              </h1>
            )}

            {isEditing ? (
              <textarea
                value={content.home.subheading}
                onChange={(e) => handleTextChange('home', 'subheading', e.target.value)}
                className="w-full bg-white border border-slate-300 rounded p-2 text-slate-600 text-sm leading-relaxed"
                rows={2}
              />
            ) : (
              <p className="text-slate-500 text-base sm:text-lg leading-relaxed max-w-lg">
                {content.home.subheading}
              </p>
            )}

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link href={getPathWithPrefix('/contact')} className="px-6 py-3.5 bg-[#4e31aa] hover:bg-[#3b238c] text-white text-xs font-bold tracking-widest rounded-xl transition-all shadow-lg shadow-purple-500/10">
                {content.home.ctaText}
              </Link>
              
              <div className="flex items-center gap-2.5 cursor-pointer group">
                <span className="w-10 h-10 rounded-full bg-amber-500 hover:bg-amber-600 flex items-center justify-center shadow text-white transition-all group-hover:scale-105">
                  <Play className="w-4 h-4 fill-white ml-0.5" />
                </span>
                <span className="text-xs font-bold text-slate-700 group-hover:text-[#4e31aa] transition-colors">
                  {content.home.videoText}
                </span>
              </div>
            </div>
          </div>

          {/* Right curved masked team image container */}
          <div className="lg:col-span-6 flex justify-center relative select-none pointer-events-none">
            <div className="w-[300px] h-[300px] sm:w-[420px] sm:h-[420px] bg-slate-100 rounded-bl-[160px] rounded-tr-[120px] overflow-hidden shadow-2xl relative border-4 border-white">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#4e31aa]/10 to-transparent z-10" />
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800" 
                alt="Digital Agency Team Workspace" 
                className="w-full h-full object-cover scale-105"
              />
            </div>
            {/* Background elements */}
            <span className="absolute top-1/2 -left-6 w-12 h-12 rounded-full bg-amber-500/10 -z-10" />
            <span className="absolute bottom-6 -right-4 w-8 h-8 rounded-full bg-purple-500/10 -z-10" />
          </div>

        </div>
      </section>

      {/* 3. Care Features Grid Section */}
      <section className="py-20 bg-slate-50 border-t border-b border-slate-100 relative z-10">
        <div className="max-w-[1280px] mx-auto px-6 space-y-16">
          <div className="text-center max-w-xl mx-auto space-y-3">
            <span className="text-[10px] font-extrabold text-amber-600 tracking-widest uppercase block">
              {content.home.toolsCategory}
            </span>
            {isEditing ? (
              <input
                type="text"
                value={content.home.toolsHeading}
                onChange={(e) => handleTextChange('home', 'toolsHeading', e.target.value)}
                className="bg-white border border-slate-300 rounded p-1 text-center font-bold text-slate-900 text-2xl w-full"
              />
            ) : (
              <h2 className="text-3xl font-extrabold text-slate-900 leading-tight">
                {content.home.toolsHeading}
              </h2>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Discover, Explore Product', desc: 'Analyzing user flows, exploring product requirements.', color: 'bg-blue-500/10 text-blue-500', icon: Globe },
              { title: 'Art Direction & Brand', desc: 'Establishing visual design systems and brand directions.', color: 'bg-amber-500/10 text-amber-500', icon: Layers },
              { title: 'UX, Design & Build', desc: 'Building responsive interfaces and clean React codebases.', color: 'bg-rose-500/10 text-rose-500', icon: Code },
              { title: 'SEO & Marketing Campaigns', desc: 'Auditing keyword visibility and driving active growth.', color: 'bg-emerald-500/10 text-emerald-500', icon: TrendingUp }
            ].map((tool, idx) => {
              const IconComp = tool.icon
              return (
                <div key={idx} className="bg-white border border-slate-100 p-6 rounded-2xl shadow-xl shadow-slate-200/50 hover:shadow-[#4e31aa]/5 hover:-translate-y-1 transition-all space-y-4">
                  <div className={`p-3.5 rounded-xl inline-block ${tool.color}`}>
                    <IconComp className="w-5 h-5" />
                  </div>
                  <h3 className="font-extrabold text-sm text-slate-900">{tool.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{tool.desc}</p>
                  <Link href={getPathWithPrefix('/services')} className="inline-flex items-center gap-1.5 text-[10px] font-extrabold tracking-wider text-[#4e31aa] hover:underline pt-2">
                    <span>READ MORE</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* 4. Traffic Boost & Stats Split Section */}
      <section className="py-20 bg-[#ffffff] relative z-10">
        <div className="max-w-[1280px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left copy */}
          <div className="lg:col-span-6 space-y-6">
            <span className="text-[10px] font-extrabold text-[#4e31aa] tracking-widest uppercase block">
              {content.home.statsCategory}
            </span>

            {isEditing ? (
              <textarea
                value={content.home.statsHeading}
                onChange={(e) => handleTextChange('home', 'statsHeading', e.target.value)}
                className="w-full bg-white border border-slate-300 rounded p-2 text-2xl font-bold text-slate-900"
                rows={2}
              />
            ) : (
              <h2 className="text-3xl font-extrabold text-slate-900 leading-tight">
                {content.home.statsHeading}
              </h2>
            )}

            {isEditing ? (
              <textarea
                value={content.home.statsDesc}
                onChange={(e) => handleTextChange('home', 'statsDesc', e.target.value)}
                className="w-full bg-white border border-slate-300 rounded p-2 text-slate-500 text-xs"
                rows={4}
              />
            ) : (
              <p className="text-slate-500 text-sm leading-relaxed">
                {content.home.statsDesc}
              </p>
            )}

            <div className="pt-2">
              <Link href={getPathWithPrefix('/about')} className="px-6 py-3 bg-[#4e31aa] hover:bg-[#3b238c] text-white text-[10px] font-bold tracking-widest rounded-xl transition-all shadow-md">
                {content.home.statsBtnText}
              </Link>
            </div>
          </div>

          {/* Right metrics column */}
          <div className="lg:col-span-6 space-y-6 bg-slate-50 p-8 rounded-2xl border border-slate-100">
            {content.home.metrics.map((met, idx) => (
              <div key={idx} className="flex gap-4 items-start border-b border-slate-200/60 pb-6 last:border-0 last:pb-0">
                <div className="w-16 flex-shrink-0">
                  {isEditing ? (
                    <input
                      type="text"
                      value={met.value}
                      onChange={(e) => handleMetricChange(idx, 'value', e.target.value)}
                      className="bg-white border border-slate-300 rounded p-1 text-2xl font-extrabold text-[#4e31aa] text-center w-full"
                    />
                  ) : (
                    <span className="text-2xl sm:text-3xl font-extrabold text-[#4e31aa] block">
                      {met.value}
                    </span>
                  )}
                </div>
                <div className="space-y-1">
                  {isEditing ? (
                    <input
                      type="text"
                      value={met.label}
                      onChange={(e) => handleMetricChange(idx, 'label', e.target.value)}
                      className="bg-white border border-slate-300 rounded p-0.5 font-bold text-slate-800 text-[10px] w-full"
                    />
                  ) : (
                    <h4 className="font-bold text-[10px] text-slate-800 tracking-wider uppercase">
                      {met.label}
                    </h4>
                  )}

                  {isEditing ? (
                    <textarea
                      value={met.desc}
                      onChange={(e) => handleMetricChange(idx, 'desc', e.target.value)}
                      className="bg-white border border-slate-300 rounded p-1 text-slate-500 text-[10px] w-full"
                      rows={2}
                    />
                  ) : (
                    <p className="text-[11px] text-slate-550 leading-relaxed">
                      {met.desc}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 5. Footer */}
      <footer className="bg-slate-950 text-slate-500 py-12 border-t border-slate-900 text-xs font-sans">
        <div className="max-w-[1280px] mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <p>© {new Date().getFullYear()} {content.header.logoText} Digital Agency. All rights reserved.</p>
          
          <div className="flex gap-6 font-bold uppercase tracking-wider text-[10px]">
            <Link href={getPathWithPrefix('/about')} className="hover:text-white transition-colors">About Us</Link>
            <Link href={getPathWithPrefix('/services')} className="hover:text-white transition-colors">Services</Link>
            <Link href={getPathWithPrefix('/contact')} className="hover:text-white transition-colors">Contact</Link>
          </div>
        </div>
      </footer>

    </div>
  )
}
