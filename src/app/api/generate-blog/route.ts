import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/admin'
import { getServerApiKeys } from '@/lib/server/secrets'

function extractJsonObject(raw: string): Record<string, unknown> {
  const trimmed = raw.trim()
  // Strip ONLY outer markdown code fences, never inner code blocks inside markdown content
  const withoutOuterFence = trimmed
    .replace(/^```(?:json)?\s*\r?\n?/i, '')
    .replace(/\r?\n?```\s*$/i, '')
    .trim()

  try {
    return JSON.parse(withoutOuterFence)
  } catch {
    // Fallback: slice from first { to last }
    const start = withoutOuterFence.indexOf('{')
    const end = withoutOuterFence.lastIndexOf('}')
    if (start !== -1 && end > start) {
      return JSON.parse(withoutOuterFence.slice(start, end + 1))
    }
    throw new Error('Invalid JSON output')
  }
}

export async function POST(req: Request) {
  try {
    const auth = await requireAdmin()
    if (auth.error) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json().catch(() => null)
    const prompt = typeof body?.prompt === 'string' ? body.prompt.trim() : ''
    const provider = typeof body?.provider === 'string' ? body.provider : ''

    if (!prompt || !provider) {
      return NextResponse.json({ error: 'Prompt and provider are required' }, { status: 400 })
    }

    if (prompt.length > 4000) {
      return NextResponse.json({ error: 'Prompt must be 4,000 characters or fewer' }, { status: 400 })
    }

    const keys = await getServerApiKeys()
    const systemPrompt =
      'You are an expert tech and AI voice automation copywriter. Output a raw JSON object with the following keys: "title", "slug", "excerpt", and "content" (content should be in Markdown and highly SEO optimized). Do not wrap the JSON in markdown blocks.'

    let content = ''

    if (provider === 'openai') {
      const apiKey = keys.openai_api_key
      if (!apiKey) return NextResponse.json({ error: 'OpenAI API key not configured in settings' }, { status: 400 })

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          response_format: { type: 'json_object' },
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt },
          ],
        }),
        signal: AbortSignal.timeout(45_000),
      })

      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data.error?.message || 'OpenAI API error')
      content = data?.choices?.[0]?.message?.content || ''
    } else if (provider === 'anthropic') {
      const apiKey = keys.anthropic_api_key
      if (!apiKey) return NextResponse.json({ error: 'Anthropic API key not configured in settings' }, { status: 400 })

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 4000,
          system: systemPrompt,
          messages: [{ role: 'user', content: prompt }],
        }),
        signal: AbortSignal.timeout(45_000),
      })

      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data.error?.message || 'Anthropic API error')
      content = data?.content?.[0]?.text || ''
    } else if (provider === 'gemini') {
      const apiKey = keys.gemini_api_key
      if (!apiKey) return NextResponse.json({ error: 'Gemini API key not configured in settings' }, { status: 400 })

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(apiKey)}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system_instruction: { parts: { text: systemPrompt } },
            generationConfig: { responseMimeType: 'application/json' },
            contents: [{ parts: [{ text: prompt }] }],
          }),
          signal: AbortSignal.timeout(45_000),
        }
      )

      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data.error?.message || 'Gemini API error')
      content = data?.candidates?.[0]?.content?.parts?.[0]?.text || ''
    } else {
      return NextResponse.json({ error: 'Invalid provider' }, { status: 400 })
    }

    if (!content) {
      return NextResponse.json({ error: 'AI returned an empty response. Try again.' }, { status: 502 })
    }

    try {
      const parsedContent = extractJsonObject(content)
      return NextResponse.json({
        title: parsedContent.title || '',
        slug: parsedContent.slug || '',
        excerpt: parsedContent.excerpt || '',
        content: parsedContent.content || '',
      })
    } catch {
      console.error('Failed to parse JSON from AI:', content)
      return NextResponse.json({ error: 'AI did not return a valid JSON format. Try again.' }, { status: 500 })
    }
  } catch (error) {
    console.error('AI Generation Error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    )
  }
}
