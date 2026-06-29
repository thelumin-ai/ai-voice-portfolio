'use client'

import { HelpCircle, BookOpen, ExternalLink } from 'lucide-react'

export default function HelpPage() {
  const faqs = [
    { q: 'How do I publish my website?', a: 'Open your project in the Editor, customize your sections, and click the Publish button in the top toolbar. Your site is instantly live on your subdomain!' },
    { q: 'Can I reuse content between templates?', a: 'Yes! Inside the Theme Builder, you can load prebuilt copy which updates all your general copy placeholders (about story, services lists) at once.' },
    { q: 'Is there a limit to the number of sections I can have?', a: 'No, you can add, duplicate, reorder, or hide sections on your homepage dynamically in the editor panels.' }
  ]

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-xl font-bold text-white">Help &amp; Documentation</h1>
        <p className="text-xs text-zinc-400 mt-1">Find answers to common builder operations or consult support guidelines.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-zinc-900 border border-zinc-850 p-6 rounded-2xl md:col-span-2 space-y-4">
          <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
            Frequently Asked Questions
          </h3>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="space-y-1 text-xs">
                <h4 className="font-extrabold text-zinc-200">{faq.q}</h4>
                <p className="text-zinc-500 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-850 p-6 rounded-2xl space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="p-3 bg-zinc-950 text-zinc-500 rounded-xl inline-block">
              <BookOpen className="w-5 h-5" />
            </div>
            <h4 className="text-white font-bold text-xs">Knowledge Base</h4>
            <p className="text-zinc-550 text-[10px]">Read detailed document blueprints covering custom styling and SEO tags setup.</p>
          </div>

          <button className="w-full py-2 px-3 bg-zinc-850 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white rounded-lg text-xs font-semibold inline-flex items-center justify-center gap-1.5">
            <span>Open KB docs</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

    </div>
  )
}
