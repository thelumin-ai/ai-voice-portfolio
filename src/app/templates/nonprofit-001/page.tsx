'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { DEFAULT_CONTENT } from './default-content'
import { THEME_CONFIG } from './theme'
import { 
  Phone, 
  Search, 
  User, 
  ArrowRight, 
  Heart, 
  Cpu, 
  Bot, 
  Sparkles, 
  Edit3, 
  Eye, 
  Globe,
  Scale
} from 'lucide-react'

export default function Nonprofit001Template() {
  const [content, setContent] = useState(DEFAULT_CONTENT)
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState('Health')
  const pathname = usePathname() || ''

  // Dynamic route prefix compiler
  const getPathWithPrefix = (path: string) => {
    if (pathname.startsWith('/templates/nonprofit-001/preview')) {
      return `/templates/nonprofit-001/preview${path === '/' ? '' : path}`
    }
    if (pathname.startsWith('/templates/nonprofit-001')) {
      return `/templates/nonprofit-001${path === '/' ? '' : path}`
    }
    const sitesMatch = pathname.match(/^\/sites\/([^/]+)/)
    if (sitesMatch) {
      return `/sites/${sitesMatch[1]}${path === '/' ? '' : path}`
    }
    return path
  }

  // Edit handlers
  const handleTextChange = (section: string, field: string, value: string) => {
    setContent((prev: any) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
  }

  const handleListChange = (index: number, field: string, value: string) => {
    setContent((prev: any) => {
      const newList = [...prev.programs.list]
      newList[index] = { ...newList[index], [field]: value }
      return {
        ...prev,
        programs: {
          ...prev.programs,
          list: newList
        }
      }
    })
  }

  return (
    <div className={`min-h-screen ${THEME_CONFIG.bg} ${THEME_CONFIG.font} selection:bg-[#d97706]/30 overflow-x-hidden relative`}>
      
      {/* Interactive Mode Control Overlay */}
      <div className="fixed bottom-6 left-6 z-50 bg-[#1c1917] text-white px-4 py-3 rounded-full flex items-center gap-3 shadow-2xl border border-stone-850">
        <span className="text-[10px] font-sans font-bold tracking-wider uppercase text-stone-400">
          Sandbox Editor:
        </span>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-sans font-semibold transition-all cursor-pointer ${
            isEditing 
              ? 'bg-[#d97706] text-black font-bold' 
              : 'bg-stone-800 text-stone-300 hover:bg-stone-750'
          }`}
        >
          {isEditing ? (
            <>
              <Edit3 className="w-3 h-3" />
              <span>Edit Mode Active</span>
            </>
          ) : (
            <>
              <Eye className="w-3 h-3" />
              <span>Interactive Preview</span>
            </>
          )}
        </button>
      </div>

      {/* 1. Header Navigation */}
      <nav className="w-full bg-[#faf9f6]/95 border-b border-stone-200 sticky top-0 z-40 backdrop-blur">
        <div className="max-w-[1240px] mx-auto px-6 h-20 flex items-center justify-between">
          <Link href={getPathWithPrefix('/')} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-500 via-[#d97706] to-emerald-500 p-0.5 flex items-center justify-center">
              <Heart className="w-4 h-4 text-white fill-white" />
            </div>
            {isEditing ? (
              <input
                type="text"
                value={content.header.logoText}
                onClick={(e) => e.preventDefault()}
                onChange={(e) => handleTextChange('header', 'logoText', e.target.value)}
                className="bg-white border border-stone-300 rounded p-1 text-sm font-bold text-stone-900 w-28 font-serif"
              />
            ) : (
              <span className="font-serif font-extrabold text-xl tracking-tight text-stone-900">
                {content.header.logoText}
              </span>
            )}
          </Link>

          <div className="hidden lg:flex items-center gap-8 text-[10px] font-sans font-extrabold tracking-widest text-stone-600">
            <Link href={getPathWithPrefix('/')} className="hover:text-stone-900 transition-colors text-[#d97706]">HOME</Link>
            <Link href={getPathWithPrefix('/about')} className="hover:text-stone-900 transition-colors">ABOUT</Link>
            <Link href={getPathWithPrefix('/services')} className="hover:text-stone-900 transition-colors">SERVICES</Link>
            <Link href={getPathWithPrefix('/contact')} className="hover:text-stone-900 transition-colors">CONTACT US</Link>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-2 text-[10px] font-sans font-bold text-stone-750">
              <Phone className="w-4 h-4 text-[#d97706]" />
              {isEditing ? (
                <input
                  type="text"
                  value={content.header.phone}
                  onChange={(e) => handleTextChange('header', 'phone', e.target.value)}
                  className="bg-white border border-stone-300 rounded p-0.5 w-28 text-stone-850"
                />
              ) : (
                <span>{content.header.phone}</span>
              )}
            </div>

            <div className="flex items-center gap-4 text-stone-600">
              <Search className="w-4.5 h-4.5 cursor-pointer hover:text-stone-900" />
              <User className="w-4.5 h-4.5 cursor-pointer hover:text-stone-900" />
            </div>

            {isEditing ? (
              <input
                type="text"
                value={content.header.donateText}
                onChange={(e) => handleTextChange('header', 'donateText', e.target.value)}
                className="bg-white border border-[#d97706] rounded p-1 text-[10px] text-stone-900 w-24 text-center font-sans font-bold"
              />
            ) : (
              <Link href={getPathWithPrefix('/contact')} className={`px-5 py-2.5 ${THEME_CONFIG.btn} font-sans font-extrabold text-[9px] tracking-widest rounded transition-colors uppercase`}>
                {content.header.donateText}
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* 2. Hero Section */}
      <section className="relative overflow-hidden py-16 lg:py-24 border-b border-stone-200">
        <div className="absolute inset-0 z-0 opacity-15 pointer-events-none select-none flex items-center justify-center">
          <Globe className="w-[600px] h-[600px] text-stone-400 stroke-[0.5]" />
        </div>

        <div className="max-w-[1240px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          <div className="lg:col-span-7 space-y-6">
            <span className="inline-flex items-center rounded-full px-3 py-1 text-[9px] font-sans font-bold uppercase tracking-widest ring-1 ring-inset ring-[#d97706]/20 bg-[#d97706]/5 text-[#d97706]">
              {content.home.badge}
            </span>

            {isEditing ? (
              <textarea
                value={content.home.heading}
                onChange={(e) => handleTextChange('home', 'heading', e.target.value)}
                className="w-full bg-white border border-stone-300 rounded p-2 font-serif text-3xl sm:text-5xl font-extrabold text-stone-900 leading-tight"
                rows={2}
              />
            ) : (
              <h1 className="text-4xl sm:text-6xl font-serif font-extrabold text-stone-900 leading-tight tracking-tight">
                {content.home.heading}
              </h1>
            )}

            {isEditing ? (
              <textarea
                value={content.home.subheading}
                onChange={(e) => handleTextChange('home', 'subheading', e.target.value)}
                className="w-full bg-white border border-stone-300 rounded p-2 text-stone-600 text-sm leading-relaxed"
                rows={2}
              />
            ) : (
              <p className="text-stone-600 text-base sm:text-lg leading-relaxed max-w-lg">
                {content.home.subheading}
              </p>
            )}

            <div className="pt-2">
              <Link href={getPathWithPrefix('/contact')} className="inline-block px-6 py-3.5 bg-stone-900 text-white hover:bg-stone-850 text-xs font-sans font-extrabold tracking-widest rounded transition-colors uppercase shadow-md">
                {content.home.ctaText}
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
      </section>

      {/* 3. Programs Grid Section */}
      <section className="py-20 bg-white border-b border-stone-200 relative z-10">
        <div className="max-w-[1240px] mx-auto px-6 space-y-16">
          <div className="text-center max-w-xl mx-auto space-y-3">
            {isEditing ? (
              <input
                type="text"
                value={content.programs.heading}
                onChange={(e) => handleTextChange('programs', 'heading', e.target.value)}
                className="bg-white border border-stone-300 rounded p-1 text-center font-serif text-2xl font-bold text-stone-900 w-full"
              />
            ) : (
              <h2 className="text-3xl font-serif font-extrabold text-stone-900">{content.programs.heading}</h2>
            )}

            {isEditing ? (
              <textarea
                value={content.programs.subheading}
                onChange={(e) => handleTextChange('programs', 'subheading', e.target.value)}
                className="w-full bg-white border border-stone-300 rounded p-1 text-center text-stone-500 text-xs"
                rows={2}
              />
            ) : (
              <p className="text-sm text-stone-500 leading-relaxed">{content.programs.subheading}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {content.programs.list.map((prog, idx) => (
              <div key={idx} className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all flex flex-col justify-between h-full">
                <div className="h-44 bg-stone-100 relative overflow-hidden select-none pointer-events-none">
                  <img src={prog.image} alt={prog.title} className="w-full h-full object-cover" />
                </div>
                
                <div className="p-6 space-y-3 flex-grow text-center">
                  {isEditing ? (
                    <input
                      type="text"
                      value={prog.title}
                      onChange={(e) => handleListChange(idx, 'title', e.target.value)}
                      className="w-full bg-white border border-stone-300 rounded p-1 font-serif text-sm font-bold text-stone-900 text-center"
                    />
                  ) : (
                    <h3 className="font-serif font-bold text-base text-stone-900">{prog.title}</h3>
                  )}

                  {isEditing ? (
                    <textarea
                      value={prog.description}
                      onChange={(e) => handleListChange(idx, 'description', e.target.value)}
                      className="w-full bg-white border border-stone-300 rounded p-1 text-stone-600 text-xs text-center"
                      rows={3}
                    />
                  ) : (
                    <p className="text-xs text-stone-600 leading-relaxed">{prog.description}</p>
                  )}
                </div>

                <div className="p-6 pt-0">
                  <Link href={getPathWithPrefix('/services')} className="block text-center py-2.5 bg-stone-900 hover:bg-stone-850 text-white font-sans font-extrabold text-[9px] rounded uppercase tracking-widest shadow-sm">
                    LEARN MORE
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Welcome Mission Banner Section */}
      <section className="py-20 relative overflow-hidden border-b border-stone-200">
        <div className="max-w-3xl mx-auto px-6 text-center space-y-8 relative z-10">
          <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#d97706]">
            Welcome Aid Network
          </span>

          {isEditing ? (
            <textarea
              value={content.home.welcomeHeading}
              onChange={(e) => handleTextChange('home', 'welcomeHeading', e.target.value)}
              className="w-full bg-white border border-stone-300 rounded p-2 text-center font-serif text-2xl font-bold text-stone-900"
              rows={2}
            />
          ) : (
            <h2 className="text-3xl sm:text-4xl font-serif font-extrabold text-stone-900 leading-tight">
              {content.home.welcomeHeading}
            </h2>
          )}

          {isEditing ? (
            <textarea
              value={content.home.welcomeDesc}
              onChange={(e) => handleTextChange('home', 'welcomeDesc', e.target.value)}
              className="w-full bg-white border border-stone-300 rounded p-2 text-center text-stone-650 text-xs"
              rows={4}
            />
          ) : (
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
              {content.home.welcomeDesc}
            </p>
          )}

          <div className="flex justify-center gap-3 font-sans font-bold text-[10px] tracking-widest uppercase">
            <Link href={getPathWithPrefix('/about')} className="px-6 py-3.5 bg-emerald-600 text-white hover:bg-emerald-700 rounded transition-colors shadow">
              {content.home.btnInvolved}
            </Link>
            <Link href={getPathWithPrefix('/contact')} className="px-6 py-3.5 bg-stone-900 text-white hover:bg-stone-850 rounded transition-colors shadow">
              {content.home.btnDonate}
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Fundraiser Circles Split Section */}
      <section className="py-20 bg-white border-b border-stone-200 relative z-10">
        <div className="max-w-[1240px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 flex justify-center relative select-none pointer-events-none">
            <div className="absolute inset-0 flex items-center justify-center opacity-10">
              <span className="w-80 h-80 rounded-full border-2 border-dashed border-stone-800" />
            </div>

            <div className="relative w-64 h-64 border border-stone-200 p-2 rounded-full bg-stone-50 shadow-inner flex items-center justify-center">
              <img 
                src="https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&q=80&w=400"
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
              {content.home.fundraiserCategory}
            </span>

            {isEditing ? (
              <textarea
                value={content.home.fundraiserHeading}
                onChange={(e) => handleTextChange('home', 'fundraiserHeading', e.target.value)}
                className="w-full bg-white border border-stone-300 rounded p-2 font-serif text-2xl font-bold text-stone-900"
                rows={2}
              />
            ) : (
              <h2 className="text-3xl font-serif font-extrabold text-stone-900 leading-tight">
                {content.home.fundraiserHeading}
              </h2>
            )}

            {isEditing ? (
              <input
                type="text"
                value={content.home.fundraiserSubheading}
                onChange={(e) => handleTextChange('home', 'fundraiserSubheading', e.target.value)}
                className="w-full bg-white border border-stone-300 rounded p-1 font-serif text-sm font-bold text-stone-850"
              />
            ) : (
              <h4 className="font-serif font-bold text-base text-stone-850 italic">
                {content.home.fundraiserSubheading}
              </h4>
            )}

            {isEditing ? (
              <textarea
                value={content.home.fundraiserDesc}
                onChange={(e) => handleTextChange('home', 'fundraiserDesc', e.target.value)}
                className="w-full bg-white border border-stone-300 rounded p-2 text-stone-600 text-xs"
                rows={4}
              />
            ) : (
              <p className="text-stone-600 text-sm leading-relaxed">
                {content.home.fundraiserDesc}
              </p>
            )}

            <Link href={getPathWithPrefix('/about')} className="pt-2 inline-flex items-center gap-1.5 text-xs font-sans font-extrabold tracking-wider text-[#d97706] hover:text-amber-600 transition-colors">
              <span>{content.home.fundraiserLinkText}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 6. Choices Tabbed Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="max-w-[1240px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-3">
              <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#d97706] block">
                {content.home.choicesCategory}
              </span>

              {isEditing ? (
                <textarea
                  value={content.home.choicesHeading}
                  onChange={(e) => handleTextChange('home', 'choicesHeading', e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded p-2 font-serif text-2xl font-bold text-stone-900"
                  rows={2}
                />
              ) : (
                <h2 className="text-3xl font-serif font-extrabold text-stone-900 leading-tight">
                  {content.home.choicesHeading}
                </h2>
              )}
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
              <h4 className="font-serif font-bold text-lg text-stone-900">{content.home.choicesSubheading}</h4>
              <p className="text-stone-600 text-sm leading-relaxed max-w-md">
                {content.home.choicesTabDesc}
              </p>
            </div>
          </div>

          <div className="bg-stone-200 rounded-2xl h-80 overflow-hidden shadow-md select-none pointer-events-none relative">
            <img 
              src={content.home.choicesImage}
              alt="Feature Category"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* 7. Footer */}
      <footer className="bg-stone-950 text-stone-500 py-12 border-t border-stone-900 text-xs font-sans">
        <div className="max-w-[1240px] mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <p>© {new Date().getFullYear()} {content.header.logoText} Global Aid Network. All rights reserved.</p>
          
          <div className="flex gap-6 font-bold uppercase tracking-wider text-[10px]">
            <Link href={getPathWithPrefix('/about')} className="hover:text-white transition-colors">About Us</Link>
            <Link href={getPathWithPrefix('/services')} className="hover:text-white transition-colors">Services</Link>
            <Link href={getPathWithPrefix('/contact')} className="hover:text-white transition-colors">Contact</Link>
          </div>
        </div>
      </footer>

    </div>
  )
}
