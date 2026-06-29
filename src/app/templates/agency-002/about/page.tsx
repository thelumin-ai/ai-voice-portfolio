'use client'

import { DEFAULT_CONTENT } from '../default-content'
import { THEME_CONFIG } from '../theme'
import { Header, Footer, useTemplateRouter } from '../page'
import { useTemplateContent } from '@/lib/projectsRepo'

export default function AboutPage() {
  const { content } = useTemplateContent('agency-002', DEFAULT_CONTENT)
  const go = useTemplateRouter()

  return (
    <div className={`min-h-screen bg-[#ffffff] text-slate-800 ${THEME_CONFIG.font} overflow-x-hidden`}>
      <Header content={content} go={go} />

      {/* Banner */}
      <section className="py-16 bg-slate-50 border-b border-slate-100">
        <div className="max-w-[1280px] mx-auto px-6 text-center space-y-4">
          <span className="text-[10px] font-extrabold text-[#4e31aa] tracking-widest uppercase block">
            {content.about.bannerSub}
          </span>
          <h1 className="text-4xl font-extrabold text-slate-900 leading-tight">
            {content.about.bannerHeading}
          </h1>
        </div>
      </section>

      {/* Intro */}
      <section className="py-20 bg-[#ffffff] text-left">
        <div className="max-w-[1000px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-2xl font-extrabold text-slate-900">
              {content.about.introHeading}
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed">
              {content.about.introText}
            </p>
          </div>
          <div className="w-full h-64 bg-slate-100 rounded-bl-[80px] rounded-tr-[80px] overflow-hidden shadow-xl border-4 border-white relative select-none pointer-events-none">
            <img 
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=600" 
              alt="Our Story" 
              className="w-full h-full object-cover scale-105"
            />
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="py-20 bg-slate-50 border-t border-slate-100 text-left">
        <div className="max-w-[1280px] mx-auto px-6 space-y-12">
          <div className="text-center max-w-xl mx-auto">
            <h2 className="text-2xl font-extrabold text-slate-900">{content.about.valuesHeading}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {content.about.valuesList.map((val: any, idx: number) => (
              <div key={idx} className="bg-white border border-slate-100 p-8 rounded-2xl shadow-xl shadow-slate-200/50 space-y-4">
                <span className="inline-block px-3 py-1 bg-[#4e31aa]/5 text-[#4e31aa] font-extrabold text-[10px] rounded-md uppercase">
                  Principle 0{idx + 1}
                </span>
                <h3 className="font-extrabold text-sm text-slate-900">{val.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-semibold">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer content={content} go={go} />
    </div>
  )
}
