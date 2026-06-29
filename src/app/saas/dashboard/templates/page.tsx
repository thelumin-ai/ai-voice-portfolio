'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getTemplateById, REAL_TEMPLATES } from '@/lib/templates'
import { Search, Eye, ArrowRight, Layers, Sparkles } from 'lucide-react'

interface TemplateCard {
  id: string
  name: string
  category: string
  description: string
  isDark: boolean
  bgClass: string
  cardBgClass: string
  niche: string
  previewRoute: string
}

export default function TemplatesPage() {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<string>('All')

  // Categories list
  const categories = [
    'All',
    'Legal',
    'Consulting',
    'Real Estate',
    'Charity',
    'Agency',
    'Construction',
    'Manufacturing'
  ]

  // Construct a list of registered templates
  const allTemplates: TemplateCard[] = []
  
  REAL_TEMPLATES.forEach(tpl => {
    const details = getTemplateById(tpl.id)
    const bgClass = details.bg.split(' ')[0] || 'bg-white'
    const cardBgClass = details.cardBg.split(' ')[0] || 'bg-white'
    
    allTemplates.push({
      id: tpl.id,
      name: tpl.name,
      category: tpl.category,
      description: tpl.description,
      isDark: tpl.isDark,
      bgClass,
      cardBgClass,
      niche: tpl.niche,
      previewRoute: tpl.previewRoute
    })
  })

  // Filter templates
  const filtered = allTemplates.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase()) || 
                          t.category.toLowerCase().includes(search.toLowerCase()) ||
                          t.niche.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = activeCategory === 'All' || t.category === activeCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Title */}
      <div>
        <h1 className="text-xl font-bold text-white">Template Gallery</h1>
        <p className="text-xs text-zinc-400 mt-1">Select a visual foundation to start building your professional website.</p>
      </div>

      {/* Filter and Search controls */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-zinc-900/40 p-4 border border-zinc-850 rounded-2xl">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search templates..."
            className="pl-10 pr-4 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-700 w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Category Tabs */}
        <div className="flex bg-zinc-950 border border-zinc-800 rounded-xl p-1 text-[10px] font-bold overflow-x-auto w-full md:w-auto">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg uppercase tracking-wider transition-all whitespace-nowrap ${
                activeCategory === cat ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Templates */}
      {filtered.length === 0 ? (
        <div className="bg-zinc-900/30 border border-dashed border-zinc-800 py-16 text-center rounded-3xl">
          <Layers className="w-8 h-8 text-zinc-650 mx-auto mb-4" />
          <p className="text-zinc-300 font-bold text-sm">No templates matched</p>
          <p className="text-zinc-500 text-xs mt-1">Try resetting your search query or choosing another category filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(tpl => {
            return (
              <div 
                key={tpl.id} 
                className="bg-zinc-900 border border-zinc-850 rounded-2xl overflow-hidden hover:border-zinc-700 transition-all flex flex-col justify-between h-96 group"
              >
                {/* Visual Preview area */}
                <div className="h-44 bg-zinc-950 relative border-b border-zinc-850 p-6 flex flex-col justify-between overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 text-[8px] font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-md uppercase tracking-wider">
                      {tpl.category}
                    </span>
                    <span className="text-[9px] text-zinc-550 font-bold font-mono uppercase tracking-widest">
                      {tpl.isDark ? 'Dark Theme' : 'Light Theme'}
                    </span>
                  </div>

                  {/* Swatches representation */}
                  <div className="flex gap-2 items-center">
                    <span className={`w-6 h-6 rounded-full border border-zinc-800 shadow-md ${tpl.bgClass}`} title="Canvas background" />
                    <span className={`w-6 h-6 rounded-full border border-zinc-800 shadow-md ${tpl.cardBgClass}`} title="Card elements" />
                    <div className="h-4 w-[1px] bg-zinc-800 mx-1" />
                    <span className="text-[10px] text-zinc-400 font-medium">Palette preset</span>
                  </div>

                  <div className="absolute right-0 bottom-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
                </div>

                {/* Info and action */}
                <div className="p-6 space-y-4 flex-grow flex flex-col justify-between">
                  <div className="space-y-1">
                    <h3 className="font-extrabold text-sm text-white group-hover:text-blue-400 transition-colors">
                      {tpl.name}
                    </h3>
                    <p className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">
                      Niche: {tpl.niche}
                    </p>
                    <p className="text-[11px] text-zinc-400 leading-relaxed pt-1.5 line-clamp-2">
                      {tpl.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 border-t border-zinc-850 pt-4 mt-2">
                    <a
                      href={tpl.previewRoute}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 py-2 px-3 bg-zinc-850 hover:bg-zinc-800 text-zinc-300 hover:text-white rounded-lg text-xs font-semibold border border-zinc-800 transition-all"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Preview</span>
                    </a>

                    <Link
                      href={`/saas/dashboard/create?template_id=${tpl.id}`}
                      className="flex-grow inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all"
                    >
                      <span>Use Template</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

    </div>
  )
}
