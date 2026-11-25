'use client'

import React, { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Edit2, Eye, GripVertical, Trash2 } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { AdminConfirmDialog, AdminStatusBadge } from '@/components/admin/AdminStates'
import { useAdminToast } from '@/components/admin/AdminToast'
import { isSafeHttpUrl } from '@/lib/url'
import type { PortfolioMediaFile, PortfolioMetric } from '@/lib/types'
import { deletePortfolioProject } from './actions'

export interface PortfolioItem {
  id: string
  title?: string | null
  industry_tag?: string | null
  short_description?: string | null
  case_study_body?: string | null
  metrics?: PortfolioMetric[] | string
  integrations?: string[]
  media_files?: PortfolioMediaFile[]
  project_type?: 'webrtc' | 'audio' | 'video' | 'iframe'
  media_url?: string | null
  api_key?: string | null
  cover_image_url?: string | null
  voice_platform?: string | null
  status?: string | null
  is_featured?: boolean | null
  display_order: number
}

interface Props {
  id: string
  item: PortfolioItem
  onPreview: (item: PortfolioItem) => void
  reorderDisabled?: boolean
}

export function SortableItem({ id, item, onPreview, reorderDisabled = false }: Props) {
  const router = useRouter()
  const toast = useAdminToast()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled: reorderDisabled })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
  }

  const displayTitle = item.title?.trim() || 'Untitled Project'
  const coverUrl = item.cover_image_url?.trim() || ''
  const hasSafeCover =
    Boolean(coverUrl) &&
    (isSafeHttpUrl(coverUrl) || (coverUrl.startsWith('/') && !coverUrl.startsWith('//')))

  const desc = item.short_description || ''
  const previewDesc = desc.length > 400 ? `${desc.slice(0, 400)}...` : desc

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const res = await deletePortfolioProject(id)
      if (res?.error) {
        toast.error(res.error)
      } else {
        toast.success(`Deleted "${displayTitle}"`)
        setConfirmOpen(false)
        router.refresh()
      }
    } catch {
      toast.error('Failed to delete portfolio project')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className={`group relative overflow-hidden rounded-xl border border-adm-border bg-adm-surface-2/40 transition-all ${
          isDragging
            ? 'opacity-85 shadow-2xl ring-2 ring-adm-accent bg-adm-surface z-50'
            : 'hover:border-adm-accent/40 hover:bg-adm-surface-2/75'
        }`}
      >
        <div className="flex flex-col sm:flex-row">
          <div className="relative w-full sm:w-48 sm:min-w-[12rem] h-36 sm:h-auto bg-adm-surface-2 flex-shrink-0 overflow-hidden border-b sm:border-b-0 sm:border-r border-adm-border">
            {hasSafeCover ? (
              <Image
                src={coverUrl}
                alt={displayTitle}
                fill
                unoptimized
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-adm-subtle text-xs font-medium">
                No Image
              </div>
            )}
          </div>

          <div className="flex-1 p-4 sm:p-5 flex flex-col justify-center min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-xs font-semibold text-adm-accent uppercase tracking-wider">
                    {item.industry_tag || 'AI Automation'}
                  </span>
                  {item.is_featured && (
                    <span className="px-2 py-0.5 text-[10px] font-semibold rounded border border-adm-info-border bg-adm-info-bg text-adm-info-text">
                      Featured
                    </span>
                  )}
                </div>
                <h3 className="font-semibold text-base sm:text-lg text-adm-text truncate">
                  {displayTitle}
                </h3>
              </div>
              <AdminStatusBadge status={item.status} />
            </div>

            {desc && (
              <p className="text-xs sm:text-sm text-adm-muted mt-2 line-clamp-2 sm:line-clamp-3 leading-relaxed">
                {previewDesc}
              </p>
            )}
          </div>

          <div className="flex sm:flex-col items-center justify-between sm:justify-center gap-2 p-3 sm:p-4 bg-adm-surface-2/60 border-t sm:border-t-0 sm:border-l border-adm-border flex-shrink-0">
            <button
              type="button"
              disabled={reorderDisabled}
              className={`p-2 rounded-lg transition-colors ${
                reorderDisabled
                  ? 'text-adm-subtle opacity-40 cursor-not-allowed'
                  : 'cursor-grab text-adm-muted hover:text-adm-text hover:bg-adm-surface active:cursor-grabbing'
              }`}
              {...(reorderDisabled ? {} : attributes)}
              {...(reorderDisabled ? {} : listeners)}
              aria-label={`Drag to reorder ${displayTitle}`}
              title={reorderDisabled ? 'Clear filters to reorder' : 'Drag to reorder'}
            >
              <GripVertical className="h-4 w-4" />
            </button>

            <div className="flex sm:flex-col items-center gap-1.5">
              <button
                type="button"
                onClick={() => onPreview(item)}
                aria-label={`Preview ${displayTitle}`}
                title="Preview full portfolio details"
                className="p-2 rounded-lg border border-adm-border bg-adm-surface text-adm-muted hover:text-adm-text hover:bg-adm-surface-2 transition-colors"
              >
                <Eye className="h-4 w-4" />
              </button>
              <Link
                href={`/admin/portfolio/${id}`}
                aria-label={`Edit ${displayTitle}`}
                title="Edit project"
                className="p-2 rounded-lg border border-adm-border bg-adm-surface text-adm-muted hover:text-adm-accent-fg hover:bg-adm-accent hover:border-adm-accent transition-colors"
              >
                <Edit2 className="h-4 w-4" />
              </Link>
              <button
                type="button"
                onClick={() => setConfirmOpen(true)}
                aria-label={`Delete ${displayTitle}`}
                title="Delete project"
                className="p-2 rounded-lg border border-adm-border bg-adm-surface text-adm-danger-text hover:bg-adm-danger-bg hover:border-adm-danger-border transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <AdminConfirmDialog
        open={confirmOpen}
        title="Delete portfolio project?"
        description={`This will permanently remove "${displayTitle}" and its uploaded cover image.`}
        confirmLabel="Delete"
        loading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  )
}
