'use client'

import { useState } from 'react'
import { DEFAULT_CONTENT } from '../default-content'
import { THEME_CONFIG } from '../theme'
import { Header, Footer, useTemplateRouter } from '../page'
import { useTemplateContent } from '@/lib/projectsRepo'
import { Phone, Mail, MapPin, Clock, Check } from 'lucide-react'

export default function ContactPage() {
  const { content } = useTemplateContent('agency-002', DEFAULT_CONTENT)
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const go = useTemplateRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setFormData({ name: '', email: '', message: '' })
    setTimeout(() => setSubmitted(false), 5000)
  }

  return (
    <div className={`min-h-screen bg-[#ffffff] text-slate-800 ${THEME_CONFIG.font} overflow-x-hidden`}>
      <Header content={content} go={go} />

      {/* Banner */}
      <section className="py-16 bg-slate-50 border-b border-slate-100">
        <div className="max-w-[1280px] mx-auto px-6 text-center space-y-4">
          <span className="text-[10px] font-extrabold text-[#4e31aa] tracking-widest uppercase block">
            {content.contact.bannerSub}
          </span>
          <h1 className="text-4xl font-extrabold text-slate-900 leading-tight">
            {content.contact.bannerHeading}
          </h1>
        </div>
      </section>

      {/* Form & Details */}
      <section className="py-20 bg-white text-left">
        <div className="max-w-[1280px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Details column */}
          <div className="lg:col-span-5 space-y-8 bg-slate-50 border border-slate-100 p-8 rounded-2xl">
            <h2 className="text-xl font-bold text-slate-900">Reach Our Office</h2>
            
            <div className="space-y-6 text-xs text-slate-700 font-sans">
              <div className="flex gap-3.5 items-center">
                <div className="p-2.5 bg-white border border-slate-100 text-[#4e31aa] rounded-xl shadow-sm">
                  <Phone className="w-4.5 h-4.5" />
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-400 block">Phone</span>
                  <span className="font-semibold block mt-0.5">{content.header.phone}</span>
                </div>
              </div>

              <div className="flex gap-3.5 items-center">
                <div className="p-2.5 bg-white border border-slate-100 text-[#4e31aa] rounded-xl shadow-sm">
                  <Mail className="w-4.5 h-4.5" />
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-400 block">Email</span>
                  <span className="font-semibold block mt-0.5">{content.contact.email}</span>
                </div>
              </div>

              <div className="flex gap-3.5 items-center">
                <div className="p-2.5 bg-white border border-slate-100 text-[#4e31aa] rounded-xl shadow-sm">
                  <MapPin className="w-4.5 h-4.5" />
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-400 block">Address</span>
                  <span className="font-semibold block mt-0.5">{content.contact.address}</span>
                </div>
              </div>

              <div className="flex gap-3.5 items-center">
                <div className="p-2.5 bg-white border border-slate-100 text-[#4e31aa] rounded-xl shadow-sm">
                  <Clock className="w-4.5 h-4.5" />
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-400 block">Hours</span>
                  <span className="font-semibold block mt-0.5">{content.contact.hours}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form column */}
          <div className="lg:col-span-7 bg-slate-50 border border-slate-100 p-8 rounded-2xl">
            <h2 className="text-xl font-bold text-slate-900 mb-6">{content.contact.formTitle}</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4 font-sans text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-2">Name</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.name} 
                    onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full p-3 bg-white border border-slate-100 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#4e31aa]"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-2">Email</label>
                  <input 
                    type="email" 
                    required 
                    value={formData.email} 
                    onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full p-3 bg-white border border-slate-100 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#4e31aa]"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-2">Message</label>
                <textarea 
                  required 
                  rows={4} 
                  value={formData.message} 
                  onChange={e => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  className="w-full p-3 bg-white border border-slate-100 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#4e31aa]"
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
                className="w-full py-3 bg-[#4e31aa] hover:bg-[#3b238c] text-white font-sans font-bold text-[10px] tracking-widest rounded-xl transition-all shadow-md uppercase cursor-pointer"
              >
                {content.contact.formButtonText}
              </button>
            </form>
          </div>

        </div>
      </section>

      <Footer content={content} go={go} />
    </div>
  )
}
