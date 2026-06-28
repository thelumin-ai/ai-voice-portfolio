'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { DEFAULT_CONTENT } from '../default-content'
import { THEME_CONFIG } from '../theme'
import { Phone, Mail, MapPin } from 'lucide-react'

export default function AboutPage() {
  const [content] = useState(DEFAULT_CONTENT)
  const pathname = usePathname() || ''

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

  return (
    <div className={`min-h-screen bg-[#fafbfe] text-slate-800 ${THEME_CONFIG.font} overflow-x-hidden`}>
      
      {/* Utility Top Bar */}
      <div className="w-full bg-[#0b1c3c] text-slate-300 text-[10px] font-semibold py-2.5 border-b border-white/5 relative z-40">
        <div className="max-w-[1280px] mx-auto px-6 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#f28500]" />
            <span>{content.header.address}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-[#f28500]" />
            <span>{content.header.phone}</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <nav className="w-full bg-[#ffffff] border-b border-slate-200 sticky top-0 z-45 shadow-sm">
        <div className="max-w-[1280px] mx-auto px-6 h-20 flex items-center justify-between">
          <Link href={getPathWithPrefix('/')} className="flex flex-col text-left">
            <span className="font-black text-lg tracking-wider text-[#0b1c3c]">
              {content.header.logoText}
            </span>
            <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">
              {content.header.slogan}
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-8 text-[11px] font-bold tracking-wider text-slate-655">
            <Link href={getPathWithPrefix('/')} className="hover:text-slate-900 transition-colors">HOME</Link>
            <Link href={getPathWithPrefix('/about')} className="hover:text-slate-900 transition-colors text-[#f28500]">ABOUT US</Link>
            <Link href={getPathWithPrefix('/services')} className="hover:text-slate-900 transition-colors">PRODUCTS</Link>
            <Link href={getPathWithPrefix('/contact')} className="hover:text-slate-900 transition-colors">CONTACT US</Link>
          </div>

          <Link href={getPathWithPrefix('/contact')} className="px-5 py-2.5 bg-[#f28500] hover:bg-[#d97700] text-white font-extrabold text-[10px] tracking-wider rounded uppercase transition-colors shadow">
            {content.header.quoteText}
          </Link>
        </div>
      </nav>

      {/* Banner */}
      <section className="py-16 bg-slate-100/50 border-b border-slate-200 text-center">
        <div className="max-w-[1280px] mx-auto px-6 space-y-3">
          <span className="text-[10px] font-bold text-[#f28500] tracking-widest uppercase block">
            {content.about.bannerSub}
          </span>
          <h1 className="text-3xl font-black text-[#0b1c3c] leading-tight">
            {content.about.bannerHeading}
          </h1>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 bg-white">
        <div className="max-w-[1000px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-[#0b1c3c] leading-tight">
              {content.about.storyHeading}
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed">
              {content.about.storyText}
            </p>
          </div>
          <div className="h-64 bg-slate-100 rounded-2xl overflow-hidden shadow-md relative select-none pointer-events-none">
            <img 
              src="https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=600"
              alt="Industrial extruders"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Standards */}
      <section className="py-20 border-t border-slate-200 bg-[#fafbfe]">
        <div className="max-w-[1280px] mx-auto px-6 space-y-12">
          <div className="text-center max-w-xl mx-auto">
            <h2 className="text-2xl font-black text-[#0b1c3c] leading-tight">
              {content.about.valuesHeading}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {content.about.valuesList.map((val, idx) => (
              <div key={idx} className="bg-white border border-slate-200 p-8 rounded-xl shadow-sm space-y-3">
                <span className="inline-block p-3 rounded bg-[#f28500]/5 text-[#f28500] font-bold text-xs">
                  0{idx + 1}
                </span>
                <h3 className="font-extrabold text-sm text-[#0b1c3c]">{val.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0b1c3c] text-slate-400 py-12 border-t border-white/5 text-xs relative z-10 text-center">
        <p>© {new Date().getFullYear()} {content.header.logoText}. All rights reserved.</p>
      </footer>

    </div>
  )
}
