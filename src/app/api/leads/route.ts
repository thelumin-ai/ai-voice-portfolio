import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { leadSchema } from '@/lib/validations/lead'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validate the incoming data against the lead schema
    const validatedData = leadSchema.parse(body)

    // Use a service role key if available for bypassing RLS, or anon key if RLS allows public inserts
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
          phone: validatedData.phone,
          company: validatedData.company,
          message: validatedData.message,
          status: 'new'
        }
      ])

    if (error) {
      console.error('Supabase error inserting lead:', error)
      return NextResponse.json({ error: 'Failed to save lead' }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: 'Lead submitted successfully' })
    
  } catch (error: any) {
    console.error('Error processing lead submission:', error)
    return NextResponse.json({ error: 'Invalid data format or missing required fields' }, { status: 400 })
  }
}
