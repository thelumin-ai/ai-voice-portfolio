'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { Bot, Loader2, Sparkles } from 'lucide-react'
import { blogPostSchema, BlogPostFormValues } from '@/lib/validations/blog'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { AdminImageUpload } from '@/components/admin/AdminImageUpload'
import { useAdminToast } from '@/components/admin/AdminToast'
import { createClient } from '@/lib/supabase/client'
import { getErrorMessage } from '@/lib/errors'
import { createBlogPost, updateBlogPost } from './actions'

interface BlogFormProps {
  initialData?: Partial<BlogPostFormValues> & { id?: string }
}

export function BlogForm({ initialData }: BlogFormProps) {
  const router = useRouter()
  const toast = useAdminToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [aiCoverError, setAiCoverError] = useState<string | null>(null)
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(Boolean(initialData?.id))
  const supabase = createClient()

  const [showAiWriter, setShowAiWriter] = useState(false)
  const [aiPrompt, setAiPrompt] = useState('')
  const [aiProvider, setAiProvider] = useState('openai')
  const [aiContentType, setAiContentType] = useState('SEO Article')
  const [isGenerating, setIsGenerating] = useState(false)
  const [aiError, setAiError] = useState<string | null>(null)

  const [showImageAi, setShowImageAi] = useState(false)
  const [imageAiPrompt, setImageAiPrompt] = useState('')
  const [isGeneratingImage, setIsGeneratingImage] = useState(false)

  const normalizedStatus =
    initialData?.status === 'published' || initialData?.status === 'archived'
      ? initialData.status
      : 'draft'

  const form = useForm<BlogPostFormValues>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      id: initialData?.id,
      title: initialData?.title ?? '',
      slug: initialData?.slug ?? '',
      excerpt: initialData?.excerpt ?? '',
      content: initialData?.content ?? '',
      cover_image_url: initialData?.cover_image_url ?? '',
      author: initialData?.author ?? 'Admin',
      status: normalizedStatus,
    },
  })

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value
    form.setValue('title', title, { shouldValidate: true })

    if (!slugManuallyEdited) {
      const generatedSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '')
      form.setValue('slug', generatedSlug, { shouldValidate: true })
    }
  }

  const handleGenerateAI = async () => {
    if (!aiPrompt.trim()) {
      setAiError('Please enter a prompt')
      return
    }

    setIsGenerating(true)
    setAiError(null)

    try {
      const promptToSend = `Write a ${aiContentType} about: ${aiPrompt}. Ensure it is highly SEO optimized.`
      const response = await fetch('/api/generate-blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptToSend, provider: aiProvider }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate')
      }

      if (data.title) form.setValue('title', data.title, { shouldValidate: true })
      if (data.slug) {
        form.setValue('slug', data.slug, { shouldValidate: true })
        setSlugManuallyEdited(true)
      }
      if (data.excerpt) form.setValue('excerpt', data.excerpt, { shouldValidate: true })
      if (data.content) form.setValue('content', data.content, { shouldValidate: true })

      setShowAiWriter(false)
      toast.success('AI draft generated')
    } catch (err: unknown) {
      setAiError(getErrorMessage(err, 'Failed to generate'))
    } finally {
      setIsGenerating(false)
    }
  }

  const handleGenerateCoverImage = async () => {
    if (!imageAiPrompt.trim()) return
    setIsGeneratingImage(true)
    setAiCoverError(null)
    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: imageAiPrompt }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to generate')

      const res = await fetch(`data:${data.mimeType};base64,${data.base64}`)
      const blob = await res.blob()
      const mimeExt =
        (data.mimeType?.split('/')[1] || 'jpeg').toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg'
      const file = new File(
        [blob],
        `ai-cover-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${mimeExt}`,
        { type: data.mimeType }
      )

      const filePath = `covers/${file.name}`
      const { error: storageError } = await supabase.storage
        .from('portfolio_media')
        .upload(filePath, file)
      if (storageError) throw storageError

      const { data: publicData } = supabase.storage
        .from('portfolio_media')
        .getPublicUrl(filePath)
      form.setValue('cover_image_url', publicData.publicUrl, { shouldValidate: true })
      setShowImageAi(false)
      toast.success('Cover image generated')
    } catch (err: unknown) {
      setAiCoverError(getErrorMessage(err, 'Error generating image'))
    } finally {
      setIsGeneratingImage(false)
    }
  }

  const onSubmit = async (values: BlogPostFormValues) => {
    setIsSubmitting(true)
    setError(null)

    try {
      const result = initialData?.id
        ? await updateBlogPost(initialData.id, values)
        : await createBlogPost(values)

      if (result.error) {
        setError(result.error)
      } else {
        toast.success(initialData?.id ? 'Blog post updated' : 'Blog post created')
        router.push('/admin/blog')
        router.refresh()
      }
    } catch (err: unknown) {
      setError(getErrorMessage(err))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pb-16">
      {error && (
        <div
          role="alert"
          className="rounded-xl border border-adm-danger-border bg-adm-danger-bg p-4 text-sm text-adm-danger-text"
        >
          {error}
        </div>
      )}

      <Card>
        <CardContent className="p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="blog-title" className="adm-label">
                Post Title <span className="text-adm-danger-text">*</span>
              </label>
              <input
                id="blog-title"
                {...form.register('title')}
                onChange={handleTitleChange}
                className="adm-input"
                placeholder="e.g. The Future of Voice AI"
              />
              {form.formState.errors.title && (
                <p className="adm-error">{form.formState.errors.title.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="blog-slug" className="adm-label">
                URL Slug <span className="text-adm-danger-text">*</span>
              </label>
              <input
                id="blog-slug"
                {...form.register('slug', {
                  onChange: () => setSlugManuallyEdited(true),
                })}
                className="adm-input font-mono"
                placeholder="the-future-of-voice-ai"
              />
              {form.formState.errors.slug && (
                <p className="adm-error">{form.formState.errors.slug.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="blog-excerpt" className="adm-label">
              Short Excerpt
            </label>
            <textarea
              id="blog-excerpt"
              {...form.register('excerpt')}
              rows={2}
              className="adm-input"
              placeholder="A brief summary shown on the blog index cards..."
            />
            {form.formState.errors.excerpt && (
              <p className="adm-error">{form.formState.errors.excerpt.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex flex-wrap justify-between items-center gap-2">
              <label htmlFor="blog-content" className="adm-label">
                Content (Markdown) <span className="text-adm-danger-text">*</span>
              </label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowAiWriter(!showAiWriter)}
              >
                <Sparkles className="w-4 h-4 mr-2 text-adm-accent" />
                AI Writer
              </Button>
            </div>

            {showAiWriter && (
              <div className="p-4 bg-adm-accent-soft border border-adm-accent/30 rounded-xl space-y-4">
                <div className="flex flex-wrap justify-between items-center gap-3">
                  <h4 className="text-sm font-semibold text-adm-text flex items-center gap-2">
                    <Bot className="w-4 h-4 text-adm-accent" />
                    Generate Draft with AI
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    <select
                      value={aiContentType}
                      onChange={(e) => setAiContentType(e.target.value)}
                      className="adm-input w-auto"
                    >
                      <option value="SEO Article">SEO Article</option>
                      <option value="Case Study">Case Study</option>
                      <option value="How-To Guide">How-To Guide</option>
                      <option value="Thought Leadership">Thought Leadership</option>
                    </select>
                    <select
                      value={aiProvider}
                      onChange={(e) => setAiProvider(e.target.value)}
                      className="adm-input w-auto"
                    >
                      <option value="openai">OpenAI (GPT-4o)</option>
                      <option value="anthropic">Anthropic (Claude 3 Opus)</option>
                      <option value="gemini">Google (Gemini 2.5 Flash)</option>
                    </select>
                  </div>
                </div>
                <textarea
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="Describe the topic, target audience, and key takeaways..."
                  className="adm-input"
                  rows={3}
                />
                {aiError && <p className="adm-error">{aiError}</p>}
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAiWriter(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleGenerateAI}
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      'Generate Post'
                    )}
                  </Button>
                </div>
              </div>
            )}

            <textarea
              id="blog-content"
              {...form.register('content')}
              rows={14}
              className="adm-input font-mono text-sm leading-relaxed"
              placeholder="# Introduction&#10;&#10;Write your post content here using Markdown..."
            />
            {form.formState.errors.content && (
              <p className="adm-error">{form.formState.errors.content.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardContent className="p-6 space-y-4">
            {showImageAi && (
              <div className="p-4 bg-adm-accent-soft border border-adm-accent/30 rounded-xl space-y-3">
                <h4 className="text-sm font-semibold text-adm-text flex items-center gap-2">
                  <Bot className="w-4 h-4 text-adm-accent" />
                  Generate Cover Image
                </h4>
                <textarea
                  value={imageAiPrompt}
                  onChange={(e) => setImageAiPrompt(e.target.value)}
                  placeholder="Describe the editorial visual style..."
                  className="adm-input"
                  rows={2}
                />
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowImageAi(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleGenerateCoverImage}
                    disabled={isGeneratingImage}
                  >
                    {isGeneratingImage ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      'Generate Image'
                    )}
                  </Button>
                </div>
              </div>
            )}

            <AdminImageUpload
              label="Cover Image (Optional)"
              hint="PNG, JPG, WebP, GIF, or AVIF up to 5 MB."
              folder="blog"
              prefix="blog"
              aspect="video"
              allowManualUrl
              value={form.watch('cover_image_url') || ''}
              onChange={(url) => {
                setAiCoverError(null)
                form.setValue('cover_image_url', url, { shouldValidate: true })
              }}
              error={form.formState.errors.cover_image_url?.message || aiCoverError || undefined}
              extraActions={
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowImageAi(!showImageAi)}
                >
                  <Sparkles className="w-4 h-4 mr-2 text-adm-accent" />
                  AI Generate
                </Button>
              }
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="blog-status" className="adm-label">
                Status
              </label>
              <select
                id="blog-status"
                {...form.register('status')}
                className="adm-input"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="blog-author" className="adm-label">
                Author <span className="text-adm-danger-text">*</span>
              </label>
              <input
                id="blog-author"
                {...form.register('author')}
                className="adm-input"
              />
              {form.formState.errors.author && (
                <p className="adm-error">{form.formState.errors.author.message}</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : initialData?.id ? 'Update Post' : 'Create Post'}
        </Button>
      </div>
    </form>
  )
}
