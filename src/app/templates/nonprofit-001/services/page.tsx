'use client'

import { DEFAULT_CONTENT } from '../default-content'
import { THEME_CONFIG } from '../theme'
import { Header, Footer, useTemplateRouter } from '../page'
import { useTemplateContent } from '@/lib/projectsRepo'

export default function ServicesPage() {
  const { content } = useTemplateContent('nonprofit-001', DEFAULT_CONTENT)
  const go = useTemplateRouter()

  return (
    <div className={`min-h-screen ${THEME_CONFIG.bg} ${THEME_CONFIG.font} overflow-x-hidden`}>
      <Header content={content} go={go} />

      {/* Banner */}
      <section className="py-16 bg-[#faf9f6] border-b border-stone-200">
        <div className="max-w-[1240px] mx-auto px-6 text-center space-y-4">
          <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#d97706]">
            {content.services.bannerSub}
          </span>
          <h1 className="text-4xl font-serif font-extrabold text-stone-900 leading-tight">
            {content.services.bannerHeading}
          </h1>
          <p className="text-stone-600 text-sm max-w-lg mx-auto leading-relaxed">
            {content.services.servicesIntro}
          </p>
        </div>
      </section>

      {/* Programs grid */}
      <section className="py-20 bg-white text-left">
        <div className="max-w-[1240px] mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          {content.programs.list.map((prog: any, idx: number) => (
            <div key={idx} className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col justify-between">
              <div className="h-40 bg-stone-100 overflow-hidden relative select-none pointer-events-none">
                <img src={prog.image} alt={prog.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-6 space-y-2 flex-grow text-center">
                <h3 className="font-serif font-bold text-base text-stone-900">{prog.title}</h3>
                <p className="text-xs text-stone-600 leading-relaxed">{prog.description || prog.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Process workflow */}
      <section className="py-20 border-t border-stone-200 bg-[#faf9f6] text-left">
        <div className="max-w-[1240px] mx-auto px-6 space-y-12">
          <div className="text-center max-w-xl mx-auto">
            <h2 className="text-2xl font-serif font-extrabold text-stone-900">
              {content.services.processHeading}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {content.services.processSteps.map((step: any, idx: number) => (
              <div key={idx} className="flex gap-4 items-start bg-white border border-stone-200 p-6 rounded-2xl shadow-sm">
                <span className="font-serif font-extrabold text-2xl text-[#d97706]">
                  {step.step}
                </span>
                <div className="space-y-2">
                  <h3 className="font-serif font-bold text-sm text-stone-900">{step.title}</h3>
                  <p className="text-xs text-stone-600 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-white border-t border-stone-200">
        <div className="max-w-3xl mx-auto px-6 text-center space-y-6">
          <h2 className="text-2xl font-serif font-extrabold text-stone-900">{content.services.benefitsHeading}</h2>
          <p className="text-stone-600 text-sm leading-relaxed max-w-xl mx-auto">{content.services.benefitsText}</p>
          <div className="pt-2">
            <a href={go('/contact')} className={`inline-block px-6 py-3.5 ${THEME_CONFIG.btn} font-sans font-extrabold text-[10px] tracking-widest rounded transition-colors uppercase`}>
              PARTICIPATE NOW
            </a>
          </div>
        </div>
      </section>

      <Footer content={content} go={go} />
    </div>
  )
}
