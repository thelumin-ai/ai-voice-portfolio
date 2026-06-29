'use client'

import { useEffect, useState, useRef, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { projectsRepo, Project, ProjectPage, ProjectSection } from '@/lib/projectsRepo'
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
      }
    }
    window.addEventListener('message', handleCanvasMessage)
    return () => window.removeEventListener('message', handleCanvasMessage)
  }, [])

  // Save utility with history tracking
  const updateProjectState = (updated: Project, isUndoRedo = false) => {
    setProject(updated)
    setSavingStatus('Unsaved Changes')
    
    // Save to local storage
    projectsRepo.save(updated)
    setSavingStatus('Saved')

    // Update iframe content in real-time
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage({
        type: 'UPDATE_CONTENT',
        project: updated
      }, '*')
    }

    if (!isUndoRedo) {
      const stateStr = JSON.stringify(updated)
      const nextHistory = history.slice(0, historyIndex + 1)
      nextHistory.push(stateStr)
      setHistory(nextHistory)
      setHistoryIndex(nextHistory.length - 1)
    }
  }

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
    const updated = { ...project, status: 'Published' as const }
    updateProjectState(updated)
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
      updateProjectState(updated)
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
    updateProjectState(updated)
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
      updateProjectState(updated)
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
        updateProjectState(updated)
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
        updateProjectState(updated)
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
      updateProjectState(updated)
    }
  }

  // Toggle section visibility
  const toggleSectionVisibility = (sectionId: string) => {
    const updated = { ...project }
    const pg = updated.pages[activePageId]
    if (pg && pg.sections[sectionId]) {
      pg.sections[sectionId].isVisible = !pg.sections[sectionId].isVisible
      updateProjectState(updated)
    }
  }

  // Global style change handlers
  const handleGlobalColorChange = (color: string) => {
    const updated = { ...project, themeColor: color }
    updateProjectState(updated)
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
                        className={`p-2 bg-zinc-900/60 border rounded-lg space-y-2 transition-all ${
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
                <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                  Add Elements
                </h3>
                <p className="text-[10px] text-zinc-500 leading-relaxed">
                  Select a section and click elements below to modify canvas text or parameters.
                </p>

                {/* Elements grid representational buttons */}
                <div className="grid grid-cols-2 gap-2 text-zinc-300 font-semibold text-xs">
                  <button 
                    onClick={() => alert('Heading element selected. Outlined elements can be customized in the properties panel.')}
                    className="p-3 bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-850 rounded-xl flex flex-col items-center gap-2 text-center"
                  >
                    <Type className="w-4 h-4 text-blue-400" />
                    <span>Heading</span>
                  </button>
                  <button 
                    onClick={() => alert('Text element selected. Click direct canvas paragraphs to edit subtext.')}
                    className="p-3 bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-850 rounded-xl flex flex-col items-center gap-2 text-center"
                  >
                    <FileText className="w-4 h-4 text-blue-400" />
                    <span>Paragraph</span>
                  </button>
                  <button 
                    onClick={() => alert('Button element selected. Click any button to adjust label and links.')}
                    className="p-3 bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-850 rounded-xl flex flex-col items-center gap-2 text-center"
                  >
                    <Maximize className="w-4 h-4 text-blue-400" />
                    <span>Button</span>
                  </button>
                  <button 
                    onClick={() => alert('Image element selected. Swap images using the Media library tab.')}
                    className="p-3 bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-850 rounded-xl flex flex-col items-center gap-2 text-center"
                  >
                    <ImageIcon className="w-4 h-4 text-blue-400" />
                    <span>Showcase Image</span>
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
        <aside className="w-[320px] border-l border-zinc-900 bg-zinc-950 flex flex-col flex-shrink-0 z-10">
          
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

              return (
                <div className="flex-grow flex flex-col min-h-0">
                  
                  {/* Content / Style / Advanced Tab Header */}
                  <div className="grid grid-cols-3 border-b border-zinc-900 text-zinc-500 text-[9px] font-black tracking-wider uppercase">
                    {(['content', 'style', 'advanced'] as const).map(tab => (
                      <button
                        key={tab}
                        onClick={() => setRightPanelTab(tab)}
                        className={`py-3 text-center border-b-2 transition-all ${
                          rightPanelTab === tab 
                            ? 'border-blue-500 text-white' 
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
                          <span className="text-[10px] text-zinc-400 font-mono">
                            Section: {selectedSectionId}
                          </span>
                          <span className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 text-[8px] font-mono capitalize">
                            {section.type}
                          </span>
                        </div>

                        {/* Selected Sub-Element specific label */}
                        {selectedElementId && (
                          <div className="p-2 bg-blue-950/20 border border-blue-500/20 rounded-lg flex items-center justify-between text-[10px] text-blue-400">
                            <span>Selected: <span className="font-mono">{selectedElementId}</span></span>
                            <button 
                              onClick={() => toggleElementLock(selectedElementId)} 
                              className="text-blue-400 hover:text-white"
                              title="Lock element settings"
                            >
                              {lockedElements[selectedElementId] ? <Lock className="w-3.5 h-3.5" /> : <LockOpen className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        )}

                        {/* Input for Heading */}
                        {section.content.heading !== undefined && (
                          <div>
                            <label className="block text-zinc-500 text-[9px] uppercase tracking-wider mb-1">
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
                            <label className="block text-zinc-500 text-[9px] uppercase tracking-wider mb-1">
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
                              <label className="block text-zinc-500 text-[9px] uppercase tracking-wider mb-1">
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
                              <label className="block text-zinc-500 text-[9px] uppercase tracking-wider mb-1">
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
                            <label className="block text-zinc-500 text-[9px] uppercase tracking-wider mb-1.5">
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
                      </div>
                    )}

                    {/* STYLE TAB */}
                    {rightPanelTab === 'style' && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-zinc-500 text-[9px] uppercase tracking-wider mb-1">
                            Alignment
                          </label>
                          <div className="grid grid-cols-3 gap-1 text-center font-bold text-[10px] text-zinc-300">
                            {['left', 'center', 'right'].map(align => (
                              <button
                                key={align}
                                onClick={() => handleSectionTextChange(selectedSectionId, 'align', align)}
                                className={`py-1.5 border rounded capitalize ${
                                  section.content.align === align ? 'border-blue-600 bg-blue-950/20' : 'border-zinc-800'
                                }`}
                              >
                                {align}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-zinc-500 text-[9px] uppercase tracking-wider mb-1">
                            Text Color Schema
                          </label>
                          <div className="grid grid-cols-2 gap-2 text-center text-[10px]">
                            {[
                              { id: 'text-zinc-100', name: 'Light zinc' },
                              { id: 'text-zinc-400', name: 'Medium zinc' },
                              { id: 'text-slate-900', name: 'Slate dark' },
                              { id: 'text-blue-600', name: 'Accent blue' }
                            ].map(color => (
                              <button
                                key={color.id}
                                onClick={() => handleSectionTextChange(selectedSectionId, 'textColor', color.id)}
                                className={`p-2 border rounded ${
                                  section.content.textColor === color.id ? 'border-blue-600 bg-blue-950/20' : 'border-zinc-800'
                                }`}
                              >
                                {color.name}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="border-t border-zinc-900 pt-3">
                          <label className="block text-zinc-500 text-[9px] uppercase tracking-wider mb-1">
                            Border Radius preset
                          </label>
                          <div className="grid grid-cols-3 gap-1 text-center font-bold text-[10px]">
                            {['none', 'md', 'full'].map(rad => (
                              <button
                                key={rad}
                                onClick={() => handleSectionTextChange(selectedSectionId, 'borderRadius', rad)}
                                className="py-1.5 border border-zinc-800 rounded hover:border-zinc-700 capitalize"
                              >
                                {rad}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ADVANCED TAB */}
                    {rightPanelTab === 'advanced' && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-zinc-500 text-[9px] uppercase tracking-wider mb-1 font-bold">
                            Responsive Visibility
                          </label>
                          <div className="space-y-2">
                            {[
                              { id: 'hideDesktop', name: 'Hide on Desktop Viewport' },
                              { id: 'hideTablet', name: 'Hide on Tablet Viewport' },
                              { id: 'hideMobile', name: 'Hide on Mobile Viewport' }
                            ].map(item => {
                              const isActive = section.content[item.id] === true
                              return (
                                <button
                                  key={item.id}
                                  onClick={() => handleSectionTextChange(selectedSectionId, item.id, isActive ? 'false' : 'true')}
                                  className={`w-full py-2 px-3 text-left border rounded-lg text-[10px] font-bold flex items-center justify-between ${
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
