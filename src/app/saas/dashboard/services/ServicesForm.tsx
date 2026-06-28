'use client'

import { useState } from 'react'
import { Trash2, Plus, Phone, Bot, Cpu, Sparkles, Briefcase } from 'lucide-react'
import { createService, deleteService } from './actions'

interface ServiceItem {
  id: string
  title: string
  description: string
  icon: string
}

interface ServicesFormProps {
  initialServices: ServiceItem[]
}

const iconOptions = [
  { name: 'Phone', icon: Phone },
  { name: 'Bot', icon: Bot },
  { name: 'Cpu', icon: Cpu },
  { name: 'Sparkles', icon: Sparkles }
]

export function ServicesForm({ initialServices }: ServicesFormProps) {
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)

  const handleAddService = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsPending(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const result = await createService(formData)

    setIsPending(false)
    if (result.error) {
      setError(result.error)
    } else {
      setShowAddForm(false)
      e.currentTarget.reset()
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return
    setIsPending(true)
    const result = await deleteService(id)
    setIsPending(false)
    if (result.error) {
      alert(result.error)
    }
  }

  return (
    <div className="space-y-6">
      
      {/* Header and Toggle */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-white">My Solutions ({initialServices.length})</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow cursor-pointer transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>{showAddForm ? 'Cancel' : 'Add New Solution'}</span>
        </button>
      </div>

      {/* Add Form Drawer */}
      {showAddForm && (
        <form onSubmit={handleAddService} className="p-6 rounded-xl border border-zinc-800 bg-zinc-900 space-y-4">
          <h3 className="font-bold text-white text-sm">Create Solution</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-zinc-400">Solution Title</label>
              <input
                name="title"
                type="text"
                required
                placeholder="e.g. Inbound Lead Qualification"
                className="mt-2 block w-full px-3 py-2 border border-zinc-800 bg-zinc-950 text-white rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-zinc-400">Icon Accent</label>
              <select
                name="icon"
                className="mt-2 block w-full px-3 py-2 border border-zinc-800 bg-zinc-950 text-white rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
              >
                {iconOptions.map(opt => (
                  <option key={opt.name} value={opt.name}>{opt.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-zinc-400">Description</label>
            <textarea
              name="description"
              rows={3}
              required
              placeholder="Detail what this voice agent does, e.g. Automatically dials inbound web leads within 30 seconds to run qualification..."
              className="mt-2 block w-full px-3 py-2 border border-zinc-800 bg-zinc-950 text-white rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
            />
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 border border-zinc-800 bg-transparent text-zinc-400 hover:bg-zinc-800 rounded-lg text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold disabled:opacity-50 transition-colors cursor-pointer"
            >
              {isPending ? 'Saving...' : 'Add Solution'}
            </button>
          </div>
        </form>
      )}

      {/* Services List */}
      {initialServices.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 border border-dashed border-zinc-800 bg-zinc-950/20 rounded-xl text-center">
          <Briefcase className="w-8 h-8 text-zinc-600 mb-3" />
          <p className="text-sm text-zinc-400">No solutions listed yet.</p>
          <p className="text-xs text-zinc-600 mt-1">Add a custom voice or automation offering to showcase on your landing page.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {initialServices.map(service => {
            const OptIcon = iconOptions.find(o => o.name === service.icon)?.icon || Briefcase
            return (
              <div
                key={service.id}
                className="p-5 border border-zinc-900 bg-zinc-950/50 rounded-xl flex items-start justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-blue-500/10 text-blue-500 rounded-lg mt-0.5">
                    <OptIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">{service.title}</h3>
                    <p className="text-sm text-zinc-400 mt-1.5 leading-relaxed">{service.description}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(service.id)}
                  disabled={isPending}
                  className="p-2 text-zinc-500 hover:text-red-500 bg-transparent rounded-lg hover:bg-red-500/10 transition-all cursor-pointer flex-shrink-0"
                  title="Delete service"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )
          })}
        </div>
      )}

    </div>
  )
}
