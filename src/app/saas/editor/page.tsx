'use client'

import { useEffect, useState, useRef, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { projectsRepo, Project, ProjectPage, ProjectSection, ProjectElement } from '@/lib/projectsRepo'
import { getTemplateById, REAL_TEMPLATES } from '@/lib/templates'
import { 
  ArrowLeft, 
  Monitor, 
  Tablet, 
  Smartphone, 
  Undo2, 
  Redo2, 
  Eye, 
  CheckCircle2, 
  Save, 
  Layers, 
  FileText, 
  Sliders, 
  Image as ImageIcon, 
  Settings as SettingsIcon, 
  Plus, 
  Trash2, 
  EyeIcon, 
  EyeOff, 
  ArrowUp, 
  ArrowDown, 
  Sparkles,
  Search,
  ExternalLink,
  ChevronRight,
  Info,
  Type,
  Link2,
  Maximize,
  Compass,
  Palette,
  X,
  FileCode,
  Lock,
  LockOpen
} from 'lucide-react'

export default function WebsiteEditorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-white font-semibold">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-4"></div>
        <p>Loading editor workspace...</p>
      </div>
    }>
      <WebsiteEditorContent />
    </Suspense>
  )
}

function WebsiteEditorContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const projectId = searchParams.get('project_id')

  const [project, setProject] = useState<Project | null>(null)
  
  // Left Sidebar Tabs
  const [activeTab, setActiveTab] = useState<'pages' | 'navigator' | 'elements' | 'design' | 'media'>('pages')
  const [activePageId, setActivePageId] = useState<string>('home')
  
  // Selected state for Elementor properties panel
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null)
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null)
  const [selectedElementType, setSelectedElementType] = useState<string | null>(null)
  const [rightPanelTab, setRightPanelTab] = useState<'content' | 'style' | 'advanced'>('content')
  
  // Element selection state
  const [lockedElements, setLockedElements] = useState<Record<string, boolean>>({})

  // Viewports: 'desktop' | 'tablet' | 'mobile'
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
  const [savingStatus, setSavingStatus] = useState<'Saved' | 'Saving...' | 'Unsaved Changes'>('Saved')

  // History stack for Undo/Redo
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState<number>(-1)

  const iframeRef = useRef<HTMLIFrameElement>(null)
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Media Library state
  const [mediaQuery, setMediaQuery] = useState('')
  const [customPageName, setCustomPageName] = useState('')
  const [customPageSlug, setCustomPageSlug] = useState('')

  // Load project
  useEffect(() => {
    if (!projectId) {
      router.push('/saas/dashboard')
      return
    }
    const proj = projectsRepo.getById(projectId)
    if (!proj) {
      router.push('/saas/dashboard')
      return
    }
    setProject(proj)
    // Init history
    const stateStr = JSON.stringify(proj)
    setHistory([stateStr])
    setHistoryIndex(0)
  }, [projectId, router])

  // Canvas selection message listener
  useEffect(() => {
    const handleCanvasMessage = (e: MessageEvent) => {
      const msg = e.data
      if (!msg || typeof msg !== 'object') return
      
      if (msg.type === 'ELEMENT_SELECTED') {
        setSelectedSectionId(msg.sectionId)
        setSelectedElementId(msg.elementId)
        setSelectedElementType(msg.elementType)
      } else if (msg.type === 'INLINE_TEXT_UPDATED') {
        const { sectionId, elementId, text } = msg
        if (!project) return
        const updated = { ...project }
        const pg = updated.pages[activePageId]
        if (pg && pg.sections[sectionId]) {
          const section = pg.sections[sectionId]
          // If it's a custom added element
          const customEl = section.elements?.find(el => el.id === elementId)
          if (customEl) {
            customEl.content.text = text
          } else {
            // Check native section keys
            const elIdLower = elementId.toLowerCase()
            if (elIdLower.endsWith('-h1') || elIdLower.endsWith('-h2') || elIdLower.endsWith('-h3') || elIdLower.endsWith('-h4') || elIdLower.endsWith('-h5') || elIdLower.endsWith('-h6') || elIdLower.includes('heading')) {
              section.content.heading = text
            } else if (elIdLower.endsWith('-p') || elIdLower.includes('subtext') || elIdLower.includes('subheading') || elIdLower.includes('desc')) {
              section.content.subtext = text
            } else if (elIdLower.endsWith('-button') || elIdLower.includes('cta') || elIdLower.includes('btn') || elIdLower.includes('label')) {
              section.content.ctaText = text
            }
          }
          updateProjectState(updated) // debounced
        }
      }
    }
    window.addEventListener('message', handleCanvasMessage)
    return () => window.removeEventListener('message', handleCanvasMessage)
  }, [project, activePageId])

  // Save utility with history tracking and debounce to fix INP issue
  const updateProjectState = (updated: Project, isUndoRedo = false, forceImmediate = false) => {
    setProject(updated)
    setSavingStatus('Unsaved Changes')
    
    // Update iframe content in real-time
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage({
        type: 'UPDATE_CONTENT',
        project: updated
      }, '*')
    }

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    if (isUndoRedo || forceImmediate) {
      setSavingStatus('Saving...')
      projectsRepo.save(updated)
      setSavingStatus('Saved')

      if (!isUndoRedo) {
        const stateStr = JSON.stringify(updated)
        const nextHistory = history.slice(0, historyIndex + 1)
        nextHistory.push(stateStr)
        setHistory(nextHistory)
        setHistoryIndex(nextHistory.length - 1)
      }
    } else {
      setSavingStatus('Saving...')
      saveTimeoutRef.current = setTimeout(() => {
        projectsRepo.save(updated)
        setSavingStatus('Saved')

        const stateStr = JSON.stringify(updated)
        const nextHistory = history.slice(0, historyIndex + 1)
        nextHistory.push(stateStr)
        setHistory(nextHistory)
        setHistoryIndex(nextHistory.length - 1)
      }, 600)
    }
  }

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [])

  // Undo / Redo
  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevIdx = historyIndex - 1
      setHistoryIndex(prevIdx)
      const state = JSON.parse(history[prevIdx])
      updateProjectState(state, true)
    }
  }

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextIdx = historyIndex + 1
      setHistoryIndex(nextIdx)
      const state = JSON.parse(history[nextIdx])
      updateProjectState(state, true)
    }
  }

  // Publish action
  const handlePublish = () => {
    if (!project) return
    const updated = { 
      ...project, 
      status: 'Published' as const,
      publishedPages: JSON.parse(JSON.stringify(project.pages))
    }
    updateProjectState(updated, false, true)
    alert('Draft published successfully to the live site!')
  }

  if (!project) return null

  const activePage = project.pages[activePageId] || project.pages['home']
  const theme = getTemplateById(project.templateId)

  // Compile iframe preview URL
  const realTemplate = REAL_TEMPLATES.find(t => t.id === project.templateId)
  const previewSuffix = realTemplate ? realTemplate.slug : (theme.id.split('_').pop() || 'nonprofit-001')
  
  const isSinglePage = realTemplate?.defaultPages.length === 1
  const pagePath = (activePageId === 'home' || isSinglePage) ? '' : `/${activePageId}`
  
  const isGainloveSingle = project.templateId === 'charity_gainlove'
  const iframeUrl = isGainloveSingle
    ? `/templates/charity_gainlove?project_id=${project.id}`
    : `/templates/${previewSuffix}/preview${pagePath}?project_id=${project.id}`

  // Handlers for Pages tab
  const handleMetaChange = (field: 'seoTitle' | 'seoDescription', value: string) => {
    const updated = { ...project }
    const pg = updated.pages[activePageId]
    if (pg) {
      pg[field] = value
      updateProjectState(updated) // debounced since it's typing
    }
  }

  const handleAddPage = () => {
    if (!customPageName.trim() || !customPageSlug.trim()) {
      alert('Please fill out Page Name and Slug.')
      return
    }
    const slug = customPageSlug.toLowerCase().replace(/[^a-z0-9-]/g, '')
    if (project.pages[slug]) {
      alert('A page with this slug already exists!')
      return
    }
    const updated = { ...project }
    updated.pages[slug] = {
      id: slug,
      title: customPageName.trim(),
      slug,
      seoTitle: '',
      seoDescription: '',
      layout: ['hero'],
      sections: {
        hero: {
          id: 'hero',
          type: 'hero',
          title: 'Hero Banner',
          isVisible: true,
          content: {
            heading: `Welcome to ${customPageName}`,
            subtext: 'This is your newly created page content banner.',
            ctaText: 'Get in Touch'
          }
        }
      }
    }
    updateProjectState(updated, false, true)
    setCustomPageName('')
    setCustomPageSlug('')
    setActivePageId(slug)
    alert(`Page "${customPageName}" created successfully!`)
  }

  const handleDeletePage = (pageId: string) => {
    if (pageId === 'home') {
      alert('The homepage cannot be deleted.')
      return
    }
    if (confirm(`Are you sure you want to delete the "${pageId}" page?`)) {
      const updated = { ...project }
      delete updated.pages[pageId]
      updateProjectState(updated, false, true)
      setActivePageId('home')
    }
  }

  const handleSectionTextChange = (sectionId: string, field: string, value: string) => {
    const updated = { ...project }
    const pg = updated.pages[activePageId]
    if (pg && pg.sections[sectionId]) {
      pg.sections[sectionId].content[field] = value
      updateProjectState(updated)
    }
  }

  const handleSectionItemChange = (sectionId: string, itemIndex: number, field: string, value: string) => {
    const updated = { ...project }
    const pg = updated.pages[activePageId]
    if (pg && pg.sections[sectionId] && Array.isArray(pg.sections[sectionId].content.items)) {
      pg.sections[sectionId].content.items[itemIndex][field] = value
      updateProjectState(updated)
    }
  }

  // Handle updates to custom element content properties
  const handleElementChange = (sectionId: string, elementId: string, field: string, value: any) => {
    const updated = { ...project }
    const pg = updated.pages[activePageId]
    if (pg && pg.sections[sectionId]) {
      const section = pg.sections[sectionId]
      const el = section.elements?.find(e => e.id === elementId)
      if (el) {
        el.content[field] = value
        updateProjectState(updated)
      }
    }
  }

  // Handle custom element style updates
  const handleElementStyleChange = (sectionId: string, elementId: string, styleKey: string, value: any) => {
    const updated = { ...project }
    const pg = updated.pages[activePageId]
    if (pg && pg.sections[sectionId]) {
      const section = pg.sections[sectionId]
      const el = section.elements?.find(e => e.id === elementId)
      if (el) {
        if (!el.styles) el.styles = {}
        el.styles[styleKey] = value
        updateProjectState(updated)
      }
    }
  }

  // Delete a custom element from section
  const handleDeleteElement = (sectionId: string, elementId: string) => {
    if (confirm('Are you sure you want to delete this element?')) {
      const updated = { ...project }
      const pg = updated.pages[activePageId]
      if (pg && pg.sections[sectionId]) {
        const section = pg.sections[sectionId]
        if (section.elements) {
          section.elements = section.elements.filter(el => el.id !== elementId)
          updateProjectState(updated, false, true)
          setSelectedElementId(null)
        }
      }
    }
  }

  // Handle section styles updates
  const handleSectionStyleChange = (sectionId: string, styleKey: string, value: any) => {
    const updated = { ...project }
    const pg = updated.pages[activePageId]
    if (pg && pg.sections[sectionId]) {
      const section = pg.sections[sectionId]
      if (!section.styles) section.styles = {}
      section.styles[styleKey] = value
      updateProjectState(updated)
    }
  }

  // Add custom element
  const handleAddElement = (type: string) => {
    if (!selectedSectionId) {
      alert('Please select a section in the Navigator or Canvas first to insert an element.')
      return
    }
    const updated = { ...project }
    const pg = updated.pages[activePageId]
    if (pg && pg.sections[selectedSectionId]) {
      const section = pg.sections[selectedSectionId]
      if (!section.elements) {
        section.elements = []
      }
      
      const newEl: ProjectElement = {
        id: `el-${type}-${Date.now().toString().slice(-4)}`,
        type,
        content: type === 'heading' ? { text: 'New Heading Text', level: 'h3' }
               : type === 'paragraph' ? { text: 'New paragraph block content text.' }
               : type === 'button' ? { label: 'Click Me', url: '#' }
               : type === 'image' ? { url: 'https://images.unsplash.com/photo-1590644365607-0cf97a5e0bc8?auto=format&fit=crop&q=80&w=600', alt: 'Showcase' }
               : type === 'divider' ? { style: 'solid', color: '#c6c6c7', height: '1px' }
               : type === 'slider' ? { items: [{ image: 'https://images.unsplash.com/photo-1590644365607-0cf97a5e0bc8?auto=format&fit=crop&q=80&w=600', title: 'Slide 1' }] }
               : type === 'accordion' ? { items: [{ title: 'Question 1', desc: 'Answer details.' }] }
               : type === 'form' ? { btnText: 'Submit Now', fields: ['name', 'email', 'message'] }
               : { text: 'New Element' },
        styles: {
          padding: 'p-2',
          margin: 'm-0',
          textColor: 'text-zinc-100',
          bgColor: 'transparent'
        }
      }
      
      section.elements.push(newEl)
      updateProjectState(updated, false, true)
    }
  }

  // Duplicate a section
  const handleDuplicateSection = (sectionId: string) => {
    const updated = { ...project }
    const pg = updated.pages[activePageId]
    if (pg) {
      const orig = pg.sections[sectionId]
      if (orig) {
        const newId = `${sectionId}-copy-${Date.now().toString().slice(-4)}`
        const copy: ProjectSection = {
          ...orig,
          id: newId,
          title: `${orig.title} (Copy)`
        }
        pg.sections[newId] = copy
        const currentIdx = pg.layout.indexOf(sectionId)
        pg.layout.splice(currentIdx + 1, 0, newId)
        updateProjectState(updated, false, true)
      }
    }
  }

  // Delete a section
  const handleDeleteSection = (sectionId: string) => {
    if (confirm('Are you sure you want to delete this section?')) {
      const updated = { ...project }
      const pg = updated.pages[activePageId]
      if (pg) {
        pg.layout = pg.layout.filter(id => id !== sectionId)
        delete pg.sections[sectionId]
        updateProjectState(updated, false, true)
        setSelectedSectionId(null)
      }
    }
  }

  // Section reordering
  const moveSection = (direction: 'up' | 'down', sectionId: string) => {
    const updated = { ...project }
    const pg = updated.pages[activePageId]
    if (pg) {
      const idx = pg.layout.indexOf(sectionId)
      if (direction === 'up' && idx > 0) {
        const temp = pg.layout[idx]
        pg.layout[idx] = pg.layout[idx - 1]
        pg.layout[idx - 1] = temp
      } else if (direction === 'down' && idx < pg.layout.length - 1) {
        const temp = pg.layout[idx]
        pg.layout[idx] = pg.layout[idx + 1]
        pg.layout[idx + 1] = temp
      }
      updateProjectState(updated, false, true)
    }
  }

  // HTML5 Drag and drop reordering handler
  const handleReorder = (dragId: string, dropId: string) => {
    if (dragId === dropId) return
    const updated = { ...project }
    const pg = updated.pages[activePageId]
    if (pg) {
      const dragIdx = pg.layout.indexOf(dragId)
      const dropIdx = pg.layout.indexOf(dropId)
      if (dragIdx !== -1 && dropIdx !== -1) {
        const newLayout = pg.layout.filter(id => id !== dragId)
        newLayout.splice(dropIdx, 0, dragId)
        pg.layout = newLayout
        updateProjectState(updated, false, true)
      }
    }
  }

  // Toggle section visibility
  const toggleSectionVisibility = (sectionId: string) => {
    const updated = { ...project }
    const pg = updated.pages[activePageId]
    if (pg && pg.sections[sectionId]) {
      pg.sections[sectionId].isVisible = !pg.sections[sectionId].isVisible
      updateProjectState(updated, false, true)
    }
  }

  // Global style change handlers
  const handleGlobalColorChange = (color: string) => {
    const updated = { ...project, themeColor: color }
    updateProjectState(updated, false, true)
  }

  // Element locks
  const toggleElementLock = (elementId: string) => {
    setLockedElements(prev => ({
      ...prev,
      [elementId]: !prev[elementId]
    }))
  }

  return (
    <div className="fixed inset-0 bg-zinc-950 text-white flex flex-col z-[1000] select-none font-sans">
      
      {/* ── TOP EDITOR TOOLBAR (~60px) ───────────────────────────────── */}
      <header className="h-14 border-b border-zinc-900 bg-zinc-950 flex items-center justify-between px-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <Link
            href="/saas/dashboard"
            className="p-1.5 hover:bg-zinc-900 rounded-lg transition-all text-zinc-400 hover:text-white"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="h-4 w-[1px] bg-zinc-800" />
          <div>
            <span className="font-black text-xs text-white uppercase tracking-wider">{project.name}</span>
            <span className="ml-2.5 px-2 py-0.5 rounded bg-zinc-900 border border-zinc-850 text-[9px] text-zinc-550 font-bold font-mono">
              {savingStatus}
            </span>
          </div>
        </div>

        {/* Viewport switchers */}
        <div className="flex bg-zinc-900 border border-zinc-850 p-0.5 rounded-lg gap-0.5">
          <button
            onClick={() => setViewport('desktop')}
            className={`p-1.5 rounded-md transition-all ${
              viewport === 'desktop' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'
            }`}
            title="Desktop Layout"
          >
            <Monitor className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setViewport('tablet')}
            className={`p-1.5 rounded-md transition-all ${
              viewport === 'tablet' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'
            }`}
            title="Tablet Layout"
          >
            <Tablet className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setViewport('mobile')}
            className={`p-1.5 rounded-md transition-all ${
              viewport === 'mobile' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'
            }`}
            title="Mobile Layout"
          >
            <Smartphone className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Action controllers */}
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5 border-r border-zinc-850 pr-3 mr-1">
            <button
              onClick={handleUndo}
              disabled={historyIndex <= 0}
              className="p-1.5 hover:bg-zinc-900 rounded-lg text-zinc-400 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent transition-all"
              title="Undo"
            >
              <Undo2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
              className="p-1.5 hover:bg-zinc-900 rounded-lg text-zinc-400 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent transition-all"
              title="Redo"
            >
              <Redo2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <a
            href={iframeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 py-1.5 px-3 bg-zinc-900 hover:bg-zinc-850 text-zinc-300 hover:text-white border border-zinc-800 rounded-lg text-[11px] font-bold"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview</span>
          </a>

          <button
            onClick={handlePublish}
            className="inline-flex items-center gap-1.5 py-1.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-lg text-[11px] shadow"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-200" />
            <span>Publish</span>
          </button>
        </div>
      </header>

      {/* ── MAIN WORKSPACE CONTAINER ───────────────────────────────── */}
      <div className="flex-grow flex min-h-0 relative">
        
        {/* ── LEFT EDITOR CONTROL PANEL (~280px) ──────────────────────── */}
        <aside className="w-[280px] border-r border-zinc-900 bg-zinc-950 flex flex-col flex-shrink-0 z-10">
          {/* Tab selector bar */}
          <div className="grid grid-cols-5 border-b border-zinc-900 text-zinc-500">
            {(['pages', 'navigator', 'elements', 'design', 'media'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-3.5 flex items-center justify-center border-b-2 uppercase text-[8px] font-black tracking-wider transition-all cursor-pointer ${
                  activeTab === tab 
                    ? 'border-blue-500 text-white bg-zinc-900/30' 
                    : 'border-transparent hover:text-zinc-300'
                }`}
                title={tab.toUpperCase()}
              >
                {tab === 'pages' && <Layers className="w-4 h-4" />}
                {tab === 'navigator' && <Sliders className="w-4 h-4" />}
                {tab === 'elements' && <Plus className="w-4 h-4" />}
                {tab === 'design' && <Sparkles className="w-4 h-4" />}
                {tab === 'media' && <ImageIcon className="w-4 h-4" />}
              </button>
            ))}
          </div>

          {/* Panel Contents */}
          <div className="flex-grow p-4 overflow-y-auto space-y-5">
            
            {/* PAGES TAB */}
            {activeTab === 'pages' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                    Site Pages
                  </h3>
                  <span className="text-[9px] text-zinc-550 font-bold uppercase">
                    {Object.keys(project.pages).length} Total
                  </span>
                </div>
                
                <div className="space-y-1">
                  {Object.keys(project.pages).map(pg => {
                    const isActive = activePageId === pg
                    return (
                      <div 
                        key={pg}
                        className={`group flex items-center justify-between py-2 px-3 rounded-lg border transition-all ${
                          isActive 
                            ? 'bg-blue-600/10 text-blue-400 border-blue-500/20' 
                            : 'bg-zinc-900/20 border-zinc-900 text-zinc-400 hover:text-white'
                        }`}
                      >
                        <button
                          onClick={() => {
                            setActivePageId(pg)
                            setSelectedSectionId(null)
                            setSelectedElementId(null)
                          }}
                          className="font-semibold text-xs capitalize text-left flex-grow truncate"
                        >
                          {pg} Page
                        </button>
                        
                        {pg !== 'home' && (
                          <button
                            onClick={() => handleDeletePage(pg)}
                            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-zinc-800 rounded text-red-500 transition-opacity"
                            title="Delete page"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    )
                  })}
                </div>

                {/* Add Custom Page form */}
                <div className="border-t border-zinc-900 pt-4 space-y-3">
                  <h4 className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">
                    Add New Page
                  </h4>
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Page Name (e.g. FAQ)"
                      className="w-full bg-zinc-900/60 border border-zinc-850 p-2 rounded text-xs text-white"
                      value={customPageName}
                      onChange={(e) => {
                        setCustomPageName(e.target.value)
                        setCustomPageSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-'))
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Page Slug (e.g. faq)"
                      className="w-full bg-zinc-900/60 border border-zinc-850 p-2 rounded text-xs text-white font-mono"
                      value={customPageSlug}
                      onChange={(e) => setCustomPageSlug(e.target.value)}
                    />
                    <button
                      onClick={handleAddPage}
                      className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded text-xs font-bold transition-all"
                    >
                      Create Page
                    </button>
                  </div>
                </div>

                {/* SEO Metadata Form */}
                <div className="border-t border-zinc-900 pt-4 space-y-3">
                  <h4 className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">
                    Page SEO Metadata
                  </h4>
                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block text-zinc-500 text-[9px] uppercase tracking-wider mb-1">
                        SEO Title Tag
                      </label>
                      <input
                        type="text"
                        className="w-full bg-zinc-900 border border-zinc-850 p-2 rounded text-white text-xs"
                        value={activePage.seoTitle || ''}
                        onChange={(e) => handleMetaChange('seoTitle', e.target.value)}
                        placeholder="Page title for search engines"
                      />
                    </div>
                    <div>
                      <label className="block text-zinc-500 text-[9px] uppercase tracking-wider mb-1">
                        Meta Description
                      </label>
                      <textarea
                        rows={2}
                        className="w-full bg-zinc-900 border border-zinc-850 p-2 rounded text-white text-xs resize-none"
                        value={activePage.seoDescription || ''}
                        onChange={(e) => handleMetaChange('seoDescription', e.target.value)}
                        placeholder="Page summary for snippets"
                      />
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* NAVIGATOR TAB */}
            {activeTab === 'navigator' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                    Page Navigator
                  </h3>
                  <span className="text-[9px] text-zinc-550 font-bold uppercase">
                    {activePage.layout.length + 2} Elements
                  </span>
                </div>

                {/* Structural tree layout */}
                <div className="space-y-1.5 font-semibold text-xs text-zinc-400">
                  {/* Header Element */}
                  <div className="p-2 bg-zinc-900/30 border border-zinc-900 rounded-lg flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-zinc-500" />
                    <span>Header Block</span>
                  </div>

                  {/* Dynamic sections */}
                  {activePage.layout.map(sectionId => {
                    const section = activePage.sections[sectionId]
                    if (!section) return null
                    const isSelected = selectedSectionId === sectionId

                    return (
                      <div 
                        key={sectionId}
                        draggable={true}
                        onDragStart={(e) => e.dataTransfer.setData('text/plain', sectionId)}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          const dragId = e.dataTransfer.getData('text/plain')
                          handleReorder(dragId, sectionId)
                        }}
                        className={`p-2 bg-zinc-900/60 border rounded-lg space-y-2 transition-all cursor-move ${
                          isSelected ? 'border-blue-600/60 bg-blue-950/10' : 'border-zinc-900'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <button
                            onClick={() => {
                              setSelectedSectionId(sectionId)
                              setSelectedElementId(null)
                            }}
                            className="font-bold text-xs text-zinc-300 hover:text-blue-400 text-left capitalize truncate max-w-[120px]"
                          >
                            {section.title || sectionId}
                          </button>
                          
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => toggleSectionVisibility(sectionId)}
                              className="p-1 hover:bg-zinc-800 rounded text-zinc-500 hover:text-zinc-300"
                              title="Toggle Visibility"
                            >
                              {section.isVisible ? <EyeIcon className="w-3 h-3 text-blue-400" /> : <EyeOff className="w-3 h-3" />}
                            </button>
                            <button
                              onClick={() => moveSection('up', sectionId)}
                              className="p-1 hover:bg-zinc-800 rounded text-zinc-500 hover:text-zinc-300"
                            >
                              <ArrowUp className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => moveSection('down', sectionId)}
                              className="p-1 hover:bg-zinc-800 rounded text-zinc-500 hover:text-zinc-300"
                            >
                              <ArrowDown className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        {/* Duplication & delete options */}
                        <div className="flex gap-2 justify-end text-[9px] border-t border-zinc-850 pt-1 text-zinc-500">
                          <button
                            onClick={() => handleDuplicateSection(sectionId)}
                            className="hover:text-white"
                          >
                            Duplicate
                          </button>
                          <button
                            onClick={() => handleDeleteSection(sectionId)}
                            className="hover:text-red-400 text-red-500/80"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )
                  })}

                  {/* Footer Element */}
                  <div className="p-2 bg-zinc-900/30 border border-zinc-900 rounded-lg flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-zinc-500" />
                    <span>Footer Block</span>
                  </div>
                </div>
              </div>
            )}

            {/* ADD ELEMENTS TAB */}
            {activeTab === 'elements' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                    Add Elements
                  </h3>
                  {selectedSectionId && (
                    <span className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 text-[8px] font-mono capitalize">
                      Section: {selectedSectionId}
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-zinc-500 leading-relaxed">
                  {selectedSectionId 
                    ? "Select an element below to insert it into the highlighted section."
                    : "Please select a section in the Page Navigator or Canvas first, then insert an element."}
                </p>

                {/* Elements grid */}
                <div className="grid grid-cols-2 gap-2 text-zinc-300 font-semibold text-[10px]">
                  <button 
                    onClick={() => handleAddElement('heading')}
                    disabled={!selectedSectionId}
                    className="p-3 bg-zinc-900/50 hover:bg-zinc-900 disabled:opacity-40 disabled:hover:bg-zinc-900/50 border border-zinc-850 rounded-xl flex flex-col items-center gap-1.5 text-center transition-all cursor-pointer"
                  >
                    <Type className="w-4 h-4 text-blue-400" />
                    <span>Heading</span>
                  </button>
                  <button 
                    onClick={() => handleAddElement('paragraph')}
                    disabled={!selectedSectionId}
                    className="p-3 bg-zinc-900/50 hover:bg-zinc-900 disabled:opacity-40 disabled:hover:bg-zinc-900/50 border border-zinc-850 rounded-xl flex flex-col items-center gap-1.5 text-center transition-all cursor-pointer"
                  >
                    <FileText className="w-4 h-4 text-blue-400" />
                    <span>Paragraph</span>
                  </button>
                  <button 
                    onClick={() => handleAddElement('button')}
                    disabled={!selectedSectionId}
                    className="p-3 bg-zinc-900/50 hover:bg-zinc-900 disabled:opacity-40 disabled:hover:bg-zinc-900/50 border border-zinc-850 rounded-xl flex flex-col items-center gap-1.5 text-center transition-all cursor-pointer"
                  >
                    <Link2 className="w-4 h-4 text-blue-400" />
                    <span>Button</span>
                  </button>
                  <button 
                    onClick={() => handleAddElement('image')}
                    disabled={!selectedSectionId}
                    className="p-3 bg-zinc-900/50 hover:bg-zinc-900 disabled:opacity-40 disabled:hover:bg-zinc-900/50 border border-zinc-850 rounded-xl flex flex-col items-center gap-1.5 text-center transition-all cursor-pointer"
                  >
                    <ImageIcon className="w-4 h-4 text-blue-400" />
                    <span>Image</span>
                  </button>
                  <button 
                    onClick={() => handleAddElement('divider')}
                    disabled={!selectedSectionId}
                    className="p-3 bg-zinc-900/50 hover:bg-zinc-900 disabled:opacity-40 disabled:hover:bg-zinc-900/50 border border-zinc-850 rounded-xl flex flex-col items-center gap-1.5 text-center transition-all cursor-pointer"
                  >
                    <Sliders className="w-4 h-4 text-blue-400" />
                    <span>Divider Line</span>
                  </button>
                  <button 
                    onClick={() => handleAddElement('slider')}
                    disabled={!selectedSectionId}
                    className="p-3 bg-zinc-900/50 hover:bg-zinc-900 disabled:opacity-40 disabled:hover:bg-zinc-900/50 border border-zinc-850 rounded-xl flex flex-col items-center gap-1.5 text-center transition-all cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-blue-400" />
                    <span>Slider Carousel</span>
                  </button>
                  <button 
                    onClick={() => handleAddElement('accordion')}
                    disabled={!selectedSectionId}
                    className="p-3 bg-zinc-900/50 hover:bg-zinc-900 disabled:opacity-40 disabled:hover:bg-zinc-900/50 border border-zinc-850 rounded-xl flex flex-col items-center gap-1.5 text-center transition-all cursor-pointer"
                  >
                    <Layers className="w-4 h-4 text-blue-400" />
                    <span>FAQ Accordion</span>
                  </button>
                  <button 
                    onClick={() => handleAddElement('form')}
                    disabled={!selectedSectionId}
                    className="p-3 bg-zinc-900/50 hover:bg-zinc-900 disabled:opacity-40 disabled:hover:bg-zinc-900/50 border border-zinc-850 rounded-xl flex flex-col items-center gap-1.5 text-center transition-all cursor-pointer"
                  >
                    <FileCode className="w-4 h-4 text-blue-400" />
                    <span>Contact Form</span>
                  </button>
                </div>
              </div>
            )}

            {/* GLOBAL DESIGN TAB */}
            {activeTab === 'design' && (
              <div className="space-y-4">
                <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                  Global Layout Styles
                </h3>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-zinc-500 text-[9px] uppercase tracking-wider mb-2 font-bold">
                      Design System Presets
                    </label>
                    <div className="grid grid-cols-2 gap-2 text-xs font-bold text-zinc-300">
                      {[
                        { id: 'legal_practice_roofing-004', name: 'Roofing (Dark)' },
                        { id: 'business_consulting_manufacturing-003', name: 'Mfg (Light)' },
                        { id: 'agency_agency-002', name: 'Agency (Mod)' },
                        { id: 'charity_nonprofit-001', name: 'Charity (Warm)' }
                      ].map(preset => (
                        <button
                          key={preset.id}
                          onClick={() => {
                            const updated = { ...project, templateId: preset.id }
                            updateProjectState(updated)
                          }}
                          className={`p-2.5 border rounded-lg text-left transition-all ${
                            project.templateId === preset.id 
                              ? 'border-blue-600 bg-blue-950/20 text-blue-400' 
                              : 'border-zinc-850 hover:border-zinc-700'
                          }`}
                        >
                          {preset.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-zinc-900 pt-3">
                    <label className="block text-zinc-500 text-[9px] uppercase tracking-wider mb-1.5 font-bold">
                      Accent Theme Color
                    </label>
                    <div className="flex gap-2.5 items-center">
                      {['#ff5637', '#0f2b5c', '#4e31aa', '#10b981', '#f59e0b'].map(c => (
                        <button
                          key={c}
                          onClick={() => handleGlobalColorChange(c)}
                          className="w-6 h-6 rounded-full border border-zinc-850 relative"
                          style={{ backgroundColor: c }}
                        >
                          {project.themeColor === c && (
                            <span className="absolute inset-0 flex items-center justify-center text-[10px] text-white">✓</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* MEDIA LIBRARY TAB */}
            {activeTab === 'media' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                    Media Assets
                  </h3>
                  <span className="text-[9px] text-zinc-500 font-bold uppercase">Library</span>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search media..."
                    className="w-full bg-zinc-900 border border-zinc-850 py-1.5 pl-7 pr-3 rounded-lg text-xs text-white"
                    value={mediaQuery}
                    onChange={(e) => setMediaQuery(e.target.value)}
                  />
                  <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-2.5" />
                </div>

                <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
                  {[
                    { id: 'media-1', url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=600', name: 'roofing_worker.jpg' },
                    { id: 'media-2', url: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=600', name: 'mfg_floor.jpg' },
                    { id: 'media-3', url: 'https://images.unsplash.com/photo-1590644365607-0cf97a5e0bc8?auto=format&fit=crop&q=80&w=600', name: 'modern_house.jpg' },
                    { id: 'media-4', url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=600', name: 'glass_building.jpg' }
                  ]
                    .filter(m => m.name.toLowerCase().includes(mediaQuery.toLowerCase()))
                    .map(media => (
                      <button
                        key={media.id}
                        onClick={() => {
                          if (selectedSectionId) {
                            handleSectionTextChange(selectedSectionId, 'image', media.url)
                            alert('Image replaced in selected section!')
                          } else {
                            alert('Please select a section in the Navigator or Canvas first to swap its image asset.')
                          }
                        }}
                        className="group relative h-20 bg-zinc-900 border border-zinc-850 rounded-lg overflow-hidden hover:border-zinc-700 transition-all text-left"
                      >
                        <img src={media.url} alt={media.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center p-1 text-[8px] font-bold text-center">
                          Click to Replace Selected
                        </div>
                      </button>
                    ))}
                </div>
              </div>
            )}

          </div>
        </aside>

        {/* ── CENTRALisolated CANVAS PANEL (Flexible) ─────────────────── */}
        <main className="flex-grow bg-zinc-900/40 p-4 flex flex-col justify-center items-center overflow-auto min-w-0">
          
          {/* IFrame shell layout */}
          <div 
            className="bg-zinc-950 border border-zinc-850 flex flex-col shadow-2xl relative transition-all duration-300 h-full rounded-2xl overflow-hidden"
            style={{
              width: viewport === 'mobile' ? '375px' : viewport === 'tablet' ? '768px' : '100%',
              maxWidth: viewport === 'desktop' ? '1200px' : 'none',
              minHeight: '400px'
            }}
          >
            {/* Top bar browser representation */}
            <div className="bg-zinc-950 border-b border-zinc-900 px-4 py-2 flex items-center justify-between flex-shrink-0">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
              </div>
              <div className="flex-grow max-w-sm mx-4 py-0.5 px-3 bg-zinc-900/60 rounded-md text-center text-[9px] text-zinc-500 font-mono truncate select-all">
                {project.subdomain}.abimbola.ai/{activePageId === 'home' ? '' : activePageId}
              </div>
              <span className="text-[8px] text-zinc-500 uppercase tracking-widest font-black">
                {viewport} Frame
              </span>
            </div>

            {/* Simulated iframe canvas */}
            <div className="flex-grow relative">
              <iframe
                ref={iframeRef}
                src={iframeUrl}
                className="w-full h-full border-0 absolute inset-0 bg-zinc-950"
                title="SaaS Site Canvas Editor"
              />
            </div>
          </div>
        </main>
        
        {/* ── RIGHT PROPERTIES PANEL (~320px) ────────────────────────── */}
        <aside className="w-[320px] border-l border-zinc-900 bg-zinc-950 flex flex-col flex-shrink-0 z-10 select-none">
          
          {/* Header identifier */}
          <div className="h-12 border-b border-zinc-900 flex items-center justify-between px-4">
            <span className="font-bold text-[10px] text-zinc-400 uppercase tracking-widest">
              Element Inspector
            </span>
            {selectedSectionId && (
              <button 
                onClick={() => {
                  setSelectedSectionId(null)
                  setSelectedElementId(null)
                }}
                className="text-zinc-500 hover:text-white"
                title="Clear selection"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Properties content area */}
          {selectedSectionId ? (
            (() => {
              const section = activePage.sections[selectedSectionId]
              if (!section) return <div className="p-4 text-zinc-500 text-xs">Section not found.</div>

              // Find active sub-element
              const activeElement = section.elements?.find(el => el.id === selectedElementId)

              return (
                <div className="flex-grow flex flex-col min-h-0">
                  
                  {/* Content / Style / Advanced Tab Header */}
                  <div className="grid grid-cols-3 border-b border-zinc-900 text-zinc-500 text-[9px] font-black tracking-wider uppercase">
                    {(['content', 'style', 'advanced'] as const).map(tab => (
                      <button
                        key={tab}
                        onClick={() => setRightPanelTab(tab)}
                        className={`py-3 text-center border-b-2 transition-all cursor-pointer ${
                          rightPanelTab === tab 
                            ? 'border-blue-500 text-white bg-zinc-900/40' 
                            : 'border-transparent hover:text-zinc-300'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>

                  {/* Properties Inputs Form */}
                  <div className="flex-grow p-4 overflow-y-auto space-y-4 text-xs font-semibold">
                    
                    {/* CONTENT TAB */}
                    {rightPanelTab === 'content' && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between bg-zinc-900/60 p-2.5 rounded-lg border border-zinc-850">
                          <span className="text-[9px] text-zinc-400 font-mono">
                            Section: {selectedSectionId}
                          </span>
                          <span className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 text-[8px] font-mono capitalize">
                            {section.type}
                          </span>
                        </div>

                        {/* Selected Sub-Element specific banner */}
                        {selectedElementId && (
                          <div className="p-2.5 bg-blue-950/20 border border-blue-500/20 rounded-lg flex items-center justify-between text-[10px] text-blue-400">
                            <div className="flex flex-col gap-0.5">
                              <span className="font-bold uppercase text-[8px] tracking-wider text-blue-300">Active Element</span>
                              <span className="font-mono text-zinc-300">{selectedElementId}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <button 
                                onClick={() => toggleElementLock(selectedElementId)} 
                                className="p-1 hover:bg-zinc-800 rounded text-blue-400 hover:text-white"
                                title="Lock element settings"
                              >
                                {lockedElements[selectedElementId] ? <Lock className="w-3.5 h-3.5" /> : <LockOpen className="w-3.5 h-3.5" />}
                              </button>
                              {activeElement && (
                                <button
                                  onClick={() => handleDeleteElement(selectedSectionId, selectedElementId)}
                                  className="p-1 hover:bg-red-950 rounded text-red-500 hover:text-red-400"
                                  title="Delete custom element"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>
                        )}

                        {/* If editing a custom sub-element */}
                        {activeElement ? (
                          <div className="space-y-4 border-t border-zinc-900 pt-3">
                            <h4 className="text-[9px] text-zinc-400 uppercase tracking-widest font-bold mb-2">
                              {activeElement.type} Settings
                            </h4>

                            {/* Heading Element */}
                            {activeElement.type === 'heading' && (
                              <div className="space-y-3">
                                <div>
                                  <label className="block text-zinc-550 text-[9px] uppercase tracking-wider mb-1">Heading Size</label>
                                  <select 
                                    value={activeElement.content.level || 'h3'}
                                    onChange={(e) => handleElementChange(selectedSectionId, selectedElementId, 'level', e.target.value)}
                                    className="w-full bg-zinc-900 border border-zinc-850 p-2 rounded text-white text-xs"
                                  >
                                    <option value="h1">H1 (Hero Heading)</option>
                                    <option value="h2">H2 (Section Heading)</option>
                                    <option value="h3">H3 (Subsection)</option>
                                    <option value="h4">H4 (Cards Title)</option>
                                    <option value="h5">H5 (Small Title)</option>
                                    <option value="h6">H6 (Subtext Accent)</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-zinc-550 text-[9px] uppercase tracking-wider mb-1">Text Content</label>
                                  <textarea
                                    rows={3}
                                    value={activeElement.content.text || ''}
                                    onChange={(e) => handleElementChange(selectedSectionId, selectedElementId, 'text', e.target.value)}
                                    className="w-full bg-zinc-900 border border-zinc-850 p-2 rounded text-white text-xs resize-none"
                                  />
                                </div>
                              </div>
                            )}

                            {/* Paragraph Element */}
                            {activeElement.type === 'paragraph' && (
                              <div>
                                <label className="block text-zinc-550 text-[9px] uppercase tracking-wider mb-1">Paragraph Text</label>
                                <textarea
                                  rows={5}
                                  value={activeElement.content.text || ''}
                                  onChange={(e) => handleElementChange(selectedSectionId, selectedElementId, 'text', e.target.value)}
                                  className="w-full bg-zinc-900 border border-zinc-850 p-2 rounded text-white text-xs resize-none"
                                />
                              </div>
                            )}

                            {/* Button Element */}
                            {activeElement.type === 'button' && (
                              <div className="space-y-3">
                                <div>
                                  <label className="block text-zinc-550 text-[9px] uppercase tracking-wider mb-1">Button Label</label>
                                  <input
                                    type="text"
                                    value={activeElement.content.label || ''}
                                    onChange={(e) => handleElementChange(selectedSectionId, selectedElementId, 'label', e.target.value)}
                                    className="w-full bg-zinc-900 border border-zinc-850 p-2 rounded text-white text-xs"
                                  />
                                </div>
                                <div>
                                  <label className="block text-zinc-550 text-[9px] uppercase tracking-wider mb-1">Button URL / Link</label>
                                  <input
                                    type="text"
                                    value={activeElement.content.url || ''}
                                    onChange={(e) => handleElementChange(selectedSectionId, selectedElementId, 'url', e.target.value)}
                                    className="w-full bg-zinc-900 border border-zinc-850 p-2 rounded text-white text-xs font-mono"
                                  />
                                </div>
                              </div>
                            )}

                            {/* Image Element */}
                            {activeElement.type === 'image' && (
                              <div className="space-y-3">
                                <div>
                                  <label className="block text-zinc-550 text-[9px] uppercase tracking-wider mb-1">Image URL</label>
                                  <input
                                    type="text"
                                    value={activeElement.content.url || ''}
                                    onChange={(e) => handleElementChange(selectedSectionId, selectedElementId, 'url', e.target.value)}
                                    className="w-full bg-zinc-900 border border-zinc-850 p-2 rounded text-white text-xs font-mono"
                                  />
                                </div>
                                <div>
                                  <label className="block text-zinc-550 text-[9px] uppercase tracking-wider mb-1">Alt Description Text</label>
                                  <input
                                    type="text"
                                    value={activeElement.content.alt || ''}
                                    onChange={(e) => handleElementChange(selectedSectionId, selectedElementId, 'alt', e.target.value)}
                                    className="w-full bg-zinc-900 border border-zinc-850 p-2 rounded text-white text-xs"
                                  />
                                </div>
                              </div>
                            )}

                            {/* Divider Element */}
                            {activeElement.type === 'divider' && (
                              <div className="space-y-3">
                                <div>
                                  <label className="block text-zinc-550 text-[9px] uppercase tracking-wider mb-1">Border Style</label>
                                  <select 
                                    value={activeElement.content.style || 'solid'}
                                    onChange={(e) => handleElementChange(selectedSectionId, selectedElementId, 'style', e.target.value)}
                                    className="w-full bg-zinc-900 border border-zinc-850 p-2 rounded text-white text-xs"
                                  >
                                    <option value="solid">Solid Line</option>
                                    <option value="dashed">Dashed Line</option>
                                    <option value="dotted">Dotted Line</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-zinc-550 text-[9px] uppercase tracking-wider mb-1">Height (Thickness)</label>
                                  <input
                                    type="text"
                                    value={activeElement.content.height || '1px'}
                                    onChange={(e) => handleElementChange(selectedSectionId, selectedElementId, 'height', e.target.value)}
                                    className="w-full bg-zinc-900 border border-zinc-850 p-2 rounded text-white text-xs font-mono"
                                  />
                                </div>
                                <div>
                                  <label className="block text-zinc-550 text-[9px] uppercase tracking-wider mb-1">Color Code</label>
                                  <input
                                    type="color"
                                    value={activeElement.content.color || '#c6c6c7'}
                                    onChange={(e) => handleElementChange(selectedSectionId, selectedElementId, 'color', e.target.value)}
                                    className="w-full bg-zinc-900 border border-zinc-850 h-8 rounded text-white text-xs cursor-pointer p-0.5"
                                  />
                                </div>
                              </div>
                            )}

                            {/* Slider Element */}
                            {activeElement.type === 'slider' && (
                              <div className="space-y-3">
                                <label className="block text-zinc-550 text-[9px] uppercase tracking-wider">Slide Deck Items</label>
                                {activeElement.content.items?.map((item: any, sIdx: number) => (
                                  <div key={sIdx} className="p-2 bg-zinc-900 border border-zinc-850 rounded-lg space-y-2">
                                    <input 
                                      type="text"
                                      value={item.title || ''}
                                      placeholder={`Slide ${sIdx + 1} Title`}
                                      onChange={(e) => {
                                        const newItems = [...activeElement.content.items]
                                        newItems[sIdx].title = e.target.value
                                        handleElementChange(selectedSectionId, selectedElementId, 'items', newItems)
                                      }}
                                      className="w-full bg-zinc-950 border border-zinc-850 p-1.5 rounded text-[11px] text-white"
                                    />
                                    <input 
                                      type="text"
                                      value={item.image || ''}
                                      placeholder="Slide Image URL"
                                      onChange={(e) => {
                                        const newItems = [...activeElement.content.items]
                                        newItems[sIdx].image = e.target.value
                                        handleElementChange(selectedSectionId, selectedElementId, 'items', newItems)
                                      }}
                                      className="w-full bg-zinc-950 border border-zinc-850 p-1.5 rounded text-[10px] text-white font-mono"
                                    />
                                  </div>
                                ))}
                                <button
                                  onClick={() => {
                                    const newItems = [...(activeElement.content.items || [])]
                                    newItems.push({ title: 'New Slide', image: 'https://images.unsplash.com/photo-1590644365607-0cf97a5e0bc8?auto=format&fit=crop&q=80&w=600' })
                                    handleElementChange(selectedSectionId, selectedElementId, 'items', newItems)
                                  }}
                                  className="w-full py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded text-[10px] font-bold text-center"
                                >
                                  + Add New Slide
                                </button>
                              </div>
                            )}

                            {/* Accordion / FAQ Element */}
                            {activeElement.type === 'accordion' && (
                              <div className="space-y-3">
                                <label className="block text-zinc-550 text-[9px] uppercase tracking-wider">Accordion Items</label>
                                {activeElement.content.items?.map((item: any, aIdx: number) => (
                                  <div key={aIdx} className="p-2 bg-zinc-900 border border-zinc-850 rounded-lg space-y-2">
                                    <input 
                                      type="text"
                                      value={item.title || ''}
                                      placeholder={`Question ${aIdx + 1}`}
                                      onChange={(e) => {
                                        const newItems = [...activeElement.content.items]
                                        newItems[aIdx].title = e.target.value
                                        handleElementChange(selectedSectionId, selectedElementId, 'items', newItems)
                                      }}
                                      className="w-full bg-zinc-950 border border-zinc-850 p-1.5 rounded text-[11px] text-white font-bold"
                                    />
                                    <textarea 
                                      value={item.desc || ''}
                                      placeholder="Answer details..."
                                      rows={2}
                                      onChange={(e) => {
                                        const newItems = [...activeElement.content.items]
                                        newItems[aIdx].desc = e.target.value
                                        handleElementChange(selectedSectionId, selectedElementId, 'items', newItems)
                                      }}
                                      className="w-full bg-zinc-950 border border-zinc-850 p-1.5 rounded text-[10px] text-white resize-none"
                                    />
                                  </div>
                                ))}
                                <button
                                  onClick={() => {
                                    const newItems = [...(activeElement.content.items || [])]
                                    newItems.push({ title: 'New Question', desc: 'Answer explanation details.' })
                                    handleElementChange(selectedSectionId, selectedElementId, 'items', newItems)
                                  }}
                                  className="w-full py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded text-[10px] font-bold text-center"
                                >
                                  + Add FAQ Accordion Item
                                </button>
                              </div>
                            )}

                            {/* Form Element */}
                            {activeElement.type === 'form' && (
                              <div>
                                <label className="block text-zinc-550 text-[9px] uppercase tracking-wider mb-1">Submit Button Label</label>
                                <input
                                  type="text"
                                  value={activeElement.content.btnText || 'Submit'}
                                  onChange={(e) => handleElementChange(selectedSectionId, selectedElementId, 'btnText', e.target.value)}
                                  className="w-full bg-zinc-900 border border-zinc-850 p-2 rounded text-white text-xs"
                                />
                              </div>
                            )}

                          </div>
                        ) : (
                          /* If editing default native section properties */
                          <div className="space-y-4 border-t border-zinc-900 pt-3">
                            
                            {/* Input for Heading */}
                            {section.content.heading !== undefined && (
                              <div>
                                <label className="block text-zinc-550 text-[9px] uppercase tracking-wider mb-1">
                                  Heading Text
                                </label>
                                <textarea
                                  rows={3}
                                  className="w-full bg-zinc-900 border border-zinc-850 p-2 rounded text-white text-xs resize-none"
                                  value={section.content.heading}
                                  onChange={(e) => handleSectionTextChange(selectedSectionId, 'heading', e.target.value)}
                                  disabled={selectedElementId ? lockedElements[selectedElementId] : false}
                                />
                              </div>
                            )}

                            {/* Input for Subheading / Subtext */}
                            {section.content.subtext !== undefined && (
                              <div>
                                <label className="block text-zinc-550 text-[9px] uppercase tracking-wider mb-1">
                                  Subtext / Description
                                </label>
                                <textarea
                                  rows={4}
                                  className="w-full bg-zinc-900 border border-zinc-850 p-2 rounded text-white text-xs resize-none"
                                  value={section.content.subtext}
                                  onChange={(e) => handleSectionTextChange(selectedSectionId, 'subtext', e.target.value)}
                                  disabled={selectedElementId ? lockedElements[selectedElementId] : false}
                                />
                              </div>
                            )}

                            {/* Button destination & label */}
                            {section.content.ctaText !== undefined && (
                              <div className="space-y-3">
                                <div>
                                  <label className="block text-zinc-550 text-[9px] uppercase tracking-wider mb-1">
                                    CTA Button Label
                                  </label>
                                  <input
                                    type="text"
                                    className="w-full bg-zinc-900 border border-zinc-850 p-2 rounded text-white text-xs"
                                    value={section.content.ctaText}
                                    onChange={(e) => handleSectionTextChange(selectedSectionId, 'ctaText', e.target.value)}
                                    disabled={selectedElementId ? lockedElements[selectedElementId] : false}
                                  />
                                </div>
                                <div>
                                  <label className="block text-zinc-550 text-[9px] uppercase tracking-wider mb-1">
                                    CTA Link URL
                                  </label>
                                  <input
                                    type="text"
                                    className="w-full bg-zinc-900 border border-zinc-850 p-2 rounded text-white text-xs font-mono"
                                    value={section.content.ctaLink || '/contact'}
                                    onChange={(e) => handleSectionTextChange(selectedSectionId, 'ctaLink', e.target.value)}
                                    disabled={selectedElementId ? lockedElements[selectedElementId] : false}
                                  />
                                </div>
                              </div>
                            )}

                            {/* Background / Main Image */}
                            {section.content.image !== undefined && (
                              <div>
                                <label className="block text-zinc-550 text-[9px] uppercase tracking-wider mb-1.5">
                                  Image Source URL
                                </label>
                                <input
                                  type="text"
                                  className="w-full bg-zinc-900 border border-zinc-850 p-2 rounded text-white text-xs font-mono"
                                  value={section.content.image}
                                  onChange={(e) => handleSectionTextChange(selectedSectionId, 'image', e.target.value)}
                                  disabled={selectedElementId ? lockedElements[selectedElementId] : false}
                                />
                              </div>
                            )}

                            {/* Custom Added Sub-elements listing within Section */}
                            {section.elements && section.elements.length > 0 && (
                              <div className="border-t border-zinc-900 pt-3">
                                <label className="block text-zinc-550 text-[8px] uppercase tracking-widest mb-1.5 font-bold">
                                  Added Elements List ({section.elements.length})
                                </label>
                                <div className="space-y-1 max-h-40 overflow-y-auto">
                                  {section.elements.map(el => (
                                    <button
                                      key={el.id}
                                      onClick={() => setSelectedElementId(el.id)}
                                      className={`w-full py-1.5 px-2 bg-zinc-900 hover:bg-zinc-850 rounded border text-left font-mono text-[9px] flex items-center justify-between ${
                                        selectedElementId === el.id ? 'border-blue-500 text-blue-400' : 'border-zinc-850 text-zinc-400'
                                      }`}
                                    >
                                      <span>{el.id}</span>
                                      <span className="capitalize text-[8px] bg-zinc-800 text-zinc-500 px-1 py-0.2 rounded font-sans">
                                        {el.type}
                                      </span>
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}

                          </div>
                        )}
                      </div>
                    )}

                    {/* STYLE TAB */}
                    {rightPanelTab === 'style' && (
                      <div className="space-y-4">
                        {activeElement ? (
                          /* Sub-Element custom styling */
                          <div className="space-y-4">
                            <div>
                              <label className="block text-zinc-500 text-[9px] uppercase tracking-wider mb-1">
                                Text Color Override
                              </label>
                              <div className="grid grid-cols-2 gap-2 text-center text-[10px]">
                                {[
                                  { id: 'text-white', name: 'Light White' },
                                  { id: 'text-zinc-400', name: 'Medium Zinc' },
                                  { id: 'text-[#ff5637]', name: 'Safety Orange' },
                                  { id: 'text-blue-500', name: 'Link Blue' }
                                ].map(color => (
                                  <button
                                    key={color.id}
                                    onClick={() => handleElementStyleChange(selectedSectionId, selectedElementId!, 'textColor', color.id)}
                                    className={`p-2 border rounded ${
                                      activeElement.styles?.textColor === color.id ? 'border-blue-600 bg-blue-950/20 text-white' : 'border-zinc-800 text-zinc-400'
                                    }`}
                                  >
                                    {color.name}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div>
                              <label className="block text-zinc-500 text-[9px] uppercase tracking-wider mb-1">
                                Element Padding
                              </label>
                              <div className="grid grid-cols-3 gap-1 text-center font-bold text-[10px]">
                                {['p-1', 'p-3', 'p-5'].map(pad => (
                                  <button
                                    key={pad}
                                    onClick={() => handleElementStyleChange(selectedSectionId, selectedElementId!, 'padding', pad)}
                                    className={`py-1.5 border rounded ${
                                      activeElement.styles?.padding === pad ? 'border-blue-600 bg-blue-950/20 text-white' : 'border-zinc-800 text-zinc-400'
                                    }`}
                                  >
                                    {pad}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        ) : (
                          /* Section background and alignments styling */
                          <div className="space-y-4">
                            <div>
                              <label className="block text-zinc-500 text-[9px] uppercase tracking-wider mb-1">
                                Text Alignment
                              </label>
                              <div className="grid grid-cols-3 gap-1 text-center font-bold text-[10px] text-zinc-300">
                                {['left', 'center', 'right'].map(align => (
                                  <button
                                    key={align}
                                    onClick={() => handleSectionTextChange(selectedSectionId, 'align', align)}
                                    className={`py-1.5 border rounded capitalize cursor-pointer ${
                                      section.content.align === align ? 'border-blue-600 bg-blue-950/20 text-white' : 'border-zinc-800'
                                    }`}
                                  >
                                    {align}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div>
                              <label className="block text-zinc-500 text-[9px] uppercase tracking-wider mb-1.5">
                                Section Background Color
                              </label>
                              <div className="grid grid-cols-2 gap-2 text-center text-[10px]">
                                {[
                                  { id: 'bg-[#131313]', name: 'Dark Theme' },
                                  { id: 'bg-[#0f172a]', name: 'Slate Night' },
                                  { id: 'bg-white', name: 'Crisp White' },
                                  { id: 'bg-[#faf9f6]', name: 'Warm Cream' },
                                  { id: 'bg-[#ff5637]/10', name: 'Orange Tint' },
                                  { id: 'bg-[#4e31aa]/10', name: 'Purple Tint' }
                                ].map(bgItem => (
                                  <button
                                    key={bgItem.id}
                                    onClick={() => handleSectionStyleChange(selectedSectionId, 'bgColor', bgItem.id)}
                                    className={`p-2 border rounded text-xs ${
                                      section.styles?.bgColor === bgItem.id ? 'border-blue-600 bg-blue-950/20 text-white' : 'border-zinc-800 text-zinc-400'
                                    }`}
                                  >
                                    {bgItem.name}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div>
                              <label className="block text-zinc-500 text-[9px] uppercase tracking-wider mb-1">
                                Text Color Scheme
                              </label>
                              <div className="grid grid-cols-2 gap-2 text-center text-[10px]">
                                {[
                                  { id: 'text-zinc-100', name: 'Light text' },
                                  { id: 'text-zinc-400', name: 'Medium text' },
                                  { id: 'text-slate-900', name: 'Slate Dark' },
                                  { id: 'text-blue-600', name: 'Accent Blue' }
                                ].map(color => (
                                  <button
                                    key={color.id}
                                    onClick={() => handleSectionTextChange(selectedSectionId, 'textColor', color.id)}
                                    className={`p-2 border rounded ${
                                      section.content.textColor === color.id ? 'border-blue-600 bg-blue-950/20 text-white' : 'border-zinc-800 text-zinc-400'
                                    }`}
                                  >
                                    {color.name}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div className="border-t border-zinc-900 pt-3">
                              <label className="block text-zinc-500 text-[9px] uppercase tracking-wider mb-1">
                                Corner Border Radius
                              </label>
                              <div className="grid grid-cols-3 gap-1 text-center font-bold text-[10px]">
                                {['none', 'md', 'full'].map(rad => (
                                  <button
                                    key={rad}
                                    onClick={() => handleSectionTextChange(selectedSectionId, 'borderRadius', rad)}
                                    className={`py-1.5 border rounded capitalize ${
                                      section.content.borderRadius === rad ? 'border-blue-600 bg-blue-950/20 text-white' : 'border-zinc-800 text-zinc-400'
                                    }`}
                                  >
                                    {rad}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* ADVANCED TAB */}
                    {rightPanelTab === 'advanced' && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-zinc-500 text-[9px] uppercase tracking-wider mb-1.5 font-bold">
                            Responsive Visibility Override
                          </label>
                          <div className="space-y-2">
                            {[
                              { id: 'hideDesktop', name: 'Hide on Desktop Viewport' },
                              { id: 'hideTablet', name: 'Hide on Tablet Viewport' },
                              { id: 'hideMobile', name: 'Hide on Mobile Viewport' }
                            ].map(item => {
                              const targetItem = activeElement ? activeElement : section
                              const targetContent = activeElement ? activeElement.content : section.content
                              const isActive = targetContent[item.id] === true || targetContent[item.id] === 'true'

                              return (
                                <button
                                  key={item.id}
                                  onClick={() => {
                                    if (activeElement) {
                                      handleElementChange(selectedSectionId, selectedElementId!, item.id, !isActive)
                                    } else {
                                      handleSectionTextChange(selectedSectionId, item.id, isActive ? 'false' : 'true')
                                    }
                                  }}
                                  className={`w-full py-2 px-3 text-left border rounded-lg text-[10px] font-bold flex items-center justify-between cursor-pointer transition-all ${
                                    isActive ? 'border-red-500/30 bg-red-500/10 text-red-400' : 'border-zinc-800 hover:border-zinc-700 text-zinc-400'
                                  }`}
                                >
                                  <span>{item.name}</span>
                                  <span>{isActive ? 'Hidden' : 'Visible'}</span>
                                </button>
                              )
                            })}
                          </div>
                        </div>

                        {!activeElement && (
                          <div className="border-t border-zinc-900 pt-3">
                            <label className="block text-zinc-500 text-[9px] uppercase tracking-wider mb-1 font-bold">
                              Section Padding Height
                            </label>
                            <div className="grid grid-cols-4 gap-1 text-center text-[10px]">
                              {[
                                { id: 'py-8', name: 'XS' },
                                { id: 'py-16', name: 'SM' },
                                { id: 'py-24', name: 'MD' },
                                { id: 'py-32', name: 'LG' }
                              ].map(pItem => (
                                <button
                                  key={pItem.id}
                                  onClick={() => handleSectionStyleChange(selectedSectionId, 'padding', pItem.id)}
                                  className={`py-1.5 border rounded ${
                                    section.styles?.padding === pItem.id ? 'border-blue-600 bg-blue-950/20 text-white' : 'border-zinc-800 text-zinc-400'
                                  }`}
                                >
                                  {pItem.name}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                  </div>
                </div>
              )
            })()
          ) : (
            <div className="p-8 text-center text-zinc-550 text-xs flex-grow flex flex-col items-center justify-center space-y-2">
              <Info className="w-8 h-8 text-zinc-700" />
              <p>Select any page section in the Navigator or click elements inside the canvas to inspect and edit layout properties.</p>
            </div>
          )}
        </aside>

      </div>

    </div>
  )
}
