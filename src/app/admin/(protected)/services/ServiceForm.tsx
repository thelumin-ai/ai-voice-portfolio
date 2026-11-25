'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { serviceSchema, ServiceFormValues } from '@/lib/validations/service'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useAdminToast } from '@/components/admin/AdminToast'
import { getErrorMessage } from '@/lib/errors'
import { createService, updateService } from './actions'

interface ServiceFormProps {
  initialData?: Partial<ServiceFormValues> & { id?: string }
}

export function ServiceForm({ initialData }: ServiceFormProps) {
  const router = useRouter()
  const toast = useAdminToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const normalizedStatus =
    initialData?.status === 'draft' || initialData?.status === 'archived'
      ? initialData.status
      : 'published'

  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      title: initialData?.title ?? '',
      description: initialData?.description ?? '',
      icon_name: initialData?.icon_name ?? 'PhoneIncoming',
      status: normalizedStatus,
      display_order: typeof initialData?.display_order === 'number' ? initialData.display_order : 0,
    },
  })

  const onSubmit = async (values: ServiceFormValues) => {
    setIsSubmitting(true)
    setError(null)

    try {
      const result = initialData?.id
        ? await updateService(initialData.id, values)
        : await createService(values)

      if (result.error) {
        setError(result.error)
      } else {
        toast.success(initialData?.id ? 'Service updated' : 'Service added')
        router.push('/admin/services')
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
            <label htmlFor="service-title" className="adm-label">
              Service Title <span className="text-adm-danger-text">*</span>
            </label>
            <input
              id="service-title"
              {...form.register('title')}
              className="adm-input"
              placeholder="e.g. AI Voice Agents"
            />
            {form.formState.errors.title && (
              <p className="adm-error">{form.formState.errors.title.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="service-description" className="adm-label">
              Description <span className="text-adm-danger-text">*</span>
            </label>
            <textarea
              id="service-description"
              {...form.register('description')}
              rows={3}
              className="adm-input"
              placeholder="Describe what this service delivers..."
            />
            {form.formState.errors.description && (
              <p className="adm-error">{form.formState.errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="service-icon" className="adm-label">
                Lucide Icon Name <span className="text-adm-danger-text">*</span>
              </label>
              <input
                id="service-icon"
                {...form.register('icon_name')}
                className="adm-input"
                placeholder="e.g. PhoneIncoming, UserCheck, Zap"
              />
              <p className="adm-hint">
                Browse icon names at{' '}
                <a
                  href="https://lucide.dev/icons"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-adm-accent hover:underline"
                >
                  lucide.dev
                </a>
                .
              </p>
              {form.formState.errors.icon_name && (
                <p className="adm-error">{form.formState.errors.icon_name.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="service-status" className="adm-label">
                Status
              </label>
              <select id="service-status" {...form.register('status')} className="adm-input">
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
          {isSubmitting ? 'Saving...' : initialData?.id ? 'Update Service' : 'Add Service'}
        </Button>
      </div>
    </form>
  )
}
