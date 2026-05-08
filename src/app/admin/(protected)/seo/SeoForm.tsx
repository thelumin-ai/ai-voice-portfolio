'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { seoSchema, SeoFormValues } from '@/lib/validations/seo'
import { createSeoSetting, updateSeoSetting } from './actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import { UploadCloud } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface SeoFormProps {
  initialData?: SeoFormValues & { id: string }
}

export function SeoForm({ initialData }: SeoFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const form = useForm<SeoFormValues>({
    resolver: zodResolver(seoSchema),
    defaultValues: initialData || {
      page_path: '/',
      title: '',
      description: '',
      keywords: '',
      og_image_url: '',
    },
  })

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `seo/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('portfolio_media')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data } = supabase.storage.from('portfolio_media').getPublicUrl(filePath)
      form.setValue('og_image_url', data.publicUrl)
    } catch (error: any) {
      alert(`Error uploading image: ${error.message}`)
    }
  }

  const onSubmit = async (values: SeoFormValues) => {
    setIsSubmitting(true)
    setError(null)
    
    try {
      let result
      if (initialData?.id) {
        result = await updateSeoSetting(initialData.id, values)
      } else {
        result = await createSeoSetting(values)
      }

      if (result.error) {
        setError(result.error)
      } else {
        router.push('/admin/seo')
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
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Page Path (Route)</label>
            <input
              {...form.register('page_path')}
              className="w-full px-3 py-2 border rounded-md dark:bg-zinc-900 dark:border-zinc-700 font-mono"
              placeholder="e.g. /, /about, /portfolio"
            />
            {form.formState.errors.page_path && (
              <p className="text-sm text-red-500">{form.formState.errors.page_path.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Meta Title</label>
            <input
              {...form.register('title')}
              className="w-full px-3 py-2 border rounded-md dark:bg-zinc-900 dark:border-zinc-700"
              placeholder="e.g. AI Voice Portfolio | Home"
            />
            {form.formState.errors.title && (
              <p className="text-sm text-red-500">{form.formState.errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Meta Description</label>
            <textarea
              {...form.register('description')}
              rows={3}
              className="w-full px-3 py-2 border rounded-md dark:bg-zinc-900 dark:border-zinc-700"
            />
            {form.formState.errors.description && (
              <p className="text-sm text-red-500">{form.formState.errors.description.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Keywords (comma separated)</label>
            <input
              {...form.register('keywords')}
              className="w-full px-3 py-2 border rounded-md dark:bg-zinc-900 dark:border-zinc-700"
              placeholder="e.g. AI voice, elevenlabs, automation"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">OpenGraph Image (Optional)</label>
            <div className="flex items-center gap-4">
              {form.watch('og_image_url') && (
                <div className="w-32 h-20 rounded-md overflow-hidden border dark:border-zinc-700">
                  <img src={form.watch('og_image_url')} alt="OG Image" className="w-full h-full object-cover" />
                </div>
              )}
              <label className="cursor-pointer flex items-center justify-center px-4 py-2 border-2 border-dashed border-gray-300 dark:border-zinc-700 rounded-md hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
                <UploadCloud className="w-5 h-5 mr-2" />
                <span>Upload OG Image</span>
                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
              </label>
              <input type="hidden" {...form.register('og_image_url')} />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : initialData ? 'Update SEO' : 'Create SEO Route'}
        </Button>
      </div>
    </form>
  )
}
