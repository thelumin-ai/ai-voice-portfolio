// Centralized SaaS website builder theme catalog mapping industries and theme structures

export interface PrebuiltService {
  title: string
  description: string
  icon: string
}

export interface PrebuiltContent {
  title: string
  bio: string[]
  skills: string[]
  services: PrebuiltService[]
}

export interface ThemeConfig {
  id: string
  name: string
  category: 'Legal' | 'Consulting' | 'Real Estate' | 'Charity' | 'Agency' | 'Construction'
  isDark: boolean
  layoutType: 'advmarc' | 'consult' | 'dycrw' | 'renthu' | 'estate_teal' | 'gainlove' | 'roofing-004'
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
  category: 'Legal' | 'Consulting' | 'Real Estate' | 'Charity' | 'Agency' | 'Construction'
}

export const INDUSTRIES: Industry[] = [
  { id: 'legal_practice', name: 'Legal & Law Firm', category: 'Legal' },
  { id: 'business_consulting', name: 'Business Consulting', category: 'Consulting' },
  { id: 'real_estate_luxury', name: 'Luxury Real Estate', category: 'Real Estate' },
  { id: 'real_estate_rent', name: 'Rental Real Estate', category: 'Real Estate' },
  { id: 'real_estate_modern', name: 'Modern Real Estate', category: 'Real Estate' },
  { id: 'charity', name: 'Charity Aid Network', category: 'Charity' },
  { id: 'agency', name: 'Digital Agency Hub', category: 'Agency' }
]

export const THEME_STYLES: Omit<ThemeConfig, 'id' | 'name' | 'category'>[] = [
  // 1. Grupo ADVMARC (Law Firm)
  {
    isDark: true,
    layoutType: 'advmarc',
    bg: 'bg-[#121212] text-stone-250',
    text: 'text-stone-400',
    accent: 'text-[#c5a880]',
    accentBorder: 'border-[#c5a880]/20',
    accentBg: 'bg-[#c5a880]/5',
    btn: 'bg-[#c5a880] text-black hover:bg-[#b09670] font-semibold',
    cardBg: 'bg-[#1c1c1c] border-stone-850',
    font: 'font-serif',
    glow: 'from-[#c5a880]/10 to-transparent'
  },
  // 2. CONSULT (Business Consulting)
  {
    isDark: false,
    layoutType: 'consult',
    bg: 'bg-white text-slate-800',
    text: 'text-slate-500',
    accent: 'text-[#0f4c81]',
    accentBorder: 'border-slate-200',
    accentBg: 'bg-[#0f4c81]/5',
    btn: 'bg-[#0f4c81] text-white hover:bg-[#0c3c66] font-semibold',
    cardBg: 'bg-white border-slate-100 shadow-lg shadow-slate-200/50',
    font: 'font-sans',
    glow: 'from-blue-50 to-transparent'
  },
  // 3. DYCRW (Luxury Real Estate)
  {
    isDark: true,
    layoutType: 'dycrw',
    bg: 'bg-[#0a0a0a] text-zinc-300',
    text: 'text-zinc-500',
    accent: 'text-[#d4af37]',
    accentBorder: 'border-[#d4af37]/20',
    accentBg: 'bg-[#d4af37]/5',
    btn: 'bg-[#d4af37] text-black hover:bg-[#c19e2e] font-semibold',
    cardBg: 'bg-[#121212] border-zinc-850',
    font: 'font-sans',
    glow: 'from-[#d4af37]/10 to-transparent'
  },
  // 4. Rent H&U (Rental Real Estate)
  {
    isDark: false,
    layoutType: 'renthu',
    bg: 'bg-[#f4f7f6] text-[#0f2c59]',
    text: 'text-slate-500',
    accent: 'text-[#0f2c59]',
    accentBorder: 'border-slate-200',
    accentBg: 'bg-[#0f2c59]/5',
    btn: 'bg-[#0f2c59] text-white hover:bg-slate-800 font-semibold',
    cardBg: 'bg-white border-slate-100 shadow-md',
    font: 'font-sans',
    glow: 'from-[#0f2c59]/5 to-transparent'
  },
  // 5. Teal & Salmon Modern Real Estate
  {
    isDark: false,
    layoutType: 'estate_teal',
    bg: 'bg-[#e0f2f1] text-[#004d40]',
    text: 'text-teal-800',
    accent: 'text-[#008080]',
    accentBorder: 'border-teal-200',
    accentBg: 'bg-teal-50',
    btn: 'bg-[#ff7f50] text-white hover:bg-[#e06d40] font-semibold',
    cardBg: 'bg-white border-teal-100 shadow-md',
    font: 'font-sans',
    glow: 'from-teal-100 to-transparent'
  },
  // 6. Gainlove (Charity & Non-Profit)
  {
    isDark: false,
    layoutType: 'gainlove',
    bg: 'bg-[#faf9f6] text-stone-900',
    text: 'text-stone-600',
    accent: 'text-[#d97706]',
    accentBorder: 'border-stone-200',
    accentBg: 'bg-[#d97706]/5',
    btn: 'bg-[#d97706] text-black hover:bg-amber-600 font-semibold',
    cardBg: 'bg-white border-stone-200 shadow-sm',
    font: 'font-serif',
    glow: 'from-[#d97706]/5 to-transparent'
  },
  // 7. ewebot (Digital Agency)
  {
    isDark: false,
    layoutType: 'consult',
    bg: 'bg-white text-slate-800',
    text: 'text-slate-550',
    accent: 'text-[#4e31aa]',
    accentBorder: 'border-slate-100',
    accentBg: 'bg-[#4e31aa]/5',
    btn: 'bg-[#4e31aa] text-white hover:bg-[#3b238c] font-semibold',
    cardBg: 'bg-white border-slate-100 shadow-xl shadow-slate-200/50',
    font: 'font-sans',
    glow: 'from-[#4e31aa]/5 to-transparent'
  },
  // 8. IRONCLAD ROOFING (Dark Industrial)
  {
    isDark: true,
    layoutType: 'roofing-004',
    bg: 'bg-[#131313] text-[#e5e2e1]',
    text: 'text-[#c6c6c7]',
    accent: 'text-[#ffb4a5]',
    accentBorder: 'border-[#5c403a]',
    accentBg: 'bg-[#ff5637]/10',
    btn: 'bg-[#ff5637] text-white hover:bg-[#ba1d00] font-semibold uppercase tracking-wider',
    cardBg: 'bg-[#202020] border-[#353535]',
    font: 'font-sans',
    glow: 'from-[#ff5637]/10 to-transparent'
  }
]

