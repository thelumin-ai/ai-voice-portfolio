import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { requireAdmin, isSafeHttpUrl, validateImageFile } from '@/lib/auth/admin'
import { createPublicClient } from '@/lib/supabase/public'

export async function POST(request: Request) {
  try {
    const auth = await requireAdmin()
    if (auth.error || !auth.supabase) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const title = String(formData.get('title') || '').trim()
    const shortDescription = String(
      formData.get('short_description') || formData.get('description') || ''
    ).trim()
    const industryTag = String(formData.get('industry_tag') || 'AI Automation').trim()
    const projectType = String(formData.get('project_type') || formData.get('type') || 'video').trim()
    const mediaUrlInput = String(formData.get('media_url') || formData.get('mediaUrl') || '').trim()
    const metricsStr = String(formData.get('metrics') || '').trim()
    const status = String(formData.get('status') || 'published').trim()
    const file = formData.get('file') as File | null
    let coverImageUrl = String(formData.get('cover_image_url') || '').trim()

    if (!title || !shortDescription) {
      return NextResponse.json({ error: 'Title and description are required' }, { status: 400 })
    }

    if (title.length > 200) {
      return NextResponse.json({ error: 'Portfolio title must not exceed 200 characters' }, { status: 400 })
    }

    if (shortDescription.length > 2500) {
      return NextResponse.json(
        { error: 'Portfolio description must not exceed 2,500 characters' },
        { status: 400 }
      )
    }

    let metrics: Array<{ label: string; value: string }> = []
    if (metricsStr) {
      try {
        const parsed = JSON.parse(metricsStr)
        if (!Array.isArray(parsed)) {
          return NextResponse.json({ error: 'Metrics must be a JSON array' }, { status: 400 })
        }
        metrics = parsed
      } catch {
        return NextResponse.json({ error: 'Invalid JSON format for metrics' }, { status: 400 })
      }
    }

    if (file && file.size > 0) {
      const fileError = validateImageFile(file)
      if (fileError) {
        return NextResponse.json({ error: fileError }, { status: 400 })
      }

      const fileExt = file.name.split('.').pop()?.toLowerCase() || 'png'
      const fileName = `portfolio-${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${fileExt}`

      const { error: uploadError } = await auth.supabase.storage
        .from('portfolio_media')
        .upload(fileName, file, { contentType: file.type || undefined })

      if (uploadError) {
        console.error('Upload error:', uploadError)
        return NextResponse.json({ error: 'Failed to upload cover image' }, { status: 500 })
      }

      const { data: publicUrlData } = auth.supabase.storage
        .from('portfolio_media')
        .getPublicUrl(fileName)

      coverImageUrl = publicUrlData.publicUrl
    }

    if (!coverImageUrl || !isSafeHttpUrl(coverImageUrl)) {
      return NextResponse.json(
        { error: 'A valid portfolio cover image (file or http/https URL) is required' },
        { status: 400 }
      )
    }

    const allowedProjectTypes = new Set(['audio', 'video', 'iframe', 'webrtc'])
    const safeProjectType = allowedProjectTypes.has(projectType) ? projectType : 'video'
    const allowedStatuses = new Set(['draft', 'published', 'archived'])
    const safeStatus = allowedStatuses.has(status) ? status : 'published'

    const { data, error } = await auth.supabase
      .from('portfolio_projects')
      .insert([
        {
          title,
          industry_tag: industryTag,
          short_description: shortDescription,
          metrics,
          project_type: safeProjectType,
          media_url: mediaUrlInput || null,
          cover_image_url: coverImageUrl,
          status: safeStatus,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error('Database insert error:', error)
      return NextResponse.json({ error: 'Failed to save portfolio project' }, { status: 500 })
    }

    revalidatePath('/')
    revalidatePath('/portfolio')
    revalidatePath('/admin/portfolio')

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('API route error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const supabase = createPublicClient()
    const { data, error } = await supabase
      .from('portfolio_projects')
      .select(
        'id, title, industry_tag, short_description, case_study_body, metrics, integrations, project_type, media_url, cover_image_url, voice_platform, status, is_featured, display_order, created_at'
      )
      .eq('status', 'published')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch portfolio projects' }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
