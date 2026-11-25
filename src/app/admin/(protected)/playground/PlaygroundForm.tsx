'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { playgroundAppSchema, PlaygroundAppFormValues } from '@/lib/validations/playground'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useAdminToast } from '@/components/admin/AdminToast'
import { getErrorMessage } from '@/lib/errors'
import { createPlaygroundApp, updatePlaygroundApp } from './actions'

interface PlaygroundFormProps {
  initialData?: Partial<PlaygroundAppFormValues> & { id?: string }
}

export function PlaygroundForm({ initialData }: PlaygroundFormProps) {
  const router = useRouter()
  const toast = useAdminToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const normalizedStatus =
    initialData?.status === 'draft' || initialData?.status === 'archived'
      ? initialData.status
      : 'published'

  const form = useForm<PlaygroundAppFormValues>({
    resolver: zodResolver(playgroundAppSchema),
    defaultValues: {
      id: initialData?.id,
      title: initialData?.title ?? '',
      description: initialData?.description ?? '',
      category: initialData?.category ?? '',
      embed_url: initialData?.embed_url ?? '',
      status: normalizedStatus,
      display_order: typeof initialData?.display_order === 'number' ? initialData.display_order : 0,
    },
  })

  const onSubmit = async (values: PlaygroundAppFormValues) => {
    setIsSubmitting(true)
    setError(null)

    try {
      const result = initialData?.id
        ? await updatePlaygroundApp(initialData.id, values)
        : await createPlaygroundApp(values)

      if (result.error) {
        setError(result.error)
      } else {
        toast.success(initialData?.id ? 'Playground app updated' : 'Playground app created')
        router.push('/admin/playground')
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
              <label htmlFor="pg-title" className="adm-label">
                App Title <span className="text-adm-danger-text">*</span>
              </label>
              <input
                id="pg-title"
                {...form.register('title')}
                className="adm-input"
                placeholder="e.g. Real Estate Speed-to-Lead Agent"
              />
              {form.formState.errors.title && (
                <p className="adm-error">{form.formState.errors.title.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="pg-category" className="adm-label">
                Category <span className="text-adm-danger-text">*</span>
              </label>
              <input
                id="pg-category"
                {...form.register('category')}
                className="adm-input"
                placeholder="e.g. Voice AI, Receptionist, SDR"
              />
              {form.formState.errors.category && (
                <p className="adm-error">{form.formState.errors.category.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="pg-description" className="adm-label">
              Description <span className="text-adm-danger-text">*</span>
            </label>
            <textarea
              id="pg-description"
              {...form.register('description')}
              rows={4}
              className="adm-input"
              placeholder="Explain what visitors can try in this demo..."
            />
            {form.formState.errors.description && (
              <p className="adm-error">{form.formState.errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="pg-embed-url" className="adm-label">
                Interactive Embed URL
              </label>
              <input
                id="pg-embed-url"
                {...form.register('embed_url')}
                className="adm-input"
                placeholder="https://..."
              />
              <p className="adm-hint">Public https:// URL loaded inside the playground iframe.</p>
              {form.formState.errors.embed_url && (
                <p className="adm-error">{form.formState.errors.embed_url.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="pg-status" className="adm-label">
                Status
              </label>
              <select id="pg-status" {...form.register('status')} className="adm-input">
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : initialData?.id ? 'Update App' : 'Create App'}
        </Button>
      </div>
    </form>
  )
}
