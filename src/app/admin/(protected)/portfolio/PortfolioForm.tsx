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
      media_files: [],
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
    name: "integrations" as never, 
  })

  const { fields: mediaFields, append: appendMedia, remove: removeMedia } = useFieldArray({
    control: form.control,
    name: "media_files",
  })

  const [uploadingMedia, setUploadingMedia] = useState(false)

  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploadingMedia(true)
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const fileExt = file.name.split('.').pop()
        const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`
        const filePath = `portfolio_files/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('portfolio_media')
          .upload(filePath, file)

        if (uploadError) throw uploadError

        const { data } = supabase.storage.from('portfolio_media').getPublicUrl(filePath)
        
        let type: 'image' | 'video' | 'audio' | 'json' = 'image'
        if (file.type.startsWith('video/')) type = 'video'
        else if (file.type.startsWith('audio/')) type = 'audio'
        else if (file.type === 'application/json' || fileExt === 'json') type = 'json'

        appendMedia({
          url: data.publicUrl,
          type,
          name: file.name
        })
      }
    } catch (error: any) {
      alert(`Error uploading media: ${error.message}`)
    } finally {
      setUploadingMedia(false)
      if (e.target) e.target.value = ''
    }
  }

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
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Additional Media Files (Images, Video, Audio, JSON)</label>
            <label className="cursor-pointer flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50">
              <UploadCloud className="w-4 h-4 mr-2" />
              <span>{uploadingMedia ? 'Uploading...' : 'Add Files'}</span>
              <input type="file" className="hidden" multiple accept="image/*,video/*,audio/*,.json" onChange={handleMediaUpload} disabled={uploadingMedia} />
            </label>
          </div>
          
          <div className="space-y-3">
            {mediaFields.map((field, index) => (
              <div key={field.id} className="flex gap-4 items-center p-3 border rounded-md dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800/50">
                <div className="flex-1 flex gap-4 items-center">
                  {form.watch(`media_files.${index}.type`) === 'image' && (
                    <img src={form.watch(`media_files.${index}.url`)} alt="preview" className="w-12 h-12 object-cover rounded" />
                  )}
                  {form.watch(`media_files.${index}.type`) === 'video' && <div className="w-12 h-12 flex items-center justify-center bg-gray-200 dark:bg-zinc-700 rounded text-xs font-bold">VID</div>}
                  {form.watch(`media_files.${index}.type`) === 'audio' && <div className="w-12 h-12 flex items-center justify-center bg-gray-200 dark:bg-zinc-700 rounded text-xs font-bold">AUD</div>}
                  {form.watch(`media_files.${index}.type`) === 'json' && <div className="w-12 h-12 flex items-center justify-center bg-gray-200 dark:bg-zinc-700 rounded text-xs font-bold">JSON</div>}
                  
                  <div className="flex-1 space-y-2">
                    <input
                      {...form.register(`media_files.${index}.name`)}
                      placeholder="File name or description"
                      className="w-full text-sm px-2 py-1 border rounded bg-white dark:bg-zinc-900 dark:border-zinc-600"
                    />
                    <div className="text-xs text-gray-500 truncate w-64 md:w-96" title={form.watch(`media_files.${index}.url`)}>
                      {form.watch(`media_files.${index}.url`)}
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  <select
                    {...form.register(`media_files.${index}.type`)}
                    className="text-xs px-2 py-1 border rounded dark:bg-zinc-900 dark:border-zinc-700"
                  >
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                    <option value="audio">Audio</option>
                    <option value="json">JSON</option>
                  </select>
                  <Button type="button" variant="destructive" size="sm" onClick={() => removeMedia(index)}>
                    <Trash2 className="w-3 h-3 mr-1" /> Remove
                  </Button>
                </div>
              </div>
            ))}
            {mediaFields.length === 0 && (
              <p className="text-sm text-gray-500 dark:text-zinc-400 text-center py-4">No additional media files added yet.</p>
            )}
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
