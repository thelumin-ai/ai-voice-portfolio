// Centralized SaaS website builder theme catalog mapping industries and theme structures

export interface ThemeConfig {
  id: string
  name: string
  isDark: boolean
  bg: string
  text: string
  accent: string
  accentBorder: string
  accentBg: string
  btn: string
  cardBg: string
  font: string
  glow: string
}

export interface Industry {
  id: string
  name: string
}

export const INDUSTRIES: Industry[] = [
  { id: 'automation_agency', name: 'Automation Agency' },
  { id: 'web_design_agency', name: 'Web Design Agency' },
  { id: 'marketing_agency', name: 'Marketing Agency' },
  { id: 'social_media_agency', name: 'Social Media Agency' },
  { id: 'content_agency', name: 'Content Creation Agency' },
  { id: 'real_estate', name: 'Real Estate' },
  { id: 'legal_practice', name: 'Legal & Law Firm' },
  { id: 'solar_energy', name: 'Solar & Energy Solutions' },
  { id: 'medical_dental', name: 'Medical & Dental' },
  { id: 'mental_health', name: 'Mental Health & Therapy' },
  { id: 'ecommerce_retail', name: 'E-Commerce & Retail' },
  { id: 'financial_consulting', name: 'Financial Consulting' },
  { id: 'fitness_gym', name: 'Fitness & Gym' },
  { id: 'coaching_mentoring', name: 'Coaching & Mentoring' },
  { id: 'home_services', name: 'Home Services (Plumbing/HVAC)' },
  { id: 'construction', name: 'Construction & Renovation' },
  { id: 'event_planning', name: 'Event Planning' },
  { id: 'restaurants', name: 'Restaurants & Cafés' },
  { id: 'education_courses', name: 'Education & Courses' },
  { id: 'accounting_bookkeeping', name: 'Accounting & Bookkeeping' },
  { id: 'photography', name: 'Professional Photography' },
]

export const THEME_STYLES: Omit<ThemeConfig, 'id' | 'name'>[] = [
  // 1. Neon Cyber (Dark)
  {
    isDark: true,
    bg: 'bg-zinc-950 text-zinc-100',
    text: 'text-zinc-400',
    accent: 'text-emerald-400',
    accentBorder: 'border-emerald-500/20',
    accentBg: 'bg-emerald-500/10',
    btn: 'bg-emerald-500 text-black hover:bg-emerald-600',
    cardBg: 'bg-zinc-900/60 border-zinc-800/80',
    font: 'font-mono',
    glow: 'from-emerald-500/10 to-transparent'
  },
  // 2. Slate Corporate (Dark)
  {
    isDark: true,
    bg: 'bg-slate-950 text-slate-100',
    text: 'text-slate-400',
    accent: 'text-blue-400',
    accentBorder: 'border-blue-500/20',
    accentBg: 'bg-blue-500/10',
    btn: 'bg-blue-600 text-white hover:bg-blue-700',
    cardBg: 'bg-slate-900/60 border-slate-800/80',
    font: 'font-sans',
    glow: 'from-blue-500/10 to-transparent'
  },
  // 3. Slate Corporate (Light)
  {
    isDark: false,
    bg: 'bg-slate-50 text-slate-900',
    text: 'text-slate-600',
    accent: 'text-blue-600',
    accentBorder: 'border-blue-200',
    accentBg: 'bg-blue-50',
    btn: 'bg-blue-600 text-white hover:bg-blue-700',
    cardBg: 'bg-white border-slate-200',
    font: 'font-sans',
    glow: 'from-blue-100/50 to-transparent'
  },
  // 4. Royal Gold (Dark)
  {
    isDark: true,
    bg: 'bg-zinc-900 text-zinc-100',
    text: 'text-zinc-400',
    accent: 'text-amber-500',
    accentBorder: 'border-amber-500/20',
    accentBg: 'bg-amber-500/10',
    btn: 'bg-amber-500 text-black hover:bg-amber-600',
    cardBg: 'bg-zinc-950/60 border-zinc-800/80',
    font: 'font-serif',
    glow: 'from-amber-500/10 to-transparent'
  },
  // 5. Eco Teal (Light)
  {
    isDark: false,
    bg: 'bg-white text-zinc-800',
    text: 'text-zinc-600',
    accent: 'text-teal-600',
    accentBorder: 'border-teal-200',
    accentBg: 'bg-teal-50',
    btn: 'bg-teal-600 text-white hover:bg-teal-700',
    cardBg: 'bg-zinc-50 border-teal-100',
    font: 'font-sans',
    glow: 'from-teal-100/50 to-transparent'
  },
  // 6. Coral Sunset (Dark)
  {
    isDark: true,
    bg: 'bg-stone-950 text-stone-100',
    text: 'text-stone-400',
    accent: 'text-orange-500',
    accentBorder: 'border-orange-500/20',
    accentBg: 'bg-orange-500/10',
    btn: 'bg-orange-600 text-white hover:bg-orange-700',
    cardBg: 'bg-stone-900/60 border-stone-800/80',
    font: 'font-sans',
    glow: 'from-orange-500/10 to-transparent'
  },
  // 7. Performance Red (Dark)
  {
    isDark: true,
    bg: 'bg-neutral-900 text-neutral-100',
    text: 'text-neutral-400',
    accent: 'text-red-500',
    accentBorder: 'border-red-500/20',
    accentBg: 'bg-red-500/10',
    btn: 'bg-red-600 text-white hover:bg-red-700',
    cardBg: 'bg-neutral-950/60 border-neutral-800/80',
    font: 'font-sans',
    glow: 'from-red-500/10 to-transparent'
  },
  // 8. Minimalist Slate (Light)
  {
    isDark: false,
    bg: 'bg-white text-black',
    text: 'text-zinc-600',
    accent: 'text-zinc-900',
    accentBorder: 'border-zinc-200',
    accentBg: 'bg-zinc-50',
    btn: 'bg-black text-white hover:bg-zinc-800',
    cardBg: 'bg-white border-zinc-100',
    font: 'font-sans',
    glow: 'from-zinc-100 to-transparent'
  },
  // 9. Violet Aurora (Dark)
  {
    isDark: true,
    bg: 'bg-slate-950 text-slate-100',
    text: 'text-slate-400',
    accent: 'text-violet-400',
    accentBorder: 'border-violet-500/20',
    accentBg: 'bg-violet-500/10',
    btn: 'bg-violet-600 text-white hover:bg-violet-700',
    cardBg: 'bg-slate-900/60 border-slate-800/80',
    font: 'font-sans',
    glow: 'from-violet-500/10 to-transparent'
  },
  // 10. Steel Industrial (Dark)
  {
    isDark: true,
    bg: 'bg-zinc-900 text-zinc-100',
    text: 'text-zinc-400',
    accent: 'text-slate-400',
    accentBorder: 'border-slate-500/20',
    accentBg: 'bg-slate-500/10',
    btn: 'bg-slate-700 text-white hover:bg-slate-800',
    cardBg: 'bg-zinc-950/60 border-zinc-800/80',
    font: 'font-sans',
    glow: 'from-slate-500/10 to-transparent'
  }
]

