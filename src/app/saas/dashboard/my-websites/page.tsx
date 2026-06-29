'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { projectsRepo, Project } from '@/lib/projectsRepo'
import { getTemplateById } from '@/lib/templates'
import { 
  Search, 
  Globe, 
  Edit3, 
  ExternalLink, 
  Copy, 
  Trash2, 
  Plus, 
  Clock, 
  FolderOpen,
  Edit2
} from 'lucide-react'

export default function MyWebsitesPage() {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'All' | 'Draft' | 'Published'>('All')

  useEffect(() => {
    setProjects(projectsRepo.getAll())
  }, [])

  const refresh = () => {
    setProjects(projectsRepo.getAll())
  }

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      projectsRepo.delete(id)
      refresh()
    }
  }

  const handleDuplicate = (id: string) => {
    const clone = projectsRepo.duplicate(id)
    if (clone) {
      alert(`Project duplicated successfully as "${clone.name}"`)
      refresh()
    }
  }

  const handleRename = (id: string, currentName: string) => {
    const newName = prompt(`Enter new name for "${currentName}":`, currentName)
    if (newName && newName.trim() !== '') {
      projectsRepo.rename(id, newName.trim())
      refresh()
    }
  }

  const filtered = projects.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                          p.subdomain.toLowerCase().includes(search.toLowerCase())
    const matchesFilter = filter === 'All' || p.status === filter
    return matchesSearch && matchesFilter
  })

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white">All Website Projects</h1>
          <p className="text-xs text-zinc-400 mt-1">Manage and edit your active site previews and content repositories.</p>
        </div>
        <Link
          href="/saas/dashboard/create"
          className="inline-flex items-center gap-2 py-2.5 px-5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </Link>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-zinc-900/40 p-4 border border-zinc-850 rounded-2xl">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search projects..."
            className="pl-10 pr-4 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-700 w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex bg-zinc-950 border border-zinc-800 rounded-xl p-1 text-[10px] font-bold">
          {(['All', 'Draft', 'Published'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3.5 py-1.5 rounded-lg uppercase tracking-wider transition-all ${
                filter === f ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="bg-zinc-900/30 border border-dashed border-zinc-800 py-16 text-center rounded-3xl">
          <FolderOpen className="w-8 h-8 text-zinc-600 mx-auto mb-4" />
          <p className="text-zinc-300 font-bold text-sm">No website projects found</p>
          <p className="text-zinc-500 text-xs mt-1">Try relaxing your filters or create a new website project.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(proj => {
            const theme = getTemplateById(proj.templateId)

            return (
              <div 
                key={proj.id} 
                className="bg-zinc-900 border border-zinc-850 p-6 rounded-2xl flex flex-col justify-between h-64 hover:border-zinc-750 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-2 py-0.5 text-[9px] font-bold uppercase rounded border ${
                      proj.status === 'Published' 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                        : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                    }`}>
                      {proj.status}
                    </span>
                    <span className="text-[10px] text-zinc-500 font-semibold font-mono">
                      {theme.name.split(' - ')[1] || theme.name}
                    </span>
                  </div>
                  
                  <h3 className="font-bold text-base text-white truncate">{proj.name}</h3>
                  <p className="text-xs text-zinc-500 mt-1 truncate">{proj.subdomain}.abimbola.ai</p>
                  
                  <div className="flex items-center gap-1.5 text-zinc-550 text-[10px] mt-4">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Edited {new Date(proj.lastEdited).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Actions row */}
                <div className="flex items-center gap-2 border-t border-zinc-800/80 pt-4 mt-4">
                  <Link
                    href={`/saas/editor?project_id=${proj.id}`}
                    className="flex-grow flex items-center justify-center gap-1.5 py-2 px-3 bg-zinc-850 hover:bg-zinc-800 text-white rounded-lg border border-zinc-800 text-[11px] font-semibold"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Open Editor</span>
                  </Link>

                  <a
                    href={`/templates/${theme.id.split('_').pop()}/preview?project_id=${proj.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-zinc-850 hover:bg-zinc-800 text-zinc-450 hover:text-white rounded-lg border border-zinc-800"
                    title="Live Preview"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    onClick={() => handleRename(proj.id, proj.name)}
                    className="p-2 bg-zinc-850 hover:bg-zinc-800 text-zinc-450 hover:text-white rounded-lg border border-zinc-800"
                    title="Rename Project"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleDuplicate(proj.id)}
                    className="p-2 bg-zinc-850 hover:bg-zinc-800 text-zinc-450 hover:text-white rounded-lg border border-zinc-800"
                    title="Duplicate Project"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleDelete(proj.id, proj.name)}
                    className="p-2 bg-red-950/20 hover:bg-red-950/40 text-red-400 rounded-lg border border-red-900/20"
                    title="Delete Project"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

    </div>
  )
}
