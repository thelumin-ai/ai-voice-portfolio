import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { createPublicClient } from '@/lib/supabase/public'

/**
 * Server-only Supabase client that uses SUPABASE_SERVICE_ROLE_KEY when available
 * and falls back to the public client. Never import this file in client components.
 */
export function createServerSupabaseAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (url && serviceKey) {
    return createSupabaseClient(url, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
  }

  return createPublicClient()
}

export interface ServerApiKeys {
  openai_api_key: string
  anthropic_api_key: string
  gemini_api_key: string
}

/**
 * Server-only loader for AI provider API keys. Checks environment variables first
 * and falls back to site_settings rows stored in Supabase.
 */
export async function getServerApiKeys(): Promise<ServerApiKeys> {
  const keys: ServerApiKeys = {
    openai_api_key: process.env.OPENAI_API_KEY || '',
    anthropic_api_key: process.env.ANTHROPIC_API_KEY || '',
    gemini_api_key: process.env.GEMINI_API_KEY || '',
  }

  try {
    const supabase = createServerSupabaseAdminClient()
    const { data, error } = await supabase
      .from('site_settings')
      .select('setting_key, setting_value')
      .in('setting_key', ['openai_api_key', 'anthropic_api_key', 'gemini_api_key'])

    if (!error && data) {
      for (const row of data) {
        if (row.setting_key === 'openai_api_key' && row.setting_value && !keys.openai_api_key) {
          keys.openai_api_key = String(row.setting_value)
        }
        if (row.setting_key === 'anthropic_api_key' && row.setting_value && !keys.anthropic_api_key) {
          keys.anthropic_api_key = String(row.setting_value)
        }
        if (row.setting_key === 'gemini_api_key' && row.setting_value && !keys.gemini_api_key) {
          keys.gemini_api_key = String(row.setting_value)
        }
      }
    }
  } catch (err) {
    console.error('Error reading server API keys:', err)
  }

  return keys
}

/**
 * Server-only lookup for Retell web call creation.
 * Resolves the secret Retell API key and verifies the requested agentId belongs to
 * a published portfolio project (or matches configured env defaults).
 */
export async function resolveServerRetellCredentials(params: {
  projectId?: string
  agentId?: string
}): Promise<{ agentId: string; apiKey: string } | { error: string; status: number }> {
  const envApiKey = process.env.RETELL_API_KEY || ''
  const supabase = createServerSupabaseAdminClient()

  // Prefer lookup by published projectId so secrets never leave the server
  if (params.projectId) {
    const { data: project, error } = await supabase
      .from('portfolio_projects')
      .select('media_url, api_key, voice_platform, status')
      .eq('id', params.projectId)
      .eq('status', 'published')
      .maybeSingle()

    if (error || !project) {
      return { error: 'Published voice project not found', status: 404 }
    }

    const resolvedAgentId = extractRetellAgentId(project.media_url || '')
    const resolvedKey = project.api_key || envApiKey

    if (!resolvedAgentId) {
      return { error: 'Project has no configured Retell agent ID', status: 400 }
    }
    if (!resolvedKey) {
      return { error: 'Retell API key is not configured on the server', status: 500 }
    }

    return { agentId: resolvedAgentId, apiKey: resolvedKey }
  }

  // Fallback: verify agentId matches a published portfolio project or env allowlist
  if (!params.agentId || typeof params.agentId !== 'string') {
    return { error: 'Missing projectId or agentId', status: 400 }
  }

  const requestedAgentId = extractRetellAgentId(params.agentId)
  if (!requestedAgentId) {
    return { error: 'Invalid Retell agent ID', status: 400 }
  }

  const allowedEnvAgents = (process.env.RETELL_ALLOWED_AGENT_IDS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)

  if (allowedEnvAgents.includes(requestedAgentId)) {
    if (!envApiKey) {
      return { error: 'Retell API key is not configured on the server', status: 500 }
    }
    return { agentId: requestedAgentId, apiKey: envApiKey }
  }

  const { data: projects } = await supabase
    .from('portfolio_projects')
    .select('media_url, api_key, voice_platform')
    .eq('status', 'published')
    .eq('voice_platform', 'retell')

  const match = projects?.find((p) => extractRetellAgentId(p.media_url || '') === requestedAgentId)
  if (!match) {
    return { error: 'Unauthorized or unknown Retell agent ID', status: 403 }
  }

  const resolvedKey = match.api_key || envApiKey
  if (!resolvedKey) {
    return { error: 'Retell API key is not configured on the server', status: 500 }
  }

  return { agentId: requestedAgentId, apiKey: resolvedKey }
}

export function extractRetellAgentId(input: string): string {
  const trimmed = input.trim()
  if (!trimmed) return ''
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    try {
      const urlObj = new URL(trimmed)
      return urlObj.searchParams.get('agent_id') || urlObj.searchParams.get('id') || ''
    } catch {
      return ''
    }
  }
  return trimmed
}
