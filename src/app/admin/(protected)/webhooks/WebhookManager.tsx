'use client'

import { useState, useTransition } from 'react'
import {
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Play,
  Plus,
  ToggleLeft,
  ToggleRight,
  Trash2,
  Webhook as WebhookIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { AdminConfirmDialog, AdminEmptyState } from '@/components/admin/AdminStates'
import { useAdminToast } from '@/components/admin/AdminToast'
import { Webhook, saveWebhooks, testWebhook } from './actions'

interface WebhookManagerProps {
  initialWebhooks: Webhook[]
}

export default function WebhookManager({ initialWebhooks }: WebhookManagerProps) {
  const [webhooks, setWebhooks] = useState<Webhook[]>(initialWebhooks)
  const [prevInitial, setPrevInitial] = useState<Webhook[]>(initialWebhooks)
  const [isPending, startTransition] = useTransition()
  const [deleteTarget, setDeleteTarget] = useState<Webhook | null>(null)
  const toast = useAdminToast()

  const [isAdding, setIsAdding] = useState(false)
  const [name, setName] = useState('')
  const [url, setUrl] = useState('')
  const [event, setEvent] = useState<'all' | 'lead_created' | 'estimate_requested'>('all')

  const [testingId, setTestingId] = useState<string | null>(null)
  const [testResult, setTestResult] = useState<{
    [id: string]: { success: boolean; status?: number; error?: string }
  }>({})

  if (prevInitial !== initialWebhooks) {
    setPrevInitial(initialWebhooks)
    setWebhooks(initialWebhooks)
  }

  const handleAddWebhook = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !url.trim()) return

    const previousWebhooks = webhooks
    const newWebhook: Webhook = {
      id: crypto.randomUUID(),
      name: name.trim(),
      url: url.trim(),
      event,
      is_active: true,
      created_at: new Date().toISOString(),
    }

    const updatedWebhooks = [...webhooks, newWebhook]
    setWebhooks(updatedWebhooks)

    startTransition(async () => {
      const res = await saveWebhooks(updatedWebhooks)
      if (res.error) {
        setWebhooks(previousWebhooks)
        toast.error(res.error)
      } else {
        setName('')
        setUrl('')
        setEvent('all')
        setIsAdding(false)
        toast.success('Webhook added')
      }
    })
  }

  const handleConfirmDelete = () => {
    if (!deleteTarget) return
    const targetId = deleteTarget.id
    const targetName = deleteTarget.name
    const previousWebhooks = webhooks
    const updatedWebhooks = webhooks.filter((w) => w.id !== targetId)
    setWebhooks(updatedWebhooks)
    setDeleteTarget(null)

    startTransition(async () => {
      const res = await saveWebhooks(updatedWebhooks)
      if (res.error) {
        setWebhooks(previousWebhooks)
        toast.error(res.error)
      } else {
        toast.success(`Deleted webhook "${targetName}"`)
      }
    })
  }

  const handleToggleWebhook = (id: string) => {
    const previousWebhooks = webhooks
    const updatedWebhooks = webhooks.map((w) =>
      w.id === id ? { ...w, is_active: !w.is_active } : w
    )
    setWebhooks(updatedWebhooks)

    startTransition(async () => {
      const res = await saveWebhooks(updatedWebhooks)
      if (res.error) {
        setWebhooks(previousWebhooks)
        toast.error(res.error)
      } else {
        toast.info('Webhook status updated')
      }
    })
  }

  const handleTestWebhook = async (id: string, testUrl: string, testEvent: string) => {
    setTestingId(id)
    setTestResult((prev) => {
      const next = { ...prev }
      delete next[id]
      return next
    })

    try {
      const res = await testWebhook(testUrl, testEvent)
      setTestResult((prev) => ({
        ...prev,
        [id]: {
          success: res.success,
          status: res.status,
          error: res.error,
        },
      }))
    } catch (err: unknown) {
      setTestResult((prev) => ({
        ...prev,
        [id]: {
          success: false,
          error: err instanceof Error ? err.message : 'Network error',
        },
      }))
    } finally {
      setTestingId(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle>Outbound Event Webhooks</CardTitle>
            <CardDescription>
              Deliver real-time JSON payloads when a visitor submits a contact inquiry or cost estimate request.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardContent className="p-6 flex flex-col justify-between h-full">
            <span className="text-xs font-semibold text-adm-muted uppercase tracking-wider">
              Active Triggers
            </span>
            <div className="text-3xl font-bold text-adm-text mt-2">
              {webhooks.filter((w) => w.is_active).length} / {webhooks.length}
            </div>
            <span className="text-xs text-adm-subtle mt-1">
              Currently active endpoints
            </span>
          </CardContent>
        </Card>
      </div>

      {isAdding ? (
        <Card>
          <CardHeader>
            <CardTitle>New Outbound Webhook</CardTitle>
            <CardDescription>Configure the endpoint URL and event filter.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddWebhook} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label htmlFor="webhook-name" className="adm-label">
                    Webhook Name
                  </label>
                  <input
                    id="webhook-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. n8n CRM Integration"
                    className="adm-input"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="webhook-event" className="adm-label">
                    Trigger Event
                  </label>
                  <select
                    id="webhook-event"
                    value={event}
                    onChange={(e) => setEvent(e.target.value as Webhook['event'])}
                    className="adm-input"
                  >
                    <option value="all">All Events</option>
                    <option value="lead_created">New Lead Captured (Form/Chatbot)</option>
                    <option value="estimate_requested">Project Cost Estimate Submitted</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="webhook-url" className="adm-label">
                  Target Webhook URL
                </label>
                <input
                  id="webhook-url"
                  type="url"
                  required
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://hooks.zapier.com/hooks/catch/..."
                  className="adm-input"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setIsAdding(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? 'Saving...' : 'Create Webhook'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <div className="flex justify-end">
          <Button type="button" onClick={() => setIsAdding(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Webhook
          </Button>
        </div>
      )}

      <div className="space-y-4">
        {webhooks.length === 0 ? (
          <div className="adm-surface adm-card-pad">
            <AdminEmptyState
              icon={WebhookIcon}
              title="No webhooks configured"
              description="Connect portfolio lead and estimate events to n8n, Make, Zapier, or your custom backend."
              action={
                <Button type="button" size="sm" onClick={() => setIsAdding(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Webhook
                </Button>
              }
            />
          </div>
        ) : (
          webhooks.map((webhook) => (
            <Card
              key={webhook.id}
              className={`transition-all ${!webhook.is_active ? 'opacity-65' : ''}`}
            >
              <CardContent className="p-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h3 className="text-base font-semibold text-adm-text">{webhook.name}</h3>
                      <span
                        className={`text-[11px] px-2 py-0.5 rounded-md font-semibold uppercase tracking-wide border ${
                          webhook.event === 'all'
                            ? 'border-adm-border bg-adm-surface-2 text-adm-muted'
                            : webhook.event === 'lead_created'
                            ? 'border-adm-success-border bg-adm-success-bg text-adm-success-text'
                            : 'border-adm-info-border bg-adm-info-bg text-adm-info-text'
                        }`}
                      >
                        {webhook.event.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-xs text-adm-muted font-mono select-all break-all">
                      {webhook.url}
                    </p>
                    <p className="text-xs text-adm-subtle">
                      Created: {new Date(webhook.created_at).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleToggleWebhook(webhook.id)}
                      className="text-adm-muted hover:text-adm-text transition-colors"
                      aria-label={webhook.is_active ? 'Disable webhook' : 'Enable webhook'}
                      title={webhook.is_active ? 'Disable webhook' : 'Enable webhook'}
                    >
                      {webhook.is_active ? (
                        <ToggleRight className="h-8 w-8 text-adm-accent" />
                      ) : (
                        <ToggleLeft className="h-8 w-8 text-adm-subtle" />
                      )}
                    </button>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleTestWebhook(webhook.id, webhook.url, webhook.event)}
                      disabled={testingId === webhook.id}
                    >
                      {testingId === webhook.id ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                          Testing...
                        </>
                      ) : (
                        <>
                          <Play className="h-3.5 w-3.5 mr-1.5 fill-current" />
                          Test
                        </>
                      )}
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => setDeleteTarget(webhook)}
                      aria-label={`Delete ${webhook.name}`}
                      className="text-adm-danger-text hover:bg-adm-danger-bg hover:border-adm-danger-border"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {testResult[webhook.id] && (
                  <div
                    className={`mt-4 p-3 rounded-lg border flex items-center gap-3 text-sm ${
                      testResult[webhook.id].success
                        ? 'bg-adm-success-bg border-adm-success-border text-adm-success-text'
                        : 'bg-adm-danger-bg border-adm-danger-border text-adm-danger-text'
                    }`}
                  >
                    {testResult[webhook.id].success ? (
                      <CheckCircle2 className="h-4 w-4 shrink-0" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 shrink-0" />
                    )}
                    <div>
                      <p className="font-semibold">
                        {testResult[webhook.id].success
                          ? `Test Succeeded (Status ${testResult[webhook.id].status})`
                          : 'Test Failed'}
                      </p>
                      {testResult[webhook.id].error && (
                        <p className="text-xs opacity-90 font-mono mt-0.5">
                          {testResult[webhook.id].error}
                        </p>
                      )}
                      {!testResult[webhook.id].success && testResult[webhook.id].status && (
                        <p className="text-xs opacity-90 font-mono mt-0.5">
                          Server returned status code: {testResult[webhook.id].status}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <AdminConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete webhook?"
        description={`This will permanently remove "${deleteTarget?.name || 'this webhook'}".`}
        confirmLabel="Delete"
        loading={isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
