'use client'

import { useState } from 'react'
import { updateTenantSettings } from './actions'
import { Check, AlertCircle } from 'lucide-react'

interface SettingsFormProps {
  initialTenant: {
    company_name: string
    title: string
    cta_text: string
    consultation_link: string
    footer_text: string
  }
}

export default function SettingsForm({ initialTenant }: SettingsFormProps) {
  const [formData, setFormData] = useState(initialTenant)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    const res = await updateTenantSettings(formData)
    setLoading(false)
    if (res.error) {
      setError(res.error)
    } else {
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl bg-zinc-900/40 border border-zinc-900 p-6 rounded-2xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">
            Company Name
          </label>
          <input
            type="text"
            required
            value={formData.company_name}
            onChange={(e) => setFormData(prev => ({ ...prev, company_name: e.target.value }))}
            className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">
            Page Title Tag
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">
            Header CTA Button Text
          </label>
          <input
            type="text"
            required
            value={formData.cta_text}
            onChange={(e) => setFormData(prev => ({ ...prev, cta_text: e.target.value }))}
            className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">
            CTA Target Link
          </label>
          <input
            type="text"
            required
            value={formData.consultation_link}
            onChange={(e) => setFormData(prev => ({ ...prev, consultation_link: e.target.value }))}
            className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">
          Footer Copyright Text
        </label>
        <input
          type="text"
          required
          value={formData.footer_text}
          onChange={(e) => setFormData(prev => ({ ...prev, footer_text: e.target.value }))}
          className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400 flex gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-400 flex gap-2">
          <Check className="w-4 h-4 flex-shrink-0" />
          <span>Settings saved successfully.</span>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-xl text-xs transition-colors cursor-pointer"
      >
        {loading ? 'Saving...' : 'Save Settings'}
      </button>
    </form>
  )
}
