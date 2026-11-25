'use server'

import { createPublicClient } from '@/lib/supabase/public'
import { testimonialSchema, TestimonialFormValues } from '@/lib/validations/testimonial'
import { requireAdmin } from '@/lib/auth/admin'
import { deleteStorageFileByUrl } from '@/lib/storage'
import { revalidatePath } from 'next/cache'

/**
 * Public-safe testimonials loader returning published items only.
 */
export async function getTestimonials() {
  try {
    const supabase = createPublicClient()

    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('status', 'published')
      .order('display_order', { ascending: true })

    if (error) {
      console.error('Error fetching testimonials:', error)
      return { error: 'Failed to fetch testimonials' }
    }

    return { data }
  } catch (error) {
    console.error('Error fetching testimonials:', error)
    return { error: 'Failed to fetch testimonials' }
  }
}

/**
 * Admin-only testimonials loader returning all items (draft, published, archived).
 */
export async function getAdminTestimonials() {
  const auth = await requireAdmin()
  if (auth.error || !auth.supabase) {
    return { error: 'Unauthorized' }
  }

  const { data, error } = await auth.supabase
    .from('testimonials')
    .select('*')
    .order('display_order', { ascending: true })

  if (error) {
    console.error('Error fetching admin testimonials:', error)
    return { error: error.message || 'Failed to fetch testimonials' }
  }

  return { data }
}

export async function getTestimonial(id: string) {
  const auth = await requireAdmin()
  if (auth.error || !auth.supabase) {
    return { error: 'Unauthorized' }
  }

  const { data, error } = await auth.supabase
    .from('testimonials')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching testimonial:', error)
    return { error: error.message || 'Failed to fetch testimonial' }
  }

  return { data }
}

export async function createTestimonial(data: TestimonialFormValues) {
  const auth = await requireAdmin()
  if (auth.error || !auth.supabase) {
    return { error: 'Unauthorized' }
  }

  const parsed = testimonialSchema.safeParse(data)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || 'Invalid testimonial data' }
  }

  const validatedData = parsed.data

  const { error } = await auth.supabase
    .from('testimonials')
    .insert([
      {
        client_name: validatedData.client_name,
        company: validatedData.company,
        content: validatedData.content,
        image_url: validatedData.image_url,
        video_url: validatedData.video_url,
        rating: validatedData.rating,
        status: validatedData.status,
        display_order: validatedData.display_order,
      },
    ])

  if (error) {
    console.error('Error creating testimonial:', error)
    return { error: error.message }
  }

  revalidatePath('/admin/testimonials')
  revalidatePath('/')
  return { success: true }
}

export async function updateTestimonial(id: string, data: TestimonialFormValues) {
  const auth = await requireAdmin()
  if (auth.error || !auth.supabase) {
    return { error: 'Unauthorized' }
  }

  const parsed = testimonialSchema.safeParse(data)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || 'Invalid testimonial data' }
  }

  const validatedData = parsed.data

  const { data: current } = await auth.supabase
    .from('testimonials')
    .select('image_url')
    .eq('id', id)
    .maybeSingle()

  const { error } = await auth.supabase
    .from('testimonials')
    .update({
      client_name: validatedData.client_name,
      company: validatedData.company,
      content: validatedData.content,
      image_url: validatedData.image_url,
      video_url: validatedData.video_url,
      rating: validatedData.rating,
      status: validatedData.status,
      display_order: validatedData.display_order,
    })
    .eq('id', id)

  if (error) {
    console.error('Error updating testimonial:', error)
    return { error: error.message }
  }

  if (current?.image_url && current.image_url !== (validatedData.image_url || '')) {
    await deleteStorageFileByUrl(auth.supabase, current.image_url)
  }

  revalidatePath('/admin/testimonials')
  revalidatePath('/')
  return { success: true }
}

export async function deleteTestimonial(id: string) {
  const auth = await requireAdmin()
  if (auth.error || !auth.supabase) {
    return { error: 'Unauthorized' }
  }

  const { data: current } = await auth.supabase
    .from('testimonials')
    .select('image_url')
    .eq('id', id)
    .maybeSingle()

  const { error } = await auth.supabase
    .from('testimonials')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting testimonial:', error)
    return { error: error.message }
  }

  if (current?.image_url) {
    await deleteStorageFileByUrl(auth.supabase, current.image_url)
  }

  revalidatePath('/admin/testimonials')
  revalidatePath('/')
  return { success: true }
}

