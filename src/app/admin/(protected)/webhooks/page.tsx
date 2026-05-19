import WebhookManager from './WebhookManager'
import { getWebhooks } from './actions'

export const dynamic = 'force-dynamic'

export default async function WebhooksPage() {
  const webhooks = await getWebhooks()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Webhook Manager</h1>
        <p className="text-zinc-400 mt-1">Configure outbound webhooks to send events to n8n, Make, or other automation systems.</p>
      </div>

      <WebhookManager initialWebhooks={webhooks} />
    </div>
  )
}
