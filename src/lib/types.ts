export interface PortfolioMetric {
  label: string
  value: string
}

export interface PortfolioMediaFile {
  url: string
  type: 'image' | 'video' | 'audio' | 'json'
  name?: string
}

export interface PortfolioProject {
  id?: string
  title: string
  industry_tag?: string
  short_description: string
  case_study_body?: string | null
  metrics?: PortfolioMetric[]
  integrations?: string[]
  media_files?: PortfolioMediaFile[]
  project_type?: 'webrtc' | 'audio' | 'video' | 'iframe' | string
  media_url?: string | null
  api_key?: string | null
  cover_image_url?: string | null
  voice_platform?: 'vapi' | 'retell' | string | null
  status?: 'published' | 'draft' | 'archived' | string
  is_featured?: boolean
  display_order?: number
  created_at?: string
  color?: string
  borderClass?: string
}

export interface BlogPostRecord {
  id?: string
  title: string
  slug: string
  excerpt?: string | null
  content?: string
  cover_image_url?: string | null
  author?: string
  status?: string
  created_at?: string
  published_at?: string | null
}

export interface UseCaseFlowStep {
  step: string
  desc: string
}

export interface UseCaseResultItem {
  stat: string
  label: string
}

export interface UseCaseRecord {
  id?: string
  industry_slug: string
  name: string
  headline: string
  subhead: string
  problem?: string
  features?: string[]
  flow?: UseCaseFlowStep[]
  results?: UseCaseResultItem[]
  cover_image_url?: string | null
  icon_name?: string | null
  status?: string
  display_order?: number
}

export interface TestimonialRecord {
  id?: string
  client_name: string
  company?: string | null
  content: string
  image_url?: string | null
  video_url?: string | null
  rating?: number | null
  status?: string
  display_order?: number
}

export interface ServiceRecord {
  id?: string
  title: string
  description: string
  icon_name?: string | null
  link?: string | null
  category?: string | null
  metrics?: string | null
  features?: string[]
  status?: string
  display_order?: number
}

export interface TechStackRecord {
  id?: string
  name: string
  category: string
  icon_url?: string | null
  status?: string
  display_order?: number
}

export interface ProcessStepRecord {
  id?: string
  title: string
  description: string
  icon_url?: string | null
  status?: string
  display_order?: number
}

export interface AdminBranding {
  brandName: string
  brandSubtitle: string
  logoUrl: string
}

export interface SiteSettingsRecord {
  contact_email?: string
  footer_text?: string
  admin_brand_name?: string
  admin_brand_subtitle?: string
  admin_logo_url?: string
  social_links?: {
    twitter?: string
    linkedin?: string
    github?: string
  }
  profile_image_url?: string
  consultation_provider?: 'upwork' | 'fiverr' | 'calendly' | string
  consultation_link_upwork?: string
  consultation_link_fiverr?: string
  consultation_link_calendly?: string
  openai_api_key?: string
  anthropic_api_key?: string
  gemini_api_key?: string
}

export interface DashboardRecentLead {
  id: string
  name: string
  email: string
  company?: string | null
  created_at: string
}

export interface DashboardRecentBlog {
  id: string
  title: string
  status: string
  created_at: string
  slug: string
}
