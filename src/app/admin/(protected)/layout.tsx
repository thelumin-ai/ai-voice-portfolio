import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { isAdminUser } from '@/lib/auth/admin'
import { getSiteSettings } from './settings/actions'
import type { AdminBranding } from '@/lib/types'
import { AdminShell } from './AdminShell'

export const dynamic = 'force-dynamic'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!isAdminUser(user)) {
    redirect('/admin/login')
  }

  let branding: AdminBranding = {
    brandName: 'Admin Panel',
    brandSubtitle: 'Dashboard Console',
    logoUrl: '',
  }

  try {
    const { data: settings } = await getSiteSettings()
    if (settings) {
      branding = {
        brandName: settings.admin_brand_name?.trim() || 'Admin Panel',
        brandSubtitle: settings.admin_brand_subtitle?.trim() || 'Dashboard Console',
        logoUrl: settings.admin_logo_url?.trim() || '',
      }
    }
  } catch {
    // Use default branding cleanly if site_settings has not been initialized yet
  }

  return (
    <AdminShell userEmail={user?.email || ''} branding={branding}>
      {children}
    </AdminShell>
  )
}
