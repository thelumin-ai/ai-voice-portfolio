'use client'

import { DEFAULT_CONTENT } from './default-content'
import { THEME_CONFIG } from './theme'
import { useTemplateContent } from '@/lib/projectsRepo'
import { renderCustomElements } from '@/lib/builderUtils'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { 
  Phone, 
  Search, 
  Menu, 
  Play, 
  ArrowRight,
  TrendingUp,
  Layers,
  Code,
  Globe
} from 'lucide-react'

// ─── Route helper ───────────────────────────────────────────────────────────
function useTemplateRouter() {
  const pathname = usePathname() || ''
  return (path: string) => {
    const base = path === '/' ? '' : path
    if (pathname.startsWith('/templates/agency-002/preview'))
      return `/templates/agency-002/preview${base}`
    if (pathname.startsWith('/templates/agency-002'))
      return `/templates/agency-002${base}`
    const m = pathname.match(/^\/sites\/([^/]+)/)
    if (m) return `/sites/${m[1]}${base}`
    return path
  }
}

// ─── Header Navigation ───────────────────────────────────────────────────────
function Header({ content, go }: { content: any; go: any }) {
  return (
    <nav className="w-full bg-[#ffffff]/90 border-b border-slate-100 sticky top-0 z-45 backdrop-blur-md">
      <div className="max-w-[1280px] mx-auto px-6 h-20 flex items-center justify-between">
        <Link href={go('/')} className="flex items-center gap-2">
          <div className="w-6.5 h-6.5 rounded-lg bg-gradient-to-tr from-amber-500 to-[#4e31aa] flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-white" />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-slate-900">
            {content.header.logoText}
          </span>
        </Link>

        <div className="hidden lg:flex items-center gap-8 text-[11px] font-bold tracking-wider text-slate-650">
          <Link href={go('/')} className="hover:text-slate-900 transition-colors text-[#4e31aa]">HOME</Link>
          <Link href={go('/about')} className="hover:text-slate-900 transition-colors">ABOUT</Link>
          <Link href={go('/services')} className="hover:text-slate-900 transition-colors">SERVICES</Link>
          <Link href={go('/contact')} className="hover:text-slate-900 transition-colors">CONTACT US</Link>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden sm:flex items-center gap-2 text-[11px] font-bold text-slate-650 border-r border-slate-200 pr-6">
            <span className="text-slate-400">Call Us:</span>
            <span className="text-slate-900 font-extrabold">{content.header.phone}</span>
          </div>

          <div className="flex items-center gap-4 text-slate-600">
            <Search className="w-4.5 h-4.5 cursor-pointer hover:text-slate-900" />
            <Menu className="w-5 h-5 cursor-pointer hover:text-slate-900" />
          </div>
        </div>
      </div>
    </nav>
  )
}

// ─── Footer Component ────────────────────────────────────────────────────────
function Footer({ content, go }: { content: any; go: any }) {
  return (
    <footer className="bg-slate-950 text-slate-500 py-12 border-t border-slate-900 text-xs font-sans">
      <div className="max-w-[1280px] mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
        <p>© {new Date().getFullYear()} {content.header.logoText} Digital Agency. All rights reserved.</p>
        
        <div className="flex gap-6 font-bold uppercase tracking-wider text-[10px]">
          <Link href={go('/about')} className="hover:text-white transition-colors">About Us</Link>
          <Link href={go('/services')} className="hover:text-white transition-colors">Services</Link>
          <Link href={go('/contact')} className="hover:text-white transition-colors">Contact</Link>
        </div>
      </div>
    </footer>
  )
}

