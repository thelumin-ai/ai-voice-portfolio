'use server'

import { revalidatePath } from 'next/cache'
import { requireAdmin, assertPublicWebhookUrl } from '@/lib/auth/admin'

export interface Webhook {
  id: string
  name: string
  url: string
  event: 'all' | 'lead_created' | 'estimate_requested'
  is_active: boolean
  created_at: string
}

export async function getWebhooks(): Promise<Webhook[]> {
  try {
    const auth = await requireAdmin()
    if (auth.error || !auth.supabase) {
      return []
    }

    const { data, error } = await auth.supabase
      .from('site_settings')
      .select('setting_value')
      .eq('setting_key', 'webhooks')
      .maybeSingle()

    if (error) {
      console.error('Error fetching webhooks:', error)
      return []
    }

    return Array.isArray(data?.setting_value) ? (data.setting_value as Webhook[]) : []
  } catch (error) {
    console.error('Error in getWebhooks:', error)
    return []
  }
}

export async function saveWebhooks(webhooks: Webhook[]) {
  try {
    const auth = await requireAdmin()
    if (auth.error || !auth.supabase) {
      return { error: 'Unauthorized' }
    }

    if (!Array.isArray(webhooks)) {
      return { error: 'Invalid webhooks list' }
    }

    for (const wh of webhooks) {
      const check = assertPublicWebhookUrl(wh.url)
      if (!check.ok) {
        return { error: `Invalid URL for "${wh.name || 'webhook'}": ${check.error}` }
      }
    }

    const { error } = await auth.supabase
      .from('site_settings')
      .upsert(
        {
          setting_key: 'webhooks',
          setting_value: webhooks,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'setting_key' }
      )

    if (error) {
      console.error('Error saving webhooks:', error)
      return { error: 'Failed to save webhooks' }
    }

    revalidatePath('/admin/webhooks')
    return { success: true }
  } catch (error) {
    console.error('Error in saveWebhooks:', error)
    return { error: error instanceof Error ? error.message : 'An unexpected error occurred' }
  }
}

export async function testWebhook(url: string, event: string) {
  try {
    const auth = await requireAdmin()
    if (auth.error) {
      return { success: false, error: 'Unauthorized' }
    }

    const urlCheck = assertPublicWebhookUrl(url)
    if (!urlCheck.ok) {
      return { success: false, error: urlCheck.error }
    }

    const samplePayload = {
      event,
      timestamp: new Date().toISOString(),
      test: true,
      message: 'This is a test event from your AI Voice & Automation Portfolio Webhook Manager.',
      data: {
        name: 'John Doe',
        email: 'test@example.com',
        phone: '+1234567890',
        company: 'AI Automations Inc',
        message: 'I want to automate my leads flow using Retell/Vapi and n8n.',
        source: 'Webhook Test Button',
      },
    }

    const response = await fetch(urlCheck.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'AI-Voice-Portfolio-Webhook-Manager',
      },
      body: JSON.stringify(samplePayload),
      signal: AbortSignal.timeout(5000),
    })

    if (response.ok) {
      return { success: true, status: response.status, statusText: response.statusText }
    }
    return { success: false, status: response.status, statusText: response.statusText }
  } catch (error) {
    console.error('Webhook test error:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Connection failed' }
  }
}
