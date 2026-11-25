'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { testimonialSchema, TestimonialFormValues } from '@/lib/validations/testimonial'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { AdminImageUpload } from '@/components/admin/AdminImageUpload'
import { useAdminToast } from '@/components/admin/AdminToast'
import { getErrorMessage } from '@/lib/errors'
import { createTestimonial, updateTestimonial } from './actions'

interface TestimonialFormProps {
  initialData?: Partial<TestimonialFormValues> & { id?: string }
}

export function TestimonialForm({ initialData }: TestimonialFormProps) {
  const router = useRouter()
  const toast = useAdminToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const normalizedStatus =
    initialData?.status === 'draft' || initialData?.status === 'archived'
      ? initialData.status
      : 'published'

  const form = useForm<TestimonialFormValues>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: {
      id: initialData?.id,
      client_name: initialData?.client_name ?? '',
      company: initialData?.company ?? '',
      content: initialData?.content ?? '',
      image_url: initialData?.image_url ?? '',
      video_url: initialData?.video_url ?? '',
      rating: typeof initialData?.rating === 'number' ? initialData.rating : 5,
      status: normalizedStatus,
      display_order: typeof initialData?.display_order === 'number' ? initialData.display_order : 0,
    },
  })

  const onSubmit = async (values: TestimonialFormValues) => {
    setIsSubmitting(true)
    setError(null)

    try {
      const result = initialData?.id
        ? await updateTestimonial(initialData.id, values)
        : await createTestimonial(values)

      if (result.error) {
        setError(result.error)
      } else {
        toast.success(initialData?.id ? 'Testimonial updated' : 'Testimonial created')
        router.push('/admin/testimonials')
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
              <label htmlFor="testimonial-client" className="adm-label">
                Client Name <span className="text-adm-danger-text">*</span>
              </label>
              <input
                id="testimonial-client"
                {...form.register('client_name')}
                className="adm-input"
                placeholder="e.g. Sarah Jenkins"
              />
              {form.formState.errors.client_name && (
                <p className="adm-error">{form.formState.errors.client_name.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="testimonial-company" className="adm-label">
                Company / Role (Optional)
              </label>
              <input
                id="testimonial-company"
                {...form.register('company')}
                className="adm-input"
                placeholder="e.g. Elevation Real Estate"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="testimonial-content" className="adm-label">
              Testimonial Quote <span className="text-adm-danger-text">*</span>
            </label>
            <textarea
              id="testimonial-content"
              {...form.register('content')}
              rows={5}
              className="adm-input"
              placeholder="What measurable impact did your AI voice system deliver?"
            />
            {form.formState.errors.content && (
              <p className="adm-error">{form.formState.errors.content.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="testimonial-rating" className="adm-label">
                Rating (1–5)
              </label>
              <input
                id="testimonial-rating"
                type="number"
                min="1"
                max="5"
                {...form.register('rating', {
                  setValueAs: (v) =>
                    v === '' || v === null || Number.isNaN(Number(v)) ? undefined : Number(v),
                })}
                className="adm-input"
              />
              {form.formState.errors.rating && (
                <p className="adm-error">{form.formState.errors.rating.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="testimonial-status" className="adm-label">
                Status
              </label>
              <select
                id="testimonial-status"
                {...form.register('status')}
                className="adm-input"
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="testimonial-video" className="adm-label">
                Video URL (Optional)
              </label>
              <input
                id="testimonial-video"
                {...form.register('video_url')}
                className="adm-input"
                placeholder="https://youtube.com/..."
              />
              {form.formState.errors.video_url && (
                <p className="adm-error">{form.formState.errors.video_url.message}</p>
              )}
            </div>
          </div>

          <div className="pt-2 border-t border-adm-border">
            <AdminImageUpload
              label="Client Avatar (Optional)"
              hint="Upload an avatar photo or paste a safe http(s) URL."
              folder="testimonials"
              prefix="avatar"
              aspect="avatar"
              allowManualUrl
              placeholderUrl="https://images.unsplash.com/..."
              value={form.watch('image_url') || ''}
              onChange={(url) => form.setValue('image_url', url, { shouldValidate: true })}
              error={form.formState.errors.image_url?.message}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : initialData?.id ? 'Update Testimonial' : 'Create Testimonial'}
        </Button>
      </div>
    </form>
  )
}
