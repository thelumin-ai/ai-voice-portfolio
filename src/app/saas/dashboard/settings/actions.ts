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
