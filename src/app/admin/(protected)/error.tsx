'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle, LayoutDashboard, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function AdminErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Admin route error:', error)
  }, [error])

  return (
    <div className="max-w-2xl mx-auto py-12">
      <div className="adm-surface adm-card-pad space-y-5 border-adm-danger-border">
        <div className="flex items-start gap-3.5">
          <div className="h-10 w-10 rounded-xl bg-adm-danger-bg border border-adm-danger-border text-adm-danger-text flex items-center justify-center shrink-0">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div className="space-y-1 min-w-0">
            <h1 className="text-lg font-bold text-adm-text">
              Something went wrong on this admin page
            </h1>
            <p className="text-sm text-adm-muted break-words">
              {error.message || 'An unexpected server or rendering error occurred.'}
            </p>
            {error.digest && (
              <p className="text-xs font-mono text-adm-subtle">Digest: {error.digest}</p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Button type="button" onClick={reset}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
          <Button variant="outline" asChild>
            <Link href="/admin/dashboard">
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
