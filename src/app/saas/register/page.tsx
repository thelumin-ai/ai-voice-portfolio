'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ShieldAlert, Rocket, Globe } from 'lucide-react'
import { registerTenant } from './actions'
import Link from 'next/link'

export default function SaaSRegisterPage() {
  const [error, setError] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)
  const [subdomain, setSubdomain] = useState('')

  const handleSubdomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Keep it alphanumeric and hyphens only, lowercase
    const val = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')
    setSubdomain(val)
  }

  const handleSubmit = async (formData: FormData) => {
    setIsPending(true)
    setError(null)
    const result = await registerTenant(formData)
    if (result?.error) {
      setError(result.error)
      setIsPending(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center text-blue-600 dark:text-blue-500">
          <Rocket className="w-12 h-12 animate-bounce" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white transition-colors duration-300">
          Build Your Voice Agent Portfolio
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <Link href="/saas/login" className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 transition-colors">
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-zinc-900 py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-200 dark:border-white/10 transition-colors duration-300">
          <form action={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Company or Portfolio Name
              </label>
              <div className="mt-1">
                <input
                  name="companyName"
                  type="text"
                  required
                  placeholder="e.g. Acme Voice Labs"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-zinc-800 dark:text-white transition-colors duration-300"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Pick Your Subdomain
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  name="subdomain"
                  type="text"
                  required
                  value={subdomain}
                  onChange={handleSubdomainChange}
                  placeholder="my-portfolio"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-zinc-800 dark:text-white pr-28 transition-colors duration-300"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400 text-xs font-semibold select-none border-l border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800/80 px-2 rounded-r-md">
                  .yourplatform.com
                </div>
              </div>
              <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-blue-500" />
                <span>Your site will live at: <strong>{subdomain || 'subdomain'}.yourplatform.com</strong></span>
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email Address
              </label>
              <div className="mt-1">
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-zinc-800 dark:text-white transition-colors duration-300"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <div className="mt-1">
                <input
                  name="password"
                  type="password"
                  required
                  placeholder="•••••••• (min 6 characters)"
                  minLength={6}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-zinc-800 dark:text-white transition-colors duration-300"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-md text-sm">
                <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isPending}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors duration-300 cursor-pointer"
              >
                {isPending ? 'Building Your Site...' : 'Create Site Now'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
