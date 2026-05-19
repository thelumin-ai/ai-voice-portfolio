'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

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
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('site_settings')
      .select('setting_value')
      .eq('setting_key', 'webhooks')
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // Record not found, return empty array
        return []
      }
      console.error('Error fetching webhooks:', error)
      return []
    }

    return (data?.setting_value as Webhook[]) || []
  } catch (error) {
    console.error('Error in getWebhooks:', error)
    return []
  }
}

export async function saveWebhooks(webhooks: Webhook[]) {
  try {
    const supabase = await createClient()
    const { error } = await supabase
      .from('site_settings')
      .upsert({
        setting_key: 'webhooks',
        setting_value: webhooks,
        updated_at: new Date().toISOString()
      }, { onConflict: 'setting_key' })

    if (error) {
      console.error('Error saving webhooks:', error)
      return { error: 'Failed to save webhooks' }
    }

    revalidatePath('/admin/webhooks')
    return { success: true }
  } catch (error: any) {
    console.error('Error in saveWebhooks:', error)
    return { error: error.message || 'An unexpected error occurred' }
  }
}

export async function testWebhook(url: string, event: string) {
  try {
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
        source: 'Webhook Test Button'
      }
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'AI-Voice-Portfolio-Webhook-Manager'
      },
      body: JSON.stringify(samplePayload)
    })

    if (response.ok) {
      return { success: true, status: response.status, statusText: response.statusText }
    } else {
      return { success: false, status: response.status, statusText: response.statusText }
    }
  } catch (error: any) {
    console.error('Webhook test error:', error)
    return { success: false, error: error.message || 'Connection failed' }
  }
}

// Utility to fire webhooks (can be called server-side)
export async function fireWebhooks(event: 'lead_created' | 'estimate_requested', payload: any) {
  try {
    const webhooks = await getWebhooks()
    const activeWebhooks = webhooks.filter(w => w.is_active && (w.event === 'all' || w.event === event))

    if (activeWebhooks.length === 0) {
      return
    }

    const webhookPayload = {
      event,
      timestamp: new Date().toISOString(),
      data: payload
    }

    // Fire all active webhooks in parallel (non-blocking)
    const promises = activeWebhooks.map(async (webhook) => {
      try {
        const res = await fetch(webhook.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'AI-Voice-Portfolio-Webhook-Manager'
          },
          body: JSON.stringify(webhookPayload)
        })
        if (!res.ok) {
          console.warn(`Webhook ${webhook.name} (${webhook.url}) returned status ${res.status}`)
        }
      } catch (err) {
        console.error(`Failed to fire webhook ${webhook.name} (${webhook.url}):`, err)
      }
    })

    await Promise.allSettled(promises)
  } catch (error) {
    console.error('Error in fireWebhooks:', error)
  }
}
