'use client'

import { useState } from 'react'
import { DEFAULT_CONTENT } from '../default-content'
import { Header, Footer, useTemplateRouter } from '../page'

export default function Roofing004Contact() {
  const [content] = useState(DEFAULT_CONTENT)
  const go = useTemplateRouter()
  const [formState, setFormState] = useState({ name: '', email: '', phone: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-[#131313] text-[#e5e2e1] font-sans overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700;800&family=Work+Sans:wght@400;600&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200');
        .r004-root { font-family: 'Work Sans', sans-serif; }
        .r004-montserrat { font-family: 'Montserrat', sans-serif; }
        .r004-input {
          background: #202020;
          border: 1px solid #353535;
          color: #e5e2e1;
          padding: 12px 16px;
          width: 100%;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s;
        }
        .r004-input:focus { border-color: #ff5637; }
        .r004-input::placeholder { color: #5c403a; }
      `}</style>

      <div className="r004-root">
        <Header content={content} go={go} />

        {/* Page Banner */}
        <section className="bg-[#0e0e0e] border-b border-[#353535] py-16 md:py-20">
          <div className="max-w-[1280px] mx-auto px-5 md:px-6">
            <span className="block text-[#ff5637] text-xs font-bold uppercase tracking-[0.2em] mb-4">
              {content.contact.bannerLabel}
            </span>
            <h1 className="r004-montserrat text-3xl md:text-[48px] font-black text-white leading-tight tracking-tight">
              {content.contact.bannerHeading}
            </h1>
          </div>
        </section>

        {/* Two-column: Details + Form */}
        <section className="w-full max-w-[1280px] mx-auto px-5 md:px-6 py-20 md:py-28">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
            {/* Contact Details */}
            <div className="space-y-10">
              <div className="space-y-6">
                <div className="flex gap-4 items-start">
                  <span className="material-symbols-outlined text-[#ff5637] text-[24px] flex-shrink-0 mt-1">
                    phone
                  </span>
                  <div>
                    <p className="text-white font-bold text-xs uppercase tracking-widest mb-1">
                      Phone
                    </p>
                    <a
                      href={`tel:${content.contact.phone}`}
                      className="text-[#c6c6c7] text-base hover:text-[#ffb4a5] transition-colors"
                    >
                      {content.contact.phone}
                    </a>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <span className="material-symbols-outlined text-[#ff5637] text-[24px] flex-shrink-0 mt-1">
                    mail
                  </span>
                  <div>
                    <p className="text-white font-bold text-xs uppercase tracking-widest mb-1">
                      Email
                    </p>
                    <a
                      href={`mailto:${content.contact.email}`}
                      className="text-[#c6c6c7] text-base hover:text-[#ffb4a5] transition-colors"
                    >
                      {content.contact.email}
                    </a>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <span className="material-symbols-outlined text-[#ff5637] text-[24px] flex-shrink-0 mt-1">
                    location_on
                  </span>
                  <div>
                    <p className="text-white font-bold text-xs uppercase tracking-widest mb-1">
                      Address
                    </p>
                    <p className="text-[#c6c6c7] text-base leading-relaxed whitespace-pre-line">
                      {content.contact.address}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <span className="material-symbols-outlined text-[#ff5637] text-[24px] flex-shrink-0 mt-1">
                    schedule
                  </span>
                  <div>
                    <p className="text-white font-bold text-xs uppercase tracking-widest mb-1">
                      Hours
                    </p>
                    <p className="text-[#c6c6c7] text-base leading-relaxed whitespace-pre-line">
                      {content.contact.hours}
                    </p>
                  </div>
                </div>
              </div>

              {/* Map placeholder */}
              <div className="h-48 bg-[#202020] border border-[#353535] flex items-center justify-center">
                <p className="text-[#5c403a] text-sm font-semibold uppercase tracking-wider">
                  Map Placeholder
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-[#1b1b1c] border border-[#353535] p-8 md:p-10">
              <h2 className="r004-montserrat text-xl font-black text-white mb-8">
                {content.contact.formHeading}
              </h2>

              {submitted ? (
                <div className="py-12 text-center">
                  <span className="material-symbols-outlined text-[#ff5637] text-[48px] block mb-4">
                    check_circle
                  </span>
                  <p className="text-white font-bold text-lg r004-montserrat">
                    Message Sent!
                  </p>
                  <p className="text-[#c6c6c7] text-sm mt-2">
                    We'll get back to you within one business day.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-white font-bold text-xs uppercase tracking-widest mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      className="r004-input"
                      placeholder="John Smith"
                      value={formState.name}
                      onChange={(e) => setFormState((p) => ({ ...p, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-white font-bold text-xs uppercase tracking-widest mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        className="r004-input"
                        placeholder="you@company.com"
                        value={formState.email}
                        onChange={(e) => setFormState((p) => ({ ...p, email: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-white font-bold text-xs uppercase tracking-widest mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        className="r004-input"
                        placeholder="+1 (800) 000-0000"
                        value={formState.phone}
                        onChange={(e) => setFormState((p) => ({ ...p, phone: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-white font-bold text-xs uppercase tracking-widest mb-2">
                      Message
                    </label>
                    <textarea
                      rows={5}
                      className="r004-input resize-none"
                      placeholder="Tell us about your project..."
                      value={formState.message}
                      onChange={(e) => setFormState((p) => ({ ...p, message: e.target.value }))}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-[#ff5637] hover:bg-[#ba1d00] text-white font-black uppercase tracking-widest text-sm py-4 transition-colors"
                  >
                    {content.contact.formButton}
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>

        <Footer content={content} go={go} />
      </div>
    </div>
  )
}
