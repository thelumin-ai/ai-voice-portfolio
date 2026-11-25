import { assertPublicWebhookUrl } from '@/lib/auth/admin'
import { createServerSupabaseAdminClient } from '@/lib/server/secrets'
import type { Webhook } from '@/app/admin/(protected)/webhooks/actions'

/**
 * Server-only helper to dispatch outbound webhooks for lead/estimate events.
 * Validates URLs against SSRF and enforces a strict 5-second timeout per webhook
 * so slow endpoints never stall public API responses.
 */
export async function fireWebhooks(
  event: 'lead_created' | 'estimate_requested',
  payload: Record<string, unknown>
) {
  try {
    const supabase = createServerSupabaseAdminClient()
    const { data, error } = await supabase
      .from('site_settings')
      .select('setting_value')
      .eq('setting_key', 'webhooks')
      .maybeSingle()

    if (error || !data?.setting_value || !Array.isArray(data.setting_value)) {
      return
    }

    const webhooks = data.setting_value as Webhook[]
    const activeWebhooks = webhooks.filter(
      (w) => w.is_active && (w.event === 'all' || w.event === event)
    )

    if (activeWebhooks.length === 0) return

    const webhookPayload = {
      event,
      timestamp: new Date().toISOString(),
      data: payload,
    }

    const promises = activeWebhooks.map(async (webhook) => {
      const check = assertPublicWebhookUrl(webhook.url)
      if (!check.ok) {
        console.warn(`Skipping unsafe webhook ${webhook.name}: ${check.error}`)
        return
      }

      try {
        const res = await fetch(check.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'AI-Voice-Portfolio-Webhook-Manager',
          },
          body: JSON.stringify(webhookPayload),
          signal: AbortSignal.timeout(5000),
        })
        if (!res.ok) {
          console.warn(`Webhook ${webhook.name} returned status ${res.status}`)
        }
      } catch (err) {
        console.error(`Failed to fire webhook ${webhook.name}:`, err)
      }
    })

    await Promise.allSettled(promises)
  } catch (error) {
    console.error('Error in fireWebhooks:', error)
  }
}
