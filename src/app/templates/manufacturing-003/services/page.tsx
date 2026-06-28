'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { DEFAULT_CONTENT } from '../default-content'
import { THEME_CONFIG } from '../theme'
import { Phone, Mail, MapPin, Shield } from 'lucide-react'

export default function ServicesPage() {
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
            <Link href={getPathWithPrefix('/about')} className="hover:text-slate-900 transition-colors">ABOUT US</Link>
            <Link href={getPathWithPrefix('/services')} className="hover:text-slate-900 transition-colors text-[#f28500]">PRODUCTS</Link>
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
            {content.services.bannerSub}
          </span>
          <h1 className="text-3xl font-black text-[#0b1c3c] leading-tight">
            {content.services.bannerHeading}
          </h1>
          <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
            {content.services.introText}
          </p>
        </div>
      </section>

      {/* Products list */}
      <section className="py-20 bg-white">
        <div className="max-w-[1280px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          {content.home.productsList.map((prod, idx) => (
            <div key={idx} className="bg-slate-50 border border-slate-200/60 p-6 rounded-xl flex gap-4 items-start shadow-sm">
              <div className="p-3 bg-[#0b1c3c]/5 text-[#f28500] rounded-lg">
                <Shield className="w-5 h-5" />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-extrabold text-sm text-[#0b1c3c]">{prod.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{prod.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Process */}
      <section className="py-20 border-t border-slate-200 bg-[#fafbfe]">
        <div className="max-w-[1280px] mx-auto px-6 space-y-12">
          <div className="text-center max-w-xl mx-auto">
            <h2 className="text-2xl font-black text-[#0b1c3c] leading-tight">
              {content.services.processHeading}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {content.services.processSteps.map((step, idx) => (
              <div key={idx} className="flex gap-4 items-start bg-white border border-slate-200 p-6 rounded-xl shadow-sm">
                <span className="font-sans font-black text-2xl text-[#f28500]">
                  {step.step}
                </span>
                <div className="space-y-1">
                  <h3 className="font-extrabold text-sm text-[#0b1c3c]">{step.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>
                </div>
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
