'use client'

import { useState, useTransition } from 'react'
import { Webhook, saveWebhooks, testWebhook } from './actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Plus, Trash2, Play, ToggleLeft, ToggleRight, CheckCircle2, AlertTriangle, HelpCircle, Loader2 } from 'lucide-react'

interface WebhookManagerProps {
  initialWebhooks: Webhook[]
}

export default function WebhookManager({ initialWebhooks }: WebhookManagerProps) {
  const [webhooks, setWebhooks] = useState<Webhook[]>(initialWebhooks)
  const [isPending, startTransition] = useTransition()
  
  // Form states for new webhook
  const [isAdding, setIsAdding] = useState(false)
  const [name, setName] = useState('')
  const [url, setUrl] = useState('')
  const [event, setEvent] = useState<'all' | 'lead_created' | 'estimate_requested'>('all')
  
  // Test results state
  const [testingId, setTestingId] = useState<string | null>(null)
  const [testResult, setTestResult] = useState<{ [id: string]: { success: boolean; status?: number; error?: string } }>({})

  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleAddWebhook = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !url) return

    const newWebhook: Webhook = {
      id: crypto.randomUUID(),
      name,
      url,
      event,
      is_active: true,
      created_at: new Date().toISOString()
    }

    const updatedWebhooks = [...webhooks, newWebhook]
    setWebhooks(updatedWebhooks)

    // Reset form
    setName('')
    setUrl('')
    setEvent('all')
    setIsAdding(false)

    startTransition(async () => {
      const res = await saveWebhooks(updatedWebhooks)
      if (res.error) {
        setMessage({ type: 'error', text: res.error })
      } else {
        setMessage({ type: 'success', text: 'Webhook added successfully!' })
      }
    })
  }

  const handleDeleteWebhook = (id: string) => {
    const updatedWebhooks = webhooks.filter(w => w.id !== id)
    setWebhooks(updatedWebhooks)

    startTransition(async () => {
      const res = await saveWebhooks(updatedWebhooks)
      if (res.error) {
        setMessage({ type: 'error', text: res.error })
      } else {
        setMessage({ type: 'success', text: 'Webhook deleted successfully!' })
      }
    })
  }

  const handleToggleWebhook = (id: string) => {
    const updatedWebhooks = webhooks.map(w => {
      if (w.id === id) {
        return { ...w, is_active: !w.is_active }
      }
      return w
    })
    setWebhooks(updatedWebhooks)

    startTransition(async () => {
      const res = await saveWebhooks(updatedWebhooks)
      if (res.error) {
        setMessage({ type: 'error', text: res.error })
      }
    })
  }

  const handleTestWebhook = async (id: string, testUrl: string, testEvent: string) => {
    setTestingId(id)
    setTestResult(prev => ({ ...prev, [id]: null as any }))
    
    try {
      const res = await testWebhook(testUrl, testEvent)
      setTestResult(prev => ({
        ...prev,
        [id]: {
          success: res.success,
          status: res.status,
          error: res.error
        }
      }))
    } catch (err: any) {
      setTestResult(prev => ({
        ...prev,
        [id]: {
          success: false,
          error: err.message || 'Network error'
        }
      }))
    } finally {
      setTestingId(null)
    }
  }

  return (
    <div className="space-y-6">
      {message && (
        <div className={`p-4 rounded-xl flex items-center justify-between border ${
          message.type === 'success' 
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
            : 'bg-red-500/10 border-red-500/20 text-red-400'
        }`}>
          <span>{message.text}</span>
          <button onClick={() => setMessage(null)} className="text-sm font-semibold hover:opacity-80">Dismiss</button>
        </div>
      )}

      {/* Header card with description & stats */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 bg-zinc-950 border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-2">Outbound Webhooks</h2>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Send real-time HTTP POST JSON payloads to external services (like n8n, Make.com, Zapier, or a custom API) when specific events trigger on your website. 
          </p>
        </div>
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 flex flex-col justify-between">
          <div className="text-zinc-500 text-sm font-semibold uppercase tracking-wider">Active Triggers</div>
          <div className="text-4xl font-black text-white mt-2">
            {webhooks.filter(w => w.is_active).length} / {webhooks.length}
          </div>
          <div className="text-xs text-zinc-400 mt-2">Currently forwarding webhook payloads.</div>
        </div>
      </div>

      {/* Add Webhook Form */}
      {isAdding ? (
        <Card className="bg-zinc-950 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white">New Outbound Webhook</CardTitle>
            <CardDescription className="text-zinc-400">Configure where you want webhook notifications sent.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddWebhook} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-zinc-300">Webhook Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. n8n CRM Integration"
                    className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 text-white rounded-xl text-sm focus:outline-none focus:border-blue-500 placeholder-zinc-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-zinc-300">Trigger Event</label>
                  <select
                    value={event}
                    onChange={e => setEvent(e.target.value as any)}
                    className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 text-white rounded-xl text-sm focus:outline-none focus:border-blue-500"
                  >
                    <option value="all">All Events</option>
                    <option value="lead_created">New Lead Captured (Form/Chatbot)</option>
                    <option value="estimate_requested">Project Cost Estimate Submitted</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-zinc-300">Target Webhook URL</label>
                <input
                  type="url"
                  required
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  placeholder="https://hooks.zapier.com/hooks/catch/... or http://n8n.yourdomain/webhook/..."
                  className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 text-white rounded-xl text-sm focus:outline-none focus:border-blue-500 placeholder-zinc-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setIsAdding(false)}
                  className="border-zinc-800 hover:bg-zinc-900 text-zinc-300 hover:text-white"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20"
                >
                  Create Webhook
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <div className="flex justify-end">
          <Button 
            onClick={() => setIsAdding(true)}
            className="bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-2 shadow-lg shadow-blue-600/20"
          >
            <Plus className="h-4 w-4" /> Add Webhook
          </Button>
        </div>
      )}

      {/* Webhooks List */}
      <div className="space-y-4">
        {webhooks.length === 0 ? (
          <div className="text-center py-12 bg-zinc-950 border border-zinc-800 rounded-2xl">
            <HelpCircle className="h-10 w-10 text-zinc-700 mx-auto mb-2" />
            <p className="text-sm text-zinc-400">No webhooks configured yet.</p>
            <p className="text-xs text-zinc-500 mt-1">Connect your portfolio events to n8n, Make, or custom automation triggers.</p>
          </div>
        ) : (
          webhooks.map((webhook) => (
            <Card key={webhook.id} className={`bg-zinc-950 border-zinc-800 hover:border-zinc-700 transition-all ${!webhook.is_active && 'opacity-60'}`}>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-bold text-white">{webhook.name}</h3>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                        webhook.event === 'all' 
                          ? 'bg-zinc-800 text-zinc-300' 
                          : webhook.event === 'lead_created'
                          ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                          : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      }`}>
                        {webhook.event.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500 font-mono select-all break-all">{webhook.url}</p>
                    <p className="text-[10px] text-zinc-600">Created: {new Date(webhook.created_at).toLocaleString()}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    {/* Toggle Active status */}
                    <button
                      onClick={() => handleToggleWebhook(webhook.id)}
                      className="text-zinc-400 hover:text-white transition-colors"
                      title={webhook.is_active ? 'Disable webhook' : 'Enable webhook'}
                    >
                      {webhook.is_active ? (
                        <ToggleRight className="h-8 w-8 text-blue-500" />
                      ) : (
                        <ToggleLeft className="h-8 w-8 text-zinc-600" />
                      )}
                    </button>

                    {/* Test Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTestWebhook(webhook.id, webhook.url, webhook.event)}
                      disabled={testingId === webhook.id}
                      className="border-zinc-800 hover:bg-zinc-900 text-zinc-300 hover:text-white"
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

                    {/* Delete Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteWebhook(webhook.id)}
                      className="border-zinc-800 hover:bg-red-950/20 text-zinc-300 hover:text-red-400 hover:border-red-900/30"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>

                {/* Display Test Result if any */}
                {testResult[webhook.id] && (
                  <div className={`mt-4 p-3 rounded-xl border flex items-center gap-3 text-sm ${
                    testResult[webhook.id].success 
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                      : 'bg-red-500/10 border-red-500/20 text-red-400'
                  }`}>
                    {testResult[webhook.id].success ? (
                      <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 flex-shrink-0" />
                    )}
                    <div>
                      <p className="font-semibold">
                        {testResult[webhook.id].success 
                          ? `Test Succeeded! (Status: ${testResult[webhook.id].status})` 
                          : 'Test Failed'
                        }
                      </p>
                      {testResult[webhook.id].error && (
                        <p className="text-xs opacity-80 font-mono mt-0.5">{testResult[webhook.id].error}</p>
                      )}
                      {!testResult[webhook.id].success && testResult[webhook.id].status && (
                        <p className="text-xs opacity-80 font-mono mt-0.5">Server returned status code: {testResult[webhook.id].status}</p>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
