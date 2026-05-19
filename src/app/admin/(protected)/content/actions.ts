'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { 
  HeroContent, AboutContent, ProblemContent,
  defaultHeroContent, defaultAboutContent, defaultProblemContent 
} from './defaults'

// ---------- Getters ----------
export async function getContentSettings() {
  try {
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
  } catch (error) {
    console.error('Exception in getContentSettings:', error)
    return { hero: defaultHeroContent, about: defaultAboutContent, problem: defaultProblemContent }
  }
}

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
