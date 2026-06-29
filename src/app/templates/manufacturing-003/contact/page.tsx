'use client'

import { useState } from 'react'
import { DEFAULT_CONTENT } from '../default-content'
import { THEME_CONFIG } from '../theme'
import { Header, Footer, useTemplateRouter } from '../page'
import { useTemplateContent } from '@/lib/projectsRepo'
import { Phone, Mail, MapPin, Clock, Check } from 'lucide-react'

export default function ContactPage() {
  const { content } = useTemplateContent('manufacturing-003', DEFAULT_CONTENT)
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
    <div className={`min-h-screen bg-[#fafbfe] text-slate-800 ${THEME_CONFIG.font} overflow-x-hidden`}>
      <Header content={content} go={go} />

      {/* Banner */}
      <section className="py-16 bg-[#0b1c3c] text-white">
        <div className="max-w-[1280px] mx-auto px-6 text-center space-y-4">
          <span className="text-[10px] font-extrabold text-[#f28500] tracking-widest uppercase block">
            {content.contact.bannerSub}
          </span>
          <h1 className="text-4xl font-extrabold leading-tight">
            {content.contact.bannerHeading}
          </h1>
        </div>
      </section>

      {/* Form & Details */}
      <section className="py-20 bg-white text-left">
        <div className="max-w-[1280px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Details column */}
          <div className="lg:col-span-5 space-y-8 bg-[#fafbfe] border border-slate-200/60 p-8 rounded-2xl">
            <h2 className="text-xl font-bold text-[#0b1c3c]">Reach Our Office</h2>
            
            <div className="space-y-6 text-xs text-slate-700 font-sans">
              <div className="flex gap-3.5 items-center">
                <div className="p-2.5 bg-white border border-slate-200 text-[#f28500] rounded-xl shadow-sm">
                  <Phone className="w-4.5 h-4.5" />
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-450 block">Phone</span>
                  <span className="font-semibold block mt-0.5">{content.header.phone}</span>
                </div>
              </div>

              <div className="flex gap-3.5 items-center">
                <div className="p-2.5 bg-white border border-slate-200 text-[#f28500] rounded-xl shadow-sm">
                  <Mail className="w-4.5 h-4.5" />
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-450 block">Email</span>
                  <span className="font-semibold block mt-0.5">{content.header.email}</span>
                </div>
              </div>

              <div className="flex gap-3.5 items-center">
                <div className="p-2.5 bg-white border border-slate-200 text-[#f28500] rounded-xl shadow-sm">
                  <MapPin className="w-4.5 h-4.5" />
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-450 block">Address</span>
                  <span className="font-semibold block mt-0.5">{content.contact.address}</span>
                </div>
              </div>

              <div className="flex gap-3.5 items-center">
                <div className="p-2.5 bg-white border border-slate-200 text-[#f28500] rounded-xl shadow-sm">
                  <Clock className="w-4.5 h-4.5" />
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-450 block">Hours</span>
                  <span className="font-semibold block mt-0.5">{content.contact.hours}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form column */}
          <div className="lg:col-span-7 bg-[#fafbfe] border border-slate-200/60 p-8 rounded-2xl">
            <h2 className="text-xl font-bold text-[#0b1c3c] mb-6">{content.contact.formTitle}</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4 font-sans text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-bold text-slate-550 uppercase tracking-wider mb-2">Name</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.name} 
                    onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#f28500]"
                    placeholder="Your Name"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-slate-550 uppercase tracking-wider mb-2">Email</label>
                  <input 
                    type="email" 
                    required 
                    value={formData.email} 
                    onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#f28500]"
                    placeholder="name@company.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-bold text-slate-550 uppercase tracking-wider mb-2">Message</label>
                <textarea 
                  required 
                  rows={4} 
                  value={formData.message} 
                  onChange={e => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#f28500]"
                  placeholder="Tell us about your requirements..."
                />
              </div>

              {submitted && (
                <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 rounded-xl flex gap-2 items-center">
                  <Check className="w-4 h-4" />
                  <span>Your request has been submitted. We will contact you shortly.</span>
                </div>
              )}

              <button 
                type="submit" 
                className="w-full py-3 bg-[#f28500] hover:bg-[#d97300] text-white font-sans font-bold text-[10px] tracking-widest rounded-xl transition-all shadow-md uppercase cursor-pointer"
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
