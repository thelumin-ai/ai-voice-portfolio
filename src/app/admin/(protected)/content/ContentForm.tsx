'use client'

import { useState, useTransition } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, Loader2, Plus, RotateCcw, Save, Type, User, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAdminToast } from '@/components/admin/AdminToast'
import {
  AboutContent,
  HeroContent,
  ProblemContent,
  defaultAboutContent,
  defaultHeroContent,
  defaultProblemContent,
} from './defaults'
import {
  updateAboutContent,
  updateHeroContent,
  updateProblemContent,
} from './actions'

const tabs = [
  { id: 'hero', label: 'Hero Section', icon: Type },
  { id: 'about', label: 'About Section', icon: User },
  { id: 'problem', label: 'Problem Section', icon: AlertTriangle },
] as const

type TabId = (typeof tabs)[number]['id']

interface ContentFormProps {
  initialHero: HeroContent
  initialAbout: AboutContent
  initialProblem: ProblemContent
}

export default function ContentForm({
  initialHero,
  initialAbout,
  initialProblem,
}: ContentFormProps) {
  const [activeTab, setActiveTab] = useState<TabId>('hero')
  const [isPending, startTransition] = useTransition()
  const toast = useAdminToast()

  const [hero, setHero] = useState<HeroContent>(initialHero)
  const [about, setAbout] = useState<AboutContent>(initialAbout)
  const [newSkill, setNewSkill] = useState('')
  const [problem, setProblem] = useState<ProblemContent>(initialProblem)

  const handleSave = (section: TabId) => {
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
      if (result?.error) {
        toast.error(result.error)
      } else {
        const label = tabs.find((t) => t.id === section)?.label || 'Content'
        toast.success(`${label} saved`)
      }
    })
  }

  return (
    <div className="space-y-6 pb-16">
      {/* Tab Bar */}
      <div className="adm-surface p-1.5 flex flex-wrap gap-1.5">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const active = activeTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? 'bg-adm-accent text-adm-accent-fg shadow-sm'
                  : 'text-adm-muted hover:text-adm-text hover:bg-adm-surface-2'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Tab Panel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.16 }}
        >
          {activeTab === 'hero' && (
            <div className="adm-surface adm-card-pad space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-adm-border pb-3">
                <h2 className="text-base font-semibold text-adm-text">Hero Section Content</h2>
                <span className="adm-hint">Above-the-fold headline &amp; calls to action</span>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="hero-badge" className="adm-label">
                  Badge Text
                </label>
                <input
                  id="hero-badge"
                  value={hero.badge}
                  onChange={(e) => setHero({ ...hero, badge: e.target.value })}
                  className="adm-input"
                  placeholder={defaultHeroContent.badge}
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="hero-headline" className="adm-label">
                  Headline
                </label>
                <textarea
                  id="hero-headline"
                  value={hero.headline}
                  onChange={(e) => setHero({ ...hero, headline: e.target.value })}
                  className="adm-input"
                  rows={3}
                  placeholder={defaultHeroContent.headline}
                />
                <p className="adm-hint">Main H1 headline displayed on the landing page.</p>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="hero-subtext" className="adm-label">
                  Subtext
                </label>
                <textarea
                  id="hero-subtext"
                  value={hero.subtext}
                  onChange={(e) => setHero({ ...hero, subtext: e.target.value })}
                  className="adm-input"
                  rows={3}
                  placeholder={defaultHeroContent.subtext}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="hero-cta-primary" className="adm-label">
                    Primary CTA Label
                  </label>
                  <input
                    id="hero-cta-primary"
                    value={hero.cta_primary}
                    onChange={(e) => setHero({ ...hero, cta_primary: e.target.value })}
                    className="adm-input"
                    placeholder={defaultHeroContent.cta_primary}
                  />
                  <p className="adm-hint">Links to /playground</p>
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="hero-cta-secondary" className="adm-label">
                    Secondary CTA Label
                  </label>
                  <input
                    id="hero-cta-secondary"
                    value={hero.cta_secondary}
                    onChange={(e) => setHero({ ...hero, cta_secondary: e.target.value })}
                    className="adm-input"
                    placeholder={defaultHeroContent.cta_secondary}
                  />
                  <p className="adm-hint">Links to your active consultation provider</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setHero(defaultHeroContent)}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-adm-muted hover:text-adm-text transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Hero to defaults
              </button>
            </div>
          )}

          {activeTab === 'about' && (
            <div className="adm-surface adm-card-pad space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-adm-border pb-3">
                <h2 className="text-base font-semibold text-adm-text">About Section Content</h2>
                <span className="adm-hint">Personal profile &amp; capabilities</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="about-name" className="adm-label">
                    Full Name
                  </label>
                  <input
                    id="about-name"
                    value={about.name}
                    onChange={(e) => setAbout({ ...about, name: e.target.value })}
                    className="adm-input"
                    placeholder={defaultAboutContent.name}
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="about-title" className="adm-label">
                    Professional Title
                  </label>
                  <input
                    id="about-title"
                    value={about.title}
                    onChange={(e) => setAbout({ ...about, title: e.target.value })}
                    className="adm-input"
                    placeholder={defaultAboutContent.title}
                  />
                </div>
              </div>

              <div className="space-y-2.5">
                <span className="adm-label">Bio Paragraphs</span>
                <div className="space-y-3">
                  {about.bio.map((para, i) => (
                    <div key={i} className="flex gap-2">
                      <textarea
                        value={para}
                        onChange={(e) => {
                          const updated = [...about.bio]
                          updated[i] = e.target.value
                          setAbout({ ...about, bio: updated })
                        }}
                        className="adm-input flex-1"
                        rows={3}
                        placeholder={`Paragraph ${i + 1}`}
                      />
                      {about.bio.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          aria-label={`Remove paragraph ${i + 1}`}
                          onClick={() =>
                            setAbout({ ...about, bio: about.bio.filter((_, idx) => idx !== i) })
                          }
                          className="text-adm-danger-text hover:bg-adm-danger-bg hover:border-adm-danger-border shrink-0"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setAbout({ ...about, bio: [...about.bio, ''] })}
                  >
                    <Plus className="w-3.5 h-3.5 mr-1.5" />
                    Add paragraph
                  </Button>
                </div>
              </div>

              <div className="space-y-2.5">
                <span className="adm-label">Skills &amp; Expertise</span>
                <div className="flex flex-wrap gap-2">
                  {about.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 bg-adm-surface-2 border border-adm-border text-adm-text px-3 py-1 rounded-lg text-sm"
                    >
                      <span>{skill}</span>
                      <button
                        type="button"
                        aria-label={`Remove ${skill}`}
                        onClick={() =>
                          setAbout({
                            ...about,
                            skills: about.skills.filter((_, idx) => idx !== i),
                          })
                        }
                        className="text-adm-muted hover:text-adm-danger-text transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && newSkill.trim()) {
                        e.preventDefault()
                        setAbout({ ...about, skills: [...about.skills, newSkill.trim()] })
                        setNewSkill('')
                      }
                    }}
                    className="adm-input flex-1"
                    placeholder="Type a skill and press Enter..."
                  />
                  <Button
                    type="button"
                    onClick={() => {
                      if (newSkill.trim()) {
                        setAbout({ ...about, skills: [...about.skills, newSkill.trim()] })
                        setNewSkill('')
                      }
                    }}
                    className="shrink-0"
                  >
                    <Plus className="w-4 h-4 mr-1.5" />
                    Add
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="about-cta" className="adm-label">
                    CTA Button Text
                  </label>
                  <input
                    id="about-cta"
                    value={about.cta_text}
                    onChange={(e) => setAbout({ ...about, cta_text: e.target.value })}
                    className="adm-input"
                    placeholder={defaultAboutContent.cta_text}
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="about-linkedin" className="adm-label">
                    LinkedIn Button Text
                  </label>
                  <input
                    id="about-linkedin"
                    value={about.linkedin_text}
                    onChange={(e) => setAbout({ ...about, linkedin_text: e.target.value })}
                    className="adm-input"
                    placeholder={defaultAboutContent.linkedin_text}
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => setAbout(defaultAboutContent)}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-adm-muted hover:text-adm-text transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset About to defaults
              </button>
            </div>
          )}

          {activeTab === 'problem' && (
            <div className="adm-surface adm-card-pad space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-adm-border pb-3">
                <h2 className="text-base font-semibold text-adm-text">Problem Section Content</h2>
                <span className="adm-hint">Value proposition &amp; pain points</span>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="problem-headline" className="adm-label">
                  Headline
                </label>
                <textarea
                  id="problem-headline"
                  value={problem.headline}
                  onChange={(e) => setProblem({ ...problem, headline: e.target.value })}
                  className="adm-input"
                  rows={2}
                  placeholder={defaultProblemContent.headline}
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="problem-desc" className="adm-label">
                  Description
                </label>
                <textarea
                  id="problem-desc"
                  value={problem.description}
                  onChange={(e) => setProblem({ ...problem, description: e.target.value })}
                  className="adm-input"
                  rows={3}
                  placeholder={defaultProblemContent.description}
                />
                <p className="adm-hint">Supports basic &lt;strong&gt; emphasis tags.</p>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="problem-solution-title" className="adm-label">
                  Solution Title
                </label>
                <input
                  id="problem-solution-title"
                  value={problem.solution_title}
                  onChange={(e) => setProblem({ ...problem, solution_title: e.target.value })}
                  className="adm-input"
                  placeholder={defaultProblemContent.solution_title}
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="problem-solution-text" className="adm-label">
                  Solution Description
                </label>
                <textarea
                  id="problem-solution-text"
                  value={problem.solution_text}
                  onChange={(e) => setProblem({ ...problem, solution_text: e.target.value })}
                  className="adm-input"
                  rows={3}
                  placeholder={defaultProblemContent.solution_text}
                />
              </div>

              <button
                type="button"
                onClick={() => setProblem(defaultProblemContent)}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-adm-muted hover:text-adm-text transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Problem section to defaults
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Save Bar */}
      <div className="adm-surface p-4 flex items-center justify-between gap-4">
        <span className="text-xs text-adm-muted">
          Editing <strong className="text-adm-text">{tabs.find((t) => t.id === activeTab)?.label}</strong>
        </span>
        <Button type="button" onClick={() => handleSave(activeTab)} disabled={isPending}>
          {isPending ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          Save {tabs.find((t) => t.id === activeTab)?.label}
        </Button>
      </div>
    </div>
  )
}
