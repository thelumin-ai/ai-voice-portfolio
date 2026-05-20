'use server'

import { createClient } from '@/lib/supabase/server'
import { createPublicClient } from '@/lib/supabase/public'
import { testimonialSchema, TestimonialFormValues } from '@/lib/validations/testimonial'
import { revalidatePath } from 'next/cache'

export async function getTestimonials() {
  const supabase = createPublicClient()
  
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .order('display_order', { ascending: true })

  if (error) {
    console.error('Error fetching testimonials:', error)
    return { error: 'Failed to fetch testimonials' }
  }

  return { data }
}

export async function getTestimonial(id: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching testimonial:', error)
    return { error: 'Failed to fetch testimonial' }
  }

  return { data }
}

export async function createTestimonial(data: TestimonialFormValues) {
  const supabase = await createClient()
  
  const validatedData = testimonialSchema.parse(data)

  const { error } = await supabase
    .from('testimonials')
    .insert([
      {
        client_name: validatedData.client_name,
        company: validatedData.company,
        content: validatedData.content,
        video_url: validatedData.video_url,
        rating: validatedData.rating,
        status: validatedData.status,
        display_order: validatedData.display_order,
      }
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
  const supabase = await createClient()
  
  const validatedData = testimonialSchema.parse(data)

  const { error } = await supabase
    .from('testimonials')
    .update({
        client_name: validatedData.client_name,
        company: validatedData.company,
        content: validatedData.content,
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

  revalidatePath('/admin/testimonials')
  revalidatePath('/')
  return { success: true }
}

export async function deleteTestimonial(id: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('testimonials')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting testimonial:', error)
    return { error: error.message }
  }

  revalidatePath('/admin/testimonials')
  revalidatePath('/')
  return { success: true }
}

export async function updateTestimonialOrder(items: { id: string; display_order: number }[]) {
  const supabase = await createClient()

  // Supabase doesn't support bulk updates easily through the JS client for different rows,
  // so we'll do it sequentially or use a stored procedure. Since the list is small, sequential is fine.
  for (const item of items) {
    const { error } = await supabase
      .from('testimonials')
      .update({ display_order: item.display_order })
      .eq('id', item.id)

    if (error) {
      console.error('Error updating order:', error)
      return { error: 'Failed to update order' }
    }
  }

  revalidatePath('/admin/testimonials')
  revalidatePath('/')
  return { success: true }
}

const defaultTestimonials = [
  {
    client_name: "Sarah Jenkins",
    company: "Elevation Real Estate",
    content: "Before Abimbola's AI voice agent, our reps spent 6 hours a day dialing un-qualified leads. Now, the AI calls every new lead within 5 seconds, qualifies them, and books them straight to our Calendly. We've seen a 300% increase in connected calls.",
    rating: 5,
    image_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop",
    status: "published",
    display_order: 0
  },
  {
    client_name: "Michael Chen",
    company: "SunPower Solutions",
    content: "We deployed the outbound pre-qualification agent for our solar campaigns. It handles 500+ calls daily without breaking a sweat, handling objections like 'not interested' with perfect rebuttals. It feels like we hired an army of SDRs.",
    rating: 5,
    image_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop",
    status: "published",
    display_order: 1
  },
  {
    client_name: "David Rodriguez",
    company: "Apex Home Services",
    content: "Missed calls used to mean lost revenue for our plumbing business. The inbound 24/7 AI agent Abimbola built now answers every single call, gets the customer's issue, and dispatches the right tech. It paid for itself in week one.",
    rating: 5,
    image_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
    status: "published",
    display_order: 2
  },
  {
    client_name: "Emily Watson",
    company: "TechFlow SaaS",
    content: "Our tier-1 support was overwhelmed. The AI voice router now handles all 'where is my order' and 'reset password' queries automatically, passing only complex issues to our human agents. Incredible latency and natural voice.",
    rating: 5,
    image_url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&auto=format&fit=crop",
    status: "published",
    display_order: 3
  },
  {
    client_name: "James Carter",
    company: "Carter Legal Group",
    content: "The intake automation system is flawless. The AI conducts a natural discovery call with potential clients, extracting key legal details before scheduling a consultation with our attorneys.",
    rating: 5,
    image_url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=200&auto=format&fit=crop",
    status: "published",
    display_order: 4
  },
  {
    client_name: "Anita Patel",
    company: "Global Logistics Inc",
    content: "We needed a scalable way to confirm delivery schedules. The AI agent makes hundreds of outbound confirmation calls daily and updates our ERP in real-time. A masterpiece of automation.",
    rating: 5,
    image_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
    status: "published",
    display_order: 5
  }
];

export async function seedDefaultTestimonials() {
  const supabase = await createClient()

  // Delete all existing testimonials first to prevent duplicates/mock data
  const { error: deleteError } = await supabase
    .from('testimonials')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000')

  if (deleteError) {
    console.error('Error clearing testimonials:', deleteError)
    return { error: deleteError.message }
  }

  // Insert default testimonials
  const { error: insertError } = await supabase
    .from('testimonials')
    .insert(defaultTestimonials)

  if (insertError) {
    console.error('Error seeding testimonials:', insertError)
    return { error: insertError.message }
  }

  revalidatePath('/admin/testimonials')
  revalidatePath('/')
  return { success: true }
}
