export interface HeroContent {
  badge: string
  headline: string
  subtext: string
  cta_primary: string
  cta_secondary: string
}

export interface AboutContent {
  name: string
  title: string
  bio: string[]
  skills: string[]
  cta_text: string
  linkedin_text: string
}

export interface ProblemContent {
  headline: string
  description: string
  solution_title: string
  solution_text: string
}

export const defaultHeroContent: HeroContent = {
  badge: "Next-Gen AI & Voice Automation",
  headline: "AI Voice Agents & Chatbots That Call, Qualify, and Convert Leads Automatically",
  subtext: "I design intelligent voice systems and omni-channel automations that instantly engage leads, qualify prospects, and scale your business automatically.",
  cta_primary: "Try a Live AI Agent",
  cta_secondary: "Book a Consultation",
}

export const defaultAboutContent: AboutContent = {
  name: "Abimbola Akinsanmi",
  title: "Business Automation & AI Voice Expert",
  bio: [
    "I build AI voice systems that book 15–30+ qualified appointments per month without you hiring SDRs. I'm Abimbola Akinsanmi, a Business Automation Expert specializing in AI Voice Systems, CRM/ERP integrations, and scalable AI Automation frameworks.",
    "My mission is to replace chaos with control, replace missed calls with human-sounding AI conversations, and replace manual work with seamless, self-operating AI systems that help companies grow faster while spending less."
  ],
  skills: [
    "Conversational Voice AI Design",
    "Self-Hosted n8n Infrastructure",
    "CRM & ERP Integrations",
    "Custom Visibility Dashboards"
  ],
  cta_text: "Hire Me",
  linkedin_text: "Connect on LinkedIn",
}

export const defaultProblemContent: ProblemContent = {
  headline: "Most Businesses Lose Leads Because They Respond Too Late",
  description: "The likelihood of qualifying a lead drops <strong>400%</strong> if they aren't called within the first 5 minutes. Human sales teams sleep, take breaks, and get overwhelmed.",
  solution_title: "The Solution: AI Voice & Chat Automations",
  solution_text: "Deploy systems that never sleep. Our AI agents respond to leads in seconds across voice and text, sound completely human, handle objections, and book qualified meetings directly to your calendar, 24/7/365.",
}
