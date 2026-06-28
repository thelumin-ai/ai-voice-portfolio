'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { DEFAULT_CONTENT } from '../default-content'
import { THEME_CONFIG } from '../theme'
import { Phone, Search, User, Heart, Sparkles, Cpu, Bot } from 'lucide-react'

export default function ServicesPage() {
  const [content] = useState(DEFAULT_CONTENT)
  const pathname = usePathname() || ''

  const getPathWithPrefix = (path: string) => {
    if (pathname.startsWith('/templates/nonprofit-001/preview')) {
      return `/templates/nonprofit-001/preview${path === '/' ? '' : path}`
    }
    if (pathname.startsWith('/templates/nonprofit-001')) {
      return `/templates/nonprofit-001${path === '/' ? '' : path}`
    }
    const sitesMatch = pathname.match(/^\/sites\/([^/]+)/)
    if (sitesMatch) {
      return `/sites/${sitesMatch[1]}${path === '/' ? '' : path}`
    }
    return path
  }

  return (
    <div className={`min-h-screen ${THEME_CONFIG.bg} ${THEME_CONFIG.font} overflow-x-hidden`}>
      
      {/* Navigation */}
      <nav className="w-full bg-[#faf9f6]/95 border-b border-stone-200 sticky top-0 z-40 backdrop-blur">
        <div className="max-w-[1240px] mx-auto px-6 h-20 flex items-center justify-between">
          <Link href={getPathWithPrefix('/')} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-500 via-[#d97706] to-emerald-500 p-0.5 flex items-center justify-center">
              <Heart className="w-4 h-4 text-white fill-white" />
            </div>
            <span className="font-serif font-extrabold text-xl tracking-tight text-stone-900">
              {content.header.logoText}
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-8 text-[10px] font-sans font-extrabold tracking-widest text-stone-600">
            <Link href={getPathWithPrefix('/')} className="hover:text-stone-900 transition-colors">HOME</Link>
            <Link href={getPathWithPrefix('/about')} className="hover:text-stone-900 transition-colors">ABOUT</Link>
            <Link href={getPathWithPrefix('/services')} className="hover:text-stone-900 transition-colors text-[#d97706]">SERVICES</Link>
            <Link href={getPathWithPrefix('/contact')} className="hover:text-stone-900 transition-colors">CONTACT US</Link>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-2 text-[10px] font-sans font-bold text-stone-750">
              <Phone className="w-4 h-4 text-[#d97706]" />
              <span>{content.header.phone}</span>
            </div>

            <div className="flex items-center gap-4 text-stone-600">
              <Search className="w-4.5 h-4.5 cursor-pointer hover:text-stone-900" />
              <User className="w-4.5 h-4.5 cursor-pointer hover:text-stone-900" />
            </div>

            <Link href={getPathWithPrefix('/contact')} className={`px-5 py-2.5 ${THEME_CONFIG.btn} font-sans font-extrabold text-[9px] tracking-widest rounded transition-colors uppercase`}>
              {content.header.donateText}
            </Link>
          </div>
        </div>
      </nav>

      {/* Banner */}
      <section className="py-16 bg-[#faf9f6] border-b border-stone-200">
        <div className="max-w-[1240px] mx-auto px-6 text-center space-y-4">
          <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#d97706]">
            {content.services.bannerSub}
          </span>
          <h1 className="text-4xl font-serif font-extrabold text-stone-900 leading-tight">
            {content.services.bannerHeading}
          </h1>
          <p className="text-sm text-stone-500 max-w-md mx-auto leading-relaxed">
            {content.services.servicesIntro}
          </p>
        </div>
      </section>

      {/* Programs grid */}
      <section className="py-20 bg-white">
        <div className="max-w-[1240px] mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          {content.programs.list.map((prog, idx) => (
            <div key={idx} className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col justify-between">
              <div className="h-40 bg-stone-100 overflow-hidden relative select-none pointer-events-none">
                <img src={prog.image} alt={prog.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-6 space-y-2 flex-grow text-center">
                <h3 className="font-serif font-bold text-base text-stone-900">{prog.title}</h3>
                <p className="text-xs text-stone-600 leading-relaxed">{prog.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Process workflow */}
      <section className="py-20 border-t border-stone-200 bg-[#faf9f6]">
        <div className="max-w-[1240px] mx-auto px-6 space-y-12">
          <div className="text-center max-w-xl mx-auto">
            <h2 className="text-2xl font-serif font-extrabold text-stone-900">
              {content.services.processHeading}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {content.services.processSteps.map((step, idx) => (
              <div key={idx} className="flex gap-4 items-start bg-white border border-stone-200 p-6 rounded-2xl shadow-sm">
                <span className="font-serif font-extrabold text-2xl text-[#d97706]">
                  {step.step}
                </span>
                <div className="space-y-2">
                  <h3 className="font-serif font-bold text-sm text-stone-900">{step.title}</h3>
                  <p className="text-xs text-stone-600 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-white border-t border-stone-200">
        <div className="max-w-3xl mx-auto px-6 text-center space-y-6">
          <h2 className="text-2xl font-serif font-extrabold text-stone-900">{content.services.benefitsHeading}</h2>
          <p className="text-stone-600 text-sm leading-relaxed max-w-xl mx-auto">{content.services.benefitsText}</p>
          <div className="pt-2">
            <Link href={getPathWithPrefix('/contact')} className={`inline-block px-6 py-3.5 ${THEME_CONFIG.btn} font-sans font-extrabold text-[10px] tracking-widest rounded transition-colors uppercase`}>
              PARTICIPATE NOW
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-950 text-stone-500 py-12 border-t border-stone-900 text-xs font-sans">
        <div className="max-w-[1240px] mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <p>© {new Date().getFullYear()} {content.header.logoText} Global Aid Network. All rights reserved.</p>
          
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
