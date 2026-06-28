'use client'

import { useState, useTransition } from 'react'
import { 
  INDUSTRIES, 
  getTemplatesForIndustry, 
  getTemplateById 
} from '@/lib/templates'
import { updateBuilderConfig, applyPrebuiltContent } from './actions'
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
  useSortable, 
  verticalListSortingStrategy 
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { 
  GripVertical, 
  Eye, 
  EyeOff, 
  Sparkles, 
  Save, 
  Check, 
  AlertCircle,
  Globe 
} from 'lucide-react'

// Section names for user display
const SECTION_LABELS: Record<string, string> = {
  hero: 'Hero Header Banner',
  services: 'Solutions Grid (Services)',
  about: 'About Profile Section',
  consultation: 'Booking & Consultation Call',
  footer: 'Footer & Copyright Line'
}

interface BuilderWorkspaceProps {
  initialTenant: {
    template_id: string
    layout_structure: string[]
    visible_sections: string[]
  }
}

// Draggable sortable row item component
function SortableItem({ 
  id, 
  label, 
  isVisible, 
  onToggleVisibility 
}: { 
  id: string
  label: string
  isVisible: boolean
  onToggleVisibility: () => void
}) {
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
    zIndex: isDragging ? 50 : 'auto',
    opacity: isDragging ? 0.6 : 1
  }

  return (
    <div 
      ref={setNodeRef} 
      style={style}
      className={`flex items-center justify-between p-4 mb-3 border rounded-xl bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 transition-shadow ${
        isDragging ? 'shadow-lg border-blue-500/50' : 'shadow-sm'
      }`}
    >
      <div className="flex items-center gap-3">
        {/* Drag handle */}
        <button 
          type="button"
          {...attributes} 
          {...listeners}
          className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-grab active:cursor-grabbing p-1"
        >
          <GripVertical className="w-5 h-5" />
        </button>
        <span className="font-medium text-sm text-zinc-800 dark:text-zinc-200 select-none">
          {label}
        </span>
      </div>

      {/* Visibility Toggle */}
      <button
        type="button"
        onClick={onToggleVisibility}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
          isVisible 
            ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/30' 
            : 'bg-zinc-50 dark:bg-zinc-800/40 text-zinc-400 border-zinc-200 dark:border-zinc-800'
        }`}
      >
        {isVisible ? (
          <>
            <Eye className="w-3.5 h-3.5" />
            <span>Visible</span>
          </>
        ) : (
          <>
            <EyeOff className="w-3.5 h-3.5" />
            <span>Hidden</span>
          </>
        )}
      </button>
    </div>
  )
}

export default function BuilderWorkspace({ initialTenant }: BuilderWorkspaceProps) {
  const [isPending, startTransition] = useTransition()
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Layout states
  const [layout, setLayout] = useState<string[]>(
    initialTenant.layout_structure || ['hero', 'services', 'about', 'consultation', 'footer']
  )
  const [visibleSections, setVisibleSections] = useState<string[]>(
    initialTenant.visible_sections || ['hero', 'services', 'about', 'consultation']
  )

  // Theme states
  const initialTemplate = getTemplateById(initialTenant.template_id)
  
  // Extract initial industry from template_id (e.g. `agency_automation_cyber` -> `agency_automation`)
  const getInitialIndustry = () => {
    if (!initialTenant.template_id) return INDUSTRIES[0].id
    const parts = initialTenant.template_id.split('_')
    if (parts.length < 2) return INDUSTRIES[0].id
    // Suffix checks: could be royal_gold, eco_teal, etc.
    const lastTwo = parts.slice(-2).join('_')
    const suffixes = ['cyber', 'corp_dark', 'corp_light', 'royal_gold', 'eco_teal', 'sunset', 'performance', 'minimalist', 'violet_aurora', 'steel_industrial']
    if (suffixes.includes(lastTwo)) {
      return parts.slice(0, -2).join('_')
    }
    return parts.slice(0, -1).join('_')
  }

  const [selectedIndustry, setSelectedIndustry] = useState<string>(getInitialIndustry())
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(
    initialTenant.template_id || 'agency_automation_cyber'
  )

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

  // Handle industry change (auto-selects first theme of that industry)
  const handleIndustryChange = (industryId: string) => {
    setSelectedIndustry(industryId)
    const templates = getTemplatesForIndustry(industryId)
    if (templates.length > 0) {
      setSelectedTemplateId(templates[0].id)
    }
  }

  const activeTemplates = getTemplatesForIndustry(selectedIndustry)
  const activeTemplateDetails = getTemplateById(selectedTemplateId)

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Overview header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-zinc-900 p-6 border rounded-2xl border-zinc-200 dark:border-zinc-800 transition-colors duration-300">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-blue-500" />
            Visual Site Builder
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Pick your industry, choose a theme structure, and drag sections to customize your layout order.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isPending}
          className="flex items-center justify-center gap-2 py-2 px-5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-xl text-sm transition-colors cursor-pointer shadow-md shadow-blue-500/10"
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
        <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Stacked Sidebar Editor Controls */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Card 1: Template & Theme Selector */}
          <div className="bg-white dark:bg-zinc-900 border rounded-2xl border-zinc-200 dark:border-zinc-800 p-6 space-y-5 transition-colors duration-300">
            <div>
              <h2 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider mb-3">
                1. Select Industry Theme
              </h2>
              
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">
                Industry Target
              </label>
              <select
                value={selectedIndustry}
                onChange={(e) => handleIndustryChange(e.target.value)}
                className="w-full p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-850 text-zinc-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                {INDUSTRIES.map((ind) => (
                  <option key={ind.id} value={ind.id}>
                    {ind.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2.5">
                Style Palette (15 designs)
              </label>
              <div className="grid grid-cols-2 gap-2 max-h-[220px] overflow-y-auto pr-1">
                {activeTemplates.map((tpl) => {
                  const isSelected = selectedTemplateId === tpl.id
                  const details = getTemplateById(tpl.id)
                  
                  // Extract bg class name safely
                  const bgClass = details.bg.split(' ')[0] || 'bg-white'
                  const cardClass = details.cardBg.split(' ')[0] || 'bg-white'
                  
                  return (
                    <button
                      key={tpl.id}
                      type="button"
                      onClick={() => setSelectedTemplateId(tpl.id)}
                      className={`flex flex-col justify-between text-left p-3 rounded-xl border transition-all cursor-pointer h-[90px] ${
                        isSelected 
                          ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/20 ring-1 ring-blue-600' 
                          : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-700 bg-white dark:bg-zinc-900'
                      }`}
                    >
                      <div className="w-full overflow-hidden">
                        <span className="font-bold text-xs text-zinc-800 dark:text-zinc-200 truncate w-full block">
                          {tpl.name}
                        </span>
                        <span className="text-[9px] text-zinc-500 dark:text-zinc-400 uppercase font-semibold mt-0.5 block truncate">
                          {details.layoutType.replace('_', ' ')}
                        </span>
                      </div>
                      
                      {/* Color swatches preview bar */}
                      <div className="flex items-center gap-1.5 w-full pt-1 border-t border-zinc-100 dark:border-zinc-800/80">
                        <div className="flex gap-1">
                          <span className={`w-3.5 h-3.5 rounded-full border border-zinc-300 dark:border-zinc-700 ${bgClass}`} title="Background Color" />
                          <span className={`w-3.5 h-3.5 rounded-full border border-zinc-300 dark:border-zinc-700 ${cardClass}`} title="Card Background" />
                        </div>
                        <span className="text-[9px] text-zinc-400 ml-auto font-medium">
                          {details.isDark ? 'Dark' : 'Light'}
                        </span>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Theme specs & Content Seeder */}
            <div className="p-3 border rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border-zinc-200 dark:border-zinc-800 space-y-3">
              <div>
                <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                  Selected Theme Specs
                </h3>
                <div className="flex flex-wrap gap-1.5 text-[10px]">
                  <span className="px-2 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-mono">
                    Font: {activeTemplateDetails.font === 'font-mono' ? 'Mono' : activeTemplateDetails.font === 'font-serif' ? 'Serif' : 'Sans'}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-mono">
                    Layout: {activeTemplateDetails.layoutType.replace('_', ' ')}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={handleApplyPrebuilt}
                  disabled={isApplying}
                  className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 bg-zinc-850 hover:bg-zinc-800 text-zinc-200 text-[10px] font-semibold rounded-lg transition-colors cursor-pointer border border-zinc-850 shadow-sm"
                >
                  {applySuccess ? (
                    <>
                      <Check className="w-3 h-3 text-green-500" />
                      <span>Content Seeded!</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3 h-3 text-yellow-500" />
                      <span>{isApplying ? 'Seeding Copy...' : 'Load Pre-built Copy & Services'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Card 2: Sortable Layout Drag-and-Drop */}
          <div className="bg-white dark:bg-zinc-900 border rounded-2xl border-zinc-200 dark:border-zinc-800 p-6 transition-colors duration-300">
            <h2 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider mb-3">
              2. Custom Section Ordering
            </h2>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mb-4 leading-relaxed">
              Drag sections using grab handles. Hide or show sections in real-time.
            </p>

            <DndContext 
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext 
                items={layout}
                strategy={verticalListSortingStrategy}
              >
                <div>
                  {layout.map((item) => (
                    <SortableItem 
                      key={item} 
                      id={item} 
                      label={SECTION_LABELS[item] || item}
                      isVisible={visibleSections.includes(item)}
                      onToggleVisibility={() => toggleVisibility(item)}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>

        </div>

        {/* Right Column: Live Browser Preview Iframe Canvas */}
        <div className="lg:col-span-7 bg-white dark:bg-zinc-900 border rounded-2xl border-zinc-200 dark:border-zinc-800 overflow-hidden transition-colors duration-300 shadow-sm">
          
          {/* Mock Web Browser Top Header */}
          <div className="bg-zinc-100 dark:bg-zinc-950 px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-3">
            {/* Window dots */}
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500/80 block" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/80 block" />
              <span className="w-3 h-3 rounded-full bg-green-500/80 block" />
            </div>

            {/* Address Bar */}
            <div className="flex-grow flex items-center bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-1 text-xs text-zinc-400 font-mono select-none">
              <Globe className="w-3.5 h-3.5 mr-2 text-zinc-500" />
              <span>https://{initialTenant.template_id ? 'your-portfolio' : 'subdomain'}.yourplatform.com/preview</span>
              <span className="ml-auto text-[10px] text-zinc-500 bg-zinc-100 dark:bg-zinc-800/80 px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">
                Live canvas
              </span>
            </div>
          </div>

          {/* Iframe Canvas Area */}
          <div className="relative w-full h-[620px] bg-zinc-950">
            <iframe
              key={`${selectedTemplateId}-${layout.join(',')}-${visibleSections.join(',')}`}
              src={`/saas/preview?template_id=${selectedTemplateId}&layout=${layout.join(',')}&visible=${visibleSections.join(',')}`}
              className="w-full h-full border-0 select-none pointer-events-none"
            />
            
            {/* Visual overlay tag */}
            <div className="absolute bottom-4 right-4 bg-blue-600 text-white font-bold text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-full shadow-lg pointer-events-none select-none z-20">
              Live Preview Mode
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
