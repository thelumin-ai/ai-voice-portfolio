'use client'

import { useState } from 'react'
import { 
  Phone, 
  Search, 
  User, 
  ArrowRight, 
  Heart, 
  BookOpen, 
  Users, 
  Droplet, 
  Activity, 
  Edit3, 
  Eye, 
  Check, 
  Globe 
} from 'lucide-react'

// Default template content schema (fully editable)
const INITIAL_CONTENT = {
  header: {
    logoText: 'Gainlove',
    phone: '(84) 1800 700 999',
    donateText: 'DONATE NOW'
  },
  hero: {
    badge: 'Next-Gen Automation Specialist',
    heading: 'Justice begins where inequality ends',
    subheading: "We're building a world where everyone has the power to shape their lives.",
    ctaText: 'DONATE NOW'
  },
  programs: {
    heading: 'Our Programs',
    subheading: "It's through your support that we can solve the problems of inequality.",
    list: [
      { 
        title: 'Anti Poverty Programs & Services', 
        description: 'Programs and services designed to relieve the effects of and address the root causes of poverty.',
        image: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=600'
      },
      { 
        title: 'Family & Community Programs', 
        description: 'Programs designed to educate and engage all ages of the community. We offer various classes.',
        image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=600'
      },
      { 
        title: 'Teen Programs', 
        description: 'Come visit the resource center\'s Oasis place teen center and take advantage of free youth engagement.',
        image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=600'
      }
    ]
  },
  welcome: {
    heading: 'Welcome to the Gainlove Global aid network',
    description: 'The Gainlove Global aid network establishes a thriving and connected community, ensuring each member has access to resources that enrich and empower. A community where all of its members feel they can talk to, and in which everyone has a chance to both contribute and receive.',
    btnInvolved: 'GET INVOLVED',
    btnDonate: 'DONATE NOW'
  },
  fundraiser: {
    category: 'ABOUT US',
    heading: '2020 fundraiser champions for social justice',
    subheading: 'Help raise $30,000 for the community of Starwood Commons.',
    description: 'The Gainlove Global aid network is hosting an event to educate our community about the services we provide and our foundational Family Support Principles. We will highlight voices and stories from community members impacted by The Gainlove Global aid network.',
    linkText: 'Learn More and Join the Fundraiser'
  },
  choices: {
    category: 'WHAT WE DO',
    heading: 'Give a future full of choices',
    subheading: 'Every child deserves a healthy start',
    tabs: ['Health', 'Education', 'Clean Water', 'Emergency'],
    tabDesc: 'We coordinate local clinics and medical units to ensure children receive pediatric assessments, vaccinations, and dental care from day one.',
    image: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&q=80&w=600'
  }
}

