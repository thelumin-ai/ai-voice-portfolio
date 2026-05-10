'use server'

import { createClient } from '@/lib/supabase/server'
import { settingsSchema, SettingsFormValues } from '@/lib/validations/settings'
import { revalidatePath } from 'next/cache'

export async function getSiteSettings(): Promise<{ data?: SettingsFormValues; error?: string }> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('site_settings')
    .select('setting_key, setting_value')

  if (error) {
    console.error('Error fetching site settings:', error)
    return { error: 'Failed to fetch site settings' }
  }

  // Transform KV pairs into a single object matching the schema
  const settingsObj: any = {
    social_links: { twitter: '', linkedin: '', github: '' },
    profile_image_url: '',
    consultation_provider: 'upwork',
    consultation_link_upwork: '',
    consultation_link_fiverr: '',
    consultation_link_calendly: '',
    openai_api_key: '',
    anthropic_api_key: '',
    gemini_api_key: ''
  }

  data?.forEach(row => {
    if (row.setting_key === 'contact_email') settingsObj.contact_email = row.setting_value
    if (row.setting_key === 'footer_text') settingsObj.footer_text = row.setting_value
    if (row.setting_key === 'social_links') settingsObj.social_links = { ...settingsObj.social_links, ...row.setting_value }
    if (row.setting_key === 'profile_image_url') settingsObj.profile_image_url = row.setting_value
    if (row.setting_key === 'consultation_provider') settingsObj.consultation_provider = row.setting_value || 'upwork'
    if (row.setting_key === 'consultation_link_upwork') settingsObj.consultation_link_upwork = row.setting_value
    if (row.setting_key === 'consultation_link_fiverr') settingsObj.consultation_link_fiverr = row.setting_value
    if (row.setting_key === 'consultation_link_calendly') settingsObj.consultation_link_calendly = row.setting_value
    if (row.setting_key === 'openai_api_key') settingsObj.openai_api_key = row.setting_value
    if (row.setting_key === 'anthropic_api_key') settingsObj.anthropic_api_key = row.setting_value
    if (row.setting_key === 'gemini_api_key') settingsObj.gemini_api_key = row.setting_value
  })

  return { data: settingsObj }
}

export async function updateSiteSettings(data: SettingsFormValues) {
  const supabase = await createClient()
  
  const validatedData = settingsSchema.parse(data)

  const updates = [
    { setting_key: 'contact_email', setting_value: validatedData.contact_email || '' },
    { setting_key: 'footer_text', setting_value: validatedData.footer_text || '' },
    { setting_key: 'social_links', setting_value: validatedData.social_links },
    { setting_key: 'profile_image_url', setting_value: validatedData.profile_image_url || '' },
    { setting_key: 'consultation_provider', setting_value: validatedData.consultation_provider },
    { setting_key: 'consultation_link_upwork', setting_value: validatedData.consultation_link_upwork || '' },
    { setting_key: 'consultation_link_fiverr', setting_value: validatedData.consultation_link_fiverr || '' },
    { setting_key: 'consultation_link_calendly', setting_value: validatedData.consultation_link_calendly || '' },
    { setting_key: 'openai_api_key', setting_value: validatedData.openai_api_key || '' },
    { setting_key: 'anthropic_api_key', setting_value: validatedData.anthropic_api_key || '' },
    { setting_key: 'gemini_api_key', setting_value: validatedData.gemini_api_key || '' },
  ]

  for (const update of updates) {
    const { error } = await supabase
      .from('site_settings')
      .upsert({
        setting_key: update.setting_key,
        setting_value: update.setting_value,
        updated_at: new Date().toISOString()
      }, { onConflict: 'setting_key' })

    if (error) {
      console.error(`Error updating setting ${update.setting_key}:`, error)
      return { error: `Failed to update ${update.setting_key}` }
    }
  }

  revalidatePath('/admin/settings')
  revalidatePath('/', 'layout') // Revalidate everything since settings affect header/footer
  return { success: true }
}
