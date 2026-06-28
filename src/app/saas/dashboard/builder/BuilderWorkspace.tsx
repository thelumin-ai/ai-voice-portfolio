'use client'

import { useState, useTransition } from 'react'
import { updateBuilderConfig, applyPrebuiltContent } from './actions'
import { 
  getTemplateById, 
  getTemplatesForIndustry, 
  INDUSTRIES 
} from '@/lib/templates'
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragEndEvent
} from '@dnd-kit/core'
import { 
  arrayMove, 
  SortableContext, 
  sortableKeyboardCoordinates, 
  verticalListSortingStrategy 
} from '@dnd-kit/sortable'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { 
  Sparkles, 
  Save, 
  Check, 
  GripVertical, 
  Eye, 
  EyeOff, 
  AlertCircle,
  Play,
  RotateCcw
} from 'lucide-react'

// Sortable Section Row Component
interface SortableItemProps {
  id: string
  label: string
  isVisible: boolean
  onToggleVisibility: () => void
}

function SortableItem({ id, label, isVisible, onToggleVisibility }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 20 : 'auto'
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center justify-between p-3.5 bg-zinc-900 border border-zinc-800 rounded-xl select-none"
    >
      <div className="flex items-center gap-3">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="p-1 text-zinc-500 hover:text-zinc-300 cursor-grab active:cursor-grabbing hover:bg-zinc-800 rounded transition-colors"
        >
          <GripVertical className="w-4 h-4" />
        </button>
        <span className="font-medium text-xs text-zinc-300">
          {label}
        </span>
      </div>

      {/* Visibility Toggle */}
      <button
        type="button"
        onClick={onToggleVisibility}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-semibold border transition-all cursor-pointer ${
          isVisible 
            ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' 
            : 'bg-zinc-800/40 text-zinc-500 border-zinc-800'
        }`}
      >
        {isVisible ? (
          <>
            <Eye className="w-3 h-3" />
            <span>Visible</span>
          </>
        ) : (
          <>
            <EyeOff className="w-3 h-3" />
            <span>Hidden</span>
          </>
        )}
      </button>
    </div>
  )
}

interface BuilderWorkspaceProps {
  initialTenant: {
    template_id: string
    layout_structure: string[]
    visible_sections: string[]
    company_name: string
    subdomain: string
  }
}

export default function BuilderWorkspace({ initialTenant }: BuilderWorkspaceProps) {
  const [isPending, startTransition] = useTransition()
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Layout states
  const [layout, setLayout] = useState<string[]>(
    initialTenant.layout_structure || ['hero', 'services', 'about']
  )
  const [visibleSections, setVisibleSections] = useState<string[]>(
    initialTenant.visible_sections || ['hero', 'services', 'about']
  )

  // Theme states
  const initialTemplate = getTemplateById(initialTenant.template_id)
  
  // Extract initial industry from template_id (e.g. `legal_practice_advmarc` -> `legal_practice`)
  const getInitialIndustry = () => {
    if (!initialTenant.template_id) return INDUSTRIES[0].id
    const parts = initialTenant.template_id.split('_')
    if (parts.length < 2) return INDUSTRIES[0].id
    const lastTwo = parts.slice(-2).join('_')
    const suffixes = ['advmarc', 'consult', 'dycrw', 'renthu', 'estate_teal', 'gainlove']
    if (suffixes.includes(lastTwo)) {
      return parts.slice(0, -2).join('_')
    }
    return parts.slice(0, -1).join('_')
  }

  const [selectedIndustry, setSelectedIndustry] = useState<string>(getInitialIndustry())
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(
    initialTenant.template_id || 'legal_practice_advmarc'
  )
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Legal' | 'Consulting' | 'Real Estate' | 'Charity'>('All')

  // Sensors for @dnd-kit
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Handle section drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    
    if (over && active.id !== over.id) {
      setLayout((items) => {
        const oldIndex = items.indexOf(active.id as string)
        const newIndex = items.indexOf(over.id as string)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  // Toggle visible section array
  const toggleVisibility = (sectionId: string) => {
    setVisibleSections((prev) => {
      if (prev.includes(sectionId)) {
        return prev.filter(id => id !== sectionId)
      } else {
        return [...prev, sectionId]
      }
    })
  }

  // Handle Save
  const handleSave = () => {
    setError(null)
    setSuccess(false)
    
    startTransition(async () => {
      const res = await updateBuilderConfig(selectedTemplateId, layout, visibleSections)
      if (res.error) {
        setError(res.error)
      } else {
        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
      }
    })
  }

  const [isApplying, startApplyTransition] = useTransition()
  const [applySuccess, setApplySuccess] = useState(false)

  const handleApplyPrebuilt = () => {
    setError(null)
    setApplySuccess(false)
    
    if (confirm("Applying the template copy will overwrite your current profile biography, skills, and solutions. Do you want to continue?")) {
      startApplyTransition(async () => {
        const res = await applyPrebuiltContent(selectedTemplateId)
        if (res.error) {
          setError(res.error)
        } else {
          setApplySuccess(true)
          setTimeout(() => setApplySuccess(false), 3000)
          window.location.reload()
        }
      })
    }
  }

  const activeTemplateDetails = getTemplateById(selectedTemplateId)

  // Compile mock browser preview URL query parameters
  const previewUrl = `/saas/preview?template_id=${selectedTemplateId}&layout=${layout.join(',')}&visible=${visibleSections.join(',')}&companyName=${encodeURIComponent(initialTenant.company_name)}`

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* Overview header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-900 border border-zinc-800/80 p-6 rounded-2xl transition-colors duration-300">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-400" />
            Visual Site Builder
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Pick your industry, choose a theme structure, and drag sections to customize your layout order.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isPending}
          className="flex items-center justify-center gap-2 py-2.5 px-5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-xl text-xs transition-colors cursor-pointer shadow-md shadow-blue-500/10"
        >
          {success ? (
            <>
              <Check className="w-4 h-4" />
              <span>Saved Successfully</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>{isPending ? 'Saving...' : 'Save Configuration'}</span>
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Stacked Sidebar Editor Controls */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Card 1: Template & Theme Selector */}
          <div className="bg-zinc-900/60 border border-zinc-850 p-6 rounded-2xl space-y-5">
            <div>
              <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">
                1. Browse by Category
              </h2>
              
              {/* Category tabs */}
              <div className="flex border-b border-zinc-800 pb-2 mb-4 gap-3 text-xs font-semibold overflow-x-auto">
                {(['All', 'Legal', 'Consulting', 'Real Estate', 'Charity'] as const).map((cat) => {
                  const isActive = selectedCategory === cat
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`pb-1 px-1.5 relative whitespace-nowrap cursor-pointer ${
                        isActive ? 'text-blue-400 font-bold' : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      {cat}
                      {isActive && (
                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2.5">
                Available Templates
              </label>
              <div className="grid grid-cols-2 gap-2 max-h-[220px] overflow-y-auto pr-1">
                {(() => {
                  // Compile all template configurations across all industries
                  const allTemplates = INDUSTRIES.flatMap((ind) => 
                    getTemplatesForIndustry(ind.id).map((tpl) => {
                      const details = getTemplateById(tpl.id)
                      return {
                        ...tpl,
                        industryId: ind.id,
                        category: details.category,
                        details
                      }
                    })
                  )
                  
                  // Filter by category
                  const filteredTemplates = allTemplates.filter((tpl) => {
                    if (selectedCategory === 'All') return true
                    return tpl.category === selectedCategory
                  })

                  // Deduplicate by template layoutType so we only display unique layouts
                  const uniqueLayouts: typeof filteredTemplates = []
                  const seen = new Set<string>()
                  for (const t of filteredTemplates) {
                    if (!seen.has(t.details.layoutType)) {
                      seen.add(t.details.layoutType)
                      uniqueLayouts.push(t)
                    }
                  }

                  return uniqueLayouts.map((tpl) => {
                    const isSelected = selectedTemplateId === tpl.id || activeTemplateDetails.layoutType === tpl.details.layoutType
                    const bgClass = tpl.details.bg.split(' ')[0] || 'bg-white'
                    const cardClass = tpl.details.cardBg.split(' ')[0] || 'bg-white'

                    return (
                      <button
                        key={tpl.id}
                        type="button"
                        onClick={() => {
                          setSelectedTemplateId(tpl.id)
                          setSelectedIndustry(tpl.industryId)
                        }}
                        className={`flex flex-col justify-between text-left p-3 rounded-xl border transition-all cursor-pointer h-[95px] ${
                          isSelected 
                            ? 'border-blue-600 bg-blue-950/20 ring-1 ring-blue-600' 
                            : 'border-zinc-800 hover:border-zinc-700 bg-zinc-950'
                        }`}
                      >
                        <div className="w-full overflow-hidden">
                          <span className="font-bold text-[11px] text-zinc-300 truncate w-full block">
                            {tpl.details.name.split(' - ')[1] || tpl.details.name}
                          </span>
                          <span className="text-[8px] text-zinc-500 uppercase font-bold tracking-wider mt-0.5 block truncate">
                            {tpl.category}
                          </span>
                        </div>
                        
                        {/* Swatches preview */}
                        <div className="flex items-center gap-1.5 w-full pt-1.5 border-t border-zinc-800/80">
                          <div className="flex gap-1">
                            <span className={`w-3.5 h-3.5 rounded-full border border-zinc-700 ${bgClass}`} title="Background Color" />
                            <span className={`w-3.5 h-3.5 rounded-full border border-zinc-700 ${cardClass}`} title="Card Background" />
                          </div>
                          <span className="text-[8px] text-zinc-500 ml-auto font-medium">
                            {tpl.details.isDark ? 'Dark' : 'Light'}
                          </span>
                        </div>
                      </button>
                    )
                  })
                })()}
              </div>
            </div>

            {/* Theme specs & Content Seeder */}
            <div className="p-3 border rounded-xl bg-zinc-950 border-zinc-800 space-y-3">
              <div>
                <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
                  Selected Theme Specs
                </h3>
                <div className="flex flex-wrap gap-1.5 text-[10px]">
                  <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 font-mono">
                    Font: {activeTemplateDetails.font === 'font-mono' ? 'Mono' : activeTemplateDetails.font === 'font-serif' ? 'Serif' : 'Sans'}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 font-mono">
                    Layout: {activeTemplateDetails.layoutType.replace('_', ' ')}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={handleApplyPrebuilt}
                  disabled={isApplying}
                  className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-blue-600/10 hover:bg-blue-600/25 border border-blue-500/20 text-blue-400 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{isApplying ? 'Applying copy...' : 'Load Pre-built Copy & Services'}</span>
                </button>
                {applySuccess && (
                  <p className="text-[10px] text-emerald-400 mt-1.5 text-center">
                    Copy applied successfully. Reloading...
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Card 2: Layout Reordering */}
          <div className="bg-zinc-900/60 border border-zinc-850 p-6 rounded-2xl space-y-4">
            <div>
              <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                2. Layout Structure &amp; Sorting
              </h2>
              <p className="text-[11px] text-zinc-500 mt-1">
                Drag the items to reorder page elements, or toggle visibility.
              </p>
            </div>

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={layout} strategy={verticalListSortingStrategy}>
                <div className="space-y-2">
                  {layout.map((id) => (
                    <SortableItem
                      key={id}
                      id={id}
                      label={id.toUpperCase()}
                      isVisible={visibleSections.includes(id)}
                      onToggleVisibility={() => toggleVisibility(id)}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>

        </div>

        {/* Right Column: Live Mock Browser Preview Canvas */}
        <div className="lg:col-span-7 space-y-4 h-full">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[520px]">
            {/* Mock browser header */}
            <div className="bg-zinc-900 border-b border-zinc-800 px-4 py-3 flex items-center justify-between">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-500/30" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/30" />
                <span className="w-3 h-3 rounded-full bg-green-500/30" />
              </div>
              <div className="flex-grow max-w-sm mx-4 py-1 px-3 bg-zinc-950 border border-zinc-800 rounded-lg text-center text-[10px] text-zinc-500 font-mono truncate select-all">
                {initialTenant.subdomain}.abimbola.ai/preview
              </div>
              <span className="text-[10px] text-zinc-500 font-mono">Live Preview</span>
            </div>

            {/* Target rendering canvas */}
            <div className="flex-grow bg-zinc-950 relative">
              <iframe
                src={previewUrl}
                className="w-full h-full border-0 absolute inset-0 bg-zinc-950"
                title="Mock Live Site Canvas"
              />
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
