'use server'

import { createPublicClient } from '@/lib/supabase/public'
import { settingsSchema, SettingsFormValues } from '@/lib/validations/settings'
import { requireAdmin } from '@/lib/auth/admin'
import { deleteStorageFileByUrl } from '@/lib/storage'
import { revalidatePath } from 'next/cache'
import { cache } from 'react'

const PUBLIC_SETTING_KEYS = [
  'contact_email',
  'footer_text',
  'admin_brand_name',
  'admin_brand_subtitle',
  'admin_logo_url',
  'social_links',
  'profile_image_url',
  'consultation_provider',
  'consultation_link_upwork',
  'consultation_link_fiverr',
  'consultation_link_calendly',
] as const

const ALL_SETTING_KEYS = [
  ...PUBLIC_SETTING_KEYS,
  'openai_api_key',
  'anthropic_api_key',
  'gemini_api_key',
] as const

function buildSettingsObject(
  rows: Array<{ setting_key: string; setting_value: unknown }> | null,
  includeSecrets: boolean
): SettingsFormValues {
  const settingsObj: SettingsFormValues = {
    contact_email: '',
    footer_text: '',
    admin_brand_name: '',
    admin_brand_subtitle: '',
    admin_logo_url: '',
    social_links: { twitter: '', linkedin: '', github: '' },
    profile_image_url: '',
    consultation_provider: 'upwork',
    consultation_link_upwork: '',
    consultation_link_fiverr: '',
    consultation_link_calendly: '',
    openai_api_key: '',
    anthropic_api_key: '',
    gemini_api_key: '',
  }

  rows?.forEach((row) => {
    const val = row.setting_value
    if (row.setting_key === 'contact_email') settingsObj.contact_email = String(val || '')
    if (row.setting_key === 'footer_text') settingsObj.footer_text = String(val || '')
    if (row.setting_key === 'admin_brand_name') settingsObj.admin_brand_name = String(val || '')
    if (row.setting_key === 'admin_brand_subtitle') settingsObj.admin_brand_subtitle = String(val || '')
    if (row.setting_key === 'admin_logo_url') settingsObj.admin_logo_url = String(val || '')
    if (row.setting_key === 'social_links' && val && typeof val === 'object') {
      settingsObj.social_links = { ...settingsObj.social_links, ...(val as Record<string, string>) }
    }
    if (row.setting_key === 'profile_image_url') settingsObj.profile_image_url = String(val || '')
    if (row.setting_key === 'consultation_provider') {
      const p = String(val || 'upwork')
      settingsObj.consultation_provider = p === 'fiverr' || p === 'calendly' ? p : 'upwork'
    }
    if (row.setting_key === 'consultation_link_upwork') settingsObj.consultation_link_upwork = String(val || '')
    if (row.setting_key === 'consultation_link_fiverr') settingsObj.consultation_link_fiverr = String(val || '')
    if (row.setting_key === 'consultation_link_calendly') settingsObj.consultation_link_calendly = String(val || '')
    if (includeSecrets) {
      if (row.setting_key === 'openai_api_key') settingsObj.openai_api_key = String(val || '')
      if (row.setting_key === 'anthropic_api_key') settingsObj.anthropic_api_key = String(val || '')
      if (row.setting_key === 'gemini_api_key') settingsObj.gemini_api_key = String(val || '')
    }
  })

  return settingsObj
}

/**
 * Public-safe site settings loader. Never fetches or exposes private AI API keys or webhooks.
 */
export const getSiteSettings = cache(async (): Promise<{ data?: SettingsFormValues; error?: string }> => {
  try {
    const supabase = createPublicClient()
    const { data, error } = await supabase
      .from('site_settings')
      .select('setting_key, setting_value')
      .in('setting_key', [...PUBLIC_SETTING_KEYS])

    if (error) {
      console.error('Error fetching site settings:', error)
      return { error: 'Failed to fetch site settings' }
    }

    return { data: buildSettingsObject(data, false) }
  } catch (err) {
    console.error('Error fetching site settings:', err)
    return { error: 'Failed to fetch site settings' }
  }
})

