import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { AdminErrorBanner } from '@/components/admin/AdminStates'
import WebhookManager from './WebhookManager'
import { getAdminWebhooks } from './actions'

export const dynamic = 'force-dynamic'

export default async function WebhooksPage() {
  const { data: webhooks, error } = await getAdminWebhooks()

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Webhook Manager"
        description="Configure outbound HTTP webhooks to notify n8n, Make, Zapier, or external CRMs."
      />

      {error && <AdminErrorBanner title="Failed to load webhooks" message={error} />}

      <WebhookManager initialWebhooks={webhooks} />
    </div>
  )
}
