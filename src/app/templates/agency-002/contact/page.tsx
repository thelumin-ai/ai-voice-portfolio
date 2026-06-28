'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { DEFAULT_CONTENT } from '../default-content'
import { THEME_CONFIG } from '../theme'
import { Phone, Search, Menu, Mail, MapPin, Clock, Check, TrendingUp } from 'lucide-react'

export default function ContactPage() {
  const [content] = useState(DEFAULT_CONTENT)
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setFormData({ name: '', email: '', message: '' })
    setTimeout(() => setSubmitted(false), 4000)
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

          <div className="hidden lg:flex items-center gap-8 text-[11px] font-bold tracking-wider text-slate-655">
            <Link href={getPathWithPrefix('/')} className="hover:text-slate-900 transition-colors">HOME</Link>
            <Link href={getPathWithPrefix('/about')} className="hover:text-slate-900 transition-colors">ABOUT</Link>
            <Link href={getPathWithPrefix('/services')} className="hover:text-slate-900 transition-colors">SERVICES</Link>
            <Link href={getPathWithPrefix('/contact')} className="hover:text-slate-900 transition-colors text-[#4e31aa]">CONTACT US</Link>
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
            {content.contact.bannerSub}
          </span>
          <h1 className="text-4xl font-extrabold text-slate-900 leading-tight">
            {content.contact.bannerHeading}
          </h1>
        </div>
      </section>

      {/* Form & Details */}
      <section className="py-20 bg-white">
        <div className="max-w-[1280px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Details */}
          <div className="lg:col-span-5 space-y-8 bg-slate-50 border border-slate-100 p-8 rounded-2xl">
            <h2 className="text-lg font-extrabold text-slate-900">Agency Coordinates</h2>
            
            <div className="space-y-6 text-xs text-slate-700">
              <div className="flex gap-4 items-center">
                <div className="p-3 bg-white border border-slate-100 text-[#4e31aa] rounded-xl shadow">
                  <Phone className="w-4.5 h-4.5" />
                </div>
                <div>
                  <span className="text-[8px] uppercase font-bold text-slate-400 block">Phone</span>
                  <span className="font-extrabold block mt-0.5">{content.header.phone}</span>
                </div>
              </div>

              <div className="flex gap-4 items-center">
                <div className="p-3 bg-white border border-slate-100 text-[#4e31aa] rounded-xl shadow">
                  <Mail className="w-4.5 h-4.5" />
                </div>
                <div>
                  <span className="text-[8px] uppercase font-bold text-slate-400 block">Email</span>
                  <span className="font-extrabold block mt-0.5">{content.contact.email}</span>
                </div>
              </div>

              <div className="flex gap-4 items-center">
                <div className="p-3 bg-white border border-slate-100 text-[#4e31aa] rounded-xl shadow">
                  <MapPin className="w-4.5 h-4.5" />
                </div>
                <div>
                  <span className="text-[8px] uppercase font-bold text-slate-400 block">HQ Address</span>
                  <span className="font-extrabold block mt-0.5">{content.contact.address}</span>
                </div>
              </div>

              <div className="flex gap-4 items-center">
                <div className="p-3 bg-white border border-slate-100 text-[#4e31aa] rounded-xl shadow">
                  <Clock className="w-4.5 h-4.5" />
                </div>
                <div>
                  <span className="text-[8px] uppercase font-bold text-slate-400 block">Hours</span>
                  <span className="font-extrabold block mt-0.5">{content.contact.hours}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-7 bg-slate-50 border border-slate-100 p-8 rounded-2xl">
            <h2 className="text-lg font-extrabold text-slate-900 mb-6">{content.contact.formTitle}</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[8px] font-bold text-slate-400 uppercase tracking-wider mb-2">Name</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.name} 
                    onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#4e31aa]"
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
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#4e31aa]"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[8px] font-bold text-slate-400 uppercase tracking-wider mb-2">Project Brief</label>
                <textarea 
                  required 
                  rows={4} 
                  value={formData.message} 
                  onChange={e => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#4e31aa]"
                  placeholder="Describe your design and SEO goals..."
                />
              </div>

              {submitted && (
                <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 rounded-xl flex gap-2 items-center">
                  <Check className="w-4 h-4" />
                  <span>Enquiry submitted. Our strategist will call you shortly!</span>
                </div>
              )}

              <button 
                type="submit" 
                className="w-full py-3 bg-[#4e31aa] hover:bg-[#3b238c] text-white font-bold text-[10px] tracking-widest rounded-xl transition-all uppercase cursor-pointer"
              >
                {content.contact.formButtonText}
              </button>
            </form>
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
