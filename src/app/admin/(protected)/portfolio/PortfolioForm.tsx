'use client'

import { useState, useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { portfolioSchema, PortfolioFormValues } from '@/lib/validations/portfolio'
import { createPortfolioProject, updatePortfolioProject } from './actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { TipTapEditor } from './TipTapEditor'
import { useRouter } from 'next/navigation'
import { Plus, Trash2, UploadCloud, Bot, Loader2, Sparkles } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface PortfolioFormProps {
  initialData?: any
}

export function PortfolioForm({ initialData }: PortfolioFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const form = useForm<any>({
    resolver: zodResolver(portfolioSchema),
    defaultValues: {
      id: initialData?.id,
      title: initialData?.title || '',
      industry_tag: initialData?.industry_tag || '',
      short_description: initialData?.short_description || '',
      case_study_body: initialData?.case_study_body || '',
      metrics: initialData?.metrics || [],
      integrations: initialData?.integrations || [],
      media_files: initialData?.media_files || [],
      project_type: initialData?.project_type || 'webrtc',
      media_url: initialData?.media_url || '',
      api_key: initialData?.api_key || '',
      cover_image_url: initialData?.cover_image_url || '',
      status: initialData?.status || 'published',
      is_featured: !!initialData?.is_featured,
      display_order: initialData?.display_order || 0,
      voice_platform: initialData?.voice_platform || 'vapi',
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

  const [showImageAi, setShowImageAi] = useState(false)
  const [imageAiPrompt, setImageAiPrompt] = useState('')
  const [isGeneratingImage, setIsGeneratingImage] = useState(false)

  const handleGenerateCoverImage = async () => {
    if (!imageAiPrompt.trim()) return;
    setIsGeneratingImage(true);
    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: imageAiPrompt })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to generate');
      
      const res = await fetch(`data:${data.mimeType};base64,${data.base64}`);
      const blob = await res.blob();
      const file = new File([blob], `ai-cover-${Date.now()}.${data.mimeType.split('/')[1] || 'jpeg'}`, { type: data.mimeType });
      
      const filePath = `covers/${file.name}`;
      const { error: uploadError } = await supabase.storage.from('portfolio_media').upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data: publicData } = supabase.storage.from('portfolio_media').getPublicUrl(filePath);
      form.setValue('cover_image_url', publicData.publicUrl);
      setShowImageAi(false);
    } catch (err: any) {
      alert(`Error generating image: ${err.message}`);
    } finally {
      setIsGeneratingImage(false);
    }
  }

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

        // If this is the primary media type for the project, auto-fill media_url
        const projectType = form.getValues('project_type')
        const currentMediaUrl = form.getValues('media_url')
        if (!currentMediaUrl && ((projectType === 'audio' && type === 'audio') || (projectType === 'video' && type === 'video'))) {
          form.setValue('media_url', data.publicUrl)
        }
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
                <p className="text-sm text-red-500">{String(form.formState.errors.title?.message || '')}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Industry Tag</label>
              <CategorySelect
                value={form.watch('industry_tag')}
                onChange={(val) => form.setValue('industry_tag', val)}
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
              <label className="text-sm font-medium">Project Type</label>
              <select
                {...form.register('project_type')}
                className="w-full px-3 py-2 border rounded-md dark:bg-zinc-900 dark:border-zinc-700"
              >
                <option value="webrtc">Interactive WebRTC (Native Vapi)</option>
                <option value="iframe">Vapi / AI Demo Link (Embed Website)</option>
                <option value="audio">Audio Call Recording</option>
                <option value="video">Video Demonstration</option>
              </select>
            </div>

            {(form.watch('project_type') === 'webrtc' || form.watch('project_type') === 'iframe') && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Platform Type</label>
                <select
                  {...form.register('voice_platform')}
                  className="w-full px-3 py-2 border rounded-md dark:bg-zinc-900 dark:border-zinc-700"
                >
                  <option value="vapi">Vapi.ai</option>
                  <option value="retell">Retell AI</option>
                </select>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">
                {form.watch('project_type') === 'webrtc' ? `${form.watch('voice_platform') === 'retell' ? 'Retell' : 'Vapi'} Agent ID` : form.watch('project_type') === 'iframe' ? 'Shareable Demo URL (e.g. vapi.ai?demo=... or call.retellai.com/...)' : 'Media File / URL (Audio/Video)'}
              </label>
              <div className="flex gap-2">
                <input
                  {...form.register('media_url')}
                  className="flex-1 px-3 py-2 border rounded-md dark:bg-zinc-900 dark:border-zinc-700"
                  placeholder={form.watch('project_type') === 'webrtc' ? "e.g. 087efbdc-..." : "https://..."}
                />
                {(form.watch('project_type') === 'audio' || form.watch('project_type') === 'video') && (
                  <label className="cursor-pointer flex items-center justify-center px-4 py-2 bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
                    <UploadCloud className="w-4 h-4" />
                    <input 
                      type="file" 
                      className="hidden" 
                      accept={form.watch('project_type') === 'audio' ? 'audio/*' : 'video/*'} 
                      onChange={async (e) => {
                        const file = e.target.files?.[0]
                        if (!file) return
                        try {
                          const fileExt = file.name.split('.').pop()
                          const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`
                          const filePath = `portfolio_assets/${fileName}`
                          const { error: uploadError } = await supabase.storage.from('portfolio_media').upload(filePath, file)
                          if (uploadError) throw uploadError
                          const { data } = supabase.storage.from('portfolio_media').getPublicUrl(filePath)
                          form.setValue('media_url', data.publicUrl)
                        } catch (err: any) {
                          alert(`Upload failed: ${err.message}`)
                        }
                      }} 
                    />
                  </label>
                )}
              </div>
              {form.watch('media_url') && (form.watch('project_type') === 'audio' || form.watch('project_type') === 'video') && (
                <div className="mt-2 p-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg">
                  <p className="text-[10px] uppercase font-bold text-zinc-400 mb-2">Media Preview</p>
                  {form.watch('project_type') === 'audio' ? (
                    <audio src={form.watch('media_url')} controls className="w-full h-8" />
                  ) : (
                    <video src={form.watch('media_url')} controls className="w-full aspect-video rounded-md" />
                  )}
                  <p className="text-[10px] text-zinc-500 mt-1 truncate">{form.watch('media_url')}</p>
                </div>
              )}
              <p className="text-[10px] text-gray-500 italic">
                {form.watch('project_type') === 'webrtc' 
                  ? "Enter the UUID of your agent from the platform." 
                  : form.watch('project_type') === 'iframe' 
                    ? "Paste the full shareable URL provided by the AI platform."
                    : "Upload a file or enter a direct link to an audio file or video (YouTube/Vimeo)."}
              </p>
            </div>

            {form.watch('project_type') === 'webrtc' && (
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  Custom API Key
                  <span className="text-[10px] bg-zinc-200 dark:bg-zinc-800 px-2 py-0.5 rounded text-zinc-500">Optional</span>
                </label>
                <input
                  {...form.register('api_key')}
                  className="w-full px-3 py-2 border rounded-md dark:bg-zinc-900 dark:border-zinc-700"
                  placeholder="Leave blank to use default key"
                />
                <p className="text-[10px] text-gray-500 italic">If this agent is on a client's account, provide their Public API Key here.</p>
              </div>
            )}

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

            <div className="flex items-center space-x-2 pt-8">
              <input
                type="checkbox"
                id="is_featured"
                {...form.register('is_featured')}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="is_featured" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Feature on Home Page
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex justify-between items-center mb-4">
            <label className="text-sm font-medium">Cover Image</label>
            <Button type="button" variant="outline" size="sm" onClick={() => setShowImageAi(!showImageAi)} className="text-purple-500 border-purple-200 hover:bg-purple-50 dark:hover:bg-purple-900/20">
              <Sparkles className="w-4 h-4 mr-2" /> AI Generate
            </Button>
          </div>
          
          {showImageAi && (
            <div className="p-4 bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-900/30 rounded-lg space-y-4 mb-4">
              <h4 className="font-semibold text-purple-700 dark:text-purple-400 flex items-center"><Bot className="w-4 h-4 mr-2" /> Generate Cover Image</h4>
              <textarea 
                value={imageAiPrompt}
                onChange={(e) => setImageAiPrompt(e.target.value)}
                placeholder="e.g. A futuristic robot holding a glowing microphone, digital art, high quality"
                className="w-full px-3 py-2 border rounded-md dark:bg-zinc-900 dark:border-zinc-700 text-sm"
                rows={2}
              />
              <div className="flex justify-end gap-2">
                <Button type="button" variant="ghost" size="sm" onClick={() => setShowImageAi(false)}>Cancel</Button>
                <Button type="button" size="sm" className="bg-purple-600 hover:bg-purple-700 text-white" onClick={handleGenerateCoverImage} disabled={isGeneratingImage}>
                  {isGeneratingImage ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating...</> : 'Generate Image'}
                </Button>
              </div>
            </div>
          )}

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
            {(form.watch('integrations') || []).map((integration: string, index: number) => (
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

// Predefined portfolio category list
const DEFAULT_CATEGORIES = [
  "Sales Automation",
  "IVR Systems",
  "Scheduling Engines",
  "CRM Integrations",
  "Healthcare AI",
  "Real Estate",
  "Solar & Energy",
  "Customer Support",
  "Home Services",
  "Consulting & Agencies",
  "Finance & Insurance",
  "Multi-Language",
  "AI Dashboards",
];

function CategorySelect({ value, onChange }: { value: string; onChange: (val: string) => void }) {
  const [customCategories, setCustomCategories] = useState<string[]>([]);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customValue, setCustomValue] = useState('');

  const allCategories = [...DEFAULT_CATEGORIES, ...customCategories];
  const isCustomValue = value && !allCategories.includes(value) && value !== '__other__';

  // If the initial value from DB is a custom category not in our list, add it
  useEffect(() => {
    if (value && !DEFAULT_CATEGORIES.includes(value) && value !== '__other__' && !customCategories.includes(value)) {
      setCustomCategories(prev => [...prev, value]);
    }
  }, []);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    if (selected === '__other__') {
      setShowCustomInput(true);
      setCustomValue('');
    } else {
      setShowCustomInput(false);
      onChange(selected);
    }
  };

  const handleCustomSubmit = () => {
    const trimmed = customValue.trim();
    if (!trimmed) return;
    
    // Add to session list for reuse
    if (!allCategories.includes(trimmed)) {
      setCustomCategories(prev => [...prev, trimmed]);
    }
    onChange(trimmed);
    setShowCustomInput(false);
    setCustomValue('');
  };

  const handleCustomKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCustomSubmit();
    }
  };

  const selectValue = showCustomInput ? '__other__' : (allCategories.includes(value) ? value : (value ? value : ''));

  return (
    <div className="space-y-2">
      <select
        value={selectValue}
        onChange={handleSelectChange}
        className="w-full px-3 py-2 border rounded-md dark:bg-zinc-900 dark:border-zinc-700"
      >
        <option value="" disabled>Select a category...</option>
        {allCategories.map((cat) => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
        <option value="__other__">✦ Other (Custom Category)</option>
      </select>

      {showCustomInput && (
        <div className="flex gap-2 items-center animate-in slide-in-from-top-2">
          <input
            type="text"
            value={customValue}
            onChange={(e) => setCustomValue(e.target.value)}
            onKeyDown={handleCustomKeyDown}
            placeholder="Enter custom category name..."
            className="flex-1 px-3 py-2 border rounded-md dark:bg-zinc-900 dark:border-zinc-700 ring-2 ring-blue-500/30 focus:ring-blue-500"
            autoFocus
          />
          <button
            type="button"
            onClick={handleCustomSubmit}
            disabled={!customValue.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
          >
            Add
          </button>
          <button
            type="button"
            onClick={() => { setShowCustomInput(false); }}
            className="px-3 py-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors text-sm"
          >
            Cancel
          </button>
        </div>
      )}

      {value && (
        <p className="text-xs text-gray-500">
          Current: <span className="font-medium text-blue-600 dark:text-blue-400">{value}</span>
        </p>
      )}
    </div>
  );
}