export default function CharityGainloveTemplate() {
  const [content, setContent] = useState(INITIAL_CONTENT)
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState('Health')

  // Edit helper handlers
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
    <div className="min-h-screen bg-[#faf9f6] text-stone-900 font-serif selection:bg-[#d97706]/30 overflow-x-hidden relative">
      
      {/* Floating Mode Switch Overlay (Wix style) */}
      <div className="fixed bottom-6 left-6 z-50 bg-[#1c1917] text-white px-4 py-3 rounded-full flex items-center gap-3 shadow-2xl border border-stone-800">
        <span className="text-xs font-sans font-bold tracking-wider uppercase text-stone-400">
          Template Sandbox:
        </span>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-sans font-semibold transition-all cursor-pointer ${
            isEditing 
              ? 'bg-[#d97706] text-black font-bold' 
              : 'bg-stone-800 text-stone-300 hover:bg-stone-750'
          }`}
        >
          {isEditing ? (
            <>
              <Edit3 className="w-3.5 h-3.5" />
              <span>Editing Active</span>
            </>
          ) : (
            <>
              <Eye className="w-3.5 h-3.5" />
              <span>Interactive Preview</span>
            </>
          )}
        </button>
      </div>

      {/* 1. Header Navigation */}
      <nav className="w-full bg-[#faf9f6]/95 border-b border-stone-200 sticky top-0 z-40 backdrop-blur">
        <div className="max-w-[1240px] mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-500 via-[#d97706] to-emerald-500 p-0.5 flex items-center justify-center">
              <Heart className="w-4 h-4 text-white fill-white" />
            </div>
            {isEditing ? (
              <input
                type="text"
                value={content.header.logoText}
                onChange={(e) => handleTextChange('header', 'logoText', e.target.value)}
                className="bg-white border border-stone-300 rounded p-1 font-serif text-sm font-bold text-stone-900 w-28"
              />
            ) : (
              <span className="font-serif font-extrabold text-xl tracking-tight text-stone-900">
                {content.header.logoText}
              </span>
            )}
          </div>

          {/* Navigation Links */}
          <div className="hidden lg:flex items-center gap-8 text-xs font-sans font-extrabold tracking-widest text-stone-600">
            <span className="hover:text-stone-900 transition-colors cursor-pointer text-[#d97706]">HOME</span>
            <span className="hover:text-stone-900 transition-colors cursor-pointer">CAMPAIGNS</span>
            <span className="hover:text-stone-900 transition-colors cursor-pointer">ABOUT</span>
            <span className="hover:text-stone-900 transition-colors cursor-pointer">BLOG</span>
            <span className="hover:text-stone-900 transition-colors cursor-pointer">PAGES</span>
            <span className="hover:text-stone-900 transition-colors cursor-pointer">CONTACT US</span>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-2 text-xs font-sans font-bold text-stone-700">
              <Phone className="w-4 h-4 text-[#d97706]" />
              {isEditing ? (
                <input
                  type="text"
                  value={content.header.phone}
                  onChange={(e) => handleTextChange('header', 'phone', e.target.value)}
                  className="bg-white border border-stone-300 rounded p-0.5 text-xs text-stone-800 w-28"
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
                className="bg-white border border-[#d97706] rounded p-1 text-xs text-stone-900 w-24 text-center font-sans font-bold"
              />
            ) : (
              <button className="px-5 py-2.5 bg-[#d97706] text-black font-sans font-extrabold text-[10px] tracking-widest rounded hover:bg-amber-600 transition-colors uppercase">
                {content.header.donateText}
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* 2. Hero Section */}
      <section className="relative overflow-hidden py-16 lg:py-24 border-b border-stone-200">
        {/* Map coordinates watermark */}
        <div className="absolute inset-0 z-0 opacity-15 pointer-events-none select-none flex items-center justify-center">
          <Globe className="w-[600px] h-[600px] text-stone-400 stroke-[0.5]" />
        </div>

        <div className="max-w-[1240px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6">
            <span className="inline-flex items-center rounded-full px-3 py-1 text-[10px] font-sans font-bold uppercase tracking-widest ring-1 ring-inset ring-[#d97706]/20 bg-[#d97706]/5 text-[#d97706]">
              Gainlove Global Action Group
            </span>

            {isEditing ? (
              <textarea
                value={content.hero.heading}
                onChange={(e) => handleTextChange('hero', 'heading', e.target.value)}
                className="w-full bg-white border border-stone-300 rounded p-2 font-serif text-3xl sm:text-5xl font-extrabold text-stone-900 leading-tight"
                rows={2}
              />
            ) : (
              <h1 className="text-4xl sm:text-6xl font-serif font-extrabold text-stone-900 leading-tight tracking-tight">
                {content.hero.heading}
              </h1>
            )}

            {isEditing ? (
              <textarea
                value={content.hero.subheading}
                onChange={(e) => handleTextChange('hero', 'subheading', e.target.value)}
                className="w-full bg-white border border-stone-300 rounded p-2 text-stone-600 text-sm leading-relaxed"
                rows={2}
              />
            ) : (
              <p className="text-stone-600 text-base sm:text-lg leading-relaxed max-w-lg">
                {content.hero.subheading}
              </p>
            )}

            <div className="pt-2">
              <button className="px-6 py-3.5 bg-stone-900 text-white hover:bg-stone-800 text-xs font-sans font-extrabold tracking-widest rounded transition-colors uppercase shadow-md shadow-stone-950/10">
                {content.hero.ctaText}
              </button>
            </div>
          </div>

          {/* Right visual cylinders section */}
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
            
            {/* Ambient decorative dots */}
            <span className="absolute top-12 left-4 w-3.5 h-3.5 rounded-full bg-[#d97706]" />
            <span className="absolute bottom-16 right-4 w-2 h-2 rounded-full bg-emerald-500" />
            <span className="absolute top-1/2 -translate-y-1/2 right-12 w-3 h-3 rounded-full bg-blue-500" />
          </div>
        </div>
      </section>

      {/* 3. Programs Showcase Section */}
      <section className="py-20 bg-white border-b border-stone-200 relative z-10">
        <div className="max-w-[1240px] mx-auto px-6 space-y-16">
          {/* Header */}
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

          {/* Cards Grid */}
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
                  <span className="block text-center py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-sans font-extrabold text-[9px] rounded uppercase tracking-widest cursor-pointer shadow-sm">
                    LEARN MORE
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Mission Welcome Section */}
      <section className="py-20 relative overflow-hidden border-b border-stone-200">
        <div className="max-w-3xl mx-auto px-6 text-center space-y-8 relative z-10">
          <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#d97706]">
            Welcome Aid Network
          </span>

          {isEditing ? (
            <textarea
              value={content.welcome.heading}
              onChange={(e) => handleTextChange('welcome', 'heading', e.target.value)}
              className="w-full bg-white border border-stone-300 rounded p-2 text-center font-serif text-2xl font-bold text-stone-900"
              rows={2}
            />
          ) : (
            <h2 className="text-3xl sm:text-4xl font-serif font-extrabold text-stone-900 leading-tight">
              {content.welcome.heading}
            </h2>
          )}

          {isEditing ? (
            <textarea
              value={content.welcome.description}
              onChange={(e) => handleTextChange('welcome', 'description', e.target.value)}
              className="w-full bg-white border border-stone-300 rounded p-2 text-center text-stone-655 text-xs"
              rows={4}
            />
          ) : (
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
              {content.welcome.description}
            </p>
          )}

          <div className="flex justify-center gap-3 font-sans font-bold text-[10px] tracking-widest uppercase">
            <button className="px-6 py-3.5 bg-emerald-600 text-white hover:bg-emerald-700 rounded transition-colors shadow">
              {content.welcome.btnInvolved}
            </button>
            <button className="px-6 py-3.5 bg-stone-900 text-white hover:bg-stone-850 rounded transition-colors shadow">
              {content.welcome.btnDonate}
            </button>
          </div>
        </div>
      </section>

      {/* 5. Fundraiser Split Section */}
      <section className="py-20 bg-white border-b border-stone-200 relative z-10">
        <div className="max-w-[1240px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left circles block */}
          <div className="lg:col-span-5 flex justify-center relative select-none pointer-events-none">
            {/* Concentric dashed rings */}
            <div className="absolute inset-0 flex items-center justify-center opacity-10">
              <span className="w-80 h-80 rounded-full border-2 border-dashed border-stone-800" />
            </div>

            <div className="relative w-64 h-64 border border-stone-200 p-2 rounded-full bg-stone-50 shadow-inner flex items-center justify-center">
              <img 
                src="https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&q=80&w=400"
                alt="Main Focus"
                className="w-60 h-60 rounded-full object-cover shadow-md"
              />
              
              {/* Overlapping small circular previews */}
              <div className="absolute -bottom-4 -left-4 w-24 h-24 rounded-full border-4 border-white bg-stone-200 overflow-hidden shadow-lg">
                <img src="https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&q=80&w=200" alt="Detail 1" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full border-4 border-white bg-stone-200 overflow-hidden shadow-lg">
                <img src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=200" alt="Detail 2" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>

          {/* Right Text Block */}
          <div className="lg:col-span-7 space-y-6">
            <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#d97706] block">
              {content.fundraiser.category}
            </span>

            {isEditing ? (
              <textarea
                value={content.fundraiser.heading}
                onChange={(e) => handleTextChange('fundraiser', 'heading', e.target.value)}
                className="w-full bg-white border border-stone-300 rounded p-2 font-serif text-2xl font-bold text-stone-900"
                rows={2}
              />
            ) : (
              <h2 className="text-3xl font-serif font-extrabold text-stone-900 leading-tight">
                {content.fundraiser.heading}
              </h2>
            )}

            {isEditing ? (
              <input
                type="text"
                value={content.fundraiser.subheading}
                onChange={(e) => handleTextChange('fundraiser', 'subheading', e.target.value)}
                className="w-full bg-white border border-stone-300 rounded p-1 font-serif text-sm font-bold text-stone-850"
              />
            ) : (
              <h4 className="font-serif font-bold text-base text-stone-800 italic">
                {content.fundraiser.subheading}
              </h4>
            )}

            {isEditing ? (
              <textarea
                value={content.fundraiser.description}
                onChange={(e) => handleTextChange('fundraiser', 'description', e.target.value)}
                className="w-full bg-white border border-stone-300 rounded p-2 text-stone-600 text-xs"
                rows={4}
              />
            ) : (
              <p className="text-stone-655 text-sm leading-relaxed text-stone-600">
                {content.fundraiser.description}
              </p>
            )}

            <div className="pt-2 flex items-center gap-1.5 text-xs font-sans font-extrabold tracking-wider text-[#d97706] hover:text-amber-600 cursor-pointer">
              <span>{content.fundraiser.linkText}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </section>

      {/* 6. Tabbed Feature Split Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="max-w-[1240px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left category panel */}
          <div className="space-y-8">
            <div className="space-y-3">
              <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#d97706] block">
                {content.choices.category}
              </span>

              {isEditing ? (
                <textarea
                  value={content.choices.heading}
                  onChange={(e) => handleTextChange('choices', 'heading', e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded p-2 font-serif text-2xl font-bold text-stone-900"
                  rows={2}
                />
              ) : (
                <h2 className="text-3xl font-serif font-extrabold text-stone-900 leading-tight">
                  {content.choices.heading}
                </h2>
              )}
            </div>

            {/* Tab links */}
            <div className="flex border-b border-stone-200 pb-3 gap-6 font-sans font-extrabold text-xs tracking-wider text-stone-500">
              {content.choices.tabs.map((tab) => {
                const isActive = activeTab === tab
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-3 relative cursor-pointer ${
                      isActive ? 'text-stone-950 font-bold' : 'hover:text-stone-750'
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
              <h4 className="font-serif font-bold text-lg text-stone-900">{content.choices.subheading}</h4>
              <p className="text-stone-600 text-xs sm:text-sm leading-relaxed max-w-md">
                {content.choices.tabDesc}
              </p>
            </div>
          </div>

          {/* Right Showcase image */}
          <div className="bg-stone-200 rounded-2xl h-80 overflow-hidden shadow-md select-none pointer-events-none relative">
            <img 
              src={content.choices.image}
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
            <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
            <span className="hover:text-white cursor-pointer transition-colors">Contact</span>
          </div>
        </div>
      </footer>

    </div>
  )
}
