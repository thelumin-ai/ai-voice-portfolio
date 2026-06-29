'use client'

import { DEFAULT_CONTENT } from '../default-content'
import { THEME_CONFIG } from '../theme'
import { Header, Footer, useTemplateRouter } from '../page'
import { useTemplateContent } from '@/lib/projectsRepo'

export default function AboutPage() {
  const { content } = useTemplateContent('nonprofit-001', DEFAULT_CONTENT)
  const go = useTemplateRouter()

  return (
    <div className={`min-h-screen ${THEME_CONFIG.bg} ${THEME_CONFIG.font} overflow-x-hidden`}>
      <Header content={content} go={go} />

      {/* Banner */}
      <section className="py-16 bg-[#faf9f6] border-b border-stone-200">
        <div className="max-w-[1240px] mx-auto px-6 text-center space-y-4">
          <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#d97706]">
            {content.about.bannerSub}
          </span>
          <h1 className="text-4xl font-serif font-extrabold text-stone-900 leading-tight">
            {content.about.bannerHeading}
          </h1>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 bg-white text-left">
        <div className="max-w-[1000px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-2xl font-serif font-extrabold text-stone-900">
              {content.about.storyHeading}
            </h2>
            <p className="text-stone-600 text-sm leading-relaxed">
              {content.about.storyText}
            </p>
          </div>
          <div className="h-64 bg-stone-150 rounded-2xl overflow-hidden shadow-sm relative select-none pointer-events-none">
            <img 
              src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=600"
              alt="Community aid"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-20 border-t border-stone-200 text-left">
        <div className="max-w-[1240px] mx-auto px-6 space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-3">
            <h2 className="text-2xl font-serif font-extrabold text-stone-900">{content.about.missionHeading}</h2>
            <p className="text-sm text-stone-600">{content.about.missionText}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {content.about.values.map((val: any, idx: number) => (
              <div key={idx} className="bg-white border border-stone-200 p-6 rounded-2xl shadow-sm text-center space-y-3">
                <span className="inline-block p-3 rounded-full bg-[#d97706]/10 text-[#d97706] font-bold text-sm font-sans">
                  {idx + 1}
                </span>
                <h3 className="font-serif font-bold text-base text-stone-900">{val.title}</h3>
                <p className="text-xs text-stone-600 leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer content={content} go={go} />
    </div>
  )
}
