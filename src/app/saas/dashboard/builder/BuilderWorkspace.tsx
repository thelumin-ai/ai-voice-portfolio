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
  AlertCircle 
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Template Selector */}
        <div className="lg:col-span-7 bg-white dark:bg-zinc-900 border rounded-2xl border-zinc-200 dark:border-zinc-800 p-6 space-y-6 transition-colors duration-300">
          <div>
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">
              1. Choose Industry & Theme
            </h2>
            
            {/* Industry selector */}
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
              Select Your Industry
            </label>
            <select
              value={selectedIndustry}
              onChange={(e) => handleIndustryChange(e.target.value)}
              className="w-full p-3 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              {INDUSTRIES.map((ind) => (
                <option key={ind.id} value={ind.id}>
                  {ind.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">
              Pick Layout Style (10 themes per industry)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[320px] overflow-y-auto pr-1">
              {activeTemplates.map((tpl) => {
                const isSelected = selectedTemplateId === tpl.id
                return (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => setSelectedTemplateId(tpl.id)}
                    className={`flex flex-col text-left p-4 rounded-xl border transition-all cursor-pointer ${
                      isSelected 
                        ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/20 ring-1 ring-blue-600' 
                        : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-700 bg-white dark:bg-zinc-900'
                    }`}
                  >
                    <span className="font-bold text-sm text-zinc-800 dark:text-zinc-200">
                      {tpl.name}
                    </span>
                    <span className="text-xs text-zinc-400 mt-1 uppercase font-semibold">
                      {tpl.isDark ? 'Dark Mode' : 'Light Mode'}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Style Preview details */}
          <div className="p-4 border rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border-zinc-200 dark:border-zinc-800 space-y-4">
            <div>
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                Selected Theme Specs
              </h3>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="px-2.5 py-1 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-mono">
                  Font: {activeTemplateDetails.font === 'font-mono' ? 'Monospace' : activeTemplateDetails.font === 'font-serif' ? 'Serif' : 'Sans-serif'}
                </span>
                <span className="px-2.5 py-1 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                  Mode: {activeTemplateDetails.isDark ? 'Dark Mode' : 'Light Mode'}
                </span>
                <span className="px-2.5 py-1 rounded flex items-center gap-1.5 bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                  Accent: <span className="w-3.5 h-3.5 rounded-full bg-current" style={{ color: activeTemplateDetails.isDark ? '#34d399' : '#2563eb' }} />
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800">
              <button
                type="button"
                onClick={handleApplyPrebuilt}
                disabled={isApplying}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-zinc-850 hover:bg-zinc-800 text-zinc-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer border border-zinc-800"
              >
                {applySuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-green-500" />
                    <span>Template Content Applied!</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-yellow-500" />
                    <span>{isApplying ? 'Applying Template Content...' : 'Apply Pre-built Industry Copy & Services'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Drag and Drop sorting list */}
        <div className="lg:col-span-5 bg-white dark:bg-zinc-900 border rounded-2xl border-zinc-200 dark:border-zinc-800 p-6 transition-colors duration-300">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">
            2. Section Order & Visibility
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-6">
            Drag items using the grab handles to re-order. Click "Visible" to toggle visibility.
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
    </div>
  )
}