const styleSuffixes = [
  'advmarc',
  'consult',
  'dycrw',
  'renthu',
  'estate_teal',
  'nonprofit-001',
  'agency-002',
  'roofing-004'
]

const styleDisplayNames = [
  'Grupo ADVMARC (Law Firm)',
  'CONSULT (Business Advisory)',
  'DYCRW (Luxury Villa)',
  'Rent H&U (Blue Glassmorphism)',
  'Teal & Salmon (Modern Real Estate)',
  'Gainlove (Charity Aid Network)',
  'ewebot (Digital Agency)',
  'IRONCLAD ROOFING (Dark Industrial)'
]

const styleCategories: ('Legal' | 'Consulting' | 'Real Estate' | 'Charity' | 'Agency' | 'Construction')[] = [
  'Legal',
  'Consulting',
  'Real Estate',
  'Real Estate',
  'Real Estate',
  'Charity',
  'Agency',
  'Construction'
]

export const PREBUILT_CONTENT: Record<string, PrebuiltContent> = {
  legal_practice: {
    title: 'Advocacia e Soluções: Seu Advogado',
    bio: [
      'No ADVMARC, suas necessidades legais são o centro de tudo o que fazemos. Com uma equipe experiente e dedicada, oferecemos soluções jurídicas completas e personalizadas.',
      'Com quase três décadas de atuação no mercado, nossa ampla experiência jurídica nos posiciona entre os escritórios mais respeitados, combinando conhecimento técnico e inovação.'
    ],
    skills: ['Direito Corporativo', 'Lei de Danos Pessoais', 'Direito Tributário', 'Defesa Civil & Comercial'],
    services: [
      { title: 'Assuntos Jurídicos Corporativos', description: 'Consultoria e assessoria completa para empresas, fusões, aquisições and conformidade regulatória.', icon: 'Cpu' },
      { title: 'Lei de Danos Pessoais', description: 'Representação ágil para assegurar compensações justas por acidentes e negligências de terceiros.', icon: 'Phone' },
      { title: 'Assessoria em Contratos', description: 'Redação, revisão e litígio de acordos civis e comerciais com máxima segurança documental.', icon: 'Bot' }
    ]
  },
  business_consulting: {
    title: 'We Are Business Consultants Dedicated To Driving Your Success',
    bio: [
      'We help businesses identify growth bottlenecks, streamline operational efficiency, and implement scalable modern structures.',
      'Our team is composed of seasoned financial analysts, operation experts, and technical automation engineers built to scale your startup or enterprise.'
    ],
    skills: ['Strategic Planning', 'Process Optimization', 'Market Research & Entry', 'Business Analysis'],
    services: [
      { title: 'Operational Restructuring', description: 'Re-aligning department workflows, automating repetitive tasks, and cutting legacy operational overheads.', icon: 'Cpu' },
      { title: 'Financial Modeling & Advice', description: 'High-fidelity revenue forecasts, unit economics auditing, and advisory for venture capital fundraising.', icon: 'Bot' },
      { title: 'Growth Scaling Strategy', description: 'Acquisition funnel engineering, conversion rate audits, and strategic brand positioning.', icon: 'Sparkles' }
    ]
  },
  real_estate_luxury: {
    title: 'FIND YOUR LUXURY DREAM HOME.',
    bio: [
      'Discover an exclusive portfolio of high-end architectural masterpieces, private waterfront estates, and luxury penthouses.',
      'We curate premium residences with state-of-the-art automation, panoramic views, and next-generation design features.'
    ],
    skills: ['Waterfront Properties', 'Premium Luxury Villas', 'Penthouse Curating', 'Private Estate Brokering'],
    services: [
      { title: 'Exclusive Villa Showcases', description: 'Private viewings of custom architectural homes featuring luxury automation and high-end security.', icon: 'Sparkles' },
      { title: 'Elite Market Appraisals', description: 'Detailed comparative market analysis for luxury estates using real-time neighborhood metrics.', icon: 'Cpu' },
      { title: 'Concierge Relocation Support', description: 'Complete, stress-free settling service including local guide matches and secure transit.', icon: 'Bot' }
    ]
  },
  real_estate_rent: {
    title: 'Finding Your New Home Is Simple',
    bio: [
      'RentHomes is your go-to destination for finding the perfect rental property to suit your needs and budget.',
      'With thousands of property listings across prime locations in the United States and Europe, home finding has never been easier.'
    ],
    skills: ['Apartment Leasing', 'Luxury Villa Rentals', 'Tenant Placement Services', 'Property Management Sync'],
    services: [
      { title: 'Ocean Breeze Villa', description: 'Stunning 4-bed modern villa with a private infinity pool and panoramic beachside view.', icon: 'Sparkles' },
      { title: 'Jakson House Penthouse', description: 'Elegant 2-bed penthouse with floor-to-ceiling glass in the center of the financial district.', icon: 'Cpu' },
      { title: 'Lakeside Cottage Retreat', description: 'Quiet 3-bed cozy cottage built directly on the water with a private boat dock.', icon: 'Bot' }
    ]
  },
  real_estate_modern: {
    title: 'Find Your Dream Home',
    bio: [
      'We design modern housing developments and manage active listings for families looking to plant roots.',
      'Our platforms offer simplified search tools to filter listings by price, location, and key amenities.'
    ],
    skills: ['Development Listings', 'Family Home Sourcing', 'First-Time Buyer Support', 'Mortgage Pre-qual Support'],
    services: [
      { title: 'Melack Residences', description: 'Contemporary family homes featuring open-concept kitchens, gardens, and community pools.', icon: 'Cpu' },
      { title: 'Decchood Complex', description: 'Modern downtown apartments near transit lines, perfect for young professionals.', icon: 'Bot' },
      { title: 'Key Woolgany Estate', description: 'Spacious suburban family estates featuring green yards and private solar arrays.', icon: 'Sparkles' }
    ]
  },
  charity: {
    title: 'Justice begins where inequality ends',
    bio: [
      'We\'re building a world where everyone has the power to shape their lives.',
      'The Gainlove Global aid network establishes a thriving and connected community, ensuring each member has access to resources that enrich and empower.'
    ],
    skills: ['Family Support', 'Education Access', 'Clean Water Initiatives', 'Anti-Poverty Grants'],
    services: [
      { title: 'Anti Poverty Programs', description: 'Programs designed to relieve the effects of and address the root causes of poverty.', icon: 'Sparkles' },
      { title: 'Family & Community Programs', description: 'Programs designed to educate and engage all ages of the community.', icon: 'Cpu' },
      { title: 'Teen Outreach & Oasis', description: 'Youth center offering counseling, training, and free local community engagement.', icon: 'Bot' }
    ]
  },
  agency: {
    title: 'Digital Products for Your Ideas',
    bio: [
      'We help brands navigate the complex digital environment. From custom SEO integrations to high-fidelity product designs, we focus on driving user engagement and growth.',
      'We are passionate about our work. Our designers stay ahead of the curve to provide engaging and user-friendly website designs to make your business stand out.'
    ],
    skills: ['SEO Auditing', 'Product UI/UX Design', 'Full Stack Development', 'Growth Hacking'],
    services: [
      { title: 'Discover, Explore Product', description: 'Analyzing user flows, exploring product requirements, and mapping architectural layouts.', icon: 'Globe' },
      { title: 'Product UX & Design', description: 'Building responsive interfaces, interactive prototypes, and production-grade design systems.', icon: 'Layers' },
      { title: 'SEO Campaigns', description: 'Auditing search engine visibility, optimizing keywords, and driving high-converting growth campaigns.', icon: 'TrendingUp' }
    ]
  }
}

