'use server'

import { createClient } from '@/lib/supabase/server'
import { blogPostSchema, BlogPostFormValues } from '@/lib/validations/blog'
import { revalidatePath } from 'next/cache'

export async function getBlogPosts() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching blog posts:', error)
    return { error: 'Failed to fetch blog posts' }
  }

  return { data }
}

export async function getBlogPost(id: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching blog post:', error)
    return { error: 'Failed to fetch blog post' }
  }

  return { data }
}

export async function getPublishedBlogPosts() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  if (error) {
    console.error('Error fetching published blog posts:', error)
    return { error: 'Failed to fetch blog posts' }
  }

  return { data }
}

export async function getBlogPostBySlug(slug: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (error) {
    console.error('Error fetching blog post by slug:', error)
    return { error: 'Failed to fetch blog post' }
  }

  return { data }
}

export async function createBlogPost(data: BlogPostFormValues) {
  const supabase = await createClient()
  
  const validatedData = blogPostSchema.parse(data)

  const { error } = await supabase
    .from('blog_posts')
    .insert([
      {
        title: validatedData.title,
        slug: validatedData.slug,
        excerpt: validatedData.excerpt,
        content: validatedData.content,
        cover_image_url: validatedData.cover_image_url,
        author: validatedData.author,
        status: validatedData.status,
        published_at: validatedData.status === 'published' ? new Date().toISOString() : null,
      }
    ])

  if (error) {
    console.error('Error creating blog post:', error)
    return { error: error.message }
  }

  revalidatePath('/admin/blog')
  revalidatePath('/blog')
  return { success: true }
}

export async function updateBlogPost(id: string, data: BlogPostFormValues) {
  const supabase = await createClient()
  
  const validatedData = blogPostSchema.parse(data)

  // Fetch current to see if we need to set published_at
  const { data: current } = await supabase.from('blog_posts').select('status, published_at').eq('id', id).single()

  let published_at = current?.published_at
  if (validatedData.status === 'published' && current?.status !== 'published' && !published_at) {
    published_at = new Date().toISOString()
  }

  const { error } = await supabase
    .from('blog_posts')
    .update({
        title: validatedData.title,
        slug: validatedData.slug,
        excerpt: validatedData.excerpt,
        content: validatedData.content,
        cover_image_url: validatedData.cover_image_url,
        author: validatedData.author,
        status: validatedData.status,
        published_at,
    })
    .eq('id', id)

  if (error) {
    console.error('Error updating blog post:', error)
    return { error: error.message }
  }

  revalidatePath('/admin/blog')
  revalidatePath('/blog')
  revalidatePath(`/blog/${validatedData.slug}`)
  return { success: true }
}

export async function deleteBlogPost(id: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('blog_posts')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting blog post:', error)
    return { error: error.message }
  }

  revalidatePath('/admin/blog')
  revalidatePath('/blog')
  return { success: true }
}
