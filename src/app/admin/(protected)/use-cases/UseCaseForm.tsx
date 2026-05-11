'use client'

import { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCaseSchema, UseCaseFormValues } from '@/lib/validations/useCase'
import { createUseCase, updateUseCase } from './actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import { Plus, Trash, UploadCloud } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const ICON_OPTIONS = [
  'Home', 'Sun', 'Hammer', 'Briefcase', 'BarChart', 'Headphones',
  'PhoneIncoming', 'PhoneOutgoing', 'UserCheck', 'Building', 'Car',
  'ShoppingCart', 'Heart', 'GraduationCap', 'Utensils', 'Plane',
];

interface UseCaseFormProps {
  initialData?: UseCaseFormValues & { id: string }
}

export function UseCaseForm({ initialData }: UseCaseFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<UseCaseFormValues>({
    resolver: zodResolver(useCaseSchema),
    defaultValues: initialData || {
      industry_slug: '',
      name: '',
      headline: '',
      subhead: '',
      problem: '',
      features: [''],
      flow: [{ step: '', desc: '' }],
      results: [{ stat: '', label: '' }],
      cover_image_url: '',
      icon_name: 'Briefcase',
      status: 'published',
      display_order: 0,
    },
  })

  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const supabase = createClient();
      const ext = file.name.split('.').pop();
      const path = `use-cases/${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage.from('portfolio_media').upload(path, file);
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from('portfolio_media').getPublicUrl(path);
      form.setValue('cover_image_url', publicUrl);
    } catch (err: any) {
      console.error('Upload failed:', err);
    } finally {
      setIsUploading(false);
    }
  };
  const [features, setFeatures] = useState<string[]>(initialData?.features || ['']);
  
  const { fields: flowFields, append: appendFlow, remove: removeFlow } = useFieldArray({
      control: form.control,
      name: 'flow'
  });

  const { fields: resultFields, append: appendResult, remove: removeResult } = useFieldArray({
      control: form.control,
      name: 'results'
  });

  const onSubmit = async (values: UseCaseFormValues) => {
    setIsSubmitting(true)
    setError(null)
    
    // sync features
    values.features = features.filter(f => f.trim() !== '');

    try {
      let result
      if (initialData?.id) {
        result = await updateUseCase(initialData.id, values)
      } else {
        result = await createUseCase(values)
      }

      if (result.error) {
        setError(result.error)
      } else {
        router.push('/admin/use-cases')
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
                <label className="text-sm font-medium">Industry Name</label>
                <input
                  {...form.register('name')}
                  className="w-full px-3 py-2 border rounded-md dark:bg-zinc-900 dark:border-zinc-700"
                  placeholder="e.g. Real Estate"
                />
                {form.formState.errors.name && (
                  <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Industry Slug (URL)</label>
                <input
                  {...form.register('industry_slug')}
                  className="w-full px-3 py-2 border rounded-md dark:bg-zinc-900 dark:border-zinc-700"
                  placeholder="e.g. real-estate"
                />
                {form.formState.errors.industry_slug && (
                  <p className="text-sm text-red-500">{form.formState.errors.industry_slug.message}</p>
                )}
              </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Headline</label>
            <input
              {...form.register('headline')}
              className="w-full px-3 py-2 border rounded-md dark:bg-zinc-900 dark:border-zinc-700"
            />
            {form.formState.errors.headline && (
              <p className="text-sm text-red-500">{form.formState.errors.headline.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Subhead</label>
            <input
              {...form.register('subhead')}
              className="w-full px-3 py-2 border rounded-md dark:bg-zinc-900 dark:border-zinc-700"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">The Problem</label>
            <textarea
              {...form.register('problem')}
              rows={3}
              className="w-full px-3 py-2 border rounded-md dark:bg-zinc-900 dark:border-zinc-700"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                  <label className="text-sm font-medium">Icon</label>
                  <select
                    {...form.register('icon_name')}
                    className="w-full px-3 py-2 border rounded-md dark:bg-zinc-900 dark:border-zinc-700"
                  >
                    {ICON_OPTIONS.map(icon => (
                      <option key={icon} value={icon}>{icon}</option>
                    ))}
                  </select>
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
          </div>

          {/* Cover Image */}
          <div className="space-y-2">
              <label className="text-sm font-medium">Cover Image</label>
              <div className="flex gap-4 items-center">
                  <input
                    {...form.register('cover_image_url')}
                    className="flex-1 px-3 py-2 border rounded-md dark:bg-zinc-900 dark:border-zinc-700"
                    placeholder="Paste URL or upload an image"
                  />
                  <label className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-zinc-800 text-white rounded-md hover:bg-zinc-700 transition-colors text-sm">
                    <UploadCloud className="w-4 h-4" />
                    {isUploading ? 'Uploading...' : 'Upload'}
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={isUploading} />
                  </label>
              </div>
              {form.watch('cover_image_url') && (
                <img src={form.watch('cover_image_url')} alt="Preview" className="mt-2 w-full max-h-48 object-cover rounded-lg border dark:border-zinc-700" />
              )}
          </div>
        </CardContent>
      </Card>

      {/* Features */}
      <Card>
          <CardContent className="p-6 space-y-4">
              <h3 className="font-semibold">Features</h3>
              {features.map((feature, index) => (
                  <div key={index} className="flex gap-2">
                      <input 
                        value={feature}
                        onChange={(e) => {
                            const newFeatures = [...features];
                            newFeatures[index] = e.target.value;
                            setFeatures(newFeatures);
                        }}
                        className="flex-1 px-3 py-2 border rounded-md dark:bg-zinc-900 dark:border-zinc-700"
                      />
                      <Button type="button" variant="ghost" onClick={() => setFeatures(features.filter((_, i) => i !== index))}>
                          <Trash className="w-4 h-4 text-red-500" />
                      </Button>
                  </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={() => setFeatures([...features, ''])}>
                  <Plus className="w-4 h-4 mr-2" /> Add Feature
              </Button>
          </CardContent>
      </Card>

      {/* Flow Logic */}
      <Card>
          <CardContent className="p-6 space-y-4">
              <h3 className="font-semibold">Conversation Flow Logic</h3>
              {flowFields.map((field, index) => (
                  <div key={field.id} className="flex gap-4 items-start border p-4 rounded-lg dark:border-zinc-800">
                      <div className="flex-1 space-y-2">
                        <input
                            {...form.register(`flow.${index}.step`)}
                            placeholder="Step Title (e.g. Greeting)"
                            className="w-full px-3 py-2 border rounded-md dark:bg-zinc-900 dark:border-zinc-700"
                        />
                        <input
                            {...form.register(`flow.${index}.desc`)}
                            placeholder="Description"
                            className="w-full px-3 py-2 border rounded-md dark:bg-zinc-900 dark:border-zinc-700"
                        />
                      </div>
                      <Button type="button" variant="ghost" onClick={() => removeFlow(index)}>
                          <Trash className="w-4 h-4 text-red-500" />
                      </Button>
                  </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={() => appendFlow({ step: '', desc: '' })}>
                  <Plus className="w-4 h-4 mr-2" /> Add Step
              </Button>
          </CardContent>
      </Card>

      {/* Results */}
      <Card>
          <CardContent className="p-6 space-y-4">
              <h3 className="font-semibold">Expected Results</h3>
              {resultFields.map((field, index) => (
                  <div key={field.id} className="flex gap-4 items-center">
                      <input
                          {...form.register(`results.${index}.stat`)}
                          placeholder="Stat (e.g. 300%)"
                          className="flex-1 px-3 py-2 border rounded-md dark:bg-zinc-900 dark:border-zinc-700"
                      />
                      <input
                          {...form.register(`results.${index}.label`)}
                          placeholder="Label (e.g. Conversion Rate)"
                          className="flex-1 px-3 py-2 border rounded-md dark:bg-zinc-900 dark:border-zinc-700"
                      />
                      <Button type="button" variant="ghost" onClick={() => removeResult(index)}>
                          <Trash className="w-4 h-4 text-red-500" />
                      </Button>
                  </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={() => appendResult({ stat: '', label: '' })}>
                  <Plus className="w-4 h-4 mr-2" /> Add Result
              </Button>
          </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : initialData ? 'Update Use Case' : 'Add Use Case'}
        </Button>
      </div>
    </form>
  )
}