// Resolve template settings by its ID, e.g. `real_estate_luxury_dycrw`
export function getTemplateById(templateId: string): ThemeConfig {
  const defaultTheme: ThemeConfig = {
    id: 'legal_practice_advmarc',
    name: 'Grupo ADVMARC - Law Firm',
    category: 'Legal',
    ...THEME_STYLES[0]
  }

  if (!templateId) return defaultTheme

  const parts = templateId.split('_')
  if (parts.length < 2) return defaultTheme

  // Find style suffix, e.g. `advmarc`, `consult`, etc.
  let themeSuffix = parts[parts.length - 1]
  let industryId = parts.slice(0, -1).join('_')

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
  const category = styleCategories[styleIndex]

  return {
    id: templateId,
    name: `${industry.name} - ${themeName}`,
    category,
    ...style
  }
}

// Generate the list of templates for a specific industry
export function getTemplatesForIndustry(industryId: string): { id: string; name: string; isDark: boolean }[] {
  const industry = INDUSTRIES.find(ind => ind.id === industryId)
  if (!industry) return []

  const customMapping: Record<string, string> = {
    legal_practice: 'advmarc',
    business_consulting: 'consult',
    real_estate_luxury: 'dycrw',
    real_estate_rent: 'renthu',
    real_estate_modern: 'estate_teal',
    charity: 'nonprofit-001',
    agency: 'agency-002'
  }

  const prioritizedSuffix = customMapping[industryId]
  const list = [...styleSuffixes]

  if (prioritizedSuffix) {
    const idx = list.indexOf(prioritizedSuffix)
    if (idx !== -1) {
      list.splice(idx, 1)
      list.unshift(prioritizedSuffix)
    }
  }

  return list.map((suffix) => {
    const idx = styleSuffixes.indexOf(suffix)
    return {
      id: `${industryId}_${suffix}`,
      name: styleDisplayNames[idx],
      isDark: THEME_STYLES[idx].isDark
    }
  })
}
