'use client'

import Link from 'next/link'

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white flex items-center justify-center px-4 py-20 transition-colors duration-300">
      <div className="max-w-lg w-full text-center space-y-6 p-8 rounded-3xl border border-black/10 dark:border-white/10 bg-gray-50 dark:bg-zinc-950 shadow-sm">
        <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
          Something went wrong
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Unexpected application error
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
          {error?.message || 'An unexpected error occurred while rendering this page.'}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => reset()}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="px-5 py-2.5 rounded-xl border border-black/10 dark:border-white/15 hover:bg-black/5 dark:hover:bg-white/5 text-sm font-semibold transition-colors"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  )
}
