'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { projectsRepo, Project, ProjectPage, ProjectSection } from '@/lib/projectsRepo'
import { getTemplateById } from '@/lib/templates'
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
  Eye as EyeIcon, 
  EyeOff, 
  ArrowUp, 
  ArrowDown, 
  Sparkles,
  Search,
  ExternalLink
} from 'lucide-react'

export default function WebsiteEditorPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const projectId = searchParams.get('project_id')

  const [project, setProject] = useState<Project | null>(null)
  const [activeTab, setActiveTab] = useState<'pages' | 'sections' | 'content' | 'design' | 'media' | 'settings'>('pages')
  const [activePageId, setActivePageId] = useState<string>('home')
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null)
  
  // Viewports: 'desktop' | 'tablet' | 'mobile'
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
  const [savingStatus, setSavingStatus] = useState<'Saved' | 'Saving...' | 'Unsaved Changes'>('Saved')

  // History stack for Undo/Redo
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState<number>(-1)

  const iframeRef = useRef<HTMLIFrameElement>(null)

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
    alert('Website project published successfully!')
  }

  if (!project) return null

  const activePage = project.pages[activePageId] || project.pages['home']
  const theme = getTemplateById(project.templateId)

  // Compile iframe preview URL
  const previewSuffix = theme.id.split('_').pop() || 'nonprofit-001'
  const iframeUrl = `/templates/${previewSuffix}/preview?project_id=${project.id}&page=${activePageId}`

  // Handlers for Content tab
  const handleMetaChange = (field: 'seoTitle' | 'seoDescription', value: string) => {
    const updated = { ...project }
    const pg = updated.pages[activePageId]
    if (pg) {
      pg[field] = value
      updateProjectState(updated)
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
        const newId = `${sectionId}-copy-${Date.now()}`
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

  // Handlers for Settings tab
  const handleSettingsChange = (field: keyof Project, value: string) => {
    const updated = { ...project, [field]: value }
    updateProjectState(updated)
  }

  // Design Tab overrides
  const handleDesignChange = (templateId: string) => {
    const updated = { ...project, templateId }
    updateProjectState(updated)
  }

  return (
    <div className="fixed inset-0 bg-zinc-950 text-white flex flex-col z-[1000]">
      
      {/* ── TOP EDITOR TOOLBAR ──────────────────────────────────────── */}
      <header className="h-16 border-b border-zinc-900 bg-zinc-950 flex items-center justify-between px-6 flex-shrink-0">
        <div className="flex items-center gap-4">
          <Link
            href="/saas/dashboard"
            className="p-2 hover:bg-zinc-900 rounded-xl transition-all text-zinc-400 hover:text-white"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="h-5 w-[1px] bg-zinc-800" />
          <div>
            <span className="font-extrabold text-sm text-white">{project.name}</span>
            <span className="ml-3 px-2 py-0.5 rounded bg-zinc-900 border border-zinc-850 text-[10px] text-zinc-550 font-semibold font-mono">
              {savingStatus}
            </span>
          </div>
        </div>

        {/* Device Viewport switchers */}
        <div className="hidden md:flex bg-zinc-900 border border-zinc-850 p-1 rounded-xl gap-1">
          <button
            onClick={() => setViewport('desktop')}
            className={`p-2 rounded-lg transition-all ${
              viewport === 'desktop' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'
            }`}
            title="Desktop View"
          >
            <Monitor className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewport('tablet')}
            className={`p-2 rounded-lg transition-all ${
              viewport === 'tablet' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'
            }`}
            title="Tablet View"
          >
            <Tablet className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewport('mobile')}
            className={`p-2 rounded-lg transition-all ${
              viewport === 'mobile' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'
            }`}
            title="Mobile View"
          >
            <Smartphone className="w-4 h-4" />
          </button>
        </div>

        {/* Undo/Redo & Actions */}
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5 border-r border-zinc-850 pr-3 mr-1">
            <button
              onClick={handleUndo}
              disabled={historyIndex <= 0}
              className="p-2 hover:bg-zinc-900 rounded-xl text-zinc-400 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent transition-all"
              title="Undo"
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
              className="p-2 hover:bg-zinc-900 rounded-xl text-zinc-400 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent transition-all"
              title="Redo"
            >
              <Redo2 className="w-4 h-4" />
            </button>
          </div>

          <a
            href={`/templates/${previewSuffix}/preview?project_id=${project.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 py-2 px-4 bg-zinc-900 hover:bg-zinc-850 text-zinc-300 hover:text-white border border-zinc-800 rounded-xl text-xs font-semibold"
          >
            <Eye className="w-4 h-4" />
            <span>Preview Site</span>
          </a>

          <button
            onClick={handlePublish}
            className="inline-flex items-center gap-1.5 py-2 px-5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl text-xs shadow-md shadow-blue-500/10 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4 text-blue-200" />
            <span>Publish</span>
          </button>
        </div>
      </header>

      {/* ── MAIN WORKSPACE CONTAINER ───────────────────────────────── */}
      <div className="flex-grow flex min-h-0 relative">
        
        {/* ── LEFT EDITOR CONTROL PANEL ─────────────────────────────── */}
        <aside className="w-[300px] border-r border-zinc-900 bg-zinc-950 flex flex-col flex-shrink-0 z-10">
          {/* Tab selector bar */}
          <div className="grid grid-cols-6 border-b border-zinc-900 text-zinc-500">
            {(['pages', 'sections', 'content', 'design', 'settings'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-3.5 flex items-center justify-center border-b-2 uppercase text-[9px] font-black tracking-wider transition-all cursor-pointer ${
                  activeTab === tab 
                    ? 'border-blue-500 text-white bg-zinc-900/30' 
                    : 'border-transparent hover:text-zinc-300'
                }`}
                title={tab.toUpperCase()}
              >
                {tab === 'pages' && <Layers className="w-4.5 h-4.5" />}
                {tab === 'sections' && <Sliders className="w-4.5 h-4.5" />}
                {tab === 'content' && <FileText className="w-4.5 h-4.5" />}
                {tab === 'design' && <Sparkles className="w-4.5 h-4.5" />}
                {tab === 'settings' && <SettingsIcon className="w-4.5 h-4.5" />}
              </button>
            ))}
          </div>

          {/* Panel Contents */}
          <div className="flex-grow p-5 overflow-y-auto space-y-6">
            
            {/* PAGES TAB */}
            {activeTab === 'pages' && (
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  Site Page Hierarchy
                </h3>
                <div className="space-y-2">
                  {(['home', 'about', 'services', 'contact'] as const).map(pg => {
                    const isActive = activePageId === pg
                    return (
                      <button
                        key={pg}
                        onClick={() => {
                          setActivePageId(pg)
                          setSelectedSectionId(null)
                        }}
                        className={`w-full py-3 px-4 text-left rounded-xl uppercase text-[10px] font-black tracking-widest border transition-all cursor-pointer ${
                          isActive 
                            ? 'bg-blue-600/10 text-blue-400 border-blue-500/20 shadow' 
                            : 'bg-zinc-950 border-zinc-850 text-zinc-400 hover:text-white hover:border-zinc-700'
                        }`}
                      >
                        {pg}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* SECTIONS TAB */}
            {activeTab === 'sections' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                    Page Layout Sections
                  </h3>
                </div>
                
                <div className="space-y-2">
                  {activePage.layout.map(sectionId => {
                    const section = activePage.sections[sectionId]
                    if (!section) return null
                    const isSelected = selectedSectionId === sectionId

                    return (
                      <div 
                        key={sectionId}
                        className={`p-3 bg-zinc-900 border rounded-xl space-y-3 transition-all ${
                          isSelected ? 'border-blue-600' : 'border-zinc-800'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <button
                            onClick={() => {
                              setSelectedSectionId(sectionId)
                              setActiveTab('content')
                            }}
                            className="font-bold text-xs text-zinc-300 hover:text-blue-400 text-left capitalize cursor-pointer"
                          >
                            {section.title || sectionId}
                          </button>
                          
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => toggleSectionVisibility(sectionId)}
                              className="p-1 hover:bg-zinc-800 rounded text-zinc-500 hover:text-zinc-300"
                              title="Toggle visibility"
                            >
                              {section.isVisible ? <EyeIcon className="w-3.5 h-3.5 text-blue-400" /> : <EyeOff className="w-3.5 h-3.5" />}
                            </button>
                            <button
                              onClick={() => moveSection('up', sectionId)}
                              className="p-1 hover:bg-zinc-800 rounded text-zinc-550 hover:text-zinc-300"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => moveSection('down', sectionId)}
                              className="p-1 hover:bg-zinc-800 rounded text-zinc-550 hover:text-zinc-300"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Duplication & Delete row */}
                        <div className="flex gap-2 justify-end border-t border-zinc-800/80 pt-2 text-[10px]">
                          <button
                            onClick={() => handleDuplicateSection(sectionId)}
                            className="text-zinc-500 hover:text-zinc-300 font-semibold"
                          >
                            Duplicate
                          </button>
                          <button
                            onClick={() => handleDeleteSection(sectionId)}
                            className="text-red-500 hover:text-red-400 font-semibold"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* CONTENT TAB */}
            {activeTab === 'content' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">
                    Meta SEO tags
                  </h3>
                  <div className="space-y-4 text-xs font-semibold">
                    <div>
                      <label className="block text-zinc-500 uppercase tracking-wider text-[9px] mb-1.5">
                        Page Title Tag
                      </label>
                      <input
                        type="text"
                        className="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded-lg text-white"
                        value={activePage.seoTitle || ''}
                        onChange={(e) => handleMetaChange('seoTitle', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-zinc-500 uppercase tracking-wider text-[9px] mb-1.5">
                        SEO Description
                      </label>
                      <textarea
                        rows={2}
                        className="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded-lg text-white resize-none"
                        value={activePage.seoDescription || ''}
                        onChange={(e) => handleMetaChange('seoDescription', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-zinc-900 pt-4">
                  <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-4">
                    Active Section Content
                  </h3>
                  
                  {selectedSectionId ? (
                    (() => {
                      const section = activePage.sections[selectedSectionId]
                      if (!section) return <p className="text-zinc-500 text-xs">Section not found</p>

                      return (
                        <div className="space-y-4 text-xs font-semibold">
                          <span className="px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono text-[9px] uppercase">
                            Editing: {selectedSectionId}
                          </span>
                          
                          {/* Render title property */}
                          {section.content.heading !== undefined && (
                            <div>
                              <label className="block text-zinc-500 uppercase tracking-wider text-[9px] mb-1.5">
                                Heading
                              </label>
                              <textarea
                                rows={2}
                                className="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded-lg text-white resize-none"
                                value={section.content.heading}
                                onChange={(e) => handleSectionTextChange(selectedSectionId, 'heading', e.target.value)}
                              />
                            </div>
                          )}

                          {/* Render subtext property */}
                          {section.content.subtext !== undefined && (
                            <div>
                              <label className="block text-zinc-500 uppercase tracking-wider text-[9px] mb-1.5">
                                Subtext
                              </label>
                              <textarea
                                rows={3}
                                className="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded-lg text-white resize-none"
                                value={section.content.subtext}
                                onChange={(e) => handleSectionTextChange(selectedSectionId, 'subtext', e.target.value)}
                              />
                            </div>
                          )}

                          {/* Render ctaText property */}
                          {section.content.ctaText !== undefined && (
                            <div>
                              <label className="block text-zinc-500 uppercase tracking-wider text-[9px] mb-1.5">
                                Button Label
                              </label>
                              <input
                                type="text"
                                className="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded-lg text-white"
                                value={section.content.ctaText}
                                onChange={(e) => handleSectionTextChange(selectedSectionId, 'ctaText', e.target.value)}
                              />
                            </div>
                          )}

                          {/* Render items array */}
                          {Array.isArray(section.content.items) && (
                            <div className="space-y-4 pt-3 border-t border-zinc-900">
                              <span className="block text-zinc-400 uppercase tracking-wider text-[9px] font-bold">
                                List Items
                              </span>
                              {section.content.items.map((item: any, idx: number) => (
                                <div key={idx} className="p-3 bg-zinc-950 border border-zinc-850 rounded-xl space-y-3">
                                  <div>
                                    <label className="block text-zinc-550 text-[9px] mb-1">
                                      Item {idx + 1} Title
                                    </label>
                                    <input
                                      type="text"
                                      className="w-full bg-zinc-900 border border-zinc-800 p-2 rounded text-white"
                                      value={item.title || ''}
                                      onChange={(e) => handleSectionItemChange(selectedSectionId, idx, 'title', e.target.value)}
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-zinc-550 text-[9px] mb-1">
                                      Item {idx + 1} Description
                                    </label>
                                    <textarea
                                      rows={2}
                                      className="w-full bg-zinc-900 border border-zinc-800 p-2 rounded text-white resize-none"
                                      value={item.desc || ''}
                                      onChange={(e) => handleSectionItemChange(selectedSectionId, idx, 'desc', e.target.value)}
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )
                    })()
                  ) : (
                    <div className="text-zinc-550 text-center py-6 border border-dashed border-zinc-850 rounded-2xl">
                      <p className="text-[11px]">Select a section from the "Sections" list to edit its content fields.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* DESIGN TAB */}
            {activeTab === 'design' && (
              <div className="space-y-6">
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                    Template Theme Presets
                  </h3>
                  <p className="text-[10px] text-zinc-550 leading-relaxed">
                    Instantly swap style templates and color schemes.
                  </p>
                </div>
                
                <div className="space-y-3">
                  {[
                    { id: 'legal_practice_roofing-004', name: 'IRONCLAD ROOFING (Dark)' },
                    { id: 'business_consulting_manufacturing-003', name: 'SARVAM PIPES (Mfg)' },
                    { id: 'agency_agency-002', name: 'ewebot (Agency)' },
                    { id: 'charity_nonprofit-001', name: 'Gainlove (Charity)' }
                  ].map(style => (
                    <button
                      key={style.id}
                      onClick={() => handleDesignChange(style.id)}
                      className={`w-full text-left p-3.5 border rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        project.templateId === style.id
                          ? 'border-blue-600 bg-blue-950/20'
                          : 'border-zinc-850 bg-zinc-950 hover:border-zinc-700'
                      }`}
                    >
                      {style.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* SETTINGS TAB */}
            {activeTab === 'settings' && (
              <div className="space-y-5">
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  Site Contact &amp; Brand
                </h3>
                
                <div className="space-y-4 text-xs font-semibold">
                  <div>
                    <label className="block text-zinc-500 uppercase tracking-wider text-[9px] mb-1.5">
                      Business Brand Name
                    </label>
                    <input
                      type="text"
                      className="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded-lg text-white"
                      value={project.companyName}
                      onChange={(e) => handleSettingsChange('companyName', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-500 uppercase tracking-wider text-[9px] mb-1.5">
                      Contact Phone
                    </label>
                    <input
                      type="text"
                      className="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded-lg text-white"
                      value={project.phone}
                      onChange={(e) => handleSettingsChange('phone', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-500 uppercase tracking-wider text-[9px] mb-1.5">
                      Contact Email
                    </label>
                    <input
                      type="email"
                      className="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded-lg text-white"
                      value={project.email}
                      onChange={(e) => handleSettingsChange('email', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-500 uppercase tracking-wider text-[9px] mb-1.5">
                      Office Address
                    </label>
                    <input
                      type="text"
                      className="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded-lg text-white"
                      value={project.address}
                      onChange={(e) => handleSettingsChange('address', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-500 uppercase tracking-wider text-[9px] mb-1.5">
                      CTA Button Text
                    </label>
                    <input
                      type="text"
                      className="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded-lg text-white"
                      value={project.ctaText}
                      onChange={(e) => handleSettingsChange('ctaText', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

          </div>
        </aside>

        {/* ── CENTRAL CANVAS CONTAINER ────────────────────────────────── */}
        <main className="flex-grow bg-zinc-900/40 p-6 flex flex-col justify-center items-center overflow-auto min-w-0">
          
          {/* IFrame shell layout */}
          <div 
            className="bg-zinc-950 border border-zinc-800 flex flex-col shadow-2xl relative transition-all duration-300"
            style={{
              width: viewport === 'mobile' ? '390px' : viewport === 'tablet' ? '768px' : '100%',
              maxWidth: viewport === 'desktop' ? '1280px' : 'none',
              height: '100%',
              minHeight: '400px'
            }}
          >
            {/* Top bar browser window representation */}
            <div className="bg-zinc-950 border-b border-zinc-900 px-4 py-2.5 flex items-center justify-between flex-shrink-0">
              <div className="flex gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/20" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/20" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/20" />
              </div>
              <div className="flex-grow max-w-sm mx-4 py-0.5 px-3 bg-zinc-900 rounded-md text-center text-[9px] text-zinc-500 font-mono truncate select-all">
                {project.subdomain}.abimbola.ai/{activePageId === 'home' ? '' : activePageId}
              </div>
              <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-bold">
                {viewport} Mode
              </span>
            </div>

            {/* Simulated browser canvas */}
            <div className="flex-grow relative">
              <iframe
                ref={iframeRef}
                src={iframeUrl}
                className="w-full h-full border-0 absolute inset-0 bg-zinc-950"
                title="SaaS Site Customizer"
              />
            </div>
          </div>
        </main>
        
      </div>

    </div>
  )
}
