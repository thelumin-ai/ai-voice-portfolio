'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { DEFAULT_CONTENT } from '../default-content'
import { THEME_CONFIG } from '../theme'
import { Phone, Mail, MapPin, Clock, Check, Shield } from 'lucide-react'

export default function ContactPage() {
  const [content] = useState(DEFAULT_CONTENT)
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setFormData({ name: '', email: '', message: '' })
    setTimeout(() => setSubmitted(false), 4000)
  }

  return (
    <div className={`min-h-screen bg-[#fafbfe] text-slate-800 ${THEME_CONFIG.font} overflow-x-hidden`}>
      
      {/* Utility Top Bar */}
      <div className="w-full bg-[#0b1c3c] text-slate-300 text-[10px] font-semibold py-2.5 border-b border-white/5 relative z-45">
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
            <Link href={getPathWithPrefix('/services')} className="hover:text-slate-900 transition-colors">PRODUCTS</Link>
            <Link href={getPathWithPrefix('/contact')} className="hover:text-slate-900 transition-colors text-[#f28500]">CONTACT US</Link>
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
            {content.contact.bannerSub}
          </span>
          <h1 className="text-3xl font-black text-[#0b1c3c] leading-tight">
            {content.contact.bannerHeading}
          </h1>
        </div>
      </section>

      {/* Form & Details */}
      <section className="py-20 bg-white">
        <div className="max-w-[1280px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Details */}
          <div className="lg:col-span-5 space-y-8 bg-slate-50 border border-slate-200/60 p-8 rounded-xl">
            <h2 className="text-lg font-extrabold text-[#0b1c3c]">Sarvam HQ</h2>
            
            <div className="space-y-6 text-xs text-slate-700">
              <div className="flex gap-4 items-center">
                <div className="p-3 bg-white border border-slate-200 text-[#f28500] rounded-lg shadow-sm">
                  <Phone className="w-4.5 h-4.5" />
                </div>
                <div>
                  <span className="text-[8px] uppercase font-bold text-slate-400 block">Phone</span>
                  <span className="font-extrabold block mt-0.5">{content.header.phone}</span>
                </div>
              </div>

              <div className="flex gap-4 items-center">
                <div className="p-3 bg-white border border-slate-200 text-[#f28500] rounded-lg shadow-sm">
                  <Mail className="w-4.5 h-4.5" />
                </div>
                <div>
                  <span className="text-[8px] uppercase font-bold text-slate-400 block">Email</span>
                  <span className="font-extrabold block mt-0.5">{content.header.email}</span>
                </div>
              </div>

              <div className="flex gap-4 items-center">
                <div className="p-3 bg-white border border-slate-200 text-[#f28500] rounded-lg shadow-sm">
                  <MapPin className="w-4.5 h-4.5" />
                </div>
                <div>
                  <span className="text-[8px] uppercase font-bold text-slate-400 block">MIDC Area</span>
                  <span className="font-extrabold block mt-0.5">{content.contact.address}</span>
                </div>
              </div>

              <div className="flex gap-4 items-center">
                <div className="p-3 bg-white border border-slate-200 text-[#f28500] rounded-lg shadow-sm">
                  <Clock className="w-4.5 h-4.5" />
                </div>
                <div>
                  <span className="text-[8px] uppercase font-bold text-slate-400 block">Factory Hours</span>
                  <span className="font-extrabold block mt-0.5">{content.contact.hours}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-7 bg-slate-50 border border-slate-200/60 p-8 rounded-xl">
            <h2 className="text-lg font-extrabold text-[#0b1c3c] mb-6">{content.contact.formTitle}</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[8px] font-bold text-slate-400 uppercase tracking-wider mb-2">Name</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.name} 
                    onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full p-3 bg-white border border-slate-250 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#f28500]"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label className="block text-[8px] font-bold text-slate-400 uppercase tracking-wider mb-2">Email</label>
                  <input 
                    type="email" 
                    required 
                    value={formData.email} 
                    onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full p-3 bg-white border border-slate-250 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#f28500]"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[8px] font-bold text-slate-400 uppercase tracking-wider mb-2">Pipes Specifications & Quantity</label>
                <textarea 
                  required 
                  rows={4} 
                  value={formData.message} 
                  onChange={e => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  className="w-full p-3 bg-white border border-slate-250 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#f28500]"
                  placeholder="e.g. 500 units of 110mm uPVC plumbing pipes..."
                />
              </div>

              {submitted && (
                <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 rounded-lg flex gap-2 items-center">
                  <Check className="w-4 h-4" />
                  <span>Quote requested successfully. Our representative will contact you with pricing catalog.</span>
                </div>
              )}

              <button 
                type="submit" 
                className="w-full py-3 bg-[#f28500] hover:bg-[#d97700] text-white font-bold text-[10px] tracking-widest rounded-lg transition-all uppercase cursor-pointer"
              >
                {content.contact.formButtonText}
              </button>
            </form>
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
