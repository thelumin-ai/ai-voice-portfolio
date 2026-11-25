'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { Trash2, UploadCloud } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { isSafeHttpUrl, validateImageFile } from '@/lib/url'
import { getErrorMessage } from '@/lib/errors'
import { Button } from '@/components/ui/button'

interface AdminImageUploadProps {
  value: string
  onChange: (url: string) => void
  folder: string
  prefix?: string
  label?: string
  hint?: string
  required?: boolean
  aspect?: 'video' | 'square' | 'avatar'
  error?: string
  extraActions?: React.ReactNode
  allowManualUrl?: boolean
  placeholderUrl?: string
}

export function AdminImageUpload({
  value,
  onChange,
  folder,
  prefix = 'img',
  label,
  hint = 'PNG, JPG, WebP, GIF, or AVIF up to 5 MB.',
  required = false,
  aspect = 'video',
  error,
  extraActions,
  allowManualUrl = false,
  placeholderUrl = 'https://...',
}: AdminImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const supabase = createClient()

  const trimmedValue = (value || '').trim()
  const isRenderable =
    Boolean(trimmedValue) &&
    (isSafeHttpUrl(trimmedValue) ||
      (trimmedValue.startsWith('/') && !trimmedValue.startsWith('//')))

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const validationError = validateImageFile(file)
    if (validationError) {
      setUploadError(validationError)
      e.target.value = ''
      return
    }

    setIsUploading(true)
    setUploadError(null)

    try {
      const ext = file.name.split('.').pop()?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'png'
      const safeFolder = folder.replace(/[^a-z0-9-_]/gi, '')
      const safePrefix = prefix.replace(/[^a-z0-9-_]/gi, '')
      const fileName = `${safePrefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
      const filePath = `${safeFolder}/${fileName}`

      const { error: storageError } = await supabase.storage
        .from('portfolio_media')
        .upload(filePath, file)

      if (storageError) throw storageError

      const { data } = supabase.storage.from('portfolio_media').getPublicUrl(filePath)
      onChange(data.publicUrl)
    } catch (err: unknown) {
      setUploadError(getErrorMessage(err, 'Failed to upload image'))
    } finally {
      setIsUploading(false)
      e.target.value = ''
    }
  }

  return (
    <div className="space-y-3">
      {(label || extraActions) && (
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            {label && (
              <span className="adm-label inline-flex items-center gap-1">
                {label}
                {required && <span className="text-adm-danger-text">*</span>}
              </span>
            )}
            {hint && <p className="adm-hint mt-0.5">{hint}</p>}
          </div>
          {extraActions && <div className="flex items-center gap-2">{extraActions}</div>}
        </div>
      )}

      {allowManualUrl && (
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="text"
            value={value || ''}
            onChange={(e) => {
              setUploadError(null)
              onChange(e.target.value)
            }}
            placeholder={placeholderUrl}
            className="adm-input flex-1 min-w-[200px]"
          />
          <label className="cursor-pointer inline-flex items-center justify-center gap-2 rounded-lg border border-adm-border bg-adm-surface-2 px-3.5 py-2 text-sm font-medium text-adm-text transition-colors hover:bg-adm-border/60 shrink-0">
            <UploadCloud className="h-4 w-4" />
            <span>{isUploading ? 'Uploading...' : 'Upload'}</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
              disabled={isUploading}
            />
          </label>
          {trimmedValue && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onChange('')}
              aria-label="Remove image"
            >
              <Trash2 className="h-4 w-4 text-adm-danger-text" />
            </Button>
          )}
        </div>
      )}

      {isRenderable ? (
        <div className="rounded-xl border border-adm-border bg-adm-surface-2/60 p-4 space-y-3">
          {aspect === 'avatar' ? (
            <div className="flex items-center gap-4">
              <Image
                src={trimmedValue}
                alt={label || 'Uploaded preview'}
                width={80}
                height={80}
                unoptimized
                className="h-20 w-20 rounded-full border border-adm-border object-cover shrink-0 bg-adm-surface"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs text-adm-muted" title={trimmedValue}>
                  {trimmedValue}
                </p>
              </div>
            </div>
          ) : aspect === 'square' ? (
            <div className="flex items-center gap-4">
              <div className="relative h-20 w-20 overflow-hidden rounded-lg border border-adm-border bg-adm-surface shrink-0 flex items-center justify-center p-2">
                <Image
                  src={trimmedValue}
                  alt={label || 'Uploaded icon preview'}
                  width={64}
                  height={64}
                  unoptimized
                  className="h-14 w-14 object-contain"
                />
              </div>
              <p className="truncate text-xs text-adm-muted flex-1 min-w-0" title={trimmedValue}>
                {trimmedValue}
              </p>
            </div>
          ) : (
            <div className="relative aspect-[16/9] max-w-md mx-auto overflow-hidden rounded-lg border border-adm-border bg-adm-surface">
              <Image
                src={trimmedValue}
                alt={label || 'Uploaded cover preview'}
                fill
                unoptimized
                className="object-cover"
              />
            </div>
          )}

          {!allowManualUrl && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-adm-border pt-3 text-xs">
              <span className="min-w-0 flex-1 truncate text-adm-muted" title={trimmedValue}>
                {trimmedValue}
              </span>
              <div className="flex items-center gap-2 shrink-0">
                <label className="cursor-pointer inline-flex items-center justify-center gap-1.5 rounded-lg border border-adm-border bg-adm-surface px-3 py-1.5 font-medium text-adm-text transition-colors hover:bg-adm-surface-2">
                  <UploadCloud className="h-3.5 w-3.5" />
                  <span>{isUploading ? 'Uploading...' : 'Replace'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                    disabled={isUploading}
                  />
                </label>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => onChange('')}
                  className="h-8 text-xs"
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1" />
                  Remove
                </Button>
              </div>
            </div>
          )}
        </div>
      ) : (
        !allowManualUrl && (
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-adm-border bg-adm-surface-2/40 px-6 py-8 text-center transition-colors hover:border-adm-accent/60 hover:bg-adm-surface-2">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full border border-adm-border bg-adm-accent-soft text-adm-accent">
              <UploadCloud className="h-5 w-5" />
            </div>
            <span className="text-sm font-medium text-adm-text">
              {isUploading ? 'Uploading image...' : 'Select an image file to upload'}
            </span>
            <span className="adm-hint mt-1">{hint}</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
              disabled={isUploading}
            />
          </label>
        )
      )}

      {uploadError && <p className="adm-error">{uploadError}</p>}
      {error && <p className="adm-error">{error}</p>}
    </div>
  )
}
