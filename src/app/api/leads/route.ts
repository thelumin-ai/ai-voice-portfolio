import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { leadSchema } from '@/lib/validations/lead'
import { fireWebhooks } from '@/lib/server/webhooks'
import { checkRateLimitAsync, getClientIp } from '@/lib/server/rateLimit'

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request)
    const rl = await checkRateLimitAsync(`leads:${ip}`, 10, 60_000)
    if (!rl.allowed) {
      return NextResponse.json(
        { error: 'Too many submissions. Please wait a minute and try again.' },
        { status: 429, headers: { 'Retry-After': String(rl.retryAfterSeconds) } }
      )
    }

    const body = await request.json().catch(() => null)
    if (typeof body?.website === 'string' && body.website.trim() !== '') {
      return NextResponse.json({ success: true, message: 'Submitted successfully' })
    }

    const parsed = leadSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Invalid data format or missing required fields' },
        { status: 400 }
      )
    }

    const validatedData = parsed.data

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
          name: validatedData.name,
          email: validatedData.email,
          phone: validatedData.phone || '',
          company: validatedData.company || '',
          message: validatedData.message || '',
          status: 'new',
        },
      ])

    if (error) {
      console.error('Supabase error inserting lead:', error)
      return NextResponse.json({ error: 'Failed to save lead' }, { status: 500 })
    }

    try {
      await fireWebhooks('lead_created', {
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone || '',
        company: validatedData.company || '',
        message: validatedData.message || '',
        source: 'Consultation Form / Chatbot',
      })
    } catch (webhookErr) {
      console.error('Error firing webhooks:', webhookErr)
    }

    return NextResponse.json({ success: true, message: 'Lead submitted successfully' })
  } catch (error) {
    console.error('Error processing lead submission:', error)
    return NextResponse.json({ error: 'Invalid data format or missing required fields' }, { status: 400 })
  }
}
