'use client'

import { useState } from 'react'
import { Rocket, ShieldAlert, Globe } from 'lucide-react'
import { initializeTenantProfile } from './actions'

export default function ProfileSetupForm() {
  const [error, setError] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)
  const [subdomain, setSubdomain] = useState('')

  const handleSubdomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')
    setSubdomain(val)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsPending(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const res = await initializeTenantProfile(formData)

    if (res?.error) {
      setError(res.error)
      setIsPending(false)
    }
  }

  return (
    <div className="max-w-md mx-auto bg-zinc-900 border border-zinc-800 p-8 rounded-2xl shadow-xl space-y-6">
      <div className="text-center space-y-2">
        <div className="flex justify-center text-blue-500">
          <Rocket className="w-12 h-12 animate-bounce" />
        </div>
        <h2 className="text-2xl font-bold text-white">Initialize Your Website</h2>
        <p className="text-xs text-zinc-400">
          Configure a custom subdomain and portfolio name to get started.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
            Company or Portfolio Name
          </label>
          <input
            name="companyName"
            type="text"
            required
            placeholder="e.g. Luminous Agency"
            className="w-full p-3 rounded-xl border border-zinc-800 bg-zinc-950 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
            Pick Your Subdomain
          </label>
          <div className="relative rounded-xl shadow-sm">
            <input
              name="subdomain"
              type="text"
              required
              value={subdomain}
              onChange={handleSubdomainChange}
              placeholder="luminous-agency"
              className="w-full p-3 rounded-xl border border-zinc-800 bg-zinc-950 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 pr-32 transition-colors"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-zinc-500 text-xs font-semibold border-l border-zinc-800 bg-zinc-900/50 px-2 rounded-r-xl select-none">
              .yourplatform.com
            </div>
          </div>
          <p className="mt-2 text-[10px] text-zinc-500 flex items-center gap-1">
            <Globe className="w-3.5 h-3.5 text-blue-500" />
            <span>Your website: <strong>{subdomain || 'subdomain'}.yourplatform.com</strong></span>
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-xs">
            <ShieldAlert className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-xl text-sm transition-colors cursor-pointer shadow-md shadow-blue-500/10"
        >
          {isPending ? 'Configuring Site...' : 'Initialize Site'}
        </button>
      </form>
    </div>
  )
}
