'use server'

import { createClient } from '@/lib/supabase/server'
import { testimonialSchema, TestimonialFormValues } from '@/lib/validations/testimonial'
import { revalidatePath } from 'next/cache'

export async function getTestimonials() {
  const supabase = await createClient()
  
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
