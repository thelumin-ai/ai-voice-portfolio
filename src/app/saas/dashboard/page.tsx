'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { projectsRepo, Project } from '@/lib/projectsRepo'
import { getTemplateById } from '@/lib/templates'
import { 
  Plus, 
  Search, 
  Globe, 
  Edit3, 
  ExternalLink, 
  Copy, 
  Settings, 
  Trash2, 
  UploadCloud,
  FileText,
  Clock,
  CheckCircle,
  HelpCircle
} from 'lucide-react'

export default function SaasDashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [projects, setProjects] = useState<Project[]>([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'All' | 'Draft' | 'Published' | 'Unpublished'>('All')

  // Auth & Project loading
  useEffect(() => {
    const supabase = createClient()
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/saas/login')
        return
      }
      setUser(user)
      
      // Load local storage projects
      setProjects(projectsRepo.getAll())
      setLoading(false)
    }
    checkUser()
  }, [router])

  // Reload project list
  const refreshProjects = () => {
    setProjects(projectsRepo.getAll())
  }

  // Handle actions
  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete the website project "${name}"? This cannot be undone.`)) {
      projectsRepo.delete(id)
      refreshProjects()
    }
  }

  const handleDuplicate = (id: string) => {
    const cloned = projectsRepo.duplicate(id)
    if (cloned) {
      alert(`Duplicated project successfully as "${cloned.name}"`)
      refreshProjects()
    }
  }

  const handlePublish = (id: string) => {
    const updated = projectsRepo.setStatus(id, 'Published')
    if (updated) {
      alert(`Successfully published "${updated.name}"!`)
      refreshProjects()
    }
  }

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-zinc-500 text-xs">
        <Clock className="w-4 h-4 animate-spin text-blue-500 mr-2" />
        <span>Loading Workspace Dashboard...</span>
      </div>
    )
  }

  // Filter logic
  const filtered = projects.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                          p.companyName.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-900/20 via-zinc-900 to-zinc-900 border border-zinc-850 p-8 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 z-10">
          <h1 className="text-2xl font-black tracking-tight text-white">
            Welcome back, <span className="text-blue-400">{user?.email?.split('@')[0]}</span>
          </h1>
          <p className="text-zinc-400 text-xs max-w-xl leading-relaxed">
            Create, build, and deploy standalone multi-page website projects with visual templates and advanced customization widgets.
          </p>
        </div>
        <Link
          href="/saas/dashboard/create"
          className="inline-flex items-center justify-center gap-2 py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-blue-500/20 transition-all z-10 whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>CREATE NEW WEBSITE</span>
        </Link>
        <div className="absolute right-0 top-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Projects Overview Row */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-black text-white">My Websites</h2>
            <p className="text-zinc-500 text-xs mt-1">Manage active workspace developments and deployments.</p>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search websites..."
                className="pl-9 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-700 w-52"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            <div className="flex bg-zinc-900 border border-zinc-800 rounded-xl p-1 text-[10px] font-bold">
              {(['All', 'Draft', 'Published'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setStatusFilter(f)}
                  className={`px-3 py-1.5 rounded-lg uppercase tracking-wider transition-all ${
                    statusFilter === f ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Project Card Grid */}
        {filtered.length === 0 ? (
          <div className="bg-zinc-900/40 border border-dashed border-zinc-800 py-16 px-6 text-center rounded-3xl space-y-4">
            <div className="p-3 bg-zinc-900 text-zinc-600 rounded-2xl inline-block">
              <Globe className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <p className="text-zinc-300 font-extrabold text-sm">No website projects found</p>
              <p className="text-zinc-500 text-xs">Create your first website project using one of our responsive templates.</p>
            </div>
            <Link
              href="/saas/dashboard/create"
              className="inline-flex items-center gap-1.5 py-2 px-4 bg-zinc-800 hover:bg-zinc-750 text-white rounded-lg text-xs font-semibold border border-zinc-750"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Choose Template</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(proj => {
              const theme = getTemplateById(proj.templateId)
              const bgClass = theme.bg.split(' ')[0] || 'bg-white'
              const cardClass = theme.cardBg.split(' ')[0] || 'bg-white'

              return (
                <div 
                  key={proj.id} 
                  className="bg-zinc-900 border border-zinc-850 hover:border-zinc-750 p-6 rounded-2xl flex flex-col justify-between h-[300px] transition-all group"
                >
                  <div className="space-y-4">
                    {/* Header: Name & Status */}
                    <div className="flex items-start justify-between">
                      <div className="space-y-0.5">
                        <h3 className="font-extrabold text-sm text-white group-hover:text-blue-400 transition-colors">
                          {proj.name}
                        </h3>
                        <p className="text-[10px] text-zinc-500 font-mono tracking-tight">
                          {proj.subdomain}.abimbola.ai
                        </p>
                      </div>
                      <span className={`px-2 py-0.5 text-[9px] font-black uppercase tracking-wider rounded border ${
                        proj.status === 'Published' 
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                          : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                      }`}>
                        {proj.status}
                      </span>
                    </div>

                    {/* Template Thumbnail representation */}
                    <div className="h-20 bg-zinc-950 rounded-xl border border-zinc-850 p-3 flex items-center justify-between relative overflow-hidden select-none">
                      <div className="space-y-1 z-10">
                        <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest block">
                          Template Style
                        </span>
                        <span className="text-[10px] font-extrabold text-zinc-300 block truncate max-w-[130px]">
                          {theme.name.split(' - ')[1] || theme.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 z-10">
                        <span className={`w-4 h-4 rounded-full border border-zinc-800 ${bgClass}`} title="Canvas Background" />
                        <span className={`w-4 h-4 rounded-full border border-zinc-800 ${cardClass}`} title="Card Elements" />
                        <span className="text-[9px] text-zinc-500 font-mono pl-1">
                          {theme.isDark ? 'Dark' : 'Light'}
                        </span>
                      </div>
                      <div className="absolute right-0 top-0 w-16 h-16 bg-blue-500/5 rounded-full blur-xl pointer-events-none" />
                    </div>

                    {/* Metadata: Date */}
                    <div className="flex items-center gap-1.5 text-zinc-500 text-[10px]">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Edited {new Date(proj.lastEdited).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex items-center justify-between border-t border-zinc-800/80 pt-4 mt-4">
                    {/* Primary Edit */}
                    <Link
                      href={`/saas/dashboard/editor?project_id=${proj.id}`}
                      className="inline-flex items-center gap-1.5 py-2 px-3 bg-zinc-850 hover:bg-zinc-800 text-white rounded-lg border border-zinc-800 hover:border-zinc-750 transition-all text-[11px] font-bold"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-zinc-400" />
                      <span>Edit</span>
                    </Link>

                    {/* Actions Row */}
                    <div className="flex items-center gap-2">
                      <a
                        href={`/templates/${theme.id.split('_').pop()}/preview?project_id=${proj.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-zinc-850 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-lg border border-zinc-800 transition-all"
                        title="Live Site Preview"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      
                      <button
                        onClick={() => handleDuplicate(proj.id)}
                        className="p-2 bg-zinc-850 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-lg border border-zinc-800 transition-all"
                        title="Duplicate Project"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handlePublish(proj.id)}
                        disabled={proj.status === 'Published'}
                        className={`p-2 rounded-lg border transition-all ${
                          proj.status === 'Published'
                            ? 'opacity-40 cursor-not-allowed bg-zinc-900 border-zinc-850 text-zinc-600'
                            : 'bg-blue-600/10 hover:bg-blue-600/25 border-blue-500/20 text-blue-400 hover:text-white'
                        }`}
                        title="Publish Site"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDelete(proj.id, proj.name)}
                        className="p-2 bg-red-950/20 hover:bg-red-950/40 text-red-400 rounded-lg border border-red-900/20 hover:border-red-900/40 transition-all"
                        title="Delete Website"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

    </div>
  )
}
