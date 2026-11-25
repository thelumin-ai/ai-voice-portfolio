import { NextResponse } from 'next/server'
import { checkRateLimitAsync, getClientIp } from '@/lib/server/rateLimit'
import { resolveServerRetellCredentials } from '@/lib/server/secrets'

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req)
    const rl = await checkRateLimitAsync(`retell:${ip}`, 10, 60_000)
    if (!rl.allowed) {
      return NextResponse.json(
        { error: 'Too many voice call attempts. Please wait a minute and try again.' },
        { status: 429, headers: { 'Retry-After': String(rl.retryAfterSeconds) } }
      )
    }

    const body = await req.json().catch(() => null)
    const projectId = typeof body?.projectId === 'string' ? body.projectId.trim() : undefined
    const agentId = typeof body?.agentId === 'string' ? body.agentId.trim() : undefined

    const resolved = await resolveServerRetellCredentials({ projectId, agentId })
    if ('error' in resolved) {
      return NextResponse.json({ error: resolved.error }, { status: resolved.status })
    }

    const response = await fetch('https://api.retellai.com/v2/create-web-call', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resolved.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        agent_id: resolved.agentId,
      }),
      signal: AbortSignal.timeout(15_000),
    })

    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || 'Failed to create Retell web call' },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    )
  }
}
