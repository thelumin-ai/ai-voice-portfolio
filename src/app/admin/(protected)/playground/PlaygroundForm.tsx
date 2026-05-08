'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { playgroundAppSchema, PlaygroundAppFormValues } from '@/lib/validations/playground'
import { createPlaygroundApp, updatePlaygroundApp } from './actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useRouter } from 'next/navigation'

interface PlaygroundFormProps {
  initialData?: PlaygroundAppFormValues & { id: string }
}

export function PlaygroundForm({ initialData }: PlaygroundFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<PlaygroundAppFormValues>({
    resolver: zodResolver(playgroundAppSchema),
    defaultValues: initialData || {
      title: '',
      description: '',
      category: '',
      embed_url: '',
      status: 'published',
      display_order: 0,
    },
  })

  const onSubmit = async (values: PlaygroundAppFormValues) => {
    setIsSubmitting(true)
    setError(null)
    
    try {
      let result
      if (initialData?.id) {
        result = await updatePlaygroundApp(initialData.id, values)
      } else {
        result = await createPlaygroundApp(values)
      }

      if (result.error) {
        setError(result.error)
      } else {
        router.push('/admin/playground')
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">App Title</label>
              <input
                {...form.register('title')}
                className="w-full px-3 py-2 border rounded-md dark:bg-zinc-900 dark:border-zinc-700"
                placeholder="e.g. AI Voice Cloning Demo"
              />
              {form.formState.errors.title && (
                <p className="text-sm text-red-500">{form.formState.errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <input
                {...form.register('category')}
                className="w-full px-3 py-2 border rounded-md dark:bg-zinc-900 dark:border-zinc-700"
                placeholder="e.g. Voice AI"
              />
              {form.formState.errors.category && (
                <p className="text-sm text-red-500">{form.formState.errors.category.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <textarea
              {...form.register('description')}
              rows={4}
              className="w-full px-3 py-2 border rounded-md dark:bg-zinc-900 dark:border-zinc-700"
              placeholder="Describe what this demo does..."
            />
            {form.formState.errors.description && (
              <p className="text-sm text-red-500">{form.formState.errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Embed URL</label>
              <input
                {...form.register('embed_url')}
                className="w-full px-3 py-2 border rounded-md dark:bg-zinc-900 dark:border-zinc-700"
                placeholder="https://your-voiceflow-or-elevenlabs-url.com"
              />
              <p className="text-xs text-gray-500">The URL to the interactive demo iframe.</p>
              {form.formState.errors.embed_url && (
                <p className="text-sm text-red-500">{form.formState.errors.embed_url.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <select
                {...form.register('status')}
                className="w-full px-3 py-2 border rounded-md dark:bg-zinc-900 dark:border-zinc-700"
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : initialData ? 'Update App' : 'Create App'}
        </Button>
      </div>
    </form>
  )
}
