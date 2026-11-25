'use server'

import { createPublicClient } from '@/lib/supabase/public'
import { blogPostSchema, BlogPostFormValues } from '@/lib/validations/blog'
import { requireAdmin } from '@/lib/auth/admin'
import { deleteStorageFileByUrl } from '@/lib/storage'
import { revalidatePath } from 'next/cache'

export async function getBlogPosts() {
  const auth = await requireAdmin()
  if (auth.error || !auth.supabase) {
    return { error: 'Unauthorized' }
  }

  const { data, error } = await auth.supabase
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
  const auth = await requireAdmin()
  if (auth.error || !auth.supabase) {
    return { error: 'Unauthorized' }
  }

  const { data, error } = await auth.supabase
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
  try {
    const supabase = createPublicClient()
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
  } catch (error) {
    console.error('Error fetching published blog posts:', error)
    return { error: 'Failed to fetch blog posts' }
  }
}

export async function getBlogPostBySlug(slug: string) {
  try {
    const supabase = createPublicClient()
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .maybeSingle()

    if (error) {
      console.error('Error fetching blog post by slug:', error)
      return { error: 'Failed to fetch blog post' }
    }

    return { data }
  } catch (error) {
    console.error('Error fetching blog post by slug:', error)
    return { error: 'Failed to fetch blog post' }
  }
}

export async function createBlogPost(data: BlogPostFormValues) {
  const auth = await requireAdmin()
  if (auth.error || !auth.supabase) {
    return { error: 'Unauthorized' }
  }

  const parsed = blogPostSchema.safeParse(data)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || 'Invalid blog post data' }
  }

  const validatedData = parsed.data

  const { error } = await auth.supabase
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
      },
    ])

  if (error) {
    console.error('Error creating blog post:', error)
    return { error: error.message }
  }

  revalidatePath('/admin/blog')
  revalidatePath('/blog')
  revalidatePath(`/blog/${validatedData.slug}`)
  return { success: true }
}

export async function updateBlogPost(id: string, data: BlogPostFormValues) {
  const auth = await requireAdmin()
  if (auth.error || !auth.supabase) {
    return { error: 'Unauthorized' }
  }

  const parsed = blogPostSchema.safeParse(data)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || 'Invalid blog post data' }
  }

  const validatedData = parsed.data

  const { data: current } = await auth.supabase
    .from('blog_posts')
    .select('status, published_at, slug, cover_image_url')
    .eq('id', id)
    .single()

  let published_at = current?.published_at
  if (validatedData.status === 'published' && current?.status !== 'published' && !published_at) {
    published_at = new Date().toISOString()
  }

  const { error } = await auth.supabase
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

  if (current?.cover_image_url && current.cover_image_url !== validatedData.cover_image_url) {
    await deleteStorageFileByUrl(auth.supabase, current.cover_image_url)
  }

  revalidatePath('/admin/blog')
  revalidatePath('/blog')
  revalidatePath(`/blog/${validatedData.slug}`)
  if (current?.slug && current.slug !== validatedData.slug) {
    revalidatePath(`/blog/${current.slug}`)
  }
  return { success: true }
}

export async function deleteBlogPost(id: string) {
  const auth = await requireAdmin()
  if (auth.error || !auth.supabase) {
    return { error: 'Unauthorized' }
  }

  const { data: current } = await auth.supabase
    .from('blog_posts')
    .select('slug, cover_image_url')
    .eq('id', id)
    .maybeSingle()

  const { error } = await auth.supabase
    .from('blog_posts')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting blog post:', error)
    return { error: error.message }
  }

  if (current?.cover_image_url) {
    await deleteStorageFileByUrl(auth.supabase, current.cover_image_url)
  }

  revalidatePath('/admin/blog')
  revalidatePath('/blog')
  if (current?.slug) {
    revalidatePath(`/blog/${current.slug}`)
  }
  return { success: true }
}
