'use client'

import { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { Plus, Trash2 } from 'lucide-react'
import { useCaseSchema, UseCaseFormValues } from '@/lib/validations/useCase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AdminImageUpload } from '@/components/admin/AdminImageUpload'
import { useAdminToast } from '@/components/admin/AdminToast'
import { getErrorMessage } from '@/lib/errors'
import { createUseCase, updateUseCase } from './actions'

const ICON_OPTIONS = [
  'Home',
  'Sun',
  'Hammer',
  'Briefcase',
  'BarChart',
  'Headphones',
  'PhoneIncoming',
  'PhoneOutgoing',
  'UserCheck',
  'Building',
  'Car',
  'ShoppingCart',
  'Heart',
  'GraduationCap',
  'Utensils',
  'Plane',
]

interface UseCaseFormProps {
  initialData?: Partial<UseCaseFormValues> & { id?: string }
}

export function UseCaseForm({ initialData }: UseCaseFormProps) {
  const router = useRouter()
  const toast = useAdminToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const initialFeatures =
    Array.isArray(initialData?.features) && initialData.features.length > 0
      ? initialData.features
      : ['']
  const [features, setFeatures] = useState<string[]>(initialFeatures)

  const normalizedStatus =
    initialData?.status === 'draft' || initialData?.status === 'archived'
      ? initialData.status
      : 'published'

  const form = useForm<UseCaseFormValues>({
    resolver: zodResolver(useCaseSchema),
    defaultValues: {
      industry_slug: initialData?.industry_slug ?? '',
      name: initialData?.name ?? '',
      headline: initialData?.headline ?? '',
      subhead: initialData?.subhead ?? '',
      problem: initialData?.problem ?? '',
      features: initialFeatures,
      flow:
        Array.isArray(initialData?.flow) && initialData.flow.length > 0
          ? initialData.flow
          : [{ step: '', desc: '' }],
      results:
        Array.isArray(initialData?.results) && initialData.results.length > 0
          ? initialData.results
          : [{ stat: '', label: '' }],
      cover_image_url: initialData?.cover_image_url ?? '',
      icon_name: initialData?.icon_name ?? 'Briefcase',
      status: normalizedStatus,
      display_order: typeof initialData?.display_order === 'number' ? initialData.display_order : 0,
    },
  })

  const { fields: flowFields, append: appendFlow, remove: removeFlow } = useFieldArray({
    control: form.control,
    name: 'flow',
  })

  const { fields: resultFields, append: appendResult, remove: removeResult } = useFieldArray({
    control: form.control,
    name: 'results',
  })

  const onSubmit = async (values: UseCaseFormValues) => {
    setIsSubmitting(true)
    setError(null)

    const payload: UseCaseFormValues = {
      ...values,
      features: features.filter((f) => f.trim() !== ''),
    }

    try {
      const result = initialData?.id
        ? await updateUseCase(initialData.id, payload)
        : await createUseCase(payload)

      if (result.error) {
        setError(result.error)
      } else {
        toast.success(initialData?.id ? 'Use case updated' : 'Use case created')
        router.push('/admin/use-cases')
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
              <label htmlFor="uc-name" className="adm-label">
                Industry Name <span className="text-adm-danger-text">*</span>
              </label>
              <input
                id="uc-name"
                {...form.register('name')}
                className="adm-input"
                placeholder="e.g. Real Estate"
              />
              {form.formState.errors.name && (
                <p className="adm-error">{form.formState.errors.name.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <label htmlFor="uc-slug" className="adm-label">
                Industry Slug (URL) <span className="text-adm-danger-text">*</span>
              </label>
              <input
                id="uc-slug"
                {...form.register('industry_slug')}
                className="adm-input font-mono"
                placeholder="e.g. real-estate"
              />
              {form.formState.errors.industry_slug && (
                <p className="adm-error">{form.formState.errors.industry_slug.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="uc-headline" className="adm-label">
              Headline <span className="text-adm-danger-text">*</span>
            </label>
            <input id="uc-headline" {...form.register('headline')} className="adm-input" />
            {form.formState.errors.headline && (
              <p className="adm-error">{form.formState.errors.headline.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="uc-subhead" className="adm-label">
              Subhead <span className="text-adm-danger-text">*</span>
            </label>
            <input id="uc-subhead" {...form.register('subhead')} className="adm-input" />
            {form.formState.errors.subhead && (
              <p className="adm-error">{form.formState.errors.subhead.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="uc-problem" className="adm-label">
              The Problem <span className="text-adm-danger-text">*</span>
            </label>
            <textarea
              id="uc-problem"
              {...form.register('problem')}
              rows={3}
              className="adm-input"
            />
            {form.formState.errors.problem && (
              <p className="adm-error">{form.formState.errors.problem.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="uc-icon" className="adm-label">
                Icon
              </label>
              <select id="uc-icon" {...form.register('icon_name')} className="adm-input">
                {ICON_OPTIONS.map((icon) => (
                  <option key={icon} value={icon}>
                    {icon}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label htmlFor="uc-status" className="adm-label">
                Status
              </label>
              <select id="uc-status" {...form.register('status')} className="adm-input">
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          <div className="pt-2 border-t border-adm-border">
            <AdminImageUpload
              label="Cover Image (Optional)"
              hint="Upload a banner image or paste an https:// URL."
              folder="use-cases"
              prefix="cover"
              aspect="video"
              allowManualUrl
              value={form.watch('cover_image_url') || ''}
              onChange={(url) =>
                form.setValue('cover_image_url', url, { shouldValidate: true })
              }
              error={form.formState.errors.cover_image_url?.message}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Key Capabilities &amp; Features</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {features.map((feature, index) => (
            <div key={index} className="flex gap-2">
              <input
                value={feature}
                onChange={(e) => {
                  const next = [...features]
                  next[index] = e.target.value
                  setFeatures(next)
                }}
                placeholder="e.g. Instant callback in under 5 seconds"
                className="adm-input flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label="Remove feature"
                onClick={() => setFeatures(features.filter((_, i) => i !== index))}
                className="text-adm-danger-text hover:bg-adm-danger-bg hover:border-adm-danger-border shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
          {form.formState.errors.features && (
            <p className="adm-error">{form.formState.errors.features.message}</p>
          )}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setFeatures([...features, ''])}
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Add Feature
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Conversation Flow Steps</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {flowFields.map((field, index) => (
            <div
              key={field.id}
              className="flex gap-3 items-start border border-adm-border bg-adm-surface-2/40 p-4 rounded-xl"
            >
              <div className="flex-1 space-y-2.5">
                <input
                  {...form.register(`flow.${index}.step`)}
                  placeholder="Step Title (e.g. Lead Captured)"
                  className="adm-input"
                />
                {form.formState.errors.flow?.[index]?.step && (
                  <p className="adm-error">{form.formState.errors.flow[index]?.step?.message}</p>
                )}
                <input
                  {...form.register(`flow.${index}.desc`)}
                  placeholder="Step Description"
                  className="adm-input"
                />
                {form.formState.errors.flow?.[index]?.desc && (
                  <p className="adm-error">{form.formState.errors.flow[index]?.desc?.message}</p>
                )}
              </div>
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label="Remove step"
                onClick={() => removeFlow(index)}
                className="text-adm-danger-text hover:bg-adm-danger-bg hover:border-adm-danger-border shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
          {(form.formState.errors.flow?.message || form.formState.errors.flow?.root?.message) && (
            <p className="adm-error">
              {form.formState.errors.flow?.message || form.formState.errors.flow?.root?.message}
            </p>
          )}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => appendFlow({ step: '', desc: '' })}
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Add Step
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Expected Outcomes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {resultFields.map((field, index) => (
            <div
              key={field.id}
              className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-3 items-start"
            >
              <div className="space-y-1">
                <input
                  {...form.register(`results.${index}.stat`)}
                  placeholder="Stat (e.g. 300%)"
                  className="adm-input"
                />
                {form.formState.errors.results?.[index]?.stat && (
                  <p className="adm-error">{form.formState.errors.results[index]?.stat?.message}</p>
                )}
              </div>
              <div className="space-y-1">
                <input
                  {...form.register(`results.${index}.label`)}
                  placeholder="Label (e.g. Connect Rate)"
                  className="adm-input"
                />
                {form.formState.errors.results?.[index]?.label && (
                  <p className="adm-error">{form.formState.errors.results[index]?.label?.message}</p>
                )}
              </div>
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label="Remove result"
                onClick={() => removeResult(index)}
                className="text-adm-danger-text hover:bg-adm-danger-bg hover:border-adm-danger-border"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
          {(form.formState.errors.results?.message ||
            form.formState.errors.results?.root?.message) && (
            <p className="adm-error">
              {form.formState.errors.results?.message ||
                form.formState.errors.results?.root?.message}
            </p>
          )}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => appendResult({ stat: '', label: '' })}
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Add Outcome
          </Button>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : initialData?.id ? 'Update Use Case' : 'Create Use Case'}
        </Button>
      </div>
    </form>
  )
}
