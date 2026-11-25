'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { Bot, Loader2, Plus, Sparkles, Trash2, UploadCloud } from 'lucide-react'
import { portfolioSchema, PortfolioFormValues } from '@/lib/validations/portfolio'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { AdminImageUpload } from '@/components/admin/AdminImageUpload'
import { useAdminToast } from '@/components/admin/AdminToast'
import { createClient } from '@/lib/supabase/client'
import { isSafeHttpUrl } from '@/lib/url'
import { getErrorMessage } from '@/lib/errors'
import type { PortfolioProject } from '@/lib/types'
import { createPortfolioProject, updatePortfolioProject } from './actions'

const TipTapEditor = dynamic(
  () => import('./TipTapEditor').then((mod) => mod.TipTapEditor),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-[240px] border border-adm-border rounded-xl bg-adm-surface-2/40 animate-pulse" />
    ),
  }
)

type PortfolioFormInput = z.input<typeof portfolioSchema>

interface PortfolioFormProps {
  initialData?: Partial<PortfolioProject> & { id?: string }
}

export function PortfolioForm({ initialData }: PortfolioFormProps) {
  const router = useRouter()
  const toast = useAdminToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [aiCoverError, setAiCoverError] = useState<string | null>(null)
  const [mediaUploadError, setMediaUploadError] = useState<string | null>(null)
  const [uploadingPrimaryMedia, setUploadingPrimaryMedia] = useState(false)
  const [uploadingMedia, setUploadingMedia] = useState(false)

  const [showImageAi, setShowImageAi] = useState(false)
  const [imageAiPrompt, setImageAiPrompt] = useState('')
  const [isGeneratingImage, setIsGeneratingImage] = useState(false)

  const supabase = createClient()

  const normalizedProjectType =
    initialData?.project_type === 'webrtc' ||
    initialData?.project_type === 'audio' ||
    initialData?.project_type === 'video' ||
    initialData?.project_type === 'iframe'
      ? initialData.project_type
      : 'webrtc'

  const normalizedPlatform =
    initialData?.voice_platform === 'retell' ? 'retell' : 'vapi'

  const normalizedStatus =
    initialData?.status === 'draft' || initialData?.status === 'archived'
      ? initialData.status
      : 'published'

  const form = useForm<PortfolioFormInput, unknown, PortfolioFormValues>({
    resolver: zodResolver(portfolioSchema),
    defaultValues: {
      id: initialData?.id,
      title: initialData?.title ?? '',
      industry_tag: initialData?.industry_tag ?? '',
      short_description: initialData?.short_description ?? '',
      case_study_body: initialData?.case_study_body ?? '',
      metrics: Array.isArray(initialData?.metrics) ? initialData.metrics : [],
      integrations: Array.isArray(initialData?.integrations) ? initialData.integrations : [],
      media_files: Array.isArray(initialData?.media_files) ? initialData.media_files : [],
      project_type: normalizedProjectType,
      media_url: initialData?.media_url ?? '',
      api_key: initialData?.api_key ?? '',
      cover_image_url: initialData?.cover_image_url ?? '',
      status: normalizedStatus,
      is_featured: Boolean(initialData?.is_featured),
      display_order: typeof initialData?.display_order === 'number' ? initialData.display_order : 0,
      voice_platform: normalizedPlatform,
    },
  })

  const { fields: metricFields, append: appendMetric, remove: removeMetric } = useFieldArray({
    control: form.control,
    name: 'metrics',
  })

  const { fields: mediaFields, append: appendMedia, remove: removeMedia } = useFieldArray({
    control: form.control,
    name: 'media_files',
  })

  const handleGenerateCoverImage = async () => {
    if (!imageAiPrompt.trim()) return
    setIsGeneratingImage(true)
    setAiCoverError(null)
    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: imageAiPrompt }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to generate')

      const res = await fetch(`data:${data.mimeType};base64,${data.base64}`)
      const blob = await res.blob()
      const mimeExt =
        (data.mimeType?.split('/')[1] || 'jpeg').toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg'
      const file = new File(
        [blob],
        `ai-cover-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${mimeExt}`,
        { type: data.mimeType }
      )

      const filePath = `covers/${file.name}`
      const { error: uploadError } = await supabase.storage
        .from('portfolio_media')
        .upload(filePath, file)
      if (uploadError) throw uploadError

      const { data: publicData } = supabase.storage
        .from('portfolio_media')
        .getPublicUrl(filePath)
      form.setValue('cover_image_url', publicData.publicUrl, { shouldValidate: true })
      setShowImageAi(false)
      toast.success('AI cover image generated')
    } catch (err: unknown) {
      setAiCoverError(getErrorMessage(err, 'Error generating cover image'))
    } finally {
      setIsGeneratingImage(false)
    }
  }

  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploadingMedia(true)
    setMediaUploadError(null)
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const fileExt =
          file.name.split('.').pop()?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'bin'
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${fileExt}`
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
          name: file.name,
        })

        const projectType = form.getValues('project_type')
        const currentMediaUrl = form.getValues('media_url')
        if (
          !currentMediaUrl &&
          ((projectType === 'audio' && type === 'audio') ||
            (projectType === 'video' && type === 'video'))
        ) {
          form.setValue('media_url', data.publicUrl)
        }
      }
      toast.success('Additional media uploaded')
    } catch (err: unknown) {
      setMediaUploadError(`Error uploading media: ${getErrorMessage(err)}`)
    } finally {
      setUploadingMedia(false)
      if (e.target) e.target.value = ''
    }
  }

  const handlePrimaryAudioVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingPrimaryMedia(true)
    setError(null)
    try {
      const fileExt =
        file.name.split('.').pop()?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'bin'
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${fileExt}`
      const filePath = `portfolio_assets/${fileName}`
      const { error: uploadError } = await supabase.storage
        .from('portfolio_media')
        .upload(filePath, file)
      if (uploadError) throw uploadError
      const { data } = supabase.storage.from('portfolio_media').getPublicUrl(filePath)
      form.setValue('media_url', data.publicUrl, { shouldValidate: true })
      toast.success('Primary media file uploaded')
    } catch (err: unknown) {
      setError(`Upload failed: ${getErrorMessage(err)}`)
    } finally {
      setUploadingPrimaryMedia(false)
      e.target.value = ''
    }
  }

  const onSubmit = async (values: PortfolioFormValues) => {
    setIsSubmitting(true)
    setError(null)

    try {
      const result = initialData?.id
        ? await updatePortfolioProject(initialData.id, values)
        : await createPortfolioProject(values)

      if (result.error) {
        setError(result.error)
      } else {
        toast.success(initialData?.id ? 'Portfolio project updated' : 'Portfolio project created')
        router.push('/admin/portfolio')
        router.refresh()
      }
    } catch (err: unknown) {
      setError(getErrorMessage(err))
    } finally {
      setIsSubmitting(false)
    }
  }

  const descLength = (form.watch('short_description') || '').length
  const projectType = form.watch('project_type')
  const voicePlatform = form.watch('voice_platform')
  const mediaUrl = form.watch('media_url')

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
              <label htmlFor="pf-title" className="adm-label">
                Project Title <span className="text-adm-danger-text">*</span>
              </label>
              <input
                id="pf-title"
                {...form.register('title')}
                className="adm-input"
                placeholder="e.g. Real Estate Speed-to-Lead Agent"
              />
              {form.formState.errors.title && (
                <p className="adm-error">
                  {String(form.formState.errors.title?.message || '')}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="pf-category" className="adm-label">
                Industry Tag <span className="text-adm-danger-text">*</span>
              </label>
              <CategorySelect
                id="pf-category"
                value={form.watch('industry_tag')}
                onChange={(val) =>
                  form.setValue('industry_tag', val, { shouldValidate: true })
                }
              />
              {form.formState.errors.industry_tag && (
                <p className="adm-error">
                  {String(form.formState.errors.industry_tag?.message || '')}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="pf-description" className="adm-label">
              Portfolio Description <span className="text-adm-danger-text">*</span>
            </label>
            <textarea
              id="pf-description"
              {...form.register('short_description')}
              rows={5}
              maxLength={2500}
              placeholder="Enter a detailed description of the project (up to 2,500 characters)..."
              className="adm-input resize-y"
            />
            <div className="flex flex-wrap justify-between items-center gap-2 text-xs">
              {form.formState.errors.short_description ? (
                <p className="adm-error font-medium">
                  {String(form.formState.errors.short_description?.message || '')}
                </p>
              ) : (
                <span className="adm-hint">
                  Previews display first 400 characters; full modal displays complete text.
                </span>
              )}
              <span
                className={`font-mono text-xs font-semibold px-2 py-0.5 rounded border ${
                  descLength >= 2500
                    ? 'bg-adm-danger-bg text-adm-danger-text border-adm-danger-border'
                    : descLength >= 2300
                    ? 'bg-adm-warn-bg text-adm-warn-text border-adm-warn-border'
                    : 'bg-adm-surface-2 text-adm-muted border-adm-border'
                }`}
              >
                {descLength.toLocaleString()} / 2,500 characters
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="pf-type" className="adm-label">
                Project Type
              </label>
              <select
                id="pf-type"
                {...form.register('project_type')}
                className="adm-input"
              >
                <option value="webrtc">Interactive WebRTC (Native Vapi / Retell)</option>
                <option value="iframe">Shareable AI Demo Link (Embed)</option>
                <option value="audio">Audio Call Recording</option>
                <option value="video">Video Demonstration</option>
              </select>
            </div>

            {(projectType === 'webrtc' || projectType === 'iframe') && (
              <div className="space-y-1.5">
                <label htmlFor="pf-platform" className="adm-label">
                  Platform Type
                </label>
                <select
                  id="pf-platform"
                  {...form.register('voice_platform')}
                  className="adm-input"
                >
                  <option value="vapi">Vapi.ai</option>
                  <option value="retell">Retell AI</option>
                </select>
              </div>
            )}

            <div className="space-y-1.5">
              <label htmlFor="pf-media-url" className="adm-label">
                {projectType === 'webrtc'
                  ? `${voicePlatform === 'retell' ? 'Retell' : 'Vapi'} Agent ID`
                  : projectType === 'iframe'
                  ? 'Shareable Demo URL'
                  : 'Media File / URL (Audio or Video)'}
              </label>
              <div className="flex gap-2">
                <input
                  id="pf-media-url"
                  {...form.register('media_url')}
                  className="adm-input flex-1"
                  placeholder={projectType === 'webrtc' ? 'e.g. 087efbdc-...' : 'https://...'}
                />
                {(projectType === 'audio' || projectType === 'video') && (
                  <label className="cursor-pointer inline-flex items-center justify-center px-3.5 rounded-lg border border-adm-border bg-adm-surface-2 text-adm-text hover:bg-adm-border/60 transition-colors shrink-0">
                    <UploadCloud className="w-4 h-4 mr-1.5" />
                    <span className="text-xs font-medium">
                      {uploadingPrimaryMedia ? 'Uploading...' : 'Upload'}
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      accept={projectType === 'audio' ? 'audio/*' : 'video/*'}
                      disabled={uploadingPrimaryMedia}
                      onChange={handlePrimaryAudioVideoUpload}
                    />
                  </label>
                )}
              </div>
              {mediaUrl && (projectType === 'audio' || projectType === 'video') && (
                <div className="mt-2 p-3 bg-adm-surface-2/60 border border-adm-border rounded-lg">
                  <p className="text-[10px] uppercase font-bold text-adm-muted mb-2">
                    Media Preview
                  </p>
                  {projectType === 'audio' ? (
                    <audio src={mediaUrl} controls className="w-full h-8" />
                  ) : (
                    <video src={mediaUrl} controls className="w-full aspect-video rounded-md" />
                  )}
                  <p className="text-xs text-adm-subtle mt-1 truncate">{mediaUrl}</p>
                </div>
              )}
              <p className="adm-hint">
                {projectType === 'webrtc'
                  ? 'Enter the assistant UUID from the voice platform.'
                  : projectType === 'iframe'
                  ? 'Paste the shareable https:// demo URL provided by the AI platform.'
                  : 'Upload an audio/video file or paste a direct media URL.'}
              </p>
            </div>

            {projectType === 'webrtc' && (
              <div className="space-y-1.5">
                <label htmlFor="pf-api-key" className="adm-label flex items-center gap-2">
                  <span>Custom API Key</span>
                  <span className="text-[11px] bg-adm-surface-2 border border-adm-border px-2 py-0.5 rounded text-adm-muted">
                    Optional
                  </span>
                </label>
                <input
                  id="pf-api-key"
                  {...form.register('api_key')}
                  className="adm-input"
                  placeholder="Leave blank to use default key"
                />
                <p className="adm-hint">
                  If this agent lives on a client account, provide its public key here.
                </p>
              </div>
            )}

            <div className="space-y-1.5">
              <label htmlFor="pf-status" className="adm-label">
                Status
              </label>
              <select
                id="pf-status"
                {...form.register('status')}
                className="adm-input"
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div className="flex items-center gap-2.5 pt-2 md:pt-7">
              <input
                type="checkbox"
                id="is_featured"
                {...form.register('is_featured')}
                className="adm-checkbox"
              />
              <label htmlFor="is_featured" className="adm-label cursor-pointer">
                Feature on Home Page
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Required Cover Image */}
      <Card
        className={
          form.formState.errors.cover_image_url ? 'border-adm-danger-border' : ''
        }
      >
        <CardContent className="p-6 space-y-4">
          {showImageAi && (
            <div className="p-4 bg-adm-accent-soft border border-adm-accent/30 rounded-xl space-y-3">
              <h4 className="text-sm font-semibold text-adm-text flex items-center gap-2">
                <Bot className="w-4 h-4 text-adm-accent" />
                Generate Cover Image with AI
              </h4>
              <textarea
                value={imageAiPrompt}
                onChange={(e) => setImageAiPrompt(e.target.value)}
                placeholder="e.g. Minimalist 3D visualization of voice waves over dark architectural glass"
                className="adm-input"
                rows={2}
              />
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowImageAi(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleGenerateCoverImage}
                  disabled={isGeneratingImage}
                >
                  {isGeneratingImage ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    'Generate Image'
                  )}
                </Button>
              </div>
            </div>
          )}

          <AdminImageUpload
            label="Portfolio Cover Image / Graphic"
            hint="Required. PNG, JPG, WebP, GIF, or AVIF up to 5 MB."
            required
            folder="covers"
            prefix="cover"
            aspect="video"
            value={form.watch('cover_image_url') || ''}
            onChange={(url) => {
              setAiCoverError(null)
              form.setValue('cover_image_url', url, { shouldValidate: true })
            }}
            error={
              form.formState.errors.cover_image_url?.message
                ? String(form.formState.errors.cover_image_url.message)
                : aiCoverError || undefined
            }
            extraActions={
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowImageAi(!showImageAi)}
              >
                <Sparkles className="w-4 h-4 mr-2 text-adm-accent" />
                AI Generate
              </Button>
            }
          />
          <input type="hidden" {...form.register('cover_image_url')} />
        </CardContent>
      </Card>

      {/* Additional Media */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-semibold text-adm-text">
                Additional Media Files (Images, Video, Audio, JSON)
              </h3>
              <p className="adm-hint">Attach supplementary screenshots, call recordings, or flow JSON.</p>
            </div>
            <label className="cursor-pointer inline-flex items-center justify-center px-3.5 py-2 rounded-lg bg-adm-accent hover:bg-adm-accent-hover text-adm-accent-fg text-sm font-medium transition-colors">
              <UploadCloud className="w-4 h-4 mr-2" />
              <span>{uploadingMedia ? 'Uploading...' : 'Add Files'}</span>
              <input
                type="file"
                className="hidden"
                multiple
                accept="image/*,video/*,audio/*,.json"
                onChange={handleMediaUpload}
                disabled={uploadingMedia}
              />
            </label>
          </div>
          {mediaUploadError && <p className="adm-error">{mediaUploadError}</p>}

          <div className="space-y-3">
            {mediaFields.map((field, index) => {
              const fileType = form.watch(`media_files.${index}.type`)
              const fileUrl = form.watch(`media_files.${index}.url`) || ''
              const safeImg =
                fileType === 'image' &&
                (isSafeHttpUrl(fileUrl) || (fileUrl.startsWith('/') && !fileUrl.startsWith('//')))
              return (
                <div
                  key={field.id}
                  className="flex flex-wrap sm:flex-nowrap gap-4 items-center p-3 border border-adm-border rounded-xl bg-adm-surface-2/50"
                >
                  <div className="flex-1 min-w-0 flex gap-3.5 items-center">
                    {safeImg ? (
                      <Image
                        src={fileUrl}
                        alt="Media preview"
                        width={48}
                        height={48}
                        unoptimized
                        className="w-12 h-12 object-cover rounded-lg border border-adm-border shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 shrink-0 flex items-center justify-center bg-adm-surface border border-adm-border rounded-lg text-xs font-bold text-adm-muted uppercase">
                        {fileType === 'video'
                          ? 'VID'
                          : fileType === 'audio'
                          ? 'AUD'
                          : fileType === 'json'
                          ? 'JSON'
                          : 'FILE'}
                      </div>
                    )}

                    <div className="flex-1 min-w-0 space-y-1.5">
                      <input
                        {...form.register(`media_files.${index}.name`)}
                        placeholder="File name or description"
                        className="adm-input"
                      />
                      <p className="text-xs text-adm-subtle truncate" title={fileUrl}>
                        {fileUrl}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 shrink-0 w-full sm:w-32">
                    <select
                      {...form.register(`media_files.${index}.type`)}
                      className="adm-input"
                    >
                      <option value="image">Image</option>
                      <option value="video">Video</option>
                      <option value="audio">Audio</option>
                      <option value="json">JSON</option>
                    </select>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeMedia(index)}
                      className="text-adm-danger-text hover:bg-adm-danger-bg hover:border-adm-danger-border"
                    >
                      <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                      Remove
                    </Button>
                  </div>
                </div>
              )
            })}
            {mediaFields.length === 0 && (
              <p className="text-sm text-adm-muted text-center py-4">
                No additional media files added yet.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Case Study */}
      <Card>
        <CardContent className="p-6 space-y-3">
          <label className="adm-label">Case Study Body</label>
          <TipTapEditor
            content={form.watch('case_study_body') || ''}
            onChange={(content) => form.setValue('case_study_body', content)}
          />
        </CardContent>
      </Card>

      {/* Metrics & Integrations */}
      <Card>
        <CardContent className="p-6 space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <label className="adm-label">Key Metrics</label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => appendMetric({ label: '', value: '' })}
              >
                <Plus className="w-4 h-4 mr-1.5" />
                Add Metric
              </Button>
            </div>
            {metricFields.map((field, index) => (
              <div key={field.id} className="flex gap-2 items-start">
                <input
                  {...form.register(`metrics.${index}.label`)}
                  placeholder="Label (e.g. Conversion Rate)"
                  className="adm-input flex-1 min-w-0"
                />
                <input
                  {...form.register(`metrics.${index}.value`)}
                  placeholder="Value (e.g. 34%)"
                  className="adm-input flex-1 min-w-0"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  aria-label="Remove metric"
                  onClick={() => removeMetric(index)}
                  className="text-adm-danger-text hover:bg-adm-danger-bg hover:border-adm-danger-border shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>

          <div className="space-y-3 pt-4 border-t border-adm-border">
            <div className="flex items-center justify-between gap-2">
              <label className="adm-label">Integrations</label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const current = form.getValues('integrations') || []
                  form.setValue('integrations', [...current, ''])
                }}
              >
                <Plus className="w-4 h-4 mr-1.5" />
                Add Integration
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
                  placeholder="e.g. Follow Up Boss, HubSpot, Calendly"
                  className="adm-input flex-1 min-w-0"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  aria-label="Remove integration"
                  onClick={() => {
                    const current = [...form.getValues('integrations')]
                    current.splice(index, 1)
                    form.setValue('integrations', current)
                  }}
                  className="text-adm-danger-text hover:bg-adm-danger-bg hover:border-adm-danger-border shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? 'Saving...'
            : initialData?.id
            ? 'Update Project'
            : 'Create Project'}
        </Button>
      </div>
    </form>
  )
}

