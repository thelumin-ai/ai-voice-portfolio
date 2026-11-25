'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-black text-white flex items-center justify-center px-4 font-sans">
        <div className="max-w-md w-full text-center space-y-5 p-8 rounded-3xl border border-white/10 bg-zinc-950">
          <p className="text-xs font-semibold uppercase tracking-wider text-red-400">
            Critical Error
          </p>
          <h1 className="text-2xl font-bold">Unable to load application</h1>
          <p className="text-sm text-zinc-400">
            {error?.message || 'A fatal rendering error occurred. Please retry or reload the page.'}
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => reset()}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
