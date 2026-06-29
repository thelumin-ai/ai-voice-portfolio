'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { DEFAULT_CONTENT } from './default-content'
import { THEME_CONFIG } from './theme'
import { useTemplateContent } from '@/lib/projectsRepo'
import { renderCustomElements } from '@/lib/builderUtils'
import { 
  Phone, 
  Search, 
  User, 
  ArrowRight, 
  Heart, 
  Globe
} from 'lucide-react'

// ─── Route helper ───────────────────────────────────────────────────────────
function useTemplateRouter() {
  const pathname = usePathname() || ''
  return (path: string) => {
    const base = path === '/' ? '' : path
    if (pathname.startsWith('/templates/nonprofit-001/preview'))
      return `/templates/nonprofit-001/preview${base}`
    if (pathname.startsWith('/templates/nonprofit-001'))
      return `/templates/nonprofit-001${base}`
    const m = pathname.match(/^\/sites\/([^/]+)/)
    if (m) return `/sites/${m[1]}${base}`
    return path
  }
}

// ─── Header Component ────────────────────────────────────────────────────────
function Header({ content, go }: { content: any; go: any }) {
  return (
    <nav className="w-full bg-[#faf9f6]/95 border-b border-stone-200 sticky top-0 z-40 backdrop-blur">
      <div className="max-w-[1240px] mx-auto px-6 h-20 flex items-center justify-between">
        <Link href={go('/')} className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-500 via-[#d97706] to-emerald-500 p-0.5 flex items-center justify-center">
            <Heart className="w-4 h-4 text-white fill-white" />
          </div>
          <span className="font-serif font-extrabold text-xl tracking-tight text-stone-900">
            {content.header.logoText}
          </span>
        </Link>

        <div className="hidden lg:flex items-center gap-8 text-[10px] font-sans font-extrabold tracking-widest text-stone-600">
          <Link href={go('/')} className="hover:text-stone-900 transition-colors text-[#d97706]">HOME</Link>
          <Link href={go('/about')} className="hover:text-stone-900 transition-colors">ABOUT</Link>
          <Link href={go('/services')} className="hover:text-stone-900 transition-colors">SERVICES</Link>
          <Link href={go('/contact')} className="hover:text-stone-900 transition-colors">CONTACT US</Link>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden sm:flex items-center gap-2 text-[10px] font-sans font-bold text-stone-750">
            <Phone className="w-4 h-4 text-[#d97706]" />
            <span>{content.header.phone}</span>
          </div>

          <div className="flex items-center gap-4 text-stone-600">
            <Search className="w-4.5 h-4.5 cursor-pointer hover:text-stone-900" />
            <User className="w-4.5 h-4.5 cursor-pointer hover:text-stone-900" />
          </div>

          <Link href={go('/contact')} className={`px-5 py-2.5 ${THEME_CONFIG.btn} font-sans font-extrabold text-[9px] tracking-widest rounded transition-colors uppercase`}>
            {content.header.donateText}
          </Link>
        </div>
      </div>
    </nav>
  )
}

// ─── Footer Component ────────────────────────────────────────────────────────
function Footer({ content, go }: { content: any; go: any }) {
  return (
    <footer className="bg-stone-950 text-stone-500 py-12 border-t border-stone-900 text-xs font-sans">
      <div className="max-w-[1240px] mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
        <p>© {new Date().getFullYear()} {content.header.logoText} Global Aid Network. All rights reserved.</p>
        
        <div className="flex gap-6 font-bold uppercase tracking-wider text-[10px]">
          <Link href={go('/about')} className="hover:text-white transition-colors">About Us</Link>
          <Link href={go('/services')} className="hover:text-white transition-colors">Services</Link>
          <Link href={go('/contact')} className="hover:text-white transition-colors">Contact</Link>
        </div>
      </div>
    </footer>
  )
}

export default function Nonprofit001Template() {
  const { content, project, activePage } = useTemplateContent('nonprofit-001', DEFAULT_CONTENT)
  const [activeTab, setActiveTab] = useState('Health')
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
  const layout = activePage?.layout || ['hero', 'programs', 'welcome', 'fundraiser', 'choices']

  return (
    <div className={`min-h-screen ${THEME_CONFIG.bg} ${THEME_CONFIG.font} selection:bg-[#d97706]/30 overflow-x-hidden relative`}>
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
              className={getSectionClasses(sectionId, "relative overflow-hidden py-16 lg:py-24 border-b border-stone-200")}
            >
              <div className="absolute inset-0 z-0 opacity-15 pointer-events-none select-none flex items-center justify-center">
                <Globe className="w-[600px] h-[600px] text-stone-400 stroke-[0.5]" />
              </div>

              <div className="max-w-[1240px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10 text-left">
                <div className="lg:col-span-7 space-y-6">
                  <span className="inline-flex items-center rounded-full px-3 py-1 text-[9px] font-sans font-bold uppercase tracking-widest ring-1 ring-inset ring-[#d97706]/20 bg-[#d97706]/5 text-[#d97706]">
                    {heroData.badge || content.home.badge}
                  </span>

                  <h1 id={`${sectionId}-heading`} className="text-4xl sm:text-6xl font-serif font-extrabold text-stone-900 leading-tight tracking-tight">
                    {heroData.heading}
                  </h1>

                  <p id={`${sectionId}-subtext`} className="text-stone-600 text-base sm:text-lg leading-relaxed max-w-lg">
                    {heroData.subtext || heroData.subheading}
                  </p>

                  <div className="pt-2">
                    <Link id={`${sectionId}-ctaText`} href={go('/contact')} className="inline-block px-6 py-3.5 bg-stone-900 text-white hover:bg-stone-850 text-xs font-sans font-extrabold tracking-widest rounded transition-colors uppercase shadow-md">
                      {heroData.ctaText || heroData.cta}
                    </Link>
                  </div>
                </div>

                {/* Right visual cylinders showcase */}
                <div className="lg:col-span-5 flex justify-center items-center gap-4 relative select-none pointer-events-none pr-6">
                  <div className="w-20 h-52 bg-stone-200 border-4 border-white shadow-lg rounded-full rotate-12 transform translate-y-6 overflow-hidden relative">
                    <img 
                      src="https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&q=80&w=300"
                      alt="Child Profile"
                      className="w-full h-full object-cover grayscale opacity-90 scale-105"
                    />
                  </div>
                  <div className="w-20 h-64 bg-stone-300 border-4 border-white shadow-xl rounded-full rotate-12 overflow-hidden relative">
                    <img 
                      src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=300"
                      alt="Support Group"
                      className="w-full h-full object-cover scale-105"
                    />
                  </div>
                  <div className="w-20 h-52 bg-stone-200 border-4 border-white shadow-lg rounded-full rotate-12 transform -translate-y-6 overflow-hidden relative">
                    <img 
                      src="https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&q=80&w=300"
                      alt="Equal Access"
                      className="w-full h-full object-cover grayscale opacity-90 scale-105"
                    />
                  </div>
                  
                  <span className="absolute top-12 left-4 w-3 h-3 rounded-full bg-[#d97706]" />
                  <span className="absolute bottom-16 right-4 w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="absolute top-1/2 -translate-y-1/2 right-12 w-2.5 h-2.5 rounded-full bg-blue-500" />
                </div>
              </div>
              {/* Render custom elements */}
              <div className="max-w-[1240px] mx-auto px-6 mt-4">
                {section && renderCustomElements(section.elements)}
              </div>
            </section>
          )
        }

        if (sectionType === 'programs') {
          const progData = section?.content || content.programs
          const list = section?.content?.list || content.programs.list
          return (
            <section 
              key={sectionId} 
              id={sectionId}
              data-section-id={sectionId}
              className={getSectionClasses(sectionId, "py-20 bg-white border-b border-stone-200 relative z-10")}
            >
              <div className="max-w-[1240px] mx-auto px-6 space-y-16 text-center">
                <div className="text-center max-w-xl mx-auto space-y-3">
                  <h2 id={`${sectionId}-heading`} className="text-3xl font-serif font-extrabold text-stone-900">
                    {progData.heading || content.programs.heading}
                  </h2>
                  <p id={`${sectionId}-subtext`} className="text-sm text-stone-500 leading-relaxed">
                    {progData.subtext || progData.subheading}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {list.map((prog: any, idx: number) => (
                    <div key={idx} className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all flex flex-col justify-between h-full text-center">
                      <div className="h-44 bg-stone-100 relative overflow-hidden select-none pointer-events-none">
                        <img src={prog.image} alt={prog.title} className="w-full h-full object-cover" />
                      </div>
                      
                      <div className="p-6 space-y-3 flex-grow">
                        <h3 className="font-serif font-bold text-base text-stone-900">{prog.title}</h3>
                        <p className="text-xs text-stone-600 leading-relaxed">{prog.description || prog.desc}</p>
                      </div>

                      <div className="p-6 pt-0">
                        <Link href={go('/services')} className="block text-center py-2.5 bg-stone-900 hover:bg-stone-850 text-white font-sans font-extrabold text-[9px] rounded uppercase tracking-widest shadow-sm">
                          LEARN MORE
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Render custom elements */}
                {section && renderCustomElements(section.elements)}
              </div>
            </section>
          )
        }

        if (sectionType === 'welcome') {
          const welcomeData = section?.content || content.home
          return (
            <section 
              key={sectionId} 
              id={sectionId}
              data-section-id={sectionId}
              className={getSectionClasses(sectionId, "py-20 relative overflow-hidden border-b border-stone-200")}
            >
              <div className="max-w-3xl mx-auto px-6 text-center space-y-8 relative z-10">
                <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#d97706]">
                  {welcomeData.badge || 'Welcome Aid Network'}
                </span>

                <h2 id={`${sectionId}-heading`} className="text-3xl sm:text-4xl font-serif font-extrabold text-stone-900 leading-tight">
                  {welcomeData.welcomeHeading || welcomeData.heading}
                </h2>

                <p id={`${sectionId}-subtext`} className="text-stone-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
                  {welcomeData.welcomeDesc || welcomeData.subtext || welcomeData.subheading}
                </p>

                <div className="flex justify-center gap-3 font-sans font-bold text-[10px] tracking-widest uppercase">
                  <Link href={go('/about')} className="px-6 py-3.5 bg-emerald-600 text-white hover:bg-emerald-700 rounded transition-colors shadow">
                    {welcomeData.btnInvolved || 'GET INVOLVED'}
                  </Link>
                  <Link id={`${sectionId}-ctaText`} href={go('/contact')} className="px-6 py-3.5 bg-stone-900 text-white hover:bg-stone-850 rounded transition-colors shadow">
                    {welcomeData.btnDonate || welcomeData.ctaText || welcomeData.cta || 'DONATE NOW'}
                  </Link>
                </div>
                {/* Render custom elements */}
                {section && renderCustomElements(section.elements)}
              </div>
            </section>
          )
        }

        if (sectionType === 'fundraiser') {
          const fundData = section?.content || content.home
          return (
            <section 
              key={sectionId} 
              id={sectionId}
              data-section-id={sectionId}
              className={getSectionClasses(sectionId, "py-20 bg-white border-b border-stone-200 relative z-10")}
            >
              <div className="max-w-[1240px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center text-left">
                <div className="lg:col-span-5 flex justify-center relative select-none pointer-events-none">
                  <div className="absolute inset-0 flex items-center justify-center opacity-10">
                    <span className="w-80 h-80 rounded-full border-2 border-dashed border-stone-800" />
                  </div>

                  <div className="relative w-64 h-64 border border-stone-200 p-2 rounded-full bg-stone-50 shadow-inner flex items-center justify-center">
                    <img 
                      src={fundData.fundraiserImage || "https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&q=80&w=400"}
                      alt="Main Focus"
                      className="w-60 h-60 rounded-full object-cover shadow-md"
                    />
                    
                    <div className="absolute -bottom-4 -left-4 w-24 h-24 rounded-full border-4 border-white bg-stone-200 overflow-hidden shadow-lg">
                      <img src="https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&q=80&w=200" alt="Detail 1" className="w-full h-full object-cover" />
                    </div>
                    <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full border-4 border-white bg-stone-200 overflow-hidden shadow-lg">
                      <img src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=200" alt="Detail 2" className="w-full h-full object-cover" />
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-7 space-y-6">
                  <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#d97706] block">
                    {fundData.fundraiserCategory || 'ABOUT US'}
                  </span>

                  <h2 id={`${sectionId}-heading`} className="text-3xl font-serif font-extrabold text-stone-900 leading-tight">
                    {fundData.fundraiserHeading || fundData.heading}
                  </h2>

                  <h4 className="font-serif font-bold text-base text-stone-850 italic">
                    {fundData.fundraiserSubheading || fundData.subheading}
                  </h4>

                  <p id={`${sectionId}-subtext`} className="text-stone-600 text-sm leading-relaxed">
                    {fundData.fundraiserDesc || fundData.subtext}
                  </p>

                  <Link id={`${sectionId}-ctaText`} href={go('/about')} className="pt-2 inline-flex items-center gap-1.5 text-xs font-sans font-extrabold tracking-wider text-[#d97706] hover:text-amber-600 transition-colors">
                    <span>{fundData.fundraiserLinkText || 'Learn More'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
              {/* Render custom elements */}
              <div className="max-w-[1240px] mx-auto px-6 mt-4">
                {section && renderCustomElements(section.elements)}
              </div>
            </section>
          )
        }

        if (sectionType === 'choices') {
          const choicesData = section?.content || content.home
          return (
            <section 
              key={sectionId} 
              id={sectionId}
              data-section-id={sectionId}
              className={getSectionClasses(sectionId, "py-20 relative overflow-hidden text-left")}
            >
              <div className="max-w-[1240px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-8">
                  <div className="space-y-3">
                    <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#d97706] block">
                      {choicesData.choicesCategory || 'WHAT WE DO'}
                    </span>

                    <h2 id={`${sectionId}-heading`} className="text-3xl font-serif font-extrabold text-stone-900 leading-tight">
                      {choicesData.choicesHeading || choicesData.heading}
                    </h2>
                  </div>

                  <div className="flex border-b border-stone-200 pb-3 gap-6 font-sans font-extrabold text-xs tracking-wider text-stone-500">
                    {['Health', 'Education', 'Clean Water', 'Emergency'].map((tab) => {
                      const isActive = activeTab === tab
                      return (
                        <button
                          key={tab}
                          onClick={() => setActiveTab(tab)}
                          className={`pb-3 relative cursor-pointer ${
                            isActive ? 'text-stone-950 font-bold' : 'hover:text-stone-700'
                          }`}
                        >
                          {tab.toUpperCase()}
                          {isActive && (
                            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#d97706]" />
                          )}
                        </button>
                      )
                    })}
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-serif font-bold text-lg text-stone-900">{choicesData.choicesSubheading || choicesData.subheading}</h4>
                    <p id={`${sectionId}-subtext`} className="text-stone-600 text-sm leading-relaxed max-w-md">
                      {choicesData.choicesTabDesc || choicesData.subtext}
                    </p>
                  </div>
                </div>

                <div className="bg-stone-200 rounded-2xl h-80 overflow-hidden shadow-md select-none pointer-events-none relative">
                  <img 
                    src={choicesData.choicesImage || "https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&q=80&w=600"}
                    alt="Feature Category"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              {/* Render custom elements */}
              <div className="max-w-[1240px] mx-auto px-6 mt-4">
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
