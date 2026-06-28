'use client'

import { useState } from 'react'
import { initializeTenantProfile } from './actions'
import { Sparkles, Globe, Shield, ArrowRight } from 'lucide-react'

export default function ProfileSetupForm() {
  const [subdomain, setSubdomain] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const res = await initializeTenantProfile(subdomain, companyName)
    setLoading(false)
    if (res.error) {
      setError(res.error)
    } else {
      window.location.reload()
    }
  }

  return (
    <div className="max-w-md mx-auto my-12 bg-zinc-900/60 border border-zinc-800/85 p-8 rounded-2xl shadow-2xl backdrop-blur-md space-y-6">
      <div className="text-center space-y-2">
        <div className="w-10 h-10 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl flex items-center justify-center mx-auto">
          <Sparkles className="w-5 h-5" />
        </div>
        <h2 className="text-xl font-bold">Configure Your Subdomain</h2>
        <p className="text-xs text-zinc-400">
          Set up your company name and unique domain mapping to access the builder workspace.
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">
            Company Name
          </label>
          <input
            type="text"
            required
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-zinc-650"
            placeholder="e.g. Acme Studio"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">
            Subdomain Prefix
          </label>
          <div className="relative flex items-center">
            <input
              type="text"
              required
              value={subdomain}
              onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
              className="w-full pl-4 pr-24 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-zinc-650"
              placeholder="e.g. acme"
            />
            <span className="absolute right-3 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
              .abimbola.ai
            </span>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-[11px] text-red-400">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-xl text-xs transition-colors cursor-pointer shadow-md shadow-blue-500/10"
        >
          <span>{loading ? 'Initializing...' : 'Create My Site'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>
    </div>
  )
}
