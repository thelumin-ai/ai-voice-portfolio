'use client'

import { useState } from 'react'
import { DEFAULT_CONTENT } from '../default-content'
import { Header, Footer, useTemplateRouter } from '../page'

export default function Roofing004Quote() {
  const [content] = useState(DEFAULT_CONTENT)
  const go = useTemplateRouter()
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    projectType: '',
    squareFeet: '',
    message: '',
  })

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
        .r004-select {
          background: #202020;
          border: 1px solid #353535;
          color: #e5e2e1;
          padding: 12px 16px;
          width: 100%;
          font-size: 14px;
          outline: none;
          appearance: none;
          cursor: pointer;
        }
        .r004-select:focus { border-color: #ff5637; }
      `}</style>

      <div className="r004-root">
        <Header content={content} go={go} />

        {/* Page Banner */}
        <section className="bg-[#0e0e0e] border-b border-[#353535] py-16 md:py-20">
          <div className="max-w-[1280px] mx-auto px-5 md:px-6">
            <span className="block text-[#ff5637] text-xs font-bold uppercase tracking-[0.2em] mb-4">
              {content.quote.bannerLabel}
            </span>
            <h1 className="r004-montserrat text-3xl md:text-[48px] font-black text-white leading-tight tracking-tight">
              {content.quote.bannerHeading}
            </h1>
            <p className="text-[#c6c6c7] text-base leading-relaxed max-w-xl mt-5">
              {content.quote.introText}
            </p>
          </div>
        </section>

        {/* Quote Form */}
        <section className="w-full max-w-[800px] mx-auto px-5 md:px-6 py-20 md:py-28">
          {submitted ? (
            <div className="bg-[#202020] border border-[#353535] p-16 text-center">
              <span className="material-symbols-outlined text-[#ff5637] text-[56px] block mb-5">
                check_circle
              </span>
              <h2 className="r004-montserrat text-2xl font-black text-white mb-4">
                Quote Request Received!
              </h2>
              <p className="text-[#c6c6c7] text-base leading-relaxed max-w-sm mx-auto">
                We'll review your project details and send a detailed estimate within one business
                day. Thank you for choosing Ironclad Roofing.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-[#1b1b1c] border border-[#353535] p-8 md:p-12 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white font-bold text-xs uppercase tracking-widest mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    className="r004-input"
                    placeholder="John Smith"
                    value={form.name}
                    onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label className="block text-white font-bold text-xs uppercase tracking-widest mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    className="r004-input"
                    placeholder="you@company.com"
                    value={form.email}
                    onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white font-bold text-xs uppercase tracking-widest mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    className="r004-input"
                    placeholder="+1 (800) 000-0000"
                    value={form.phone}
                    onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-white font-bold text-xs uppercase tracking-widest mb-2">
                    Project Type *
                  </label>
                  <div className="relative">
                    <select
                      className="r004-select"
                      value={form.projectType}
                      onChange={(e) => setForm((p) => ({ ...p, projectType: e.target.value }))}
                      required
                    >
                      <option value="">Select project type…</option>
                      {content.quote.projectTypes.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-[#5c403a] text-[20px] pointer-events-none">
                      expand_more
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-white font-bold text-xs uppercase tracking-widest mb-2">
                  Approx. Roof Area (sq ft)
                </label>
                <input
                  type="text"
                  className="r004-input"
                  placeholder="e.g. 2,400"
                  value={form.squareFeet}
                  onChange={(e) => setForm((p) => ({ ...p, squareFeet: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-white font-bold text-xs uppercase tracking-widest mb-2">
                  Project Details
                </label>
                <textarea
                  rows={6}
                  className="r004-input resize-none"
                  placeholder="Describe your project, current roof condition, timeline, and any specific requirements…"
                  value={form.message}
                  onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#ff5637] hover:bg-[#ba1d00] text-white font-black uppercase tracking-widest text-sm py-5 transition-colors"
              >
                {content.quote.formButton}
              </button>
            </form>
          )}
        </section>

        <Footer content={content} go={go} />
      </div>
    </div>
  )
}
