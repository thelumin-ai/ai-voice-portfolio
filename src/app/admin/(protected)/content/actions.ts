'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { cache } from 'react'

// ---------- Types ----------
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

// ---------- Defaults ----------
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

// ---------- Getters ----------
export const getContentSettings = cache(async () => {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('site_settings')
    .select('setting_key, setting_value')
    .in('setting_key', ['hero_content', 'about_content', 'problem_content'])

  if (error) {
    console.error('Error fetching content settings:', error)
    return { hero: defaultHeroContent, about: defaultAboutContent, problem: defaultProblemContent }
  }

  let hero = defaultHeroContent
  let about = defaultAboutContent
  let problem = defaultProblemContent

  data?.forEach(row => {
    if (row.setting_key === 'hero_content' && row.setting_value) {
      hero = { ...defaultHeroContent, ...row.setting_value }
    }
    if (row.setting_key === 'about_content' && row.setting_value) {
      about = { ...defaultAboutContent, ...row.setting_value }
    }
    if (row.setting_key === 'problem_content' && row.setting_value) {
      problem = { ...defaultProblemContent, ...row.setting_value }
    }
  })

  return { hero, about, problem }
})

// ---------- Updaters ----------
export async function updateHeroContent(content: HeroContent) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('site_settings')
    .upsert({
      setting_key: 'hero_content',
      setting_value: content,
      updated_at: new Date().toISOString()
    }, { onConflict: 'setting_key' })

  if (error) {
    console.error('Error updating hero content:', error)
    return { error: 'Failed to update hero content' }
  }

  revalidatePath('/', 'layout')
  return { success: true }
}

export async function updateAboutContent(content: AboutContent) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('site_settings')
    .upsert({
      setting_key: 'about_content',
      setting_value: content,
      updated_at: new Date().toISOString()
    }, { onConflict: 'setting_key' })

  if (error) {
    console.error('Error updating about content:', error)
    return { error: 'Failed to update about content' }
  }

  revalidatePath('/', 'layout')
  return { success: true }
}

export async function updateProblemContent(content: ProblemContent) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('site_settings')
    .upsert({
      setting_key: 'problem_content',
      setting_value: content,
      updated_at: new Date().toISOString()
    }, { onConflict: 'setting_key' })

  if (error) {
    console.error('Error updating problem content:', error)
    return { error: 'Failed to update problem content' }
  }

  revalidatePath('/', 'layout')
  return { success: true }
}
