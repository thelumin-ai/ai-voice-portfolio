'use client'

import { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { portfolioSchema, PortfolioFormValues } from '@/lib/validations/portfolio'
import { createPortfolioProject, updatePortfolioProject } from './actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { TipTapEditor } from './TipTapEditor'
import { useRouter } from 'next/navigation'
import { Plus, Trash2, UploadCloud } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface PortfolioFormProps {
  initialData?: PortfolioFormValues & { id: string }
}

export function PortfolioForm({ initialData }: PortfolioFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const form = useForm<PortfolioFormValues>({
    resolver: zodResolver(portfolioSchema),
    defaultValues: initialData ? {
      ...initialData,
      metrics: initialData.metrics || [],
      integrations: initialData.integrations || [],
    } as any : {
      title: '',
      industry_tag: '',
      short_description: '',
      case_study_body: '',
      metrics: [],
      integrations: [],
      demo_link: '',
      cover_image_url: '',
      status: 'published',
      display_order: 0,
    },
  })

  const { fields: metricFields, append: appendMetric, remove: removeMetric } = useFieldArray({
    control: form.control,
    name: "metrics",
  })

  const { fields: integrationFields, append: appendIntegration, remove: removeIntegration } = useFieldArray({
    control: form.control,
    // @ts-ignore - useFieldArray typing for array of primitives is tricky, we'll map it to an object temporarily
    name: "integrations", 
  })

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `covers/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('portfolio_media')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data } = supabase.storage.from('portfolio_media').getPublicUrl(filePath)
      form.setValue('cover_image_url', data.publicUrl)
    } catch (error: any) {
      alert(`Error uploading image: ${error.message}`)
    }
  }

  const onSubmit = async (values: PortfolioFormValues) => {
    setIsSubmitting(true)
    setError(null)
    
    try {
      let result
      if (initialData?.id) {
        result = await updatePortfolioProject(initialData.id, values)
      } else {
        result = await createPortfolioProject(values)
      }

      if (result.error) {
        setError(result.error)
      } else {
        router.push('/admin/portfolio')
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
              <label className="text-sm font-medium">Title</label>
              <input
                {...form.register('title')}
                className="w-full px-3 py-2 border rounded-md dark:bg-zinc-900 dark:border-zinc-700"
                placeholder="e.g. Real Estate AI Agent"
              />
              {form.formState.errors.title && (
                <p className="text-sm text-red-500">{form.formState.errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Industry Tag</label>
              <input
                {...form.register('industry_tag')}
                className="w-full px-3 py-2 border rounded-md dark:bg-zinc-900 dark:border-zinc-700"
                placeholder="e.g. Real Estate"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Short Description</label>
            <textarea
              {...form.register('short_description')}
              rows={3}
              className="w-full px-3 py-2 border rounded-md dark:bg-zinc-900 dark:border-zinc-700"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <label className="text-sm font-medium">Demo Link (Optional)</label>
              <input
                {...form.register('demo_link')}
                className="w-full px-3 py-2 border rounded-md dark:bg-zinc-900 dark:border-zinc-700"
                placeholder="https://..."
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 space-y-4">
          <label className="text-sm font-medium">Cover Image</label>
          <div className="flex items-center gap-4">
            {form.watch('cover_image_url') && (
              <img src={form.watch('cover_image_url')} alt="Cover" className="w-20 h-20 object-cover rounded-md" />
            )}
            <label className="cursor-pointer flex items-center justify-center px-4 py-2 border-2 border-dashed border-gray-300 dark:border-zinc-700 rounded-md hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
              <UploadCloud className="w-5 h-5 mr-2" />
              <span>Upload Image</span>
              <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
            </label>
            <input type="hidden" {...form.register('cover_image_url')} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 space-y-4">
          <label className="text-sm font-medium">Case Study Body</label>
          <TipTapEditor
            content={form.watch('case_study_body') || ''}
            onChange={(content) => form.setValue('case_study_body', content)}
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Metrics</label>
              <Button type="button" variant="outline" size="sm" onClick={() => appendMetric({ label: '', value: '' })}>
                <Plus className="w-4 h-4 mr-2" /> Add Metric
              </Button>
            </div>
            {metricFields.map((field, index) => (
              <div key={field.id} className="flex gap-2 items-start">
                <input
                  {...form.register(`metrics.${index}.label`)}
                  placeholder="Label (e.g. Conversion Rate)"
                  className="flex-1 px-3 py-2 border rounded-md dark:bg-zinc-900 dark:border-zinc-700"
                />
                <input
                  {...form.register(`metrics.${index}.value`)}
                  placeholder="Value (e.g. 34%)"
                  className="flex-1 px-3 py-2 border rounded-md dark:bg-zinc-900 dark:border-zinc-700"
                />
                <Button type="button" variant="destructive" size="icon" onClick={() => removeMetric(index)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Integrations</label>
              <Button type="button" variant="outline" size="sm" onClick={() => {
                 const current = form.getValues('integrations') || []
                 form.setValue('integrations', [...current, ''])
              }}>
                <Plus className="w-4 h-4 mr-2" /> Add Integration
              </Button>
            </div>
            {(form.watch('integrations') || []).map((integration, index) => (
              <div key={index} className="flex gap-2 items-start">
                <input
                  value={integration}
                  onChange={(e) => {
                    const current = [...form.getValues('integrations')]
                    current[index] = e.target.value
                    form.setValue('integrations', current)
                  }}
                  placeholder="e.g. Follow Up Boss"
                  className="flex-1 px-3 py-2 border rounded-md dark:bg-zinc-900 dark:border-zinc-700"
                />
                <Button type="button" variant="destructive" size="icon" onClick={() => {
                  const current = [...form.getValues('integrations')]
                  current.splice(index, 1)
                  form.setValue('integrations', current)
                }}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : initialData ? 'Update Project' : 'Create Project'}
        </Button>
      </div>
    </form>
  )
}