const DEFAULT_CATEGORIES = [
  'Sales Automation',
  'IVR Systems',
  'Scheduling Engines',
  'CRM Integrations',
  'Healthcare AI',
  'Real Estate',
  'Solar & Energy',
  'Customer Support',
  'Home Services',
  'Consulting & Agencies',
  'Finance & Insurance',
  'Multi-Language',
  'AI Dashboards',
]

function CategorySelect({
  id,
  value,
  onChange,
}: {
  id: string
  value: string
  onChange: (val: string) => void
}) {
  const [customCategories, setCustomCategories] = useState<string[]>([])
  const [showCustomInput, setShowCustomInput] = useState(false)
  const [customValue, setCustomValue] = useState('')

  const allCategories =
    value &&
    !DEFAULT_CATEGORIES.includes(value) &&
    value !== '__other__' &&
    !customCategories.includes(value)
      ? [...DEFAULT_CATEGORIES, ...customCategories, value]
      : [...DEFAULT_CATEGORIES, ...customCategories]

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value
    if (selected === '__other__') {
      setShowCustomInput(true)
      setCustomValue('')
    } else {
      setShowCustomInput(false)
      onChange(selected)
    }
  }

  const handleCustomSubmit = () => {
    const trimmed = customValue.trim()
    if (!trimmed) return

    if (!allCategories.includes(trimmed)) {
      setCustomCategories((prev) => [...prev, trimmed])
    }
    onChange(trimmed)
    setShowCustomInput(false)
    setCustomValue('')
  }

  const selectValue = showCustomInput
    ? '__other__'
    : allCategories.includes(value)
    ? value
    : value || ''

  return (
    <div className="space-y-2">
      <select
        id={id}
        value={selectValue}
        onChange={handleSelectChange}
        className="adm-input"
      >
        <option value="" disabled>
          Select a category...
        </option>
        {allCategories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
        <option value="__other__">Other (Custom Category)</option>
      </select>

      {showCustomInput && (
        <div className="flex gap-2 items-center">
          <input
            type="text"
            value={customValue}
            onChange={(e) => setCustomValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleCustomSubmit()
              }
            }}
            placeholder="Enter custom category name..."
            className="adm-input flex-1"
            autoFocus
          />
          <Button
            type="button"
            size="sm"
            onClick={handleCustomSubmit}
            disabled={!customValue.trim()}
          >
            Add
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowCustomInput(false)}
          >
            Cancel
          </Button>
        </div>
      )}

      {value && (
        <p className="adm-hint">
          Selected: <span className="font-medium text-adm-accent">{value}</span>
        </p>
      )}
    </div>
  )
}
