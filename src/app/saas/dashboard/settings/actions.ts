'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateTenantSettings(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Unauthorized session.' }
  }

  const companyName = formData.get('companyName') as string
  const title = formData.get('title') as string
  const bioRaw = formData.get('bio') as string
  const skillsRaw = formData.get('skills') as string
  const ctaText = formData.get('ctaText') as string
  const linkedinUrl = formData.get('linkedinUrl') as string
  const githubUrl = formData.get('githubUrl') as string
  const twitterUrl = formData.get('twitterUrl') as string
  const consultationProvider = formData.get('consultationProvider') as string
  const consultationLink = formData.get('consultationLink') as string

  // Split bio by newlines and filter empty lines
  const bio = bioRaw
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)

  // Split skills by commas and filter empty items
  const skills = skillsRaw
    .split(',')
    .map(item => item.trim())
    .filter(item => item.length > 0)

  const { error } = await supabase
    .from('saas_tenants')
    .update({
      company_name: companyName,
      title,
      bio,
      skills,
      cta_text: ctaText,
      linkedin_url: linkedinUrl,
      github_url: githubUrl,
      twitter_url: twitterUrl,
      consultation_provider: consultationProvider,
      consultation_link: consultationLink
    })
    .eq('id', user.id)

  if (error) {
    console.error('Error updating tenant settings:', error)
    return { error: error.message }
  }

  revalidatePath('/saas/dashboard/settings')
  return { success: true }
}

export async function initializeTenantProfile(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Unauthorized session.' }
  }

  const rawSubdomain = formData.get('subdomain') as string
  const companyName = formData.get('companyName') as string || 'My Portfolio'

  // Normalize subdomain
  const subdomain = rawSubdomain.toLowerCase().trim().replace(/[^a-z0-9-]/g, '')
  if (subdomain.length < 3) {
    return { error: 'Subdomain must be at least 3 characters long.' }
  }

  const reservedWords = ['admin', 'saas', 'api', 'www', 'mail', 'blog', 'portfolio', 'sites', 'privacy', 'legal']
  if (reservedWords.includes(subdomain)) {
    return { error: 'This subdomain is reserved. Please pick another one.' }
  }

  // Check duplicate
  const { data: existing } = await supabase
    .from('saas_tenants')
    .select('subdomain')
    .eq('subdomain', subdomain)
    .maybeSingle()

  if (existing) {
    return { error: 'Subdomain is already taken.' }
  }

  const { error } = await supabase
    .from('saas_tenants')
    .insert({
      id: user.id,
      subdomain,
      company_name: companyName,
      title: 'Business Automation & AI Voice Specialist',
      bio: [
        'I build AI voice systems that qualify leads and automate scheduling.',
        'My mission is to replace manual work with seamless, self-operating AI conversations.'
      ],
      skills: [
        'Conversational Voice AI Design',
        'SaaS System Architecture',
        'CRM/API Automations'
      ],
      footer_text: `© ${new Date().getFullYear()} ${companyName}. All rights reserved.`,
      template_id: 'agency_automation_cyber',
      layout_structure: ['hero', 'services', 'about', 'consultation', 'footer'],
      visible_sections: ['hero', 'services', 'about', 'consultation']
    })

  if (error) {
    console.error('Error initializing tenant profile:', error)
    return { error: error.message }
  }

  revalidatePath('/saas/dashboard')
  revalidatePath('/saas/dashboard/settings')
  return { success: true }
}
