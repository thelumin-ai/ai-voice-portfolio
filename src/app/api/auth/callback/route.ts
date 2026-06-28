import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch (error) {
              // Can be ignored if middleware handles session refreshes
            }
          },
        },
      }
    )
    const { data: { session } } = await supabase.auth.exchangeCodeForSession(code)
    
    if (session?.user) {
      const user = session.user
      
      // Check if tenant profile exists for the user
      const { data: tenant } = await supabase
        .from('saas_tenants')
        .select('id')
        .eq('id', user.id)
        .maybeSingle()
        
      if (!tenant) {
        // Generate a unique default subdomain based on their email prefix
        const emailPrefix = user.email?.split('@')[0] || 'user'
        const cleanPrefix = emailPrefix.toLowerCase().replace(/[^a-z0-9-]/g, '')
        
        let subdomain = cleanPrefix || 'portfolio'
        const { data: duplicate } = await supabase
          .from('saas_tenants')
          .select('subdomain')
          .eq('subdomain', subdomain)
          .maybeSingle()
          
        if (duplicate) {
          const randSuffix = Math.random().toString(36).substring(2, 6)
          subdomain = `${subdomain}-${randSuffix}`
        }
        
        const companyName = `${emailPrefix.charAt(0).toUpperCase()}${emailPrefix.slice(1)} Portfolio`
        
        // Insert default tenant configuration
        await supabase
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
      }
    }
  }

  // Redirect users to the SaaS dashboard after successful sign-in
  return NextResponse.redirect(new URL('/saas/dashboard', request.url))
}
