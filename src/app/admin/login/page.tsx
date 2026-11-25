import { getSiteSettings } from '../(protected)/settings/actions'
import type { AdminBranding } from '@/lib/types'
import { LoginForm } from './LoginForm'

export const dynamic = 'force-dynamic'

export default async function LoginPage() {
  let branding: AdminBranding = {
    brandName: 'Admin Sign In',
    brandSubtitle: 'Portfolio & Voice AI Console',
    logoUrl: '',
  }

  try {
    const { data: settings } = await getSiteSettings()
    if (settings) {
      branding = {
        brandName: settings.admin_brand_name?.trim() || 'Admin Sign In',
        brandSubtitle: settings.admin_brand_subtitle?.trim() || 'Portfolio & Voice AI Console',
        logoUrl: settings.admin_logo_url?.trim() || '',
      }
    }
  } catch {
    // Fallback cleanly
  }

  return <LoginForm branding={branding} />
}
