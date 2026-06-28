'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { DEFAULT_CONTENT } from '../default-content'
import { THEME_CONFIG } from '../theme'
import { Phone, Search, User, Heart } from 'lucide-react'

export default function AboutPage() {
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
            <Link href={getPathWithPrefix('/about')} className="hover:text-stone-900 transition-colors text-[#d97706]">ABOUT</Link>
            <Link href={getPathWithPrefix('/services')} className="hover:text-stone-900 transition-colors">SERVICES</Link>
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
            {content.about.bannerSub}
          </span>
          <h1 className="text-4xl font-serif font-extrabold text-stone-900 leading-tight">
            {content.about.bannerHeading}
          </h1>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 bg-white">
        <div className="max-w-[1000px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-2xl font-serif font-extrabold text-stone-900">
              {content.about.storyHeading}
            </h2>
            <p className="text-stone-600 text-sm leading-relaxed">
              {content.about.storyText}
            </p>
          </div>
          <div className="h-64 bg-stone-150 rounded-2xl overflow-hidden shadow-sm relative select-none pointer-events-none">
            <img 
              src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=600"
              alt="Community aid"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-20 border-t border-stone-200">
        <div className="max-w-[1240px] mx-auto px-6 space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-3">
            <h2 className="text-2xl font-serif font-extrabold text-stone-900">{content.about.missionHeading}</h2>
            <p className="text-sm text-stone-600">{content.about.missionText}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {content.about.values.map((val, idx) => (
              <div key={idx} className="bg-white border border-stone-200 p-6 rounded-2xl shadow-sm text-center space-y-3">
                <span className="inline-block p-3 rounded-full bg-[#d97706]/10 text-[#d97706] font-bold text-sm font-sans">
                  {idx + 1}
                </span>
                <h3 className="font-serif font-bold text-base text-stone-900">{val.title}</h3>
                <p className="text-xs text-stone-600 leading-relaxed">{val.desc}</p>
              </div>
            ))}
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
