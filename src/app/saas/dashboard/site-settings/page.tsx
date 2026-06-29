'use client'

import { useEffect, useState } from 'react'
import { projectsRepo, Project } from '@/lib/projectsRepo'
import { getTemplateById } from '@/lib/templates'
import { 
  Globe, 
  Save, 
  Check, 
  Settings, 
  Link as LinkIcon, 
  BookOpen, 
  HelpCircle,
  AlertCircle
} from 'lucide-react'

export default function SiteSettingsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProjectId, setSelectedProjectId] = useState('')
  const [project, setProject] = useState<Project | null>(null)
  
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const list = projectsRepo.getAll()
    setProjects(list)
    if (list.length > 0) {
      setSelectedProjectId(list[0].id)
      setProject(list[0])
    }
  }, [])

  const handleProjectSelect = (id: string) => {
    setSelectedProjectId(id)
    const p = projectsRepo.getById(id)
    setProject(p || null)
  }

  const handleFieldChange = (field: string, value: any) => {
    if (!project) return
    setProject(prev => prev ? { ...prev, [field]: value } : null)
  }

  const handleSocialChange = (field: 'linkedin' | 'github' | 'twitter', value: string) => {
    if (!project) return
    setProject(prev => {
      if (!prev) return null
      return {
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [field]: value
        }
      }
    })
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!project) return
    projectsRepo.save(project)
    
    // Refresh lists
    setProjects(projectsRepo.getAll())
    setSuccess(true)
    setTimeout(() => setSuccess(false), 3000)
    alert('Project settings saved successfully!')
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-white">Site Settings Panel</h1>
        <p className="text-xs text-zinc-400 mt-1">Configure project metadata, custom domains, contact entries, and social links.</p>
      </div>

      {/* Selector drop */}
      {projects.length > 0 && (
        <div className="p-4 bg-zinc-900 border border-zinc-850 rounded-2xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Settings className="w-5 h-5 text-zinc-500" />
            <label className="text-xs font-bold text-zinc-300">Select Project to Configure:</label>
          </div>
          <select
            className="bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-zinc-700 min-w-[200px]"
            value={selectedProjectId}
            onChange={(e) => handleProjectSelect(e.target.value)}
          >
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
      )}

      {project ? (
        <form onSubmit={handleSave} className="space-y-6">
          
          {/* Identity & Basic settings */}
          <div className="bg-zinc-900 border border-zinc-850 p-6 rounded-2xl space-y-4">
            <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
              Website Brand Settings
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
              <div>
                <label className="block text-zinc-500 uppercase tracking-wider text-[9px] mb-1.5">
                  Project Name
                </label>
                <input
                  type="text"
                  className="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded-lg text-white"
                  value={project.name}
                  onChange={(e) => handleFieldChange('name', e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-zinc-500 uppercase tracking-wider text-[9px] mb-1.5">
                  Company Brand Header Text
                </label>
                <input
                  type="text"
                  className="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded-lg text-white"
                  value={project.companyName}
                  onChange={(e) => handleFieldChange('companyName', e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-zinc-500 uppercase tracking-wider text-[9px] mb-1.5">
                  Primary Button Text (CTA Text)
                </label>
                <input
                  type="text"
                  className="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded-lg text-white"
                  value={project.ctaText}
                  onChange={(e) => handleFieldChange('ctaText', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-zinc-500 uppercase tracking-wider text-[9px] mb-1.5">
                  Business Category Niche
                </label>
                <input
                  type="text"
                  className="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded-lg text-white"
                  value={project.businessCategory}
                  onChange={(e) => handleFieldChange('businessCategory', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="bg-zinc-900 border border-zinc-850 p-6 rounded-2xl space-y-4">
            <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
              Contact Channels
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
              <div>
                <label className="block text-zinc-500 uppercase tracking-wider text-[9px] mb-1.5">
                  Office Phone
                </label>
                <input
                  type="text"
                  className="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded-lg text-white"
                  value={project.phone}
                  onChange={(e) => handleFieldChange('phone', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-zinc-500 uppercase tracking-wider text-[9px] mb-1.5">
                  Office Email Address
                </label>
                <input
                  type="email"
                  className="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded-lg text-white"
                  value={project.email}
                  onChange={(e) => handleFieldChange('email', e.target.value)}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-zinc-500 uppercase tracking-wider text-[9px] mb-1.5">
                  Physical Address Location
                </label>
                <input
                  type="text"
                  className="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded-lg text-white"
                  value={project.address}
                  onChange={(e) => handleFieldChange('address', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Social Profiles */}
          <div className="bg-zinc-900 border border-zinc-850 p-6 rounded-2xl space-y-4">
            <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
              Social Links
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-semibold">
              <div>
                <label className="block text-zinc-500 uppercase tracking-wider text-[9px] mb-1.5">
                  LinkedIn URL
                </label>
                <input
                  type="text"
                  placeholder="https://linkedin.com/..."
                  className="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded-lg text-white"
                  value={project.socialLinks?.linkedin || ''}
                  onChange={(e) => handleSocialChange('linkedin', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-zinc-500 uppercase tracking-wider text-[9px] mb-1.5">
                  GitHub Profile URL
                </label>
                <input
                  type="text"
                  placeholder="https://github.com/..."
                  className="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded-lg text-white"
                  value={project.socialLinks?.github || ''}
                  onChange={(e) => handleSocialChange('github', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-zinc-500 uppercase tracking-wider text-[9px] mb-1.5">
                  Twitter profile URL
                </label>
                <input
                  type="text"
                  placeholder="https://twitter.com/..."
                  className="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded-lg text-white"
                  value={project.socialLinks?.twitter || ''}
                  onChange={(e) => handleSocialChange('twitter', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Domain placeholders */}
          <div className="bg-zinc-900 border border-[#5c403a]/50 p-6 rounded-2xl space-y-4">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-zinc-400" />
              <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                Domains &amp; Publishing
              </h2>
            </div>
            <p className="text-[10px] text-zinc-500 leading-relaxed">
              Standard publishing controls. Custom domains require verification certificates.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
              <div>
                <label className="block text-zinc-500 uppercase tracking-wider text-[9px] mb-1.5">
                  Subdomain Prefix
                </label>
                <div className="flex">
                  <input
                    type="text"
                    className="w-full bg-zinc-955 border border-zinc-800 p-2.5 rounded-l-lg text-zinc-400 focus:outline-none"
                    value={project.subdomain}
                    readOnly
                  />
                  <span className="p-2.5 bg-zinc-800 border-t border-b border-r border-zinc-800 rounded-r-lg text-zinc-500 select-none">
                    .abimbola.ai
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-zinc-500 uppercase tracking-wider text-[9px] mb-1.5">
                  Custom Domain Placeholder
                </label>
                <input
                  type="text"
                  placeholder="e.g. www.mycompany.com"
                  className="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded-lg text-zinc-400 focus:outline-none"
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl text-xs shadow-md shadow-blue-500/10 cursor-pointer"
            >
              {success ? (
                <>
                  <Check className="w-4 h-4 text-blue-200" />
                  <span>Settings Saved</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Configuration</span>
                </>
              )}
            </button>
          </div>

        </form>
      ) : (
        <div className="bg-zinc-900/30 border border-dashed border-zinc-800 py-12 text-center rounded-2xl text-zinc-500 text-xs">
          <p>Please create a website project to enable site settings configuration.</p>
        </div>
      )}

    </div>
  )
}
