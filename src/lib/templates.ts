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
  isDark: boolean
  layoutType: 'modern_dark' | 'split_screen' | 'minimalist_list' | 'gainlove' | 'ewebot' | 'sarvam' | 'moveaus' | 'ausroofing'
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
  // Screenshot-based new templates
  { id: 'charity_nonprofit', name: 'Charity & Non-Profit' },
  { id: 'seo_agency', name: 'SEO & Digital Agency' },
  { id: 'industrial_manufacturing', name: 'Industrial & Manufacturing' },
  { id: 'moving_logistics', name: 'Moving & Logistics' },
  { id: 'roofing_construction', name: 'Roofing & Construction' },
]

export const THEME_STYLES: Omit<ThemeConfig, 'id' | 'name'>[] = [
  // 1. Neon Cyber (Dark) - Layout: modern_dark
  {
    isDark: true,
    layoutType: 'modern_dark',
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
  // 2. Slate Corporate (Dark) - Layout: split_screen
  {
    isDark: true,
    layoutType: 'split_screen',
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
  // 3. Slate Corporate (Light) - Layout: split_screen
  {
    isDark: false,
    layoutType: 'split_screen',
    bg: 'bg-slate-50 text-slate-900',
    text: 'text-slate-655 text-slate-500',
    accent: 'text-blue-600',
    accentBorder: 'border-slate-200',
    accentBg: 'bg-blue-50',
    btn: 'bg-blue-600 text-white hover:bg-blue-700',
    cardBg: 'bg-white border-slate-200',
    font: 'font-sans',
    glow: 'from-blue-100/50 to-transparent'
  },
  // 4. Royal Gold (Dark) - Layout: minimalist_list
  {
    isDark: true,
    layoutType: 'minimalist_list',
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
  // 5. Eco Teal (Light) - Layout: minimalist_list
  {
    isDark: false,
    layoutType: 'minimalist_list',
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
  // 6. Coral Sunset (Dark) - Layout: modern_dark
  {
    isDark: true,
    layoutType: 'modern_dark',
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
  // 7. Performance Red (Dark) - Layout: modern_dark
  {
    isDark: true,
    layoutType: 'modern_dark',
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
  // 8. Minimalist Slate (Light) - Layout: minimalist_list
  {
    isDark: false,
    layoutType: 'minimalist_list',
    bg: 'bg-white text-black',
    text: 'text-zinc-655 text-zinc-650',
    accent: 'text-zinc-900',
    accentBorder: 'border-zinc-200',
    accentBg: 'bg-zinc-50',
    btn: 'bg-black text-white hover:bg-zinc-800',
    cardBg: 'bg-white border-zinc-100',
    font: 'font-sans',
    glow: 'from-zinc-105 to-transparent'
  },
  // 9. Violet Aurora (Dark) - Layout: modern_dark
  {
    isDark: true,
    layoutType: 'modern_dark',
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
  // 10. Steel Industrial (Dark) - Layout: split_screen
  {
    isDark: true,
    layoutType: 'split_screen',
    bg: 'bg-zinc-900 text-zinc-100',
    text: 'text-zinc-400',
    accent: 'text-slate-400',
    accentBorder: 'border-slate-500/20',
    accentBg: 'bg-slate-500/10',
    btn: 'bg-slate-700 text-white hover:bg-slate-800',
    cardBg: 'bg-zinc-950/60 border-zinc-800/80',
    font: 'font-sans',
    glow: 'from-slate-500/10 to-transparent'
  },
  
  // ==========================================
  // CUSTOM SCREENSHOT-BASED THEMES (11-15)
  // ==========================================
  
  // 11. Gainlove (Charity Theme)
  {
    isDark: false,
    layoutType: 'gainlove',
    bg: 'bg-[#faf9f6] text-stone-900',
    text: 'text-stone-600',
    accent: 'text-[#d97706]',
    accentBorder: 'border-stone-200',
    accentBg: 'bg-[#d97706]/5',
    btn: 'bg-[#1c1917] text-white hover:bg-stone-800',
    cardBg: 'bg-white border-stone-200/80 shadow-sm',
    font: 'font-serif',
    glow: 'from-orange-100 to-transparent'
  },
  // 12. Ewebot (SEO/Digital Agency Theme)
  {
    isDark: false,
    layoutType: 'ewebot',
    bg: 'bg-white text-slate-800',
    text: 'text-slate-500',
    accent: 'text-[#6366f1]',
    accentBorder: 'border-[#6366f1]/15',
    accentBg: 'bg-[#6366f1]/5',
    btn: 'bg-[#4f46e5] text-white hover:bg-[#4338ca]',
    cardBg: 'bg-white border-slate-100 shadow-lg shadow-slate-100/40',
    font: 'font-sans',
    glow: 'from-indigo-100 to-transparent'
  },
  // 13. Sarvam (Industrial Theme)
  {
    isDark: false,
    layoutType: 'sarvam',
    bg: 'bg-slate-50 text-slate-900',
    text: 'text-slate-600',
    accent: 'text-[#f97316]',
    accentBorder: 'border-slate-200',
    accentBg: 'bg-[#f97316]/5',
    btn: 'bg-[#1e3a8a] text-white hover:bg-[#172554]',
    cardBg: 'bg-white border-slate-200 shadow-sm',
    font: 'font-sans',
    glow: 'from-blue-100 to-transparent'
  },
  // 14. Moveaus (Moving Services Theme)
  {
    isDark: false,
    layoutType: 'moveaus',
    bg: 'bg-white text-zinc-900',
    text: 'text-zinc-600',
    accent: 'text-[#ea580c]',
    accentBorder: 'border-zinc-200',
    accentBg: 'bg-[#ea580c]/5',
    btn: 'bg-[#ea580c] text-white hover:bg-[#d97706]',
    cardBg: 'bg-white border-zinc-200/80 shadow-sm',
    font: 'font-sans',
    glow: 'from-orange-100 to-transparent'
  },
  // 15. Ausroofing (Roofing Construction Theme)
  {
    isDark: true,
    layoutType: 'ausroofing',
    bg: 'bg-slate-900 text-slate-100',
    text: 'text-slate-400',
    accent: 'text-[#ea580c]',
    accentBorder: 'border-slate-800',
    accentBg: 'bg-[#ea580c]/10',
    btn: 'bg-[#ea580c] text-white hover:bg-[#d97706]',
    cardBg: 'bg-slate-950 border-slate-800/80 shadow-md',
    font: 'font-sans',
    glow: 'from-orange-500/10 to-transparent'
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
  'steel_industrial',
  // Screenshot suffixes
  'gainlove',
  'ewebot',
  'sarvam',
  'moveaus',
  'ausroofing'
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
  'Steel Industrial (Dark)',
  // Screenshot names
  'Gainlove (Charity Style)',
  'Ewebot (SEO Agency Style)',
  'Sarvam (Industrial Style)',
  'Moveaus (Moving Service Style)',
  'Ausroofing (Roofing Style)'
]

// Pre-populated content dict for all industries (including the 5 new ones)
export const PREBUILT_CONTENT: Record<string, PrebuiltContent> = {
  automation_agency: {
    title: 'AI Automation & Voice Integration Labs',
    bio: [
      'We build production-ready AI agents and voice pipelines to scale corporate operations.',
      'Our team specializes in connecting conversational LLMs directly with telephony systems (Vapi, Retell) and CRM platforms, cutting out manual lead coordination.'
    ],
    skills: ['Conversational Voice AI', 'CRM Webhook Integrations', 'LLM Prompt Engineering', 'Make.com & Zapier Pipelines'],
    services: [
      { title: 'Inbound Receptionist AI', description: '24/7 custom phone agents that answer booking questions, process support tickets, and sync with Calendly.', icon: 'Phone' },
      { title: 'Outbound Speed-to-Lead', description: 'Call new submissions within 5 seconds of form entry, qualify prospects automatically, and book meetings.', icon: 'Bot' },
      { title: 'CRM Workflow Triggers', description: 'Real-time database updates syncing call status and lead qualification tags to Salesforce or HubSpot.', icon: 'Cpu' }
    ]
  },
  web_design_agency: {
    title: 'Modern High-Converting Web Platforms',
    bio: [
      'We design and build bespoke, high-performance websites for scaling businesses.',
      'We focus on premium visual layouts, rich micro-interactions, and lighting-fast page speed to ensure maximum visitor conversion.'
    ],
    skills: ['Next.js & React Frameworks', 'TailwindCSS & Styling Systems', 'Figma UX/UI Prototyping', 'Search Engine Optimization (SEO)'],
    services: [
      { title: 'Responsive Landing Pages', description: 'Bespoke designs built to capture leads, showcase features, and look beautiful on mobile and desktop.', icon: 'Sparkles' },
      { title: 'SaaS Dashboard Design', description: 'Premium visual interfaces and clean user consoles designed for simple navigation and customer engagement.', icon: 'Cpu' },
      { title: 'SEO Optimization Audit', description: 'Complete layout and meta audit to boost organic rankings and load speeds in seconds.', icon: 'Bot' }
    ]
  },
  marketing_agency: {
    title: 'Growth Marketing & Customer Acquisition',
    bio: [
      'We help businesses generate predictable revenue through targeted online growth campaigns.',
      'We mix data analytics, pay-per-click ads, and automated email flows to maximize customer acquisition.'
    ],
    skills: ['Paid Search & Social Ads', 'Conversion Rate Optimization', 'Customer Acquisition Cost Tracking', 'Funnel Architecting'],
    services: [
      { title: 'Lead Generation Funnels', description: 'High-converting user journeys built to qualify cold traffic and convert them into scheduled sales calls.', icon: 'Sparkles' },
      { title: 'Paid Ad Campaigns', description: 'Manage and scale ads across Google, Meta, and LinkedIn targeting highly qualified search intent.', icon: 'Cpu' },
      { title: 'Email Flow Automation', description: 'Nurture cold leads and re-engage dormant users using segment-targeted email sequences.', icon: 'Bot' }
    ]
  },
  social_media_agency: {
    title: 'Viral Social Brand Growth',
    bio: [
      'We help brands capture attention, build community, and drive engagement on social media.',
      'We specialize in short-form video design, content scheduling, and community interaction workflows.'
    ],
    skills: ['Short-Form Video Editing', 'Brand Voice Development', 'Community Engagement Ops', 'Analytics & Content Calendar Scheduling'],
    services: [
      { title: 'Short-Form Video Production', description: 'Engaging, fast-paced vertical video editing designed to capture interest on TikTok, Reels, and Shorts.', icon: 'Sparkles' },
      { title: 'Social Content Calendars', description: 'Complete monthly content planning, scheduling, and formatting for unified cross-platform branding.', icon: 'Bot' },
      { title: 'Interactive Campaign Management', description: 'Launch viral hashtag promotions and user engagement campaigns to expand brand reach.', icon: 'Cpu' }
    ]
  },
  content_agency: {
    title: 'Content Strategy & Production Systems',
    bio: [
      'We produce high-quality, research-driven content that builds authority and drives organic traffic.',
      'Our team leverages AI-assisted drafting alongside human editing to scale content production rapidly.'
    ],
    skills: ['Technical Blog Writing', 'Copywriting & Content Strategy', 'AI-assisted Draft Generation', 'Keyword Intent Mapping'],
    services: [
      { title: 'Authority Blog Writing', description: 'Deep-dive, SEO-optimized articles that answer customer questions and drive qualified traffic.', icon: 'Sparkles' },
      { title: 'Case Study Copywriting', description: 'Compelling success stories highlighting metrics and customer outcomes to convert warm prospects.', icon: 'Bot' },
      { title: 'Social Media Copywriting', description: 'High-engagement text drafts tailored for LinkedIn and Twitter audiences to boost reach.', icon: 'Cpu' }
    ]
  },
  real_estate: {
    title: 'Automated MLS & Real Estate Lead Intake',
    bio: [
      'We deploy AI agents to instantly qualify property buyer and seller leads.',
      'Our automated voice systems connect directly with real estate databases to answer listings questions and book house viewings.'
    ],
    skills: ['MLS API Integrations', 'Zillow Lead Hooking', 'Buyer/Seller Qualification', 'Calendly Property Scheduling'],
    services: [
      { title: 'MLS Property Search Bot', description: 'Voice agents that query active MLS data to answer user questions about price, square footage, and location.', icon: 'Phone' },
      { title: 'Hot Lead Live Transfer', description: 'Instantly transfer hot buyer leads to an agent\'s cell phone the second they qualify on budget.', icon: 'Bot' },
      { title: 'Viewing Scheduler AI', description: 'Schedule house viewings and consults by syncing open-house calendars with prospect availability.', icon: 'Sparkles' }
    ]
  },
  legal_practice: {
    title: 'Intelligent Legal Intake Systems',
    bio: [
      'We build conversational systems that qualify client inquiries and automate case onboarding.',
      'Our solutions ensure new leads are screened according to practice focus area before scheduling attorney consultations.'
    ],
    skills: ['Legal Compliance Guidelines', 'Case Screening Logic', 'Clio & Practice Suite Sync', 'Secure Intake Webhooks'],
    services: [
      { title: '24/7 Client Intake Agent', description: 'Answer inbound calls, screen client inquiries by practice area, and document basic case details.', icon: 'Phone' },
      { title: 'Consultation Booker AI', description: 'Integrate attorney calendars to book paid or free initial assessments automatically.', icon: 'Bot' },
      { title: 'Case Document Sender', description: 'Automatically send retainer or onboarding PDF documents to clients immediately after screening.', icon: 'Sparkles' }
    ]
  },
  solar_energy: {
    title: 'Solar Lead Pre-Qualification Systems',
    bio: [
      'We scale solar customer acquisition through instant outbound dialing and pre-qualification.',
      'Our AI voice agents verify homeowner status, check monthly electric bills, and schedule virtual site assessments.'
    ],
    skills: ['Shade & Solar Estimation', 'Utility Bill Analysis', 'High-Volume Outbound Dialers', 'Utility Database Integration'],
    services: [
      { title: 'Electric Bill Qualifier', description: 'AI agents that ask homeowners about their monthly bill and confirm they spend enough to warrant solar.', icon: 'Phone' },
      { title: 'Virtual Consultation Scheduler', description: 'Book homeowners for roof shade assessments and solar design calls directly to your sales reps.', icon: 'Bot' },
      { title: 'CRM Database Sync', description: 'Update CRM systems in real-time with verified roof orientation and homeowner confirmation details.', icon: 'Cpu' }
    ]
  },
  medical_dental: {
    title: 'Dental & Clinic Appointment Assistants',
    bio: [
      'We deploy HIPAA-compliant inbound calling receptionists for dental and medical clinics.',
      'Our AI agents manage appointment bookings, schedule checkups, and answer questions about insurance coverage.'
    ],
    skills: ['HIPAA-compliant Data Handling', 'EHR/Patient Portal Integration', 'Insurance Provider Mapping', 'Schedule Coordination'],
    services: [
      { title: 'Checkup Appointment Booker', description: 'Patient-facing phone receptionist that updates scheduling software and schedules recurring hygiene checkups.', icon: 'Phone' },
      { title: 'Insurance Verification Bot', description: 'Resolve patient questions about covered providers and clinic address details instantly.', icon: 'Bot' },
      { title: 'Patient Recall Automations', description: 'Call patients who are due for checkups and offer to book them in with a single button press.', icon: 'Sparkles' }
    ]
  },
  mental_health: {
    title: 'Compassionate Therapist Receptionists',
    bio: [
      'We configure conversational receptionists that handle initial client outreach for therapy clinics.',
      'Our agents process initial assessments and schedule consultations in a secure environment.'
    ],
    skills: ['Patient Privacy Controls', 'Crisis Router Setup', 'Calendly Integration', 'Clinic Availability Sync'],
    services: [
      { title: 'Therapist Consultation Booker', description: 'Answer questions about therapist specializations, insurance, and book initial match assessments.', icon: 'Phone' },
      { title: 'Crisis Route Handling', description: 'Immediately identify crisis keywords and transfer callers to emergency crisis support lines.', icon: 'Bot' },
      { title: 'Onboarding Email Triggers', description: 'Send initial patient intake forms automatically after scheduling the first call.', icon: 'Sparkles' }
    ]
  },
  ecommerce_retail: {
    title: 'Conversational E-commerce Support Systems',
    bio: [
      'We help online stores handle customer inquiries, return requests, and track shipping statuses automatically.',
      'Our agents connect directly with Shopify to answer order status questions in real-time.'
    ],
    skills: ['Shopify API Integration', 'Shipping Tracking API (ShipStation)', 'Return Processing Logic', 'Customer Care Workflows'],
    services: [
      { title: 'Shopify Order Tracker', description: 'Verify customer order number and email, pull shipping details, and read out delivery ETA.', icon: 'Bot' },
      { title: 'Returns Intake Assistant', description: 'Collect return reasons, qualify items based on store policy, and email return shipping labels.', icon: 'Sparkles' },
      { title: 'Discount Promo Triggers', description: 'Offer specialized discounts to customer support callers to deflect order cancellations.', icon: 'Cpu' }
    ]
  },
  financial_consulting: {
    title: 'Wealth Management & Consulting Intake',
    bio: [
      'We build automated client onboarding and screening systems for wealth advisors.',
      'Our systems screen leads on net worth, goals, and timeline before scheduling discovery calls.'
    ],
    skills: ['Asset Qualification', 'Regulatory Compliance Check', 'Calendar Integration', 'Document Management Sync'],
    services: [
      { title: 'discovery call Booker', description: 'Qualify prospects based on investable assets and automatically book initial consults with advisors.', icon: 'Phone' },
      { title: 'Advisory FAQ Assistant', description: 'Answer basic questions about fee structures, account types, and compliance standards.', icon: 'Bot' },
      { title: 'Brokerage Transfer Trigger', description: 'Initiate onboarding PDF send-outs immediately after matching client profiles.', icon: 'Sparkles' }
    ]
  },
  fitness_gym: {
    title: 'Gym Membership Intake & Tour Booking',
    bio: [
      'We help gyms convert site visitors and social leads into active members.',
      'Our conversational agents follow up with leads, answer membership queries, and book facility tours.'
    ],
    skills: ['Member Management Sync', 'Tour Calendar Scheduling', 'Class Booking Integrations', 'Lead Follow-up Sequences'],
    services: [
      { title: 'Facility Tour Scheduler', description: 'Follow up with social media ad leads, answer pricing questions, and book physical gym tours.', icon: 'Phone' },
      { title: 'Class Booking Assistant', description: 'Allows active members to book spin, yoga, or lifting classes via SMS or voice assistant.', icon: 'Bot' },
      { title: 'Membership Upgrade Agent', description: 'Call members who have trial profiles and offer special discounts to upgrade to annual plans.', icon: 'Sparkles' }
    ]
  },
  coaching_mentoring: {
    title: 'Scale Coaching Bookings & Client Intake',
    bio: [
      'We help executive, fitness, and career coaches scale their booking pipeline.',
      'Our agents pre-qualify clients, check goal alignment, and coordinate calendar times.'
    ],
    skills: ['Discovery Call Screening', 'Coaching Software Integration', 'Payment Portal Hooking', 'Calendly Configuration'],
    services: [
      { title: 'Discovery Session Booker', description: 'Qualify client goals, budget, and schedule initial consultation calls automatically.', icon: 'Phone' },
      { title: 'Payment Reminder Agent', description: 'Follow up with clients who have unpaid invoices, taking card details over secure IVR.', icon: 'Bot' },
      { title: 'Course Recommendation Bot', description: 'Analyze caller needs and recommend digital courses or mentoring programs.', icon: 'Sparkles' }
    ]
  },
  home_services: {
    title: 'Emergency HVAC & Home Service Dispatch',
    bio: [
      'We scale contractor and home service scheduling through instant automated intake.',
      'Our agents answer emergency calls 24/7, classify issues, and dispatch bookings directly to calendars.'
    ],
    skills: ['Emergency Prioritization', 'Field Service Management Sync', 'Zip Code Coverage Checking', 'Quote Ballpark Estimating'],
    services: [
      { title: '24/7 Emergency Dispatch', description: 'Receive late-night plumbing or HVAC calls, log details, and immediately alert on-call techs.', icon: 'Phone' },
      { title: 'Zip Code Service Checker', description: 'Verify that callers live within the clinic or shop\'s operational radius before booking.', icon: 'Bot' },
      { title: 'Estimates & Quote Booking', description: 'Provide ballpark costs for standard services (e.g. water heater swap) and book site assessments.', icon: 'Sparkles' }
    ]
  },
  construction: {
    title: 'General Contractor Estimate Onboarding',
    bio: [
      'We help home builders and remodelers capture job details and schedule site walks.',
      'Our agents screen inquiries on budget and project scope to ensure profitable bids.'
    ],
    skills: ['Project Scope Screening', 'Job Cost Modeling', 'Calendar Integration', 'Site Walk Scheduling'],
    services: [
      { title: 'Remodel Inquiry Screener', description: 'Collect room dimensions, materials preference, and confirm project budget exceeds minimums.', icon: 'Phone' },
      { title: 'Site Walk Scheduler', description: 'Book physical job-site walkthroughs with project estimators directly on active calendars.', icon: 'Bot' },
      { title: 'Subcontractor Document Send', description: 'Email bid requests and blueprints automatically to sub-contractors after matching criteria.', icon: 'Sparkles' }
    ]
  },
  event_planning: {
    title: 'Event Planning & Booking Automation',
    bio: [
      'We help wedding coordinators, DJs, and caterers qualify event inquiries.',
      'Our systems verify dates, guest counts, and budgets before booking consultation calls.'
    ],
    skills: ['Event Date Checking', 'Minimum Budget Screening', 'Vendor Coordination', 'Onboarding Workflows'],
    services: [
      { title: 'Event Inquiry Qualifier', description: 'Verify date availability, check venue location, document guest count, and screen budgets.', icon: 'Phone' },
      { title: 'Catering Consultation Booker', description: 'Book menu tastings and design consultations with event coordinators automatically.', icon: 'Bot' },
      { title: 'Vendor Estimate Sender', description: 'Send initial ballpark catering or planning PDF estimates directly to client inbox after screening.', icon: 'Sparkles' }
    ]
  },
  restaurants: {
    title: 'Automated Restaurant Reservations',
    bio: [
      'We deploy conversational voice agents for restaurants to manage bookings.',
      'Our systems answer phone calls, take reservations, manage waitlists, and answer menu questions.'
    ],
    skills: ['Table Management Sync', 'Waitlist Automation', 'Menu FAQ Answering', 'Group Booking Qualifications'],
    services: [
      { title: 'Table Booking Receptionist', description: 'Conversational agent that reserves tables, checks active seat counts, and emails booking receipts.', icon: 'Phone' },
      { title: 'Menu & Allergy Assistant', description: 'Answer caller questions about dietary restrictions, active menus, and business hours.', icon: 'Bot' },
      { title: 'Large Group Qualifier', description: 'Screen group bookings exceeding 10 guests and trigger corporate event callback requests.', icon: 'Sparkles' }
    ]
  },
  education_courses: {
    title: 'Course Enrollment & Student Intake',
    bio: [
      'We build automated onboarding systems for academies, bootcamps, and courses.',
      'Our agents answer questions about curriculum, tuition, and book student advisors.'
    ],
    skills: ['Curriculum Mapping', 'Tuition Plan Answering', 'Advisor Calendar Scheduling', 'Student Portal Sync'],
    services: [
      { title: 'Advisor Call Scheduler', description: 'Qualify applicant career goals and schedule enrollment calls with course advisors.', icon: 'Phone' },
      { title: 'Syllabus Delivery Bot', description: 'Send curriculum PDFs and discount codes automatically to student WhatsApp or email.', icon: 'Bot' },
      { title: 'Tuition Payment Onboarding', description: 'Guide accepted students through payment plan setup and portal registration.', icon: 'Sparkles' }
    ]
  },
  accounting_bookkeeping: {
    title: 'Tax Season & Bookkeeping Client Intake',
    bio: [
      'We help CPAs and accounting firms manage the influx of tax season client onboarding.',
      'Our systems qualify financial scopes and collect onboarding documents automatically.'
    ],
    skills: ['Business Entity Check', 'Tax Prep Scope Screening', 'Secure Portal Integration', 'CPA Calendar Sync'],
    services: [
      { title: 'CPA Consultation Booker', description: 'Qualify bookkeeping scopes and book discovery assessments with tax professionals.', icon: 'Phone' },
      { title: 'Document Intake Assistant', description: 'Email secure upload portals to clients immediately after screening to capture W2s/1099s.', icon: 'Bot' },
      { title: 'Corporate Bookkeeping Screener', description: 'Check annual revenue metrics and client entity types to route files appropriately.', icon: 'Sparkles' }
    ]
  },
  photography: {
    title: 'Studio & Photography Booking Intake',
    bio: [
      'We help professional portrait, wedding, and commercial photographers coordinate shoots.',
      'Our systems verify dates, capture style preferences, and book consultations.'
    ],
    skills: ['Shoot Date Checking', 'Session Pricing Answering', 'Contract Delivery Sync', 'Creative Brief Intake'],
    services: [
      { title: 'Session Booking Intake', description: 'Verify date availability, explain package options, and schedule portrait or wedding consults.', icon: 'Phone' },
      { title: 'Creative Brief Bot', description: 'Send online questionnaire links to client inbox immediately after booking is confirmed.', icon: 'Bot' },
      { title: 'Contract & Invoice Trigger', description: 'Send photoshoot agreements and initial deposit invoices to client email automatically.', icon: 'Sparkles' }
    ]
  },

  // ==========================================
  // SCREENSHOT-BASED PREBUILT CONTENT (22-26)
  // ==========================================
  charity_nonprofit: {
    title: 'Justice begins where inequality ends',
    bio: [
      'We are building a world where everyone has the power to shape their lives.',
      'The Gainlove Global aid network establishes a thriving and connected community, ensuring each member has access to resources that enrich and empower.'
    ],
    skills: ['Anti-Poverty Program Design', 'Family Support Advocacy', 'Community Outreach Coordination', 'Crisis Funding Administration'],
    services: [
      { title: 'Anti-Poverty Programs & Services', description: 'Programs designed to relieve the effects of and address the root causes of poverty.', icon: 'Sparkles' },
      { title: 'Family & Community Programs', description: 'Programs designed to educate and engage all ages of the community, offering various classes.', icon: 'Bot' },
      { title: 'Teen Programs', description: 'Resource centers providing safe spaces and leadership training to promote youth engagement.', icon: 'Cpu' }
    ]
  },
  seo_agency: {
    title: 'Digital Products for Your Ideas',
    bio: [
      'Ensuring the best return on investment for your bespoke SEO campaign requirements.',
      'We are passionate about our work, staying ahead of the curve to provide engaging and user-friendly systems.'
    ],
    skills: ['SEO Campaign Structuring', 'UX Design & Prototyping', 'Product Development & Scaling', 'Marketing & Brand Strategy'],
    services: [
      { title: 'Discover & Explore the Product', description: 'Analyzing market fit and understanding user pathways to design the perfect funnel.', icon: 'Sparkles' },
      { title: 'Art Direction & Brand Strategy', description: 'Bespoke corporate identity guidelines and communications planning for high visibility.', icon: 'Bot' },
      { title: 'Product UX, Design & Development', description: 'Building fast, accessible frontend interfaces optimized for conversion rates.', icon: 'Cpu' }
    ]
  },
  industrial_manufacturing: {
    title: 'Your Trusted Partner for PVC Pipes & Fittings',
    bio: [
      'Leading PVC pipe manufacturer providing high-quality, durable solutions for diverse industrial operations.',
      'Engineered for maximum reliability, strength, and precision delivery to support modern infrastructure projects.'
    ],
    skills: ['UPVC Plumbing Systems', 'SWR Pipe Engineering', 'Borewell Casing Standards', 'Agriculture Irrigation Layouts'],
    services: [
      { title: 'uPVC Plumbing Pipes', description: 'Virgin raw materials ensuring durable, long-lasting pipes for home and commercial supply.', icon: 'Cpu' },
      { title: 'SWR Pipes & Fittings', description: 'High-quality soil, waste, and rainwater venting systems certified for durability.', icon: 'Phone' },
      { title: 'Borewell Casing Systems', description: 'High-tensile casing pipes designed for deep wells and rough geological structures.', icon: 'Bot' }
    ]
  },
  moving_logistics: {
    title: 'Stress-Free Moving Services for Homes & Businesses',
    bio: [
      'Local and long-distance moving, office relocations, and storage solutions.',
      'Our team handles packing, loading, transport, and fragile items with 5-star customer-rated safety protocols.'
    ],
    skills: ['Fragile Item Packing', 'Office Relocations', 'Storage Solutions Coordination', 'Full Transit Insurance'],
    services: [
      { title: 'Local & Interstate Relocations', description: 'Rapid, stress-free household moves within state boundaries or across long distances.', icon: 'Phone' },
      { title: 'Office & Corporate Moving', description: 'Minimal downtime relocation of server racks, office furniture, and company archives.', icon: 'Cpu' },
      { title: 'Packing & Fragile Handling', description: 'Specialized wrapping and secure strapping for pianos, artwork, and precision machinery.', icon: 'Bot' }
    ]
  },
  roofing_construction: {
    title: 'Reliable Roofing, Repairs & Restoration',
    bio: [
      'Expert roof repairs, metal re-roofing, gutter replacement, and leak detection for residential properties.',
      'Built to last and engineered for harsh weather conditions, backed by our 10-year workmanship warranty.'
    ],
    skills: ['Metal Re-Roofing', 'Gutter & Downpipe Refits', 'Leak Detection Analysis', 'Storm Damage Assessments'],
    services: [
      { title: 'Roof Repairs & Leak Detection', description: 'Fast, reliable diagnostics to spot roof breaches and seal leak points immediately.', icon: 'Bot' },
      { title: 'Metal Re-Roofing & Tile replacement', description: 'Premium shingle or metal sheeting installations to upgrade structural durability.', icon: 'Cpu' },
      { title: 'Gutter & Downpipe Installations', description: 'Custom zinc-alloy channel installations optimized for water management.', icon: 'Phone' }
    ]
  }
}

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

  // Find style suffix, e.g. `royal_gold`, `gainlove`, etc.
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

  return {
    id: templateId,
    name: `${industry.name} - ${themeName}`,
    ...style
  }
}

// Generate the list of templates for a specific industry
export function getTemplatesForIndustry(industryId: string): { id: string; name: string; isDark: boolean }[] {
  const industry = INDUSTRIES.find(ind => ind.id === industryId)
  if (!industry) return []

  // If it's one of the screenshot-based custom industries, prioritize its custom style first!
  const customMapping: Record<string, string> = {
    charity_nonprofit: 'gainlove',
    seo_agency: 'ewebot',
    industrial_manufacturing: 'sarvam',
    moving_logistics: 'moveaus',
    roofing_construction: 'ausroofing'
  }

  const prioritizedSuffix = customMapping[industryId]
  const list = [...styleSuffixes]

  if (prioritizedSuffix) {
    // Reorder so that the custom matching style is first in the list
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
