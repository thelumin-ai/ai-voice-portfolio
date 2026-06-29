'use client'

import { DEFAULT_CONTENT } from '../default-content'
import { THEME_CONFIG } from '../theme'
import { Header, Footer, useTemplateRouter } from '../page'
import { useTemplateContent } from '@/lib/projectsRepo'
import { Layers } from 'lucide-react'

export default function ServicesPage() {
  const { content } = useTemplateContent('manufacturing-003', DEFAULT_CONTENT)
  const go = useTemplateRouter()

  return (
    <div className={`min-h-screen bg-[#fafbfe] text-slate-800 ${THEME_CONFIG.font} overflow-x-hidden`}>
      <Header content={content} go={go} />

      {/* Banner */}
      <section className="py-16 bg-[#0b1c3c] text-white">
        <div className="max-w-[1280px] mx-auto px-6 text-center space-y-4">
          <span className="text-[10px] font-extrabold text-[#f28500] tracking-widest uppercase block">
            {content.services.bannerSub}
          </span>
          <h1 className="text-4xl font-extrabold leading-tight">
            {content.services.bannerHeading}
          </h1>
          <p className="text-slate-350 text-sm max-w-lg mx-auto leading-relaxed">
            {content.services.introText}
          </p>
        </div>
      </section>

      {/* Products list */}
      <section className="py-20 bg-white text-left">
        <div className="max-w-[1280px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {content.home.productsList.map((prod: any, idx: number) => (
            <div key={idx} className="bg-[#fafbfe] border border-slate-200/60 p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all space-y-4">
              <div className="p-3 bg-[#0b1c3c]/5 text-[#0b1c3c] rounded-xl inline-block">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-sm text-[#0b1c3c]">{prod.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-semibold">{prod.desc || prod.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Quality steps */}
      <section className="py-20 bg-slate-50 border-t border-slate-200/60 text-left">
        <div className="max-w-[1280px] mx-auto px-6 space-y-12">
          <div className="text-center max-w-xl mx-auto">
            <h2 className="text-2xl font-extrabold text-[#0b1c3c]">{content.services.processHeading}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {content.services.processSteps.map((step: any, idx: number) => (
              <div key={idx} className="flex gap-4 items-start bg-white border border-slate-200/60 p-6 rounded-2xl shadow-sm">
                <span className="font-black text-2xl text-[#f28500] font-sans">
                  {step.step}
                </span>
                <div className="space-y-2">
                  <h3 className="font-extrabold text-sm text-[#0b1c3c]">{step.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-semibold">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer content={content} go={go} />
    </div>
  )
}
