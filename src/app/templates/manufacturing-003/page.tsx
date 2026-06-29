'use client'

import { DEFAULT_CONTENT } from './default-content'
import { THEME_CONFIG } from './theme'
import { useTemplateContent } from '@/lib/projectsRepo'
import { renderCustomElements } from '@/lib/builderUtils'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { 
  Phone, 
  Mail, 
  MapPin, 
  ArrowRight,
  Shield,
  Layers,
  Cpu,
  Zap,
  Droplet
} from 'lucide-react'

// ─── Route helper ───────────────────────────────────────────────────────────
function useTemplateRouter() {
  const pathname = usePathname() || ''
  return (path: string) => {
    const base = path === '/' ? '' : path
    if (pathname.startsWith('/templates/manufacturing-003/preview'))
      return `/templates/manufacturing-003/preview${base}`
    if (pathname.startsWith('/templates/manufacturing-003'))
      return `/templates/manufacturing-003${base}`
    const m = pathname.match(/^\/sites\/([^/]+)/)
    if (m) return `/sites/${m[1]}${base}`
    return path
  }
}

// ─── Header Navigation ───────────────────────────────────────────────────────
function Header({ content, go }: { content: any; go: any }) {
  return (
    <div className="w-full relative z-40">
      {/* Utility Top Bar */}
      <div className="w-full bg-[#0b1c3c] text-slate-350 text-[10px] font-semibold py-2.5 border-b border-white/5">
        <div className="max-w-[1280px] mx-auto px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-left">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex gap-1.5 items-center">
              <MapPin className="w-3.5 h-3.5 text-[#f28500]" />
              <span>{content.header.address}</span>
            </div>
            <div className="flex gap-1.5 items-center">
              <Mail className="w-3.5 h-3.5 text-[#f28500]" />
              <span>{content.header.email}</span>
            </div>
          </div>
          <div className="flex gap-1.5 items-center">
            <Phone className="w-3.5 h-3.5 text-[#f28500]" />
            <span>Call: {content.header.phone}</span>
          </div>
        </div>
      </div>

      {/* Main Nav Bar */}
      <nav className="w-full bg-[#ffffff] border-b border-slate-100 shadow-sm">
        <div className="max-w-[1280px] mx-auto px-6 h-20 flex items-center justify-between">
          <Link href={go('/')} className="flex flex-col text-left">
            <span className="font-black text-lg tracking-wider text-[#0b1c3c] leading-none">
              {content.header.logoText}
            </span>
            <span className="text-[7.5px] font-bold text-slate-400 tracking-wider uppercase mt-1">
              {content.header.slogan}
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-8 text-[11px] font-bold tracking-wider text-slate-650">
            <Link href={go('/')} className="hover:text-slate-900 transition-colors text-[#f28500]">HOME</Link>
            <Link href={go('/about')} className="hover:text-slate-900 transition-colors">ABOUT US</Link>
            <Link href={go('/services')} className="hover:text-slate-900 transition-colors">PRODUCTS</Link>
            <Link href={go('/contact')} className="hover:text-slate-900 transition-colors">CONTACT</Link>
          </div>

          <Link href={go('/contact')} className="px-5 py-2.5 bg-[#f28500] hover:bg-[#d97300] text-white font-bold text-[10px] uppercase tracking-wider rounded-lg transition-colors">
            {content.header.quoteText}
          </Link>
        </div>
      </nav>
    </div>
  )
}

