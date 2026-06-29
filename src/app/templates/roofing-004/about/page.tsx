'use client'

import Link from 'next/link'
import { DEFAULT_CONTENT } from '../default-content'
import { Header, Footer, useTemplateRouter } from '../page'
import { useTemplateContent } from '@/lib/projectsRepo'

export default function Roofing004About() {
  const content = useTemplateContent('roofing-004', DEFAULT_CONTENT)
  const go = useTemplateRouter()

  return (
    <div className="min-h-screen bg-[#131313] text-[#e5e2e1] font-sans overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700;800&family=Work+Sans:wght@400;600&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200');
        .r004-root { font-family: 'Work Sans', sans-serif; }
        .r004-montserrat { font-family: 'Montserrat', sans-serif; }
      `}</style>

      <div className="r004-root">
        <Header content={content} go={go} />

        {/* Page Banner */}
        <section className="bg-[#0e0e0e] border-b border-[#353535] py-16 md:py-20">
          <div className="max-w-[1280px] mx-auto px-5 md:px-6">
            <span className="block text-[#ff5637] text-xs font-bold uppercase tracking-[0.2em] mb-4">
              {content.about.bannerLabel}
            </span>
            <h1 className="r004-montserrat text-3xl md:text-[48px] font-black text-white leading-tight tracking-tight max-w-2xl">
              {content.about.bannerHeading.split('\n').map((line: string, i: number) => (
                <span key={i}>
                  {line}
                  {i < content.about.bannerHeading.split('\n').length - 1 && <br />}
                </span>
              ))}
            </h1>
          </div>
        </section>

        {/* Mission / Story Split */}
        <section className="w-full max-w-[1280px] mx-auto px-5 md:px-6 py-20 md:py-28">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
            <div className="space-y-6">
              <h2 className="r004-montserrat text-2xl md:text-[32px] font-black text-white leading-tight">
                {content.about.missionHeading}
              </h2>
              <p className="text-[#c6c6c7] text-base leading-relaxed">
                {content.about.missionText}
              </p>
              <p className="text-[#c6c6c7] text-base leading-relaxed">
                {content.about.missionText2}
              </p>
              <Link
                href={go('/services')}
                className="inline-flex items-center px-8 py-4 bg-[#ff5637] hover:bg-[#ba1d00] text-white font-bold uppercase tracking-wider text-sm transition-colors"
              >
                Our Services
              </Link>
            </div>
            <div className="relative overflow-hidden h-80 md:h-96">
              <img
                src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=800"
                alt={content.about.imageAlt}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/20" />
            </div>
          </div>
        </section>

        {/* Values Grid */}
        <section className="bg-[#0e0e0e] border-t border-b border-[#353535] py-20 md:py-28">
          <div className="max-w-[1280px] mx-auto px-5 md:px-6">
            <h2 className="r004-montserrat text-2xl md:text-[32px] font-black text-white text-center mb-14">
              {content.about.valuesHeading}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {content.about.values.map((v: any, idx: number) => (
                <div key={idx} className="bg-[#202020] border border-[#353535] p-8 space-y-4">
                  <span className="block text-[#ff5637] font-black text-xl r004-montserrat">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <h3 className="text-white font-bold text-base">{v.title}</h3>
                  <p className="text-[#c6c6c7] text-sm leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Counter */}
        <section className="w-full max-w-[1280px] mx-auto px-5 md:px-6 py-20 md:py-28">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-12">
            {content.about.stats.map((s: any, idx: number) => (
              <div key={idx} className="text-center border-t-2 border-[#ff5637] pt-8">
                <span className="block r004-montserrat text-5xl md:text-6xl font-black text-white mb-3">
                  {s.value}
                </span>
                <span className="text-[#c6c6c7] text-sm font-semibold uppercase tracking-widest">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Team CTA */}
        <section className="bg-[#ff5637] py-16">
          <div className="max-w-[1280px] mx-auto px-5 md:px-6 text-center">
            <h2 className="r004-montserrat text-2xl md:text-[36px] font-black text-white mb-6">
              See What We Can Do For You
            </h2>
            <Link
              href={go(content.about.teamCtaLink)}
              className="inline-flex items-center px-10 py-4 border-2 border-white text-white hover:bg-white hover:text-[#ff5637] font-bold uppercase tracking-wider text-sm transition-colors"
            >
              {content.about.teamCta}
            </Link>
          </div>
        </section>

        <Footer content={content} go={go} />
      </div>
    </div>
  )
}
