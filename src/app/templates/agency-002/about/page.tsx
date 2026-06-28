'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { DEFAULT_CONTENT } from '../default-content'
import { THEME_CONFIG } from '../theme'
import { Phone, Search, Menu, TrendingUp } from 'lucide-react'

export default function AboutPage() {
  const [content] = useState(DEFAULT_CONTENT)
  const pathname = usePathname() || ''

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

  return (
    <div className={`min-h-screen bg-[#ffffff] text-slate-800 ${THEME_CONFIG.font} overflow-x-hidden`}>
      
      {/* Navigation */}
      <nav className="w-full bg-[#ffffff]/90 border-b border-slate-100 sticky top-0 z-45 backdrop-blur-md">
        <div className="max-w-[1280px] mx-auto px-6 h-20 flex items-center justify-between">
          <Link href={getPathWithPrefix('/')} className="flex items-center gap-2">
            <div className="w-6.5 h-6.5 rounded-lg bg-gradient-to-tr from-amber-500 to-[#4e31aa] flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-slate-900">
              {content.header.logoText}
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-8 text-[11px] font-bold tracking-wider text-slate-650">
            <Link href={getPathWithPrefix('/')} className="hover:text-slate-900 transition-colors">HOME</Link>
            <Link href={getPathWithPrefix('/about')} className="hover:text-slate-900 transition-colors text-[#4e31aa]">ABOUT</Link>
            <Link href={getPathWithPrefix('/services')} className="hover:text-slate-900 transition-colors">SERVICES</Link>
            <Link href={getPathWithPrefix('/contact')} className="hover:text-slate-900 transition-colors">CONTACT US</Link>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-2 text-[11px] font-bold text-slate-655 border-r border-slate-200 pr-6">
              <span className="text-slate-400">Call Us:</span>
              <span className="text-slate-900 font-extrabold">{content.header.phone}</span>
            </div>

            <div className="flex items-center gap-4 text-slate-600">
              <Search className="w-4.5 h-4.5" />
              <Menu className="w-5 h-5" />
            </div>
          </div>
        </div>
      </nav>

      {/* Banner */}
      <section className="py-16 bg-slate-50 border-b border-slate-100 text-center">
        <div className="max-w-[1280px] mx-auto px-6 space-y-3">
          <span className="text-[10px] font-extrabold text-[#4e31aa] tracking-widest uppercase block">
            {content.about.bannerSub}
          </span>
          <h1 className="text-4xl font-extrabold text-slate-900 leading-tight">
            {content.about.bannerHeading}
          </h1>
        </div>
      </section>

      {/* Intro */}
      <section className="py-20 bg-white">
        <div className="max-w-[1000px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-2xl font-extrabold text-slate-900 leading-tight">
              {content.about.introHeading}
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed">
              {content.about.introText}
            </p>
          </div>
          <div className="h-64 bg-slate-100 rounded-2xl overflow-hidden shadow-md relative select-none pointer-events-none">
            <img 
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=600"
              alt="Team Work Session"
              className="w-full h-full object-cover scale-105"
            />
          </div>
        </div>
      </section>

      {/* Values Grid */}
      <section className="py-20 border-t border-slate-100 bg-[#ffffff]">
        <div className="max-w-[1280px] mx-auto px-6 space-y-12">
          <div className="text-center max-w-xl mx-auto">
            <h2 className="text-2xl font-extrabold text-slate-900 leading-tight">
              {content.about.valuesHeading}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {content.about.valuesList.map((val, idx) => (
              <div key={idx} className="bg-slate-50 border border-slate-100 p-8 rounded-2xl text-center space-y-3 shadow-md shadow-slate-200/50">
                <span className="w-10 h-10 rounded-full bg-[#4e31aa]/5 text-[#4e31aa] flex items-center justify-center font-bold text-xs mx-auto">
                  0{idx + 1}
                </span>
                <h3 className="font-extrabold text-sm text-slate-900">{val.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
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
