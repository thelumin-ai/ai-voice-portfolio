'use client'

import { DEFAULT_CONTENT } from '../default-content'
import { THEME_CONFIG } from '../theme'
import { Header, Footer, useTemplateRouter } from '../page'
import { useTemplateContent } from '@/lib/projectsRepo'

export default function AboutPage() {
  const { content } = useTemplateContent('manufacturing-003', DEFAULT_CONTENT)
  const go = useTemplateRouter()

  return (
    <div className={`min-h-screen bg-[#fafbfe] text-slate-800 ${THEME_CONFIG.font} overflow-x-hidden`}>
      <Header content={content} go={go} />

      {/* Banner */}
      <section className="py-16 bg-[#0b1c3c] text-white">
        <div className="max-w-[1280px] mx-auto px-6 text-center space-y-4">
          <span className="text-[10px] font-extrabold text-[#f28500] tracking-widest uppercase block">
            {content.about.bannerSub}
          </span>
          <h1 className="text-4xl font-extrabold leading-tight">
            {content.about.bannerHeading}
          </h1>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 bg-white text-left">
        <div className="max-w-[1000px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-2xl font-extrabold text-[#0b1c3c]">
              {content.about.storyHeading}
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed">
              {content.about.storyText}
            </p>
          </div>
          <div className="w-full h-64 bg-slate-100 rounded-2xl overflow-hidden shadow-xl border-4 border-slate-100 relative select-none pointer-events-none">
            <img 
              src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=600" 
              alt="Sarvam Factory Extrusion" 
              className="w-full h-full object-cover scale-105"
            />
          </div>
        </div>
      </section>

      {/* Standards */}
      <section className="py-20 bg-slate-50 border-t border-slate-200/60 text-left">
        <div className="max-w-[1280px] mx-auto px-6 space-y-12">
          <div className="text-center max-w-xl mx-auto">
            <h2 className="text-2xl font-extrabold text-[#0b1c3c]">{content.about.valuesHeading}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {content.about.valuesList.map((val: any, idx: number) => (
              <div key={idx} className="bg-white border border-slate-200/60 p-8 rounded-2xl shadow-sm space-y-4">
                <span className="inline-block px-3 py-1 bg-[#f28500]/5 text-[#f28500] font-extrabold text-[10px] rounded-md uppercase">
                  Standard 0{idx + 1}
                </span>
                <h3 className="font-extrabold text-sm text-[#0b1c3c]">{val.title}</h3>
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