export default function Agency002Template() {
  const { content, project, activePage } = useTemplateContent('agency-002', DEFAULT_CONTENT)
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
  const layout = activePage?.layout || ['hero', 'tools', 'stats']

  return (
    <div className={`min-h-screen bg-[#ffffff] text-slate-800 ${THEME_CONFIG.font} selection:bg-[#4e31aa]/20 overflow-x-hidden relative`}>
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
              className={getSectionClasses(sectionId, "relative py-16 lg:py-24 bg-[#ffffff]")}
            >
              <div className="max-w-[1280px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center text-left">
                {/* Left Text */}
                <div className="lg:col-span-6 space-y-6">
                  <span className="inline-block text-[10px] font-extrabold text-[#4e31aa] tracking-widest bg-[#4e31aa]/5 px-3 py-1 rounded-md">
                    {heroData.badge || content.home.badge}
                  </span>

                  <h1 id={`${sectionId}-heading`} className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight tracking-tight">
                    {heroData.heading}
                  </h1>

                  <p id={`${sectionId}-subtext`} className="text-slate-500 text-base sm:text-lg leading-relaxed max-w-lg">
                    {heroData.subtext || heroData.subheading}
                  </p>

                  <div className="pt-2 flex flex-wrap items-center gap-4">
                    <Link id={`${sectionId}-ctaText`} href={go('/contact')} className="px-6 py-3.5 bg-[#4e31aa] hover:bg-[#3b238c] text-white text-xs font-bold tracking-widest rounded-xl transition-all shadow-lg shadow-purple-500/10">
                      {heroData.ctaText || heroData.cta}
                    </Link>
                    
                    <div className="flex items-center gap-2.5 cursor-pointer group">
                      <span className="w-10 h-10 rounded-full bg-amber-500 hover:bg-amber-600 flex items-center justify-center shadow text-white transition-all group-hover:scale-105">
                        <Play className="w-4 h-4 fill-white ml-0.5" />
                      </span>
                      <span className="text-xs font-bold text-slate-700 group-hover:text-[#4e31aa] transition-colors">
                        {heroData.videoText || 'PLAY VIDEO'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right curved masked team image container */}
                <div className="lg:col-span-6 flex justify-center relative select-none pointer-events-none pr-6">
                  <div className="w-[300px] h-[300px] sm:w-[420px] sm:h-[420px] bg-slate-100 rounded-bl-[160px] rounded-tr-[120px] overflow-hidden shadow-2xl relative border-4 border-white">
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#4e31aa]/10 to-transparent z-10" />
                    <img 
                      src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800" 
                      alt="Digital Agency Team Workspace" 
                      className="w-full h-full object-cover scale-105"
                    />
                  </div>
                  {/* Background elements */}
                  <span className="absolute top-1/2 -left-6 w-12 h-12 rounded-full bg-amber-500/10 -z-10" />
                  <span className="absolute bottom-6 -right-4 w-8 h-8 rounded-full bg-purple-500/10 -z-10" />
                </div>
              </div>
              {/* Render custom elements */}
              <div className="max-w-[1280px] mx-auto px-6 mt-6">
                {section && renderCustomElements(section.elements)}
              </div>
            </section>
          )
        }

        if (sectionType === 'tools') {
          const toolsData = section?.content || content.home
          return (
            <section 
              key={sectionId} 
              id={sectionId}
              data-section-id={sectionId}
              className={getSectionClasses(sectionId, "py-20 bg-slate-50 border-t border-b border-slate-100 relative z-10 text-center")}
            >
              <div className="max-w-[1280px] mx-auto px-6 space-y-16">
                <div className="text-center max-w-xl mx-auto space-y-3">
                  <span className="text-[10px] font-extrabold text-amber-600 tracking-widest uppercase block">
                    {toolsData.toolsCategory || 'CARE FEATURES'}
                  </span>
                  <h2 id={`${sectionId}-heading`} className="text-3xl font-extrabold text-slate-900 leading-tight">
                    {toolsData.toolsHeading || toolsData.heading}
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
                  {[
                    { title: 'Discover, Explore Product', desc: 'Analyzing user flows, exploring product requirements.', color: 'bg-blue-500/10 text-blue-500', icon: Globe },
                    { title: 'Art Direction & Brand', desc: 'Establishing visual design systems and brand directions.', color: 'bg-amber-500/10 text-amber-500', icon: Layers },
                    { title: 'UX, Design & Build', desc: 'Building responsive interfaces and clean React codebases.', color: 'bg-rose-500/10 text-rose-500', icon: Code },
                    { title: 'SEO & Marketing Campaigns', desc: 'Auditing keyword visibility and driving active growth.', color: 'bg-emerald-500/10 text-emerald-500', icon: TrendingUp }
                  ].map((tool, idx) => {
                    const IconComp = tool.icon
                    return (
                      <div key={idx} className="bg-white border border-slate-100 p-6 rounded-2xl shadow-xl shadow-slate-200/50 hover:shadow-[#4e31aa]/5 hover:-translate-y-1 transition-all space-y-4">
                        <div className={`p-3.5 rounded-xl inline-block ${tool.color}`}>
                          <IconComp className="w-5 h-5" />
                        </div>
                        <h3 className="font-extrabold text-sm text-slate-900">{tool.title}</h3>
                        <p className="text-xs text-slate-500 leading-relaxed">{tool.desc}</p>
                        <Link href={go('/services')} className="inline-flex items-center gap-1.5 text-[10px] font-extrabold tracking-wider text-[#4e31aa] hover:underline pt-2">
                          <span>READ MORE</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
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

        if (sectionType === 'stats') {
          const statsData = section?.content || content.home
          const metrics = section?.content?.metrics || content.home.metrics
          return (
            <section 
              key={sectionId} 
              id={sectionId}
              data-section-id={sectionId}
              className={getSectionClasses(sectionId, "py-20 bg-[#ffffff] relative z-10 text-left")}
            >
              <div className="max-w-[1280px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                {/* Left copy */}
                <div className="lg:col-span-6 space-y-6">
                  <span className="text-[10px] font-extrabold text-[#4e31aa] tracking-widest uppercase block">
                    {statsData.statsCategory || 'WHY CHOOSE US'}
                  </span>

                  <h2 id={`${sectionId}-heading`} className="text-3xl font-extrabold text-slate-900 leading-tight">
                    {statsData.statsHeading || statsData.heading}
                  </h2>

                  <p id={`${sectionId}-subtext`} className="text-slate-500 text-sm leading-relaxed">
                    {statsData.statsDesc || statsData.subtext}
                  </p>

                  <div className="pt-2">
                    <Link id={`${sectionId}-ctaText`} href={go('/about')} className="px-6 py-3 bg-[#4e31aa] hover:bg-[#3b238c] text-white text-[10px] font-bold tracking-widest rounded-xl transition-all shadow-md">
                      {statsData.statsBtnText || statsData.ctaText || 'DISCOVER MORE'}
                    </Link>
                  </div>
                </div>

                {/* Right metrics column */}
                <div className="lg:col-span-6 space-y-6 bg-slate-50 p-8 rounded-2xl border border-slate-100">
                  {metrics.map((met: any, idx: number) => (
                    <div key={idx} className="flex gap-4 items-start border-b border-slate-200/60 pb-6 last:border-0 last:pb-0">
                      <div className="w-16 flex-shrink-0">
                        <span className="text-2xl sm:text-3xl font-extrabold text-[#4e31aa] block">
                          {met.value}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-bold text-[10px] text-slate-800 tracking-wider uppercase">
                          {met.label}
                        </h4>
                        <p className="text-[11px] text-slate-550 leading-relaxed font-semibold">
                          {met.desc || met.description}
                        </p>
                      </div>
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

        return null
      })}

      <Footer content={content} go={go} />
    </div>
  )
}

export { Header, Footer, useTemplateRouter }
