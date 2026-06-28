'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { DEFAULT_CONTENT } from '../default-content'
import { THEME_CONFIG } from '../theme'
import { Phone, Search, User, Heart, Mail, MapPin, Clock, Check } from 'lucide-react'

export default function ContactPage() {
  const [content] = useState(DEFAULT_CONTENT)
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setFormData({ name: '', email: '', message: '' })
    setTimeout(() => setSubmitted(false), 4000)
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
            <Link href={getPathWithPrefix('/services')} className="hover:text-stone-900 transition-colors">SERVICES</Link>
            <Link href={getPathWithPrefix('/contact')} className="hover:text-stone-900 transition-colors text-[#d97706]">CONTACT US</Link>
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
            {content.contact.bannerSub}
          </span>
          <h1 className="text-4xl font-serif font-extrabold text-stone-900 leading-tight">
            {content.contact.bannerHeading}
          </h1>
        </div>
      </section>

      {/* Form & Details */}
      <section className="py-20 bg-white">
        <div className="max-w-[1240px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Details column */}
          <div className="lg:col-span-5 space-y-8 bg-[#faf9f6] border border-stone-200 p-8 rounded-2xl">
            <h2 className="text-xl font-serif font-bold text-stone-900">Reach Our Office</h2>
            
            <div className="space-y-6 text-xs text-stone-700 font-sans">
              <div className="flex gap-3.5 items-center">
                <div className="p-2.5 bg-white border border-stone-200 text-[#d97706] rounded-xl shadow-sm">
                  <Phone className="w-4.5 h-4.5" />
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-stone-500 block">Phone</span>
                  <span className="font-semibold block mt-0.5">{content.header.phone}</span>
                </div>
              </div>

              <div className="flex gap-3.5 items-center">
                <div className="p-2.5 bg-white border border-stone-200 text-[#d97706] rounded-xl shadow-sm">
                  <Mail className="w-4.5 h-4.5" />
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-stone-500 block">Email</span>
                  <span className="font-semibold block mt-0.5">{content.contact.email}</span>
                </div>
              </div>

              <div className="flex gap-3.5 items-center">
                <div className="p-2.5 bg-white border border-stone-200 text-[#d97706] rounded-xl shadow-sm">
                  <MapPin className="w-4.5 h-4.5" />
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-stone-500 block">Address</span>
                  <span className="font-semibold block mt-0.5">{content.contact.address}</span>
                </div>
              </div>

              <div className="flex gap-3.5 items-center">
                <div className="p-2.5 bg-white border border-stone-200 text-[#d97706] rounded-xl shadow-sm">
                  <Clock className="w-4.5 h-4.5" />
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-stone-500 block">Hours</span>
                  <span className="font-semibold block mt-0.5">{content.contact.hours}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form column */}
          <div className="lg:col-span-7 bg-[#faf9f6] border border-stone-200 p-8 rounded-2xl">
            <h2 className="text-xl font-serif font-bold text-stone-900 mb-6">{content.contact.formTitle}</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4 font-sans text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-bold text-stone-500 uppercase tracking-wider mb-2">Name</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.name} 
                    onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full p-3 bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#d97706]"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-stone-500 uppercase tracking-wider mb-2">Email</label>
                  <input 
                    type="email" 
                    required 
                    value={formData.email} 
                    onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full p-3 bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#d97706]"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-bold text-stone-500 uppercase tracking-wider mb-2">Message</label>
                <textarea 
                  required 
                  rows={4} 
                  value={formData.message} 
                  onChange={e => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  className="w-full p-3 bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#d97706]"
                  placeholder="How can we help you?"
                />
              </div>

              {submitted && (
                <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 rounded-xl flex gap-2 items-center">
                  <Check className="w-4 h-4" />
                  <span>Message sent successfully! We will get back to you soon.</span>
                </div>
              )}

              <button 
                type="submit" 
                className={`w-full py-3 bg-stone-950 text-white font-sans font-extrabold text-[10px] tracking-widest rounded-xl hover:bg-stone-850 uppercase cursor-pointer`}
              >
                {content.contact.formButtonText}
              </button>
            </form>
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