export async function updateTestimonialOrder(items: { id: string; display_order: number }[]) {
  const auth = await requireAdmin()
  if (auth.error || !auth.supabase) {
    return { error: 'Unauthorized' }
  }

  for (const item of items) {
    const { error } = await auth.supabase
      .from('testimonials')
      .update({ display_order: item.display_order })
      .eq('id', item.id)

    if (error) {
      console.error('Error updating order:', error)
      return { error: error.message || 'Failed to update order' }
    }
  }

  revalidatePath('/admin/testimonials')
  revalidatePath('/')
  return { success: true }
}

const defaultTestimonials = [
  {
    client_name: 'Sarah Jenkins',
    company: 'Elevation Real Estate',
    content:
      "Before Abimbola's AI voice agent, our reps spent 6 hours a day dialing un-qualified leads. Now, the AI calls every new lead within 5 seconds, qualifies them, and books them straight to our Calendly. We've seen a 300% increase in connected calls.",
    rating: 5,
    image_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop',
    status: 'published',
    display_order: 0,
  },
  {
    client_name: 'Michael Chen',
    company: 'SunPower Solutions',
    content:
      "We deployed the outbound pre-qualification agent for our solar campaigns. It handles 500+ calls daily without breaking a sweat, handling objections like 'not interested' with perfect rebuttals. It feels like we hired an army of SDRs.",
    rating: 5,
    image_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop',
    status: 'published',
    display_order: 1,
  },
  {
    client_name: 'David Rodriguez',
    company: 'Apex Home Services',
    content:
      "Missed calls used to mean lost revenue for our plumbing business. The inbound 24/7 AI agent Abimbola built now answers every single call, gets the customer's issue, and dispatches the right tech. It paid for itself in week one.",
    rating: 5,
    image_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
    status: 'published',
    display_order: 2,
  },
  {
    client_name: 'Emily Watson',
    company: 'TechFlow SaaS',
    content:
      "Our tier-1 support was overwhelmed. The AI voice router now handles all 'where is my order' and 'reset password' queries automatically, passing only complex issues to our human agents. Incredible latency and natural voice.",
    rating: 5,
    image_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&auto=format&fit=crop',
    status: 'published',
    display_order: 3,
  },
  {
    client_name: 'James Carter',
    company: 'Carter Legal Group',
    content:
      'The intake automation system is flawless. The AI conducts a natural discovery call with potential clients, extracting key legal details before scheduling a consultation with our attorneys.',
    rating: 5,
    image_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=200&auto=format&fit=crop',
    status: 'published',
    display_order: 4,
  },
  {
    client_name: 'Anita Patel',
    company: 'Global Logistics Inc',
    content:
      'We needed a scalable way to confirm delivery schedules. The AI agent makes hundreds of outbound confirmation calls daily and updates our ERP in real-time. A masterpiece of automation.',
    rating: 5,
    image_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    status: 'published',
    display_order: 5,
  },
]

export async function seedDefaultTestimonials() {
  const auth = await requireAdmin()
  if (auth.error || !auth.supabase) {
    return { error: 'Unauthorized' }
  }

  // Record existing IDs first and insert defaults BEFORE deleting old rows so data is never lost on failure
  const { data: existingRows, error: fetchError } = await auth.supabase
    .from('testimonials')
    .select('id')

  if (fetchError) {
    console.error('Error reading existing testimonials:', fetchError)
    return { error: fetchError.message }
  }

  const { error: insertError } = await auth.supabase
    .from('testimonials')
    .insert(defaultTestimonials)

  if (insertError) {
    console.error('Error seeding testimonials:', insertError)
    return { error: insertError.message }
  }

  const oldIds = (existingRows || []).map((r) => r.id).filter(Boolean)
  if (oldIds.length > 0) {
    const { error: deleteError } = await auth.supabase
      .from('testimonials')
      .delete()
      .in('id', oldIds)

    if (deleteError) {
      console.error('Error removing previous testimonials after seed:', deleteError)
      return { error: deleteError.message }
    }
  }

  revalidatePath('/admin/testimonials')
  revalidatePath('/')
  return { success: true }
}
