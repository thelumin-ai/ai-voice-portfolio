'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { techStackSchema, TechStackFormValues } from '@/lib/validations/techStack'
import { createTechItem, updateTechItem } from './actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import { UploadCloud } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface TechStackFormProps {
  initialData?: TechStackFormValues & { id: string }
}

export function TechStackForm({ initialData }: TechStackFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const PRESET_CATEGORIES = [
    "Frontend Framework",
    "Backend & APIs",
    "Database & Auth",
    "AI & Machine Learning",
    "Voice AI & Telephony",
    "DevOps & Deployment"
  ];
  
  const initialCategoryIsPreset = !initialData?.category || PRESET_CATEGORIES.includes(initialData.category);
  const [isOtherCategory, setIsOtherCategory] = useState(!initialCategoryIsPreset);
  
  const supabase = createClient()

  const form = useForm<TechStackFormValues>({
    resolver: zodResolver(techStackSchema),
    defaultValues: initialData || {
      name: '',
      category: '',
      icon_url: '',
      status: 'published',
      display_order: 0,
    },
  })

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `icons/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('portfolio_media')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data } = supabase.storage.from('portfolio_media').getPublicUrl(filePath)
      form.setValue('icon_url', data.publicUrl)
    } catch (error: any) {
      alert(`Error uploading image: ${error.message}`)
    }
  }

  const onSubmit = async (values: TechStackFormValues) => {
    setIsSubmitting(true)
    setError(null)
    
    try {
      let result
      if (initialData?.id) {
        result = await updateTechItem(initialData.id, values)
      } else {
        result = await createTechItem(values)
      }

      if (result.error) {
        setError(result.error)
      } else {
        router.push('/admin/tech-stack')
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
              <label className="text-sm font-medium">Tool Name</label>
              <input
                {...form.register('name')}
                className="w-full px-3 py-2 border rounded-md dark:bg-zinc-900 dark:border-zinc-700"
                placeholder="e.g. Next.js"
              />
              {form.formState.errors.name && (
                <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              {!isOtherCategory ? (
                  <select
                    className="w-full px-3 py-2 border rounded-md dark:bg-zinc-900 dark:border-zinc-700"
                    value={form.watch('category') || ''}
                    onChange={(e) => {
                        if (e.target.value === 'Other') {
                            setIsOtherCategory(true)
                            form.setValue('category', '')
                        } else {
                            form.setValue('category', e.target.value)
                        }
                    }}
                  >
                    <option value="" disabled>Select a category</option>
                    {PRESET_CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                    <option value="Other">Other (Custom)</option>
                  </select>
              ) : (
                  <div className="flex gap-2">
                      <input
                        {...form.register('category')}
                        className="w-full px-3 py-2 border rounded-md dark:bg-zinc-900 dark:border-zinc-700"
                        placeholder="Type custom category..."
                        autoFocus
                      />
                      <Button type="button" variant="outline" onClick={() => {
                          setIsOtherCategory(false);
                          form.setValue('category', PRESET_CATEGORIES[0]);
                      }}>
                          Back
                      </Button>
                  </div>
              )}
              {form.formState.errors.category && (
                <p className="text-sm text-red-500">{form.formState.errors.category.message}</p>
              )}
            </div>
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
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 space-y-4">
          <label className="text-sm font-medium">Tool Icon (SVG/PNG)</label>
          <div className="flex items-center gap-4">
            {form.watch('icon_url') && (
              <div className="p-4 bg-white dark:bg-zinc-800 rounded-md border dark:border-zinc-700">
                <img src={form.watch('icon_url')} alt="Icon" className="w-12 h-12 object-contain" />
              </div>
            )}
            <label className="cursor-pointer flex items-center justify-center px-4 py-2 border-2 border-dashed border-gray-300 dark:border-zinc-700 rounded-md hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
              <UploadCloud className="w-5 h-5 mr-2" />
              <span>Upload Icon</span>
              <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
            </label>
            <input type="hidden" {...form.register('icon_url')} />
          </div>
          {form.formState.errors.icon_url && (
            <p className="text-sm text-red-500">{form.formState.errors.icon_url.message}</p>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : initialData ? 'Update Tool' : 'Add Tool'}
        </Button>
      </div>
    </form>
  )
}