// ─── Footer Component ────────────────────────────────────────────────────────
function Footer({ content, go }: { content: any; go: any }) {
  return (
    <footer className="bg-[#0b1c3c] text-slate-400 py-16 border-t border-white/5 text-xs relative z-10 text-left">
      <div className="max-w-[1280px] mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 text-left mb-12">
        <div className="space-y-4">
          <h3 className="font-black text-lg text-white tracking-wider">{content.header.logoText}</h3>
          <p className="text-[11px] text-slate-400 leading-relaxed">{content.header.slogan}</p>
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-xs uppercase tracking-wider text-white">Quick Links</h4>
          <div className="flex flex-col gap-2.5 text-[11px]">
            <Link href={go('/')} className="hover:text-white transition-colors">Home</Link>
            <Link href={go('/about')} className="hover:text-white transition-colors">About Us</Link>
            <Link href={go('/services')} className="hover:text-white transition-colors">Products</Link>
            <Link href={go('/contact')} className="hover:text-white transition-colors">Contact</Link>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-xs uppercase tracking-wider text-white">Products</h4>
          <div className="flex flex-col gap-2.5 text-[11px]">
            <span className="hover:text-white transition-colors cursor-pointer">uPVC Plumbing</span>
            <span className="hover:text-white transition-colors cursor-pointer">cPVC Fittings</span>
            <span className="hover:text-white transition-colors cursor-pointer">SWR Drainage</span>
            <span className="hover:text-white transition-colors cursor-pointer">Agri Irrigation</span>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-xs uppercase tracking-wider text-white">HQ Office</h4>
          <div className="space-y-3 text-[11px]">
            <div className="flex gap-2 items-center">
              <MapPin className="w-4 h-4 text-[#f28500] flex-shrink-0" />
              <span>{content.contact.address}</span>
            </div>
            <div className="flex gap-2 items-center">
              <Phone className="w-4 h-4 text-[#f28500] flex-shrink-0" />
              <span>{content.header.phone}</span>
            </div>
            <div className="flex gap-2 items-center">
              <Mail className="w-4 h-4 text-[#f28500] flex-shrink-0" />
              <span>{content.header.email}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-6 border-t border-white/5 pt-8 text-center text-[10px] text-slate-500 font-semibold">
        <p>© {new Date().getFullYear()} {content.header.logoText}. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default function Manufacturing003Template() {
  const { content, project, activePage } = useTemplateContent('manufacturing-003', DEFAULT_CONTENT)
  const go = useTemplateRouter()

  // Compile helper to apply section and custom element styling
  const getSectionClasses = (sectionId: string, defaultClasses = '') => {
    const section = activePage?.sections?.[sectionId]
    if (!section) return defaultClasses
    const classes = [defaultClasses]
    if (section.styles?.bgColor) classes.push(section.styles.bgColor)
    if (section.styles?.padding) classes.push(section.styles.padding)
    if (section.content?.align === 'center') classes.push('text-center')
    else if (section.content?.align === 'right') classes.push('text-right')
    if (section.content?.hideDesktop === true || section.content?.hideDesktop === 'true') classes.push('lg:hidden')
    if (section.content?.hideTablet === true || section.content?.hideTablet === 'true') classes.push('md:max-lg:hidden')
    if (section.content?.hideMobile === true || section.content?.hideMobile === 'true') classes.push('max-md:hidden')
    return classes.join(' ')
  }

  // Get layout section list
  const layout = activePage?.layout || ['hero', 'products', 'why', 'industries']

  return (
    <div className={`min-h-screen bg-[#fafbfe] text-slate-800 ${THEME_CONFIG.font} selection:bg-[#f28500]/20 overflow-x-hidden relative`}>
      <Header content={content} go={go} />

      {layout.map((sectionId) => {
        const section = activePage?.sections?.[sectionId]
        const isVisible = section ? section.isVisible : true
        if (!isVisible) return null

        // Resolve section type
        const sectionType = section ? section.type : sectionId

        if (sectionType === 'hero') {
          const heroData = section?.content || content.home
          return (
            <section 
              key={sectionId} 
              id={sectionId}
              data-section-id={sectionId}
              className={getSectionClasses(sectionId, "relative py-16 lg:py-24 bg-gradient-to-tr from-[#0b1c3c] to-[#122b5c] text-white overflow-hidden")}
            >
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1600')] bg-cover bg-center mix-blend-overlay opacity-15 pointer-events-none select-none" />

              <div className="max-w-[1280px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10 text-left">
                {/* Left Text */}
                <div className="lg:col-span-7 space-y-6">
                  <h1 id={`${sectionId}-heading`} className="text-4xl sm:text-5xl lg:text-[54px] font-black text-white leading-[1.1] tracking-tight">
                    {heroData.heading}
                  </h1>

                  <p id={`${sectionId}-subtext`} className="text-slate-350 text-base sm:text-lg leading-relaxed max-w-lg">
                    {heroData.subtext || heroData.subheading}
                  </p>

                  <div className="pt-2 flex flex-wrap items-center gap-4">
                    <Link id={`${sectionId}-ctaText`} href={go('/services')} className="px-6 py-3.5 bg-[#f28500] hover:bg-[#d97300] text-white text-xs font-extrabold tracking-wider uppercase rounded-lg transition-colors shadow-lg">
                      {heroData.btnExplore || heroData.ctaText || heroData.cta || 'Explore Products'}
                    </Link>
                    
                    <a href="#" className="px-6 py-3.5 border-2 border-white/40 text-white hover:border-white hover:bg-white/5 text-xs font-extrabold tracking-wider uppercase rounded-lg transition-colors">
                      {heroData.btnBrochure || 'Download Brochure'}
                    </a>
                  </div>
                </div>

                {/* Right pipe preview cylinder container */}
                <div className="lg:col-span-5 flex justify-center relative select-none pointer-events-none pr-6">
                  <div className="w-[300px] h-[300px] sm:w-[380px] sm:h-[380px] rounded-2xl overflow-hidden shadow-2xl relative border-4 border-white/10">
                    <img 
                      src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800" 
                      alt="PVC Pipes Manufacture" 
                      className="w-full h-full object-cover scale-105"
                    />
                  </div>
                  <span className="absolute -bottom-6 -left-6 w-16 h-16 rounded-full bg-[#f28500]/25 -z-10 blur-xl" />
                </div>
              </div>
              {/* Render custom elements */}
              <div className="max-w-[1280px] mx-auto px-6 mt-6">
                {section && renderCustomElements(section.elements)}
              </div>
            </section>
          )
        }

        if (sectionType === 'products') {
          const prodData = section?.content || content.home
          const productsList = section?.content?.productsList || content.home.productsList
          return (
            <section 
              key={sectionId} 
              id={sectionId}
              data-section-id={sectionId}
              className={getSectionClasses(sectionId, "py-20 bg-white border-b border-slate-200/60 relative z-10 text-center")}
            >
              <div className="max-w-[1280px] mx-auto px-6 space-y-16">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 text-left">
                  <div className="space-y-3">
                    <span className="text-[10px] font-extrabold text-[#f28500] tracking-widest uppercase block">
                      PRODUCTS RANGE
                    </span>
                    <h2 id={`${sectionId}-heading`} className="text-3xl font-black text-[#0b1c3c] leading-tight">
                      {prodData.productsTitle || prodData.heading}
                    </h2>
                  </div>
                  <Link href={go('/services')} className="px-5 py-3 border-2 border-[#0b1c3c] hover:bg-[#0b1c3c] hover:text-white text-[#0b1c3c] text-xs font-bold uppercase rounded-lg transition-colors">
                    {prodData.productsBtn || 'View All Products'}
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
                  {productsList.map((prod: any, idx: number) => (
                    <div key={idx} className="bg-[#fafbfe] border border-slate-200/60 p-8 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all space-y-4">
                      <div className="p-3 bg-[#0b1c3c]/5 text-[#0b1c3c] rounded-xl inline-block">
                        <Layers className="w-5 h-5" />
                      </div>
                      <h3 className="font-extrabold text-sm text-[#0b1c3c]">{prod.title}</h3>
                      <p className="text-xs text-slate-500 leading-relaxed font-semibold">{prod.desc || prod.description}</p>
                    </div>
                  ))}
                </div>
                {/* Render custom elements */}
                {section && renderCustomElements(section.elements)}
              </div>
            </section>
          )
        }

        if (sectionType === 'why') {
          const whyData = section?.content || content.home
          const stats = section?.content?.stats || content.home.stats
          return (
            <section 
              key={sectionId} 
              id={sectionId}
              data-section-id={sectionId}
              className={getSectionClasses(sectionId, "py-20 bg-slate-50 border-b border-slate-200/60 relative z-10 text-left")}
            >
              <div className="max-w-[1280px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                {/* Left column info */}
                <div className="lg:col-span-6 space-y-6">
                  <span className="text-[10px] font-extrabold text-[#f28500] tracking-widest uppercase block">
                    {whyData.whyTitle || 'WHY SARVAM'}
                  </span>
                  <h2 id={`${sectionId}-heading`} className="text-3xl font-black text-[#0b1c3c] leading-tight">
                    {whyData.whyTitle || whyData.heading}
                  </h2>
                  <p id={`${sectionId}-subtext`} className="text-slate-500 text-sm leading-relaxed font-semibold">
                    {whyData.whyDesc || whyData.subtext}
                  </p>
                  <div className="pt-2">
                    <Link id={`${sectionId}-ctaText`} href={go('/about')} className="px-6 py-3 bg-[#0b1c3c] hover:bg-[#122b5c] text-white text-[10px] font-bold tracking-widest rounded-lg transition-all shadow-md">
                      {whyData.whyBtn || whyData.ctaText || 'Learn More'}
                    </Link>
                  </div>
                </div>

                {/* Right stats grid */}
                <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {stats.map((stat: any, idx: number) => (
                    <div key={idx} className="bg-white border border-slate-200/60 p-6 rounded-2xl text-center space-y-2 shadow-sm">
                      <span className="text-2xl font-black text-[#f28500] block">{stat.value}</span>
                      <h4 className="font-extrabold text-[10px] text-[#0b1c3c] uppercase tracking-wider">{stat.label}</h4>
                      <p className="text-[10px] text-slate-500 leading-relaxed font-semibold">{stat.desc || stat.description}</p>
                    </div>
                  ))}
                </div>
              </div>
              {/* Render custom elements */}
              <div className="max-w-[1280px] mx-auto px-6 mt-6">
                {section && renderCustomElements(section.elements)}
              </div>
            </section>
          )
        }

        if (sectionType === 'industries') {
          const indData = section?.content || content.home
          const list = section?.content?.industriesList || content.home.industriesList
          return (
            <section 
              key={sectionId} 
              id={sectionId}
              data-section-id={sectionId}
              className={getSectionClasses(sectionId, "py-20 bg-white relative z-10 text-center")}
            >
              <div className="max-w-[1280px] mx-auto px-6 space-y-12">
                <div className="text-center max-w-xl mx-auto space-y-3">
                  <h2 id={`${sectionId}-heading`} className="text-3xl font-black text-[#0b1c3c]">
                    {indData.industriesTitle || indData.heading}
                  </h2>
                  <p id={`${sectionId}-subtext`} className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed font-semibold">
                    {indData.industriesDesc || indData.subtext}
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
                  {list.map((ind: any, idx: number) => {
                    const IconComp = idx === 0 ? Layers : idx === 1 ? Droplet : idx === 2 ? Cpu : idx === 3 ? Zap : Shield
                    return (
                      <div key={idx} className="bg-[#fafbfe] border border-slate-200/60 p-6 rounded-xl space-y-3 shadow-sm text-center">
                        <div className="p-3 bg-[#f28500]/5 text-[#f28500] rounded-full inline-block">
                          <IconComp className="w-5 h-5" />
                        </div>
                        <h3 className="font-extrabold text-xs text-[#0b1c3c]">{ind.title}</h3>
                      </div>
                    )
                  })}
                </div>
                {/* Render custom elements */}
                {section && renderCustomElements(section.elements)}
              </div>
            </section>
          )
        }

        return null
      })}

      <Footer content={content} go={go} />
    </div>
  )
}

export { Header, Footer, useTemplateRouter }
