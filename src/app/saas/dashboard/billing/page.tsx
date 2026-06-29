'use client'

import { CreditCard, CheckCircle2, Clock } from 'lucide-react'

export default function BillingPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-xl font-bold text-white">Billing &amp; Subscriptions</h1>
        <p className="text-xs text-zinc-400 mt-1">Review active SaaS portal subscription logs and invoice histories.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Active plan */}
        <div className="bg-zinc-900 border border-zinc-850 p-6 rounded-2xl md:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
              Portal Plan Details
            </h3>
            <span className="px-2 py-0.5 text-[9px] font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-md uppercase tracking-wider">
              Active
            </span>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-white">Enterprise Creator Plan</h2>
            <p className="text-zinc-400 text-xs max-w-md leading-relaxed">
              Provides unlimited customizable subdomains, visual grids, and access to all 5+ premium templates.
            </p>
          </div>

          <div className="border-t border-zinc-850 pt-4 flex justify-between items-center text-xs">
            <span className="text-zinc-550 font-semibold">Next Invoice: July 29, 2026</span>
            <span className="text-white font-extrabold">$49.00 / month</span>
          </div>
        </div>

        {/* Card 2: Quick Specs */}
        <div className="bg-zinc-900 border border-zinc-850 p-6 rounded-2xl space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="p-3 bg-zinc-950 text-zinc-500 rounded-xl inline-block">
              <CreditCard className="w-5 h-5" />
            </div>
            <h4 className="text-white font-bold text-xs">Payment Method</h4>
            <p className="text-zinc-500 text-[10px] font-semibold font-mono">Visa ending in •••• 4242</p>
          </div>

          <button className="w-full py-2 px-3 bg-zinc-850 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white rounded-lg text-xs font-semibold">
            Update Card
          </button>
        </div>
      </div>

    </div>
  )
}
