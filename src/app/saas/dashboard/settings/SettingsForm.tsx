'use client'

import { useState } from 'react'
import { Check, AlertCircle } from 'lucide-react'
import { updateTenantSettings } from './actions'

interface SettingsFormProps {
  initialData: {
    company_name: string
    title: string
    bio: string[]
    skills: string[]
    cta_text: string
    linkedin_url: string
    github_url: string
    twitter_url: string
    consultation_provider: string
    consultation_link: string
  }
}

export function SettingsForm({ initialData }: SettingsFormProps) {
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsPending(true)
    setSuccess(false)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const result = await updateTenantSettings(formData)

    setIsPending(false)
    if (result.error) {
      setError(result.error)
    } else {
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      {/* Form Card */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-6">
        <h2 className="text-lg font-bold text-white">General Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Company or Portfolio Name
            </label>
            <input
              name="companyName"
              type="text"
              required
              defaultValue={initialData.company_name}
              className="mt-2 block w-full px-3 py-2 border border-zinc-800 bg-zinc-950 text-white rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Professional Title
            </label>
            <input
              name="title"
              type="text"
              required
              defaultValue={initialData.title}
              className="mt-2 block w-full px-3 py-2 border border-zinc-800 bg-zinc-950 text-white rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Bio (one paragraph per line)
          </label>
          <textarea
            name="bio"
            rows={4}
            required
            defaultValue={initialData.bio.join('\n')}
            className="mt-2 block w-full px-3 py-2 border border-zinc-800 bg-zinc-950 text-white rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Skills (comma separated)
          </label>
          <input
            name="skills"
            type="text"
            required
            defaultValue={initialData.skills.join(', ')}
            className="mt-2 block w-full px-3 py-2 border border-zinc-800 bg-zinc-950 text-white rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
            placeholder="e.g. Voice AI, API Automation, n8n"
          />
        </div>
      </div>

      {/* Booking and CTA */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-6">
        <h2 className="text-lg font-bold text-white">Call Booking &amp; Call-to-Action</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
              CTA Button Text
            </label>
            <input
              name="ctaText"
              type="text"
              defaultValue={initialData.cta_text}
              className="mt-2 block w-full px-3 py-2 border border-zinc-800 bg-zinc-950 text-white rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Booking Provider
            </label>
            <select
              name="consultationProvider"
              defaultValue={initialData.consultation_provider}
              className="mt-2 block w-full px-3 py-2 border border-zinc-800 bg-zinc-950 text-white rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
            >
              <option value="calendly">Calendly</option>
              <option value="upwork">Upwork</option>
              <option value="fiverr">Fiverr</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Consultation Booking Link
          </label>
          <input
            name="consultationLink"
            type="url"
            required
            defaultValue={initialData.consultation_link}
            placeholder="https://calendly.com/yourname"
            className="mt-2 block w-full px-3 py-2 border border-zinc-800 bg-zinc-950 text-white rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
          />
        </div>
      </div>

      {/* Social Links */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-6">
        <h2 className="text-lg font-bold text-white">Social Profiles</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
              LinkedIn URL
            </label>
            <input
              name="linkedinUrl"
              type="url"
              defaultValue={initialData.linkedin_url}
              placeholder="https://linkedin.com/in/..."
              className="mt-2 block w-full px-3 py-2 border border-zinc-800 bg-zinc-950 text-white rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
              GitHub URL
            </label>
            <input
              name="githubUrl"
              type="url"
              defaultValue={initialData.github_url}
              placeholder="https://github.com/..."
              className="mt-2 block w-full px-3 py-2 border border-zinc-800 bg-zinc-950 text-white rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Twitter URL
            </label>
            <input
              name="twitterUrl"
              type="url"
              defaultValue={initialData.twitter_url}
              placeholder="https://twitter.com/..."
              className="mt-2 block w-full px-3 py-2 border border-zinc-800 bg-zinc-950 text-white rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>

      {/* Notifications and Submit */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          {success && (
            <div className="flex items-center gap-2 text-green-500 text-sm font-medium">
              <Check className="w-4 h-4" />
              <span>Settings saved successfully!</span>
            </div>
          )}
          {error && (
            <div className="flex items-center gap-2 text-red-500 text-sm font-medium">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow disabled:opacity-50 transition-colors cursor-pointer"
        >
          {isPending ? 'Saving Changes...' : 'Save Settings'}
        </button>
      </div>

    </form>
  )
}
