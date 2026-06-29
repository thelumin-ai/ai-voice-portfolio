'use client'

import Link from 'next/link'
import { DEFAULT_CONTENT } from '../default-content'
import { Header, Footer, useTemplateRouter } from '../page'
import { useTemplateContent } from '@/lib/projectsRepo'

export default function Roofing004Services() {
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
              {content.services.bannerLabel}
            </span>
            <h1 className="r004-montserrat text-3xl md:text-[48px] font-black text-white leading-tight tracking-tight max-w-2xl">
              {content.services.bannerHeading.split('\n').map((line: string, i: number) => (
                <span key={i}>
                  {line}
                  {i < content.services.bannerHeading.split('\n').length - 1 && <br />}
                </span>
              ))}
            </h1>
            <p className="text-[#c6c6c7] text-base leading-relaxed max-w-2xl mt-6">
              {content.services.introText}
            </p>
          </div>
        </section>

        {/* Six Service Cards */}
        <section className="w-full max-w-[1280px] mx-auto px-5 md:px-6 py-20 md:py-28">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {content.services.servicesList.map((svc: any, idx: number) => (
              <div
                key={idx}
                className="bg-[#202020] border border-[#353535] p-10 flex flex-col gap-5 hover:border-[#ff5637]/60 transition-colors duration-200 group"
              >
                <span className="material-symbols-outlined text-[#ff5637] text-[36px] leading-none">
                  {svc.icon}
                </span>
                <h3 className="r004-montserrat text-xl font-black text-white leading-tight">
                  {svc.title}
                </h3>
                <p className="text-[#c6c6c7] text-sm leading-relaxed flex-grow">{svc.desc}</p>
                <Link
                  href={go('/contact')}
                  className="self-start text-[#ffb4a5] text-xs font-bold uppercase tracking-widest hover:text-white transition-colors"
                >
                  Learn More →
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Process Timeline */}
        <section className="bg-[#0e0e0e] border-t border-b border-[#353535] py-20 md:py-28">
          <div className="max-w-[1280px] mx-auto px-5 md:px-6">
            <h2 className="r004-montserrat text-2xl md:text-[36px] font-black text-white text-center mb-16">
              {content.services.processHeading}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative">
              {/* Connector line (desktop) */}
              <div className="hidden md:block absolute top-8 left-[calc(16.67%+24px)] right-[calc(16.67%+24px)] h-[2px] bg-[#353535]" />
              {content.services.processSteps.map((step: any, idx: number) => (
                <div key={idx} className="relative flex flex-col gap-5">
                  <div className="flex items-center gap-4">
                    <span className="r004-montserrat text-[#ff5637] text-3xl font-black leading-none flex-shrink-0">
                      {step.step}
                    </span>
                    <div className="h-[2px] flex-grow bg-[#353535] md:hidden" />
                  </div>
                  <h3 className="r004-montserrat text-lg font-black text-white">{step.title}</h3>
                  <p className="text-[#c6c6c7] text-sm leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Strip */}
        <section className="bg-[#ff5637] py-20">
          <div className="max-w-[1280px] mx-auto px-5 md:px-6 text-center">
            <h2 className="r004-montserrat text-2xl md:text-[36px] font-black text-white mb-8">
              {content.services.ctaHeading}
            </h2>
            <Link
              href={go(content.services.ctaLink)}
              className="inline-flex items-center px-10 py-5 bg-[#131313] hover:bg-[#0e0e0e] text-white font-black uppercase tracking-widest text-sm transition-colors"
            >
              {content.services.ctaText}
            </Link>
          </div>
        </section>

        <Footer content={content} go={go} />
      </div>
    </div>
  )
}
