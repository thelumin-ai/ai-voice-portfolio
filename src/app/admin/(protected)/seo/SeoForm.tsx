'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { seoSchema, SeoFormValues } from '@/lib/validations/seo'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { AdminImageUpload } from '@/components/admin/AdminImageUpload'
import { useAdminToast } from '@/components/admin/AdminToast'
import { getErrorMessage } from '@/lib/errors'
import { createSeoSetting, updateSeoSetting } from './actions'

interface SeoFormProps {
  initialData?: Partial<SeoFormValues> & { id?: string }
}

export function SeoForm({ initialData }: SeoFormProps) {
  const router = useRouter()
  const toast = useAdminToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<SeoFormValues>({
    resolver: zodResolver(seoSchema),
    defaultValues: {
      id: initialData?.id,
      page_path: initialData?.page_path ?? '/',
      title: initialData?.title ?? '',
      description: initialData?.description ?? '',
      keywords: initialData?.keywords ?? '',
      og_image_url: initialData?.og_image_url ?? '',
    },
  })

  const onSubmit = async (values: SeoFormValues) => {
    setIsSubmitting(true)
    setError(null)

    try {
      const result = initialData?.id
        ? await updateSeoSetting(initialData.id, values)
        : await createSeoSetting(values)

      if (result.error) {
        setError(result.error)
      } else {
        toast.success(initialData?.id ? 'SEO route updated' : 'SEO route created')
        router.push('/admin/seo')
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
          <div className="space-y-1.5">
            <label htmlFor="seo-path" className="adm-label">
              Page Path (Route) <span className="text-adm-danger-text">*</span>
            </label>
            <input
              id="seo-path"
              {...form.register('page_path')}
              className="adm-input font-mono"
              placeholder="e.g. /, /playground, /blog"
            />
            {form.formState.errors.page_path && (
              <p className="adm-error">{form.formState.errors.page_path.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="seo-title" className="adm-label">
              Meta Title <span className="text-adm-danger-text">*</span>
            </label>
            <input
              id="seo-title"
              {...form.register('title')}
              className="adm-input"
              placeholder="e.g. Abimbola | AI Voice Agent & Automation Architect"
            />
            {form.formState.errors.title && (
              <p className="adm-error">{form.formState.errors.title.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="seo-description" className="adm-label">
              Meta Description <span className="text-adm-danger-text">*</span>
            </label>
            <textarea
              id="seo-description"
              {...form.register('description')}
              rows={3}
              className="adm-input"
              placeholder="Concise search engine snippet (140–160 characters recommended)."
            />
            {form.formState.errors.description && (
              <p className="adm-error">{form.formState.errors.description.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="seo-keywords" className="adm-label">
              Keywords (comma separated)
            </label>
            <input
              id="seo-keywords"
              {...form.register('keywords')}
              className="adm-input"
              placeholder="e.g. AI voice agents, Vapi, Retell AI, automation"
            />
          </div>

          <div className="pt-2 border-t border-adm-border">
            <AdminImageUpload
              label="OpenGraph Preview Image (Optional)"
              hint="Recommended 1200x630 JPG/PNG/WebP for social link previews."
              folder="seo"
              prefix="og"
              aspect="video"
              allowManualUrl
              value={form.watch('og_image_url') || ''}
              onChange={(url) => form.setValue('og_image_url', url, { shouldValidate: true })}
              error={form.formState.errors.og_image_url?.message}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : initialData?.id ? 'Update SEO' : 'Create SEO Route'}
        </Button>
      </div>
    </form>
  )
}
