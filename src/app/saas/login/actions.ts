'use client'

// Client helper wrapper for saas auth actions
import { createClient } from '@/lib/supabase/client'

export async function loginWithEmail(email: string) {
  const supabase = createClient()
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${window.location.origin}/api/auth/callback?next=/saas/dashboard`
    }
  })
  
  if (error) {
    return { error: error.message }
  }
  return { success: true }
}
