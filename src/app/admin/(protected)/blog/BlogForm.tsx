'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { blogPostSchema, BlogPostFormValues } from '@/lib/validations/blog'
import { createBlogPost, updateBlogPost } from './actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import { UploadCloud, Bot, Loader2, Sparkles } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface BlogFormProps {
  initialData?: BlogPostFormValues & { id: string }
}

export function BlogForm({ initialData }: BlogFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const [showAiWriter, setShowAiWriter] = useState(false)
  const [aiPrompt, setAiPrompt] = useState('')
  const [aiProvider, setAiProvider] = useState('openai')
  const [isGenerating, setIsGenerating] = useState(false)
  const [aiError, setAiError] = useState<string | null>(null)

  const form = useForm<BlogPostFormValues>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: initialData || {
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      cover_image_url: '',
      author: 'Admin',
      status: 'draft',
    },
  })

  // Auto-generate slug from title if empty
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value
    form.setValue('title', title)
    
    if (!form.getValues('slug') && !initialData) {
      const generatedSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
      form.setValue('slug', generatedSlug)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `blog/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('portfolio_media')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data } = supabase.storage.from('portfolio_media').getPublicUrl(filePath)
      form.setValue('cover_image_url', data.publicUrl)
    } catch (error: any) {
      alert(`Error uploading image: ${error.message}`)
    }
  }

  const handleGenerateAI = async () => {
    if (!aiPrompt.trim()) {
      setAiError("Please enter a prompt")
      return
    }
    
    setIsGenerating(true)
    setAiError(null)

    try {
      const response = await fetch('/api/generate-blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiPrompt, provider: aiProvider })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate')
      }

      form.setValue('content', data.content)
      setShowAiWriter(false)
    } catch (err: any) {
      setAiError(err.message)
    } finally {
      setIsGenerating(false)
    }
  }

  const onSubmit = async (values: BlogPostFormValues) => {
    setIsSubmitting(true)
    setError(null)
    
    try {
      let result
      if (initialData?.id) {
        result = await updateBlogPost(initialData.id, values)
      } else {
        result = await createBlogPost(values)
      }

      if (result.error) {
        setError(result.error)
      } else {
        router.push('/admin/blog')
        router.refresh()
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 pb-20">
      {error && <div className="p-4 bg-red-100 text-red-800 rounded-md">{error}</div>}

      <Card>
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Post Title</label>
              <input
                {...form.register('title')}
                onChange={handleTitleChange}
                className="w-full px-3 py-2 border rounded-md dark:bg-zinc-900 dark:border-zinc-700 font-medium text-lg"
                placeholder="e.g. The Future of Voice AI"
              />
              {form.formState.errors.title && (
                <p className="text-sm text-red-500">{form.formState.errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">URL Slug</label>
              <input
                {...form.register('slug')}
                className="w-full px-3 py-2 border rounded-md dark:bg-zinc-900 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-950 text-gray-500"
                placeholder="the-future-of-voice-ai"
              />
              {form.formState.errors.slug && (
                <p className="text-sm text-red-500">{form.formState.errors.slug.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Short Excerpt</label>
            <textarea
              {...form.register('excerpt')}
              rows={2}
              className="w-full px-3 py-2 border rounded-md dark:bg-zinc-900 dark:border-zinc-700"
              placeholder="A brief summary for the blog preview card..."
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">Content (Markdown Support)</label>
              <Button type="button" variant="outline" size="sm" onClick={() => setShowAiWriter(!showAiWriter)} className="text-purple-500 border-purple-200 hover:bg-purple-50 dark:hover:bg-purple-900/20">
                <Sparkles className="w-4 h-4 mr-2" /> AI Writer
              </Button>
            </div>
            
            {showAiWriter && (
              <div className="p-4 bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-900/30 rounded-lg space-y-4 mb-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold text-purple-700 dark:text-purple-400 flex items-center"><Bot className="w-4 h-4 mr-2" /> Generate with AI</h4>
                  <select 
                    value={aiProvider} 
                    onChange={(e) => setAiProvider(e.target.value)}
                    className="text-sm px-2 py-1 border rounded dark:bg-zinc-900 dark:border-zinc-700"
                  >
                    <option value="openai">OpenAI (GPT-4o)</option>
                    <option value="anthropic">Anthropic (Claude 3 Opus)</option>
                    <option value="gemini">Google (Gemini 2.5 Flash)</option>
                  </select>
                </div>
                <textarea 
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="e.g. Write a 1000-word blog post about how AI voice agents are replacing traditional call centers in the real estate industry. Use a professional but engaging tone."
                  className="w-full px-3 py-2 border rounded-md dark:bg-zinc-900 dark:border-zinc-700 text-sm"
                  rows={3}
                />
                {aiError && <p className="text-xs text-red-500">{aiError}</p>}
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="ghost" size="sm" onClick={() => setShowAiWriter(false)}>Cancel</Button>
                  <Button type="button" size="sm" className="bg-purple-600 hover:bg-purple-700 text-white" onClick={handleGenerateAI} disabled={isGenerating}>
                    {isGenerating ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating...</> : 'Generate Post'}
                  </Button>
                </div>
              </div>
            )}

            <textarea
              {...form.register('content')}
              rows={15}
              className="w-full px-3 py-2 border rounded-md dark:bg-zinc-900 dark:border-zinc-700 font-mono text-sm leading-relaxed"
              placeholder="# Introduction&#10;&#10;Write your post content here using Markdown..."
            />
            {form.formState.errors.content && (
              <p className="text-sm text-red-500">{form.formState.errors.content.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardContent className="p-6 space-y-4">
            <label className="text-sm font-medium">Cover Image</label>
            <div className="flex items-center gap-4">
              <label className="cursor-pointer flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-zinc-700 rounded-md hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
                <UploadCloud className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">Upload Image</span>
                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
              </label>
            </div>
            {form.watch('cover_image_url') && (
              <div className="relative rounded-md overflow-hidden border dark:border-zinc-800 h-48 mt-4">
                <img src={form.watch('cover_image_url')} alt="Cover" className="w-full h-full object-cover" />
              </div>
            )}
            <input type="hidden" {...form.register('cover_image_url')} />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <select
                {...form.register('status')}
                className="w-full px-3 py-2 border rounded-md dark:bg-zinc-900 dark:border-zinc-700 font-medium"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Author</label>
              <input
                {...form.register('author')}
                className="w-full px-3 py-2 border rounded-md dark:bg-zinc-900 dark:border-zinc-700"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : initialData ? 'Update Post' : 'Create Post'}
        </Button>
      </div>
    </form>
  )
}
