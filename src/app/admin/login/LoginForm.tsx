'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Lock } from 'lucide-react'
import type { AdminBranding } from '@/lib/types'
import { isSafeHttpUrl } from '@/lib/url'
import { useAdminPreferencesSnapshot } from '@/components/admin/AdminPreferencesContext'
import { Button } from '@/components/ui/button'
import { login } from './actions'

export function LoginForm({ branding }: { branding: AdminBranding }) {
  const [error, setError] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)
  const preferences = useAdminPreferencesSnapshot()

  const logoUrl = branding.logoUrl.trim()
  const hasValidLogo =
    Boolean(logoUrl) &&
    (isSafeHttpUrl(logoUrl) || (logoUrl.startsWith('/') && !logoUrl.startsWith('//')))

  const handleSubmit = async (formData: FormData) => {
    setIsPending(true)
    setError(null)
    const result = await login(formData)
    if (result?.error) {
      setError(result.error)
      setIsPending(false)
    }
  }

  return (
    <div
      className="admin-root min-h-screen bg-adm-bg text-adm-text flex flex-col justify-center px-4 py-12 sm:px-6 lg:px-8"
      data-mode={preferences.mode}
      data-accent={preferences.accent}
      data-density={preferences.density}
    >
      <div className="sm:mx-auto sm:w-full sm:max-w-md space-y-6">
        <div className="flex flex-col items-center text-center">
          {hasValidLogo ? (
            <div className="h-14 w-14 rounded-2xl border border-adm-border bg-adm-surface p-2 flex items-center justify-center shadow-sm">
              <Image
                src={logoUrl}
                alt={branding.brandName}
                width={44}
                height={44}
                unoptimized
                className="h-10 w-10 object-contain"
              />
            </div>
          ) : (
            <div className="h-14 w-14 rounded-2xl border border-adm-accent/30 bg-adm-accent-soft text-adm-accent flex items-center justify-center shadow-sm">
              <Lock className="w-6 h-6" />
            </div>
          )}
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-adm-text">
            {branding.brandName}
          </h1>
          <p className="mt-1 text-sm text-adm-muted">{branding.brandSubtitle}</p>
        </div>

        <div className="adm-surface p-6 sm:p-8">
          <form action={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label htmlFor="admin-login-email" className="adm-label">
                Email
              </label>
              <input
                id="admin-login-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="admin@example.com"
                className="adm-input"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="admin-login-password" className="adm-label">
                Password
              </label>
              <input
                id="admin-login-password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                placeholder="Enter your password"
                className="adm-input"
              />
            </div>

            {error && (
              <div
                role="alert"
                className="rounded-lg border border-adm-danger-border bg-adm-danger-bg px-3 py-2 text-sm text-adm-danger-text text-center"
              >
                {error}
              </div>
            )}

            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>
        </div>

        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-adm-muted hover:text-adm-text transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to website</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
