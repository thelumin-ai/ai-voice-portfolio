'use client'

import { useState, useTransition } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Save, Type, User, AlertTriangle, Plus, X, Loader2, CheckCircle2 } from 'lucide-react'
import {
  HeroContent, AboutContent, ProblemContent,
  defaultHeroContent, defaultAboutContent, defaultProblemContent,
  updateHeroContent, updateAboutContent, updateProblemContent
} from './actions'

const tabs = [
  { id: 'hero', label: 'Hero Section', icon: Type },
  { id: 'about', label: 'About Section', icon: User },
  { id: 'problem', label: 'Problem Section', icon: AlertTriangle },
] as const

type TabId = typeof tabs[number]['id']

interface ContentFormProps {
  initialHero: HeroContent
  initialAbout: AboutContent
  initialProblem: ProblemContent
}

export default function ContentForm({ initialHero, initialAbout, initialProblem }: ContentFormProps) {
  const [activeTab, setActiveTab] = useState<TabId>('hero')
  const [isPending, startTransition] = useTransition()
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle')

  // Hero state
  const [hero, setHero] = useState<HeroContent>(initialHero)

  // About state
  const [about, setAbout] = useState<AboutContent>(initialAbout)
  const [newSkill, setNewSkill] = useState('')

  // Problem state
  const [problem, setProblem] = useState<ProblemContent>(initialProblem)

  const handleSave = (section: TabId) => {
    setSaveStatus('idle')
    startTransition(async () => {
      let result
      switch (section) {
        case 'hero':
          result = await updateHeroContent(hero)
          break
        case 'about':
          result = await updateAboutContent(about)
          break
        case 'problem':
          result = await updateProblemContent(problem)
          break
      }
      setSaveStatus(result?.error ? 'error' : 'success')
      setTimeout(() => setSaveStatus('idle'), 3000)
    })
  }

  const inputClass = "w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all duration-200"
  const labelClass = "block text-sm font-medium text-zinc-400 mb-2"

  return (
    <div className="space-y-6">
      {/* Tab Bar */}
      <div className="flex gap-2 p-1 bg-zinc-900/50 rounded-xl border border-zinc-800">
        {tabs.map(tab => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {/* ===== HERO TAB ===== */}
          {activeTab === 'hero' && (
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 space-y-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-bold text-white">Hero Section Content</h2>
                <span className="text-xs text-zinc-500">The first thing visitors see</span>
              </div>

              <div>
                <label className={labelClass}>Badge Text</label>
                <input
                  value={hero.badge}
                  onChange={e => setHero({ ...hero, badge: e.target.value })}
                  className={inputClass}
                  placeholder={defaultHeroContent.badge}
                />
              </div>

              <div>
                <label className={labelClass}>Headline</label>
                <textarea
                  value={hero.headline}
                  onChange={e => setHero({ ...hero, headline: e.target.value })}
                  className={`${inputClass} min-h-[80px]`}
                  placeholder={defaultHeroContent.headline}
                />
                <p className="text-xs text-zinc-600 mt-1">This is the main H1 heading on your landing page</p>
              </div>

              <div>
                <label className={labelClass}>Subtext</label>
                <textarea
                  value={hero.subtext}
                  onChange={e => setHero({ ...hero, subtext: e.target.value })}
                  className={`${inputClass} min-h-[80px]`}
                  placeholder={defaultHeroContent.subtext}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Primary CTA Button</label>
                  <input
                    value={hero.cta_primary}
                    onChange={e => setHero({ ...hero, cta_primary: e.target.value })}
                    className={inputClass}
                    placeholder={defaultHeroContent.cta_primary}
                  />
                  <p className="text-xs text-zinc-600 mt-1">Links to /playground</p>
                </div>
                <div>
                  <label className={labelClass}>Secondary CTA Button</label>
                  <input
                    value={hero.cta_secondary}
                    onChange={e => setHero({ ...hero, cta_secondary: e.target.value })}
                    className={inputClass}
                    placeholder={defaultHeroContent.cta_secondary}
                  />
                  <p className="text-xs text-zinc-600 mt-1">Links to your consultation provider</p>
                </div>
              </div>

              <button
                onClick={() => setHero(defaultHeroContent)}
                className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                Reset to defaults
              </button>
            </div>
          )}

          {/* ===== ABOUT TAB ===== */}
          {activeTab === 'about' && (
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 space-y-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-bold text-white">About Section Content</h2>
                <span className="text-xs text-zinc-500">Your personal profile</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Full Name</label>
                  <input
                    value={about.name}
                    onChange={e => setAbout({ ...about, name: e.target.value })}
                    className={inputClass}
                    placeholder={defaultAboutContent.name}
                  />
                </div>
                <div>
                  <label className={labelClass}>Professional Title</label>
                  <input
                    value={about.title}
                    onChange={e => setAbout({ ...about, title: e.target.value })}
                    className={inputClass}
                    placeholder={defaultAboutContent.title}
                  />
                </div>
              </div>

              {/* Bio Paragraphs */}
              <div>
                <label className={labelClass}>Bio Paragraphs</label>
                <div className="space-y-3">
                  {about.bio.map((para, i) => (
                    <div key={i} className="flex gap-2">
                      <textarea
                        value={para}
                        onChange={e => {
                          const updated = [...about.bio]
                          updated[i] = e.target.value
                          setAbout({ ...about, bio: updated })
                        }}
                        className={`${inputClass} min-h-[80px]`}
                        placeholder={`Paragraph ${i + 1}`}
                      />
                      {about.bio.length > 1 && (
                        <button
                          onClick={() => setAbout({ ...about, bio: about.bio.filter((_, idx) => idx !== i) })}
                          className="self-start p-2 text-zinc-500 hover:text-red-400 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={() => setAbout({ ...about, bio: [...about.bio, ''] })}
                    className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <Plus className="w-3 h-3" /> Add paragraph
                  </button>
                </div>
              </div>

              {/* Skills */}
              <div>
                <label className={labelClass}>Skills / Expertise</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {about.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="flex items-center gap-1 bg-zinc-800 border border-zinc-700 text-zinc-300 px-3 py-1.5 rounded-lg text-sm"
                    >
                      {skill}
                      <button
                        onClick={() => setAbout({ ...about, skills: about.skills.filter((_, idx) => idx !== i) })}
                        className="text-zinc-500 hover:text-red-400 transition-colors ml-1"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    value={newSkill}
                    onChange={e => setNewSkill(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && newSkill.trim()) {
                        e.preventDefault()
                        setAbout({ ...about, skills: [...about.skills, newSkill.trim()] })
                        setNewSkill('')
                      }
                    }}
                    className={inputClass}
                    placeholder="Type a skill and press Enter..."
                  />
                  <button
                    onClick={() => {
                      if (newSkill.trim()) {
                        setAbout({ ...about, skills: [...about.skills, newSkill.trim()] })
                        setNewSkill('')
                      }
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-medium transition-colors flex-shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>CTA Button Text</label>
                  <input
                    value={about.cta_text}
                    onChange={e => setAbout({ ...about, cta_text: e.target.value })}
                    className={inputClass}
                    placeholder={defaultAboutContent.cta_text}
                  />
                </div>
                <div>
                  <label className={labelClass}>LinkedIn Button Text</label>
                  <input
                    value={about.linkedin_text}
                    onChange={e => setAbout({ ...about, linkedin_text: e.target.value })}
                    className={inputClass}
                    placeholder={defaultAboutContent.linkedin_text}
                  />
                </div>
              </div>

              <button
                onClick={() => setAbout(defaultAboutContent)}
                className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                Reset to defaults
              </button>
            </div>
          )}

          {/* ===== PROBLEM TAB ===== */}
          {activeTab === 'problem' && (
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 space-y-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-bold text-white">Problem Section Content</h2>
                <span className="text-xs text-zinc-500">Pain point messaging</span>
              </div>

              <div>
                <label className={labelClass}>Headline</label>
                <textarea
                  value={problem.headline}
                  onChange={e => setProblem({ ...problem, headline: e.target.value })}
                  className={`${inputClass} min-h-[60px]`}
                  placeholder={defaultProblemContent.headline}
                />
              </div>

              <div>
                <label className={labelClass}>Description</label>
                <textarea
                  value={problem.description}
                  onChange={e => setProblem({ ...problem, description: e.target.value })}
                  className={`${inputClass} min-h-[80px]`}
                  placeholder={defaultProblemContent.description}
                />
                <p className="text-xs text-zinc-600 mt-1">Supports {"<strong>"} tags for bold text</p>
              </div>

              <div>
                <label className={labelClass}>Solution Title</label>
                <input
                  value={problem.solution_title}
                  onChange={e => setProblem({ ...problem, solution_title: e.target.value })}
                  className={inputClass}
                  placeholder={defaultProblemContent.solution_title}
                />
              </div>

              <div>
                <label className={labelClass}>Solution Description</label>
                <textarea
                  value={problem.solution_text}
                  onChange={e => setProblem({ ...problem, solution_text: e.target.value })}
                  className={`${inputClass} min-h-[80px]`}
                  placeholder={defaultProblemContent.solution_text}
                />
              </div>

              <button
                onClick={() => setProblem(defaultProblemContent)}
                className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                Reset to defaults
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Save Button */}
      <div className="flex items-center justify-between bg-zinc-950 border border-zinc-800 rounded-2xl p-4">
        <div className="flex items-center gap-2">
          {saveStatus === 'success' && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-1 text-green-400 text-sm"
            >
              <CheckCircle2 className="w-4 h-4" /> Saved successfully
            </motion.span>
          )}
          {saveStatus === 'error' && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-red-400 text-sm"
            >
              Failed to save. Please try again.
            </motion.span>
          )}
        </div>
        <button
          onClick={() => handleSave(activeTab)}
          disabled={isPending}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white rounded-xl text-sm font-semibold transition-all duration-200 shadow-lg shadow-blue-600/20"
        >
          {isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Save {tabs.find(t => t.id === activeTab)?.label}
        </button>
      </div>
    </div>
  )
}
