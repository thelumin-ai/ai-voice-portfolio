'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { testimonialSchema, TestimonialFormValues } from '@/lib/validations/testimonial'
import { createTestimonial, updateTestimonial } from './actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useRouter } from 'next/navigation'

interface TestimonialFormProps {
  initialData?: TestimonialFormValues & { id: string }
}

export function TestimonialForm({ initialData }: TestimonialFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<TestimonialFormValues>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: initialData || {
      client_name: '',
      company: '',
      content: '',
      image_url: '',
      video_url: '',
      rating: 5,
      status: 'published',
      display_order: 0,
    },
  })

  const onSubmit = async (values: TestimonialFormValues) => {
    setIsSubmitting(true)
    setError(null)
    
    try {
      let result
      if (initialData?.id) {
        result = await updateTestimonial(initialData.id, values)
      } else {
        result = await createTestimonial(values)
      }

      if (result.error) {
        setError(result.error)
      } else {
        router.push('/admin/testimonials')
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
              <label className="text-sm font-medium">Client Name</label>
              <input
                {...form.register('client_name')}
                className="w-full px-3 py-2 border rounded-md dark:bg-zinc-900 dark:border-zinc-700"
                placeholder="e.g. John Doe"
              />
              {form.formState.errors.client_name && (
                <p className="text-sm text-red-500">{form.formState.errors.client_name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Company (Optional)</label>
              <input
                {...form.register('company')}
                className="w-full px-3 py-2 border rounded-md dark:bg-zinc-900 dark:border-zinc-700"
                placeholder="e.g. Acme Corp"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Testimonial Content</label>
            <textarea
              {...form.register('content')}
              rows={5}
              className="w-full px-3 py-2 border rounded-md dark:bg-zinc-900 dark:border-zinc-700"
              placeholder="What did they say?"
            />
            {form.formState.errors.content && (
              <p className="text-sm text-red-500">{form.formState.errors.content.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Rating (1-5)</label>
              <input
                type="number"
                min="1"
                max="5"
                {...form.register('rating', { valueAsNumber: true })}
                className="w-full px-3 py-2 border rounded-md dark:bg-zinc-900 dark:border-zinc-700"
              />
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
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Video URL (Optional)</label>
              <input
                {...form.register('video_url')}
                className="w-full px-3 py-2 border rounded-md dark:bg-zinc-900 dark:border-zinc-700"
                placeholder="https://youtube.com/..."
              />
              {form.formState.errors.video_url && (
                <p className="text-sm text-red-500">{form.formState.errors.video_url.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Client Picture URL (Optional)</label>
              <input
                {...form.register('image_url')}
                className="w-full px-3 py-2 border rounded-md dark:bg-zinc-900 dark:border-zinc-700"
                placeholder="https://images.unsplash.com/..."
              />
              {form.formState.errors.image_url && (
                <p className="text-sm text-red-500">{form.formState.errors.image_url.message}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : initialData ? 'Update Testimonial' : 'Create Testimonial'}
        </Button>
      </div>
    </form>
  )
}