/**
 * Admin-only settings loader including private AI provider keys.
 */
export async function getAdminSiteSettings(): Promise<{ data?: SettingsFormValues; error?: string }> {
  const auth = await requireAdmin()
  if (auth.error || !auth.supabase) {
    return { error: 'Unauthorized' }
  }

  const { data, error } = await auth.supabase
    .from('site_settings')
    .select('setting_key, setting_value')
    .in('setting_key', [...ALL_SETTING_KEYS])

  if (error) {
    console.error('Error fetching admin site settings:', error)
    return { error: error.message || 'Failed to fetch site settings' }
  }

  return { data: buildSettingsObject(data, true) }
}

export async function updateSiteSettings(data: SettingsFormValues) {
  const auth = await requireAdmin()
  if (auth.error || !auth.supabase) {
    return { error: 'Unauthorized' }
  }

  const parsed = settingsSchema.safeParse(data)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || 'Invalid settings data' }
  }

  const validatedData = parsed.data

  const { data: existingImageRows } = await auth.supabase
    .from('site_settings')
    .select('setting_key, setting_value')
    .in('setting_key', ['profile_image_url', 'admin_logo_url'])

  const previousImages = new Map<string, string>()
  existingImageRows?.forEach((row) => {
    if (row.setting_value) {
      previousImages.set(row.setting_key, String(row.setting_value))
    }
  })

  const updates = [
    { setting_key: 'contact_email', setting_value: validatedData.contact_email || '' },
    { setting_key: 'footer_text', setting_value: validatedData.footer_text || '' },
    { setting_key: 'admin_brand_name', setting_value: validatedData.admin_brand_name || '' },
    { setting_key: 'admin_brand_subtitle', setting_value: validatedData.admin_brand_subtitle || '' },
    { setting_key: 'admin_logo_url', setting_value: validatedData.admin_logo_url || '' },
    { setting_key: 'social_links', setting_value: validatedData.social_links },
    { setting_key: 'profile_image_url', setting_value: validatedData.profile_image_url || '' },
    { setting_key: 'consultation_provider', setting_value: validatedData.consultation_provider || 'upwork' },
    { setting_key: 'consultation_link_upwork', setting_value: validatedData.consultation_link_upwork || '' },
    { setting_key: 'consultation_link_fiverr', setting_value: validatedData.consultation_link_fiverr || '' },
    { setting_key: 'consultation_link_calendly', setting_value: validatedData.consultation_link_calendly || '' },
    { setting_key: 'openai_api_key', setting_value: validatedData.openai_api_key || '' },
    { setting_key: 'anthropic_api_key', setting_value: validatedData.anthropic_api_key || '' },
    { setting_key: 'gemini_api_key', setting_value: validatedData.gemini_api_key || '' },
  ]

  for (const update of updates) {
    const { error } = await auth.supabase
      .from('site_settings')
      .upsert(
        {
          setting_key: update.setting_key,
          setting_value: update.setting_value,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'setting_key' }
      )

    if (error) {
      console.error(`Error updating setting ${update.setting_key}:`, error)
      return { error: `Failed to update ${update.setting_key}: ${error.message}` }
    }
  }

  const previousProfileUrl = previousImages.get('profile_image_url') || ''
  if (previousProfileUrl && previousProfileUrl !== (validatedData.profile_image_url || '')) {
    await deleteStorageFileByUrl(auth.supabase, previousProfileUrl)
  }

  const previousLogoUrl = previousImages.get('admin_logo_url') || ''
  if (previousLogoUrl && previousLogoUrl !== (validatedData.admin_logo_url || '')) {
    await deleteStorageFileByUrl(auth.supabase, previousLogoUrl)
  }

  revalidatePath('/admin/settings')
  revalidatePath('/admin', 'layout')
  revalidatePath('/admin/login')
  revalidatePath('/', 'layout')
  return { success: true }
}
