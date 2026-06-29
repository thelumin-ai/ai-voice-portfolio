'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { getTemplateById, INDUSTRIES, getTemplatesForIndustry } from '@/lib/templates'
import { projectsRepo } from '@/lib/projectsRepo'
import { ArrowLeft, ArrowRight, Check, Sparkles, ChevronRight, Layers, FileText, Globe } from 'lucide-react'

export default function CreateWebsitePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const templateIdParam = searchParams.get('template_id')

  const [step, setStep] = useState(1)
  
  // Step 1: Template selection
  const [selectedTemplateId, setSelectedTemplateId] = useState(templateIdParam || '')

  // Step 2: Website name, company name, category
  const [name, setName] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [businessCategory, setBusinessCategory] = useState('')
  const [logo, setLogo] = useState('')

  // Step 3: Contact details
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [ctaText, setCtaText] = useState('Get a Quote')

  // Auto skip Step 1 if template_id parameter is present
  useEffect(() => {
    if (templateIdParam) {
      setSelectedTemplateId(templateIdParam)
      setStep(2)
    }
  }, [templateIdParam])

  // Get list of unique templates
  const allTemplates: { id: string; name: string; category: string }[] = []
  INDUSTRIES.forEach(ind => {
    getTemplatesForIndustry(ind.id).forEach(t => {
      if (!allTemplates.some(x => x.id === t.id)) {
        const details = getTemplateById(t.id)
        allTemplates.push({
          id: t.id,
          name: details.name.split(' - ')[1] || details.name,
          category: details.category
        })
      }
    })
  })

  // Handle final project creation
  const handleCreate = () => {
    if (!name.trim() || !companyName.trim() || !selectedTemplateId) {
      alert('Please fill out all required fields.')
      return
    }

    const subdomain = companyName.toLowerCase().replace(/[^a-z0-9]/g, '') || `site-${Date.now().toString().slice(-4)}`

    const newProject = projectsRepo.create({
      name: name.trim(),
      companyName: companyName.trim(),
      businessCategory: businessCategory || 'General Business',
      subdomain,
      templateId: selectedTemplateId,
      logo: logo || undefined,
      phone: phone || '+1 (800) 555-0199',
      email: email || `info@${subdomain}.com`,
      address: address || '123 Main Street, Cityville, ST 12345',
      ctaText: ctaText || 'Get Started',
      socialLinks: {
        linkedin: 'https://linkedin.com',
        github: 'https://github.com'
      }
    })

    // Redirect to the editor page with the new project ID
    router.push(`/saas/dashboard/editor?project_id=${newProject.id}`)
  }

  const selectedTheme = selectedTemplateId ? getTemplateById(selectedTemplateId) : null

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-6">
      
      {/* Back button */}
      <Link 
        href="/saas/dashboard"
        className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Dashboard</span>
      </Link>

      {/* Step Progress indicators */}
      <div className="flex items-center justify-between bg-zinc-900 border border-zinc-850 p-4 rounded-2xl">
        <div className="flex items-center gap-3 text-xs font-bold">
          <span className={`w-6 h-6 rounded-full flex items-center justify-center border text-[10px] ${
            step >= 1 ? 'bg-blue-600 border-blue-500 text-white' : 'border-zinc-800 text-zinc-500'
          }`}>
            1
          </span>
          <span className={step >= 1 ? 'text-white' : 'text-zinc-500'}>Template</span>
          <ChevronRight className="w-4 h-4 text-zinc-700" />
          
          <span className={`w-6 h-6 rounded-full flex items-center justify-center border text-[10px] ${
            step >= 2 ? 'bg-blue-600 border-blue-500 text-white' : 'border-zinc-800 text-zinc-500'
          }`}>
            2
          </span>
          <span className={step >= 2 ? 'text-white' : 'text-zinc-500'}>Identity</span>
          <ChevronRight className="w-4 h-4 text-zinc-700" />
          
          <span className={`w-6 h-6 rounded-full flex items-center justify-center border text-[10px] ${
            step >= 3 ? 'bg-blue-600 border-blue-500 text-white' : 'border-zinc-800 text-zinc-500'
          }`}>
            3
          </span>
          <span className={step >= 3 ? 'text-white' : 'text-zinc-500'}>Contact</span>
        </div>
        <span className="text-[10px] font-black font-mono text-zinc-500">Step {step} of 3</span>
      </div>

      {/* Forms Panel */}
      <div className="bg-zinc-900 border border-zinc-850 p-8 rounded-3xl space-y-6">
        
        {/* STEP 1: SELECT TEMPLATE */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-lg font-black text-white">Choose a Template Preset</h2>
              <p className="text-zinc-400 text-xs">Select your visual grid layout to begin.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[350px] overflow-y-auto pr-1">
              {allTemplates.map(tpl => {
                const isSelected = selectedTemplateId === tpl.id
                return (
                  <button
                    key={tpl.id}
                    onClick={() => setSelectedTemplateId(tpl.id)}
                    className={`text-left p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between h-28 ${
                      isSelected 
                        ? 'border-blue-600 bg-blue-950/20 shadow-md ring-1 ring-blue-600' 
                        : 'border-zinc-850 hover:border-zinc-700 bg-zinc-950'
                    }`}
                  >
                    <div>
                      <span className="text-[8px] font-bold text-blue-400 uppercase tracking-wider block">
                        {tpl.category}
                      </span>
                      <span className="font-extrabold text-sm text-zinc-200 mt-1 block">
                        {tpl.name}
                      </span>
                    </div>
                    {isSelected && (
                      <span className="self-end p-1 bg-blue-600 rounded-full text-white">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </button>
                )
              })}
            </div>

            <div className="flex justify-end pt-4 border-t border-zinc-850">
              <button
                onClick={() => setStep(2)}
                disabled={!selectedTemplateId}
                className="inline-flex items-center gap-1.5 py-2.5 px-5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-semibold rounded-xl text-xs transition-colors cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: SITE IDENTITY */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-lg font-black text-white">Project Identity &amp; Branding</h2>
              <p className="text-zinc-400 text-xs">Enter your project names and default categories.</p>
            </div>

            <div className="space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-zinc-400 uppercase tracking-widest text-[10px] mb-2">
                  Project Workspace Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. My Contractor Website"
                  className="w-full bg-zinc-955 border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-zinc-700"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-zinc-400 uppercase tracking-widest text-[10px] mb-2">
                  Business Brand Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. IRONCLAD ROOFING"
                  className="w-full bg-zinc-955 border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-zinc-700"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-zinc-400 uppercase tracking-widest text-[10px] mb-2">
                  Business Category Niche
                </label>
                <input
                  type="text"
                  placeholder="e.g. Roofing Contractor, Real Estate Agent"
                  className="w-full bg-zinc-955 border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-zinc-700"
                  value={businessCategory}
                  onChange={(e) => setBusinessCategory(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-zinc-400 uppercase tracking-widest text-[10px] mb-2">
                  Logo URL / Base64 Data (Optional)
                </label>
                <input
                  type="text"
                  placeholder="https://..."
                  className="w-full bg-zinc-955 border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-zinc-700"
                  value={logo}
                  onChange={(e) => setLogo(e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-zinc-850">
              <button
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-1 py-2.5 px-4 bg-zinc-800 hover:bg-zinc-750 text-white rounded-xl text-xs font-semibold"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              
              <button
                onClick={() => setStep(3)}
                disabled={!name.trim() || !companyName.trim()}
                className="inline-flex items-center gap-1.5 py-2.5 px-5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-semibold rounded-xl text-xs transition-colors cursor-pointer"
              >
                <span>Next Step</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: CONTACT & INITIALIZATION */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-lg font-black text-white">Contact Info &amp; Setup</h2>
              <p className="text-zinc-400 text-xs">Enter default numbers and address info.</p>
            </div>

            <div className="space-y-4 text-xs font-semibold">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-400 uppercase tracking-widest text-[10px] mb-2">
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    placeholder="+1 (800) 555-0199"
                    className="w-full bg-zinc-955 border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-zinc-700"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-zinc-400 uppercase tracking-widest text-[10px] mb-2">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    placeholder="info@company.com"
                    className="w-full bg-zinc-955 border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-zinc-700"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 uppercase tracking-widest text-[10px] mb-2">
                  Office Location Address
                </label>
                <input
                  type="text"
                  placeholder="100 Main St, City, ST"
                  className="w-full bg-zinc-955 border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-zinc-700"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-zinc-400 uppercase tracking-widest text-[10px] mb-2">
                  Header Button Text (CTA text)
                </label>
                <input
                  type="text"
                  placeholder="Get a Quote"
                  className="w-full bg-zinc-955 border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-zinc-700"
                  value={ctaText}
                  onChange={(e) => setCtaText(e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-zinc-850">
              <button
                onClick={() => setStep(2)}
                className="inline-flex items-center gap-1 py-2.5 px-4 bg-zinc-800 hover:bg-zinc-750 text-white rounded-xl text-xs font-semibold"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              
              <button
                onClick={handleCreate}
                className="inline-flex items-center gap-1.5 py-2.5 px-6 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl text-xs transition-colors cursor-pointer shadow-md shadow-blue-500/10"
              >
                <Sparkles className="w-4 h-4 text-blue-200" />
                <span>BUILD SITE &amp; OPEN EDITOR</span>
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  )
}
