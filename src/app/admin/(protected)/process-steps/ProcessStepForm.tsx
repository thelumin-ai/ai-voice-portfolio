'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { processStepSchema, ProcessStepFormValues } from '@/lib/validations/processStep'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useAdminToast } from '@/components/admin/AdminToast'
import { getErrorMessage } from '@/lib/errors'
import { createProcessStep, updateProcessStep } from './actions'

interface ProcessStepFormProps {
  initialData?: Partial<ProcessStepFormValues> & { id?: string }
}

export function ProcessStepForm({ initialData }: ProcessStepFormProps) {
  const router = useRouter()
  const toast = useAdminToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const normalizedStatus =
    initialData?.status === 'draft' || initialData?.status === 'archived'
      ? initialData.status
      : 'published'

  const form = useForm<ProcessStepFormValues>({
    resolver: zodResolver(processStepSchema),
    defaultValues: {
      id: initialData?.id,
      title: initialData?.title ?? '',
      description: initialData?.description ?? '',
      icon_url: initialData?.icon_url ?? '',
      status: normalizedStatus,
      display_order: typeof initialData?.display_order === 'number' ? initialData.display_order : 0,
    },
  })

  const onSubmit = async (values: ProcessStepFormValues) => {
    setIsSubmitting(true)
    setError(null)

    try {
      const result = initialData?.id
        ? await updateProcessStep(initialData.id, values)
        : await createProcessStep(values)

      if (result.error) {
        setError(result.error)
      } else {
        toast.success(initialData?.id ? 'Process step updated' : 'Process step created')
        router.push('/admin/process-steps')
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
              <label htmlFor="step-title" className="adm-label">
                Step Title <span className="text-adm-danger-text">*</span>
              </label>
              <input
                id="step-title"
                {...form.register('title')}
                className="adm-input"
                placeholder="e.g. Discovery & Call Audit"
              />
              {form.formState.errors.title && (
                <p className="adm-error">{form.formState.errors.title.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="step-status" className="adm-label">
                Status
              </label>
              <select id="step-status" {...form.register('status')} className="adm-input">
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="step-description" className="adm-label">
              Description <span className="text-adm-danger-text">*</span>
            </label>
            <textarea
              id="step-description"
              {...form.register('description')}
              rows={4}
              className="adm-input"
              placeholder="Describe what happens in this stage..."
            />
            {form.formState.errors.description && (
              <p className="adm-error">{form.formState.errors.description.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="step-icon" className="adm-label">
              Icon Name or Image URL (Optional)
            </label>
            <input
              id="step-icon"
              {...form.register('icon_url')}
              className="adm-input"
              placeholder="e.g. phone-call, cpu, sparkles, or https://..."
            />
            {form.formState.errors.icon_url && (
              <p className="adm-error">{form.formState.errors.icon_url.message}</p>
            )}
            <p className="adm-hint">
              Enter a Lucide icon slug or a safe http(s) image URL.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : initialData?.id ? 'Update Step' : 'Create Step'}
        </Button>
      </div>
    </form>
  )
}
