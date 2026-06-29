'use client'

import { DEFAULT_CONTENT } from '../default-content'
import { THEME_CONFIG } from '../theme'
import { Header, Footer, useTemplateRouter } from '../page'
import { useTemplateContent } from '@/lib/projectsRepo'
import { TrendingUp, Layers, Code, Globe } from 'lucide-react'

export default function ServicesPage() {
  const { content } = useTemplateContent('agency-002', DEFAULT_CONTENT)
  const go = useTemplateRouter()

  return (
    <div className={`min-h-screen bg-[#ffffff] text-slate-800 ${THEME_CONFIG.font} overflow-x-hidden`}>
      <Header content={content} go={go} />

      {/* Banner */}
      <section className="py-16 bg-slate-50 border-b border-slate-100">
        <div className="max-w-[1280px] mx-auto px-6 text-center space-y-4">
          <span className="text-[10px] font-extrabold text-[#4e31aa] tracking-widest uppercase block">
            {content.services.bannerSub}
          </span>
          <h1 className="text-4xl font-extrabold text-slate-900 leading-tight">
            {content.services.bannerHeading}
          </h1>
          <p className="text-slate-500 text-sm max-w-lg mx-auto leading-relaxed font-semibold">
            {content.services.introText}
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-[#ffffff] text-left">
        <div className="max-w-[1280px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          {content.services.list.map((svc: any, idx: number) => {
            // Map index to a matching icon
            const Icon = idx === 0 ? Globe : idx === 1 ? Layers : idx === 2 ? Code : TrendingUp
            return (
              <div key={idx} className="bg-white border border-slate-100 p-8 rounded-2xl shadow-xl shadow-slate-200/50 flex gap-5 items-start">
                <div className={`p-4 rounded-2xl flex-shrink-0 ${svc.color || 'bg-[#4e31aa]/5 text-[#4e31aa]'}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="space-y-2">
                  <span className="block text-[8px] font-extrabold text-slate-400 uppercase tracking-widest">{svc.label}</span>
                  <h3 className="font-extrabold text-base text-slate-900 leading-snug">{svc.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-semibold">{svc.desc}</p>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <Footer content={content} go={go} />
    </div>
  )
}
