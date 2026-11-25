'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { techStackSchema, TechStackFormValues } from '@/lib/validations/techStack'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { AdminImageUpload } from '@/components/admin/AdminImageUpload'
import { useAdminToast } from '@/components/admin/AdminToast'
import { getErrorMessage } from '@/lib/errors'
import { createTechItem, updateTechItem } from './actions'

const PRESET_CATEGORIES = [
  'Voice & Chat Infrastructure',
  'Automation engines',
  'Voice & Text generation',
  'Core intelligence',
  'Integrations',
]

interface TechStackFormProps {
  initialData?: Partial<TechStackFormValues> & { id?: string }
}

export function TechStackForm({ initialData }: TechStackFormProps) {
  const router = useRouter()
  const toast = useAdminToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const initialCategory = initialData?.category ?? ''
  const initialCategoryIsPreset = !initialCategory || PRESET_CATEGORIES.includes(initialCategory)
  const [isOtherCategory, setIsOtherCategory] = useState(!initialCategoryIsPreset)

  const normalizedStatus =
    initialData?.status === 'draft' || initialData?.status === 'archived'
      ? initialData.status
      : 'published'

  const form = useForm<TechStackFormValues>({
    resolver: zodResolver(techStackSchema),
    defaultValues: {
      id: initialData?.id,
      name: initialData?.name ?? '',
      category: initialCategory,
      icon_url: initialData?.icon_url ?? '',
      status: normalizedStatus,
      display_order: typeof initialData?.display_order === 'number' ? initialData.display_order : 0,
    },
  })

  const onSubmit = async (values: TechStackFormValues) => {
    setIsSubmitting(true)
    setError(null)

    try {
      const result = initialData?.id
        ? await updateTechItem(initialData.id, values)
        : await createTechItem(values)

      if (result.error) {
        setError(result.error)
      } else {
        toast.success(initialData?.id ? 'Tool updated' : 'Tool added')
        router.push('/admin/tech-stack')
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
              <label htmlFor="tech-name" className="adm-label">
                Tool Name <span className="text-adm-danger-text">*</span>
              </label>
              <input
                id="tech-name"
                {...form.register('name')}
                className="adm-input"
                placeholder="e.g. Vapi.ai, n8n, Retell AI"
              />
              {form.formState.errors.name && (
                <p className="adm-error">{form.formState.errors.name.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="tech-category" className="adm-label">
                Category <span className="text-adm-danger-text">*</span>
              </label>
              {!isOtherCategory ? (
                <select
                  id="tech-category"
                  className="adm-input"
                  value={form.watch('category') || ''}
                  onChange={(e) => {
                    if (e.target.value === 'Other') {
                      setIsOtherCategory(true)
                      form.setValue('category', '', { shouldValidate: true })
                    } else {
                      form.setValue('category', e.target.value, { shouldValidate: true })
                    }
                  }}
                >
                  <option value="" disabled>
                    Select a category
                  </option>
                  {PRESET_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                  <option value="Other">Other (Custom)</option>
                </select>
              ) : (
                <div className="flex gap-2">
                  <input
                    id="tech-category"
                    {...form.register('category')}
                    className="adm-input flex-1"
                    placeholder="Type custom category..."
                    autoFocus
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsOtherCategory(false)
                      form.setValue('category', PRESET_CATEGORIES[0], { shouldValidate: true })
                    }}
                  >
                    Presets
                  </Button>
                </div>
              )}
              {form.formState.errors.category && (
                <p className="adm-error">{form.formState.errors.category.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-1.5 max-w-xs">
            <label htmlFor="tech-status" className="adm-label">
              Status
            </label>
            <select id="tech-status" {...form.register('status')} className="adm-input">
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div className="pt-2 border-t border-adm-border">
            <AdminImageUpload
              label="Tool Logo / Icon (Optional)"
              hint="Upload a PNG/WebP icon (max 5 MB) or paste an image URL."
              folder="icons"
              prefix="icon"
              aspect="square"
              allowManualUrl
              value={form.watch('icon_url') || ''}
              onChange={(url) => form.setValue('icon_url', url, { shouldValidate: true })}
              error={form.formState.errors.icon_url?.message}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : initialData?.id ? 'Update Tool' : 'Add Tool'}
        </Button>
      </div>
    </form>
  )
}