// Theme suffix names mapping to style index
const styleSuffixes = [
  'cyber',
  'corp_dark',
  'corp_light',
  'royal_gold',
  'eco_teal',
  'sunset',
  'performance',
  'minimalist',
  'violet_aurora',
  'steel_industrial'
]

const styleDisplayNames = [
  'Neon Cyber (Dark)',
  'Corporate Slate (Dark)',
  'Corporate Slate (Light)',
  'Royal Gold (Dark)',
  'Eco Teal (Light)',
  'Coral Sunset (Dark)',
  'Performance Red (Dark)',
  'Minimalist (Light)',
  'Violet Aurora (Dark)',
  'Steel Industrial (Dark)'
]

// Resolve template settings by its ID, e.g. `real_estate_royal_gold`
export function getTemplateById(templateId: string): ThemeConfig {
  const defaultTheme: ThemeConfig = {
    id: 'agency_automation_cyber',
    name: 'Automation Agency - Neon Cyber (Dark)',
    ...THEME_STYLES[0]
  }

  if (!templateId) return defaultTheme

  const parts = templateId.split('_')
  if (parts.length < 2) return defaultTheme

  // The last parts would form the theme suffix, e.g. `royal_gold`
  let themeSuffix = parts[parts.length - 1]
  let industryId = parts.slice(0, -1).join('_')

  // Check if double word suffix, e.g. `royal_gold`, `eco_teal`
  if (parts.length >= 3) {
    const lastTwo = parts.slice(-2).join('_')
    if (styleSuffixes.includes(lastTwo)) {
      themeSuffix = lastTwo
      industryId = parts.slice(0, -2).join('_')
    }
  }

  const industry = INDUSTRIES.find(ind => ind.id === industryId)
  const styleIndex = styleSuffixes.indexOf(themeSuffix)

  if (!industry || styleIndex === -1) {
    return defaultTheme
  }

  const style = THEME_STYLES[styleIndex]
  const themeName = styleDisplayNames[styleIndex]

  return {
    id: templateId,
    name: `${industry.name} - ${themeName}`,
    ...style
  }
}

// Generate the list of 10 templates for a specific industry
export function getTemplatesForIndustry(industryId: string): { id: string; name: string; isDark: boolean }[] {
  const industry = INDUSTRIES.find(ind => ind.id === industryId)
  if (!industry) return []

  return styleSuffixes.map((suffix, index) => ({
    id: `${industryId}_${suffix}`,
    name: styleDisplayNames[index],
    isDark: THEME_STYLES[index].isDark
  }))
}
