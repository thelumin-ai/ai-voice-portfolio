import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white flex items-center justify-center px-4 py-20 transition-colors duration-300">
      <div className="max-w-lg w-full text-center space-y-6 p-8 rounded-3xl border border-black/10 dark:border-white/10 bg-gray-50 dark:bg-zinc-950 shadow-sm">
        <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
          404 — Page Not Found
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          This route doesn&apos;t exist
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base leading-relaxed">
          The page you are looking for may have been moved or removed. Explore the portfolio or jump back to the home page.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors"
          >
            Back to Home
          </Link>
          <Link
            href="/portfolio"
            className="px-5 py-2.5 rounded-xl border border-black/10 dark:border-white/15 hover:bg-black/5 dark:hover:bg-white/5 text-sm font-semibold transition-colors"
          >
            View Portfolio
          </Link>
          <Link
            href="/use-cases"
            className="px-5 py-2.5 rounded-xl border border-black/10 dark:border-white/15 hover:bg-black/5 dark:hover:bg-white/5 text-sm font-semibold transition-colors"
          >
            Explore Use Cases
          </Link>
        </div>
      </div>
    </div>
  )
}
