'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function registerTenant(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const rawSubdomain = formData.get('subdomain') as string
  const companyName = formData.get('companyName') as string || 'My Portfolio'

  // 1. Normalize subdomain
  const subdomain = rawSubdomain.toLowerCase().trim().replace(/[^a-z0-9-]/g, '')
  if (subdomain.length < 3) {
    return { error: 'Subdomain must be at least 3 characters long.' }
  }

  // 2. Check if subdomain is reserved or already taken
  const reservedWords = ['admin', 'saas', 'api', 'www', 'mail', 'blog', 'portfolio', 'sites', 'privacy', 'legal']
  if (reservedWords.includes(subdomain)) {
    return { error: 'This subdomain is reserved. Please pick another one.' }
  }

  const { data: existingTenant } = await supabase
    .from('saas_tenants')
    .select('subdomain')
    .eq('subdomain', subdomain)
    .maybeSingle()

  if (existingTenant) {
    return { error: 'Subdomain is already taken by another user.' }
  }

  // 3. Sign up the user in Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  })

  if (authError) {
    return { error: authError.message }
  }

  const user = authData.user
  if (!user) {
    return { error: 'Could not create user account. Please try again.' }
  }

  // 4. Initialize SaaS Tenant Profile in `saas_tenants`
  const { error: tenantError } = await supabase
    .from('saas_tenants')
    .insert({
      id: user.id,
      subdomain,
      company_name: companyName,
      title: 'Business Automation & AI Voice Specialist',
      bio: [
        'I build AI voice systems that qualify leads and automate scheduling.',
        'My mission is to replace manual work with seamless, self-operating AI conversations that help companies grow faster.'
      ],
      skills: [
        'Conversational Voice AI Design',
        'SaaS System Architecture',
        'CRM/API Automations'
      ],
      footer_text: `© ${new Date().getFullYear()} ${companyName}. All rights reserved.`
    })

  if (tenantError) {
    console.error('Error inserting tenant profile:', tenantError)
    return { error: `Account created, but failed to initialize portfolio profile: ${tenantError.message}` }
  }

  redirect('/saas/dashboard')
}
