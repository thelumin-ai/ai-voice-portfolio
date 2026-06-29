'use client'

import { useEffect, useState } from 'react'
import { projectsRepo, MediaItem } from '@/lib/projectsRepo'
import { Search, UploadCloud, Trash2, Eye, Calendar, Sparkles } from 'lucide-react'

export default function MediaLibraryPage() {
  const [media, setMedia] = useState<MediaItem[]>([])
  const [search, setSearch] = useState('')
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null)
  
  // Form states
  const [uploadName, setUploadName] = useState('')
  const [uploadUrl, setUploadUrl] = useState('')
  const [uploadAlt, setUploadAlt] = useState('')

  useEffect(() => {
    setMedia(projectsRepo.getMedia())
  }, [])

  const refresh = () => {
    setMedia(projectsRepo.getMedia())
    setSelectedItem(null)
  }

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault()
    if (!uploadName.trim() || !uploadUrl.trim()) {
      alert('Please fill out Name and Image URL fields.')
      return
    }

    projectsRepo.uploadMedia(
      uploadName.trim(),
      uploadUrl.trim(),
      uploadAlt.trim()
    )
    
    // Clear forms
    setUploadName('')
    setUploadUrl('')
    setUploadAlt('')
    
    refresh()
    alert('Simulated media upload successfully!')
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this media item?')) {
      projectsRepo.deleteMedia(id)
      refresh()
    }
  }

  const filtered = media.filter(m => 
    m.name.toLowerCase().includes(search.toLowerCase()) || 
    m.alt.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-white">Media Library</h1>
        <p className="text-xs text-zinc-400 mt-1">Upload and manage visual assets for your website headers, heroes, and cards.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Upload UI and List */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Mock upload form */}
          <form onSubmit={handleUpload} className="bg-zinc-900 border border-zinc-850 p-6 rounded-2xl space-y-4">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
              <UploadCloud className="w-4.5 h-4.5 text-zinc-500" />
              Simulated Media Uploader
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-semibold">
              <div>
                <label className="block text-zinc-500 uppercase tracking-wider text-[9px] mb-1.5">
                  Asset Filename
                </label>
                <input
                  type="text"
                  placeholder="e.g. project_banner.jpg"
                  className="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded-lg text-white"
                  value={uploadName}
                  onChange={(e) => setUploadName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-zinc-500 uppercase tracking-wider text-[9px] mb-1.5">
                  Asset Image URL
                </label>
                <input
                  type="text"
                  placeholder="e.g. https://images.unsplash.com/..."
                  className="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded-lg text-white"
                  value={uploadUrl}
                  onChange={(e) => setUploadUrl(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-zinc-500 uppercase tracking-wider text-[9px] mb-1.5">
                  Accessibility Alt Text
                </label>
                <input
                  type="text"
                  placeholder="e.g. Steel framing support"
                  className="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded-lg text-white"
                  value={uploadAlt}
                  onChange={(e) => setUploadAlt(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              className="py-2.5 px-5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs transition-colors cursor-pointer"
            >
              Upload Mock Asset
            </button>
          </form>

          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search images by filename or alt text..."
              className="pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-850 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-700 w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* List grid */}
          {filtered.length === 0 ? (
            <div className="bg-zinc-900/30 border border-dashed border-zinc-800 py-12 text-center rounded-2xl">
              <p className="text-zinc-500 text-xs">No media files match your query.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {filtered.map(item => {
                const isSelected = selectedItem?.id === item.id
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className={`bg-zinc-900 border p-3 rounded-2xl cursor-pointer hover:border-zinc-700 transition-all ${
                      isSelected ? 'border-blue-600 ring-1 ring-blue-600' : 'border-zinc-850'
                    }`}
                  >
                    <div className="h-28 bg-zinc-950 rounded-xl overflow-hidden mb-2">
                      <img src={item.url} alt={item.alt} className="w-full h-full object-cover" />
                    </div>
                    <span className="font-bold text-[10px] text-zinc-300 block truncate">{item.name}</span>
                    <span className="text-[8px] text-zinc-550 block font-medium mt-0.5">{item.size}</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Right Column: Detail Panel */}
        <div className="lg:col-span-4 space-y-6">
          {selectedItem ? (
            <div className="bg-zinc-900 border border-zinc-850 p-6 rounded-2xl space-y-5">
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                Asset Details
              </h3>
              
              <div className="h-44 bg-zinc-950 border border-zinc-850 rounded-xl overflow-hidden">
                <img src={selectedItem.url} alt={selectedItem.alt} className="w-full h-full object-contain" />
              </div>

              <div className="space-y-3 text-xs font-medium">
                <div>
                  <span className="text-zinc-500 uppercase tracking-wider text-[9px] block">Filename</span>
                  <span className="text-zinc-200 block truncate">{selectedItem.name}</span>
                </div>
                <div>
                  <span className="text-zinc-500 uppercase tracking-wider text-[9px] block">Alt Tag</span>
                  <span className="text-zinc-200 block">{selectedItem.alt}</span>
                </div>
                <div>
                  <span className="text-zinc-500 uppercase tracking-wider text-[9px] block">Size</span>
                  <span className="text-zinc-200 block">{selectedItem.size}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                  <span className="text-zinc-550 text-[10px]">{new Date(selectedItem.uploadedAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-850 flex gap-2">
                <a
                  href={selectedItem.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-grow inline-flex items-center justify-center gap-1 py-2 px-3 bg-zinc-850 hover:bg-zinc-800 text-zinc-350 hover:text-white rounded-lg text-xs font-semibold border border-zinc-800"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Original</span>
                </a>
                
                <button
                  onClick={() => handleDelete(selectedItem.id)}
                  className="p-2 bg-red-950/20 hover:bg-red-950/40 text-red-400 border border-red-900/20 rounded-lg"
                  title="Delete Asset"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-zinc-900/40 border border-dashed border-zinc-850 p-6 text-center rounded-2xl text-zinc-550 text-xs">
              <p>Select an image to inspect its file parameters or delete it.</p>
            </div>
          )}
        </div>
      </div>

    </div>
  )
}
