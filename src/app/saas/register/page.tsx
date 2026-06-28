'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ShieldAlert, Rocket, Globe } from 'lucide-react'
import { registerTenant } from './actions'
import Link from 'next/link'

import { createClient } from '@/lib/supabase/client'

export default function SaaSRegisterPage() {
  const [error, setError] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)
  const [subdomain, setSubdomain] = useState('')

  const handleGoogleSignIn = async () => {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`,
      },
    })
  }

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
          {/* Google Sign-in */}
          <div className="mb-6">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-3 py-2.5 px-4 border border-gray-300 dark:border-zinc-800 rounded-md bg-white dark:bg-zinc-800 text-gray-700 dark:text-zinc-200 hover:bg-gray-50 dark:hover:bg-zinc-700 font-semibold text-sm transition-colors duration-300 cursor-pointer shadow-sm"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="relative mt-6">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-gray-300 dark:border-zinc-800" />
              </div>
              <div className="relative flex justify-center text-xs font-semibold uppercase">
                <span className="bg-white dark:bg-zinc-900 px-2 text-gray-500">Or continue with email</span>
              </div>
            </div>
          </div>

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
