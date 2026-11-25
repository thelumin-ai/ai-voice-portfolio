import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { fireWebhooks } from '@/lib/server/webhooks'
import { checkRateLimitAsync, getClientIp } from '@/lib/server/rateLimit'

const estimateSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(150),
  email: z.string().trim().email('Valid email address is required').max(254),
  business: z.string().trim().max(200).optional().default(''),
  useCase: z.string().trim().max(200).optional().default('Not specified'),
  features: z.array(z.string().trim().max(120)).max(25).optional().default([]),
  timeline: z.string().trim().max(120).optional().default('Standard'),
  totalEstimate: z.coerce.number().finite().min(0).max(10_000_000).optional().default(0),
  website: z.string().max(500).optional(),
})

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request)
    const rl = await checkRateLimitAsync(`estimate:${ip}`, 10, 60_000)
    if (!rl.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a minute and try again.' },
        { status: 429, headers: { 'Retry-After': String(rl.retryAfterSeconds) } }
      )
    }

    const body = await request.json().catch(() => null)
    if (typeof body?.website === 'string' && body.website.trim() !== '') {
      return NextResponse.json({ success: true, message: 'Submitted successfully' })
    }

    const parsed = estimateSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Invalid estimate payload' },
        { status: 400 }
      )
    }

    const { name, email, business, useCase, features, timeline, totalEstimate } = parsed.data

    const featureList = features.length > 0 ? features.join(', ') : 'None selected'
    const detailedMessage = `Requested project estimate:
- Use Case: ${useCase}
- Selected Features: ${featureList}
- Timeline Option: ${timeline}
- Estimated Cost: $${totalEstimate.toLocaleString('en-US')}`

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: 'Supabase credentials not configured' }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    const { error } = await supabase
      .from('leads')
      .insert([
        {
          name,
          email,
          company: business,
          message: detailedMessage,
          status: 'new',
        },
      ])

    if (error) {
      console.error('Supabase error inserting estimate lead:', error)
      return NextResponse.json({ error: 'Failed to save estimate' }, { status: 500 })
    }

    try {
      await fireWebhooks('estimate_requested', {
        name,
        email,
        company: business,
        use_case: useCase,
        selected_features: features,
        timeline,
        estimated_cost: totalEstimate,
        message: detailedMessage,
        source: 'ROI / Project Estimator',
      })
    } catch (webhookErr) {
      console.error('Error firing webhooks:', webhookErr)
    }

    return NextResponse.json({ success: true, message: 'Estimate request submitted successfully' })
  } catch (error) {
    console.error('Error processing estimate submission:', error)
    return NextResponse.json({ error: 'Invalid data format or missing required fields' }, { status: 400 })
  }
}
