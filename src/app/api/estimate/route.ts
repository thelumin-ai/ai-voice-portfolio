import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { fireWebhooks } from '@/app/admin/(protected)/webhooks/actions'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, business, useCase, features, timeline, totalEstimate } = body

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 })
    }

    // Prepare detailed message summary
    const featureList = features && features.length > 0 ? features.join(', ') : 'None selected'
    const detailedMessage = `Requested project estimate:
- Use Case: ${useCase}
- Selected Features: ${featureList}
- Timeline Option: ${timeline}
- Estimated Cost: $${totalEstimate.toLocaleString()}`

    // Use service role key or anon key to insert lead
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
          company: business || '',
          message: detailedMessage,
          status: 'new'
        }
      ])

    if (error) {
      console.error('Supabase error inserting estimate lead:', error)
      return NextResponse.json({ error: 'Failed to save estimate' }, { status: 500 })
    }

    // Trigger webhook execution for estimate_requested event
    try {
      await fireWebhooks('estimate_requested', {
        name,
        email,
        company: business || '',
        use_case: useCase,
        selected_features: features || [],
        timeline,
        estimated_cost: totalEstimate,
        message: detailedMessage,
        source: 'ROI / Project Estimator'
      })
    } catch (webhookErr) {
      console.error('Error firing webhooks:', webhookErr)
    }

    return NextResponse.json({ success: true, message: 'Estimate request submitted successfully' })
    
  } catch (error: any) {
    console.error('Error processing estimate submission:', error)
    return NextResponse.json({ error: 'Invalid data format or missing required fields' }, { status: 400 })
  }
}
