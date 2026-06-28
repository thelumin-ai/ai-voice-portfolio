import Link from 'next/link'
import { Rocket, ShieldCheck, Globe, Bot, ArrowRight } from 'lucide-react'

export default function SaasLandingPage() {
  return (
    <div className="bg-zinc-950 text-white min-h-screen flex flex-col font-sans transition-colors duration-300 relative overflow-hidden">
      
      {/* Background blur effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/10 blur-[150px] rounded-full pointer-events-none" />

      {/* Header */}
      <header className="border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between max-w-6xl">
          <Link href="/saas" className="text-xl font-bold tracking-tight flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-blue-600 flex items-center justify-center">
              <span className="text-xs text-white font-bold">S3</span>
            </span>
            SaaS Builder
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/saas/login" className="text-sm font-semibold text-zinc-400 hover:text-white transition-colors">
              Sign In
            </Link>
            <Link
              href="/saas/register"
              className="inline-flex items-center justify-center px-4 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Main hero */}
      <main className="flex-grow flex flex-col justify-center py-20 px-6 relative z-10 max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-950/50 text-blue-400 border border-blue-900/30 mb-8 w-fit mx-auto">
          <Bot className="w-3.5 h-3.5" />
          <span>Launch Your Professional Voice AI Website</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
          Create a Premium <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-400">Voice AI Portfolio</span> in Seconds
        </h1>
        
        <p className="text-zinc-400 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
          Allow clients to call your simulated voice agents, review case studies, inspect your tech stack, and schedule consultation calls directly.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-16">
          <Link
            href="/saas/register"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-950/30 group"
          >
            <span>Build Your Site Now</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/saas/login"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 border border-zinc-800 hover:border-zinc-700 bg-zinc-900/50 text-zinc-300 hover:text-white font-bold rounded-xl transition-all"
          >
            Manage Existing Site
          </Link>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="p-6 rounded-2xl border border-zinc-900 bg-zinc-900/30 backdrop-blur-sm">
            <div className="p-2.5 bg-blue-600/10 rounded-lg text-blue-500 w-fit mb-4">
              <Globe className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white mb-2">Dynamic Subdomains</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Your site is instantly provisioned at your chosen subdomain name, complete with automatic deployment.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-zinc-900 bg-zinc-900/30 backdrop-blur-sm">
            <div className="p-2.5 bg-indigo-600/10 rounded-lg text-indigo-500 w-fit mb-4">
              <Bot className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white mb-2">Agent Showcases</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Display interactive calling consoles so leads can trigger calls to test your voice integration features.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-zinc-900 bg-zinc-900/30 backdrop-blur-sm">
            <div className="p-2.5 bg-purple-600/10 rounded-lg text-purple-500 w-fit mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white mb-2">Lead Integration</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Track calls, review transcripts, and capture prospect contact details right in your centralized SaaS panel.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-8 text-center text-zinc-600 text-xs">
        <div className="container mx-auto px-6 max-w-6xl">
          <p>© {new Date().getFullYear()} SaaS Portfolio Builder. Powered by Next.js &amp; Supabase.</p>
        </div>
      </footer>

    </div>
  )
}
