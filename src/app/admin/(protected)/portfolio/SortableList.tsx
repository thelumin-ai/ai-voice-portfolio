'use client'

import React, { useState, useEffect } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { Edit2, FolderOpen, PlusCircle, Search, X } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { AdminEmptyState, AdminStatusBadge } from '@/components/admin/AdminStates'
import { useAdminToast } from '@/components/admin/AdminToast'
import { isSafeHttpUrl } from '@/lib/url'
import type { PortfolioMetric } from '@/lib/types'
import { SortableItem, PortfolioItem } from './SortableItem'
import { reorderPortfolioProjects } from './actions'

export function SortableList({
  initialItems,
  hasFetchError = false,
}: {
  initialItems: PortfolioItem[]
  hasFetchError?: boolean
}) {
  const [items, setItems] = useState<PortfolioItem[]>(initialItems)
  const [prevInitial, setPrevInitial] = useState<PortfolioItem[]>(initialItems)
  const [isUpdating, setIsUpdating] = useState(false)
  const [previewItem, setPreviewItem] = useState<PortfolioItem | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft' | 'archived'>('all')
  const toast = useAdminToast()

  if (prevInitial !== initialItems) {
    setPrevInitial(initialItems)
    setItems(initialItems)
  }

  useEffect(() => {
    if (!previewItem) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPreviewItem(null)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [previewItem])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const normalizedQuery = searchQuery.trim().toLowerCase()
  const isFiltered = normalizedQuery.length > 0 || statusFilter !== 'all'
  const filteredItems = items.filter((item) => {
    const normalizedStatus = (item.status || 'draft').toLowerCase()
    if (statusFilter !== 'all' && normalizedStatus !== statusFilter) return false
    if (!normalizedQuery) return true
    return (
      (item.title || '').toLowerCase().includes(normalizedQuery) ||
      (item.industry_tag || '').toLowerCase().includes(normalizedQuery) ||
      (item.short_description || '').toLowerCase().includes(normalizedQuery)
    )
  })

  async function handleDragEnd(event: DragEndEvent) {
    if (isFiltered) return
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = items.findIndex((item) => item.id === active.id)
    const newIndex = items.findIndex((item) => item.id === over.id)
    if (oldIndex === -1 || newIndex === -1) return

    const previousItems = items
    const updatedItems = arrayMove(items, oldIndex, newIndex).map((item, index) => ({
      ...item,
      display_order: index,
    }))

    setItems(updatedItems)
    setIsUpdating(true)

    try {
      const res = await reorderPortfolioProjects(
        updatedItems.map((i) => ({ id: i.id, display_order: i.display_order }))
      )
      if (res?.error) {
        setItems(previousItems)
        toast.error(res.error)
      } else {
        toast.success('Portfolio order updated')
      }
    } catch {
      setItems(previousItems)
      toast.error('Failed to reorder portfolio projects')
    } finally {
      setIsUpdating(false)
    }
  }

  if (items.length === 0) {
    if (hasFetchError) {
      return (
        <p className="py-6 text-center text-sm text-adm-muted">
          Fix the error above and click Retry to load portfolio projects.
        </p>
      )
    }
    return (
      <AdminEmptyState
        icon={FolderOpen}
        title="No portfolio projects yet"
        description="Add your first AI voice project with a cover image, metrics, and case study."
        action={
          <Button asChild size="sm">
            <Link href="/admin/portfolio/new">
              <PlusCircle className="w-4 h-4 mr-2" />
              Add Project
            </Link>
          </Button>
        }
      />
    )
  }

  const previewImageUrl = previewItem?.cover_image_url?.trim() || ''
  const hasSafePreviewImage =
    Boolean(previewImageUrl) &&
    (isSafeHttpUrl(previewImageUrl) ||
      (previewImageUrl.startsWith('/') && !previewImageUrl.startsWith('//')))

  return (
    <>
      <div className="mb-4 space-y-2">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1 min-w-0">
            <Search className="w-4 h-4 text-adm-subtle absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects by title, industry, or description..."
              className="adm-input pl-9"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as 'all' | 'published' | 'draft' | 'archived')
            }
            aria-label="Filter projects by status"
            className="adm-input sm:w-48 shrink-0"
          >
            <option value="all">All Statuses ({items.length})</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>
        {isFiltered && (
          <p className="text-xs text-adm-warn-text px-0.5">
            Clear search and status filters to reorder projects cleanly.
          </p>
        )}
      </div>

      {filteredItems.length === 0 ? (
        <div className="rounded-xl border border-adm-border bg-adm-surface-2/40 p-8 text-center text-sm text-adm-muted">
          No portfolio projects match your current filter.
        </div>
      ) : (
        <div className={`space-y-3 ${isUpdating ? 'opacity-60 pointer-events-none' : ''}`}>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={filteredItems.map((item) => item.id)}
              strategy={verticalListSortingStrategy}
            >
              {filteredItems.map((item) => (
                <SortableItem
                  key={item.id}
                  id={item.id}
                  item={item}
                  reorderDisabled={isFiltered}
                  onPreview={(itemToPreview) => setPreviewItem(itemToPreview)}
                />
              ))}
            </SortableContext>
          </DndContext>
        </div>
      )}

      {/* Admin Full Portfolio Preview Modal */}
      {previewItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-sm"
          onClick={() => setPreviewItem(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={previewItem.title || 'Portfolio Preview'}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-3xl max-h-[90vh] flex flex-col bg-adm-surface border border-adm-border rounded-2xl shadow-2xl overflow-hidden text-adm-text"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-4 border-b border-adm-border bg-adm-surface-2/60">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 min-w-0">
                <span className="text-xs font-semibold text-adm-accent uppercase tracking-wider">
                  {previewItem.industry_tag || 'Portfolio Preview'}
                </span>
                <AdminStatusBadge status={previewItem.status} />
                {previewItem.is_featured && (
                  <span className="px-2 py-0.5 text-xs font-semibold rounded border border-adm-info-border bg-adm-info-bg text-adm-info-text">
                    Featured
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => setPreviewItem(null)}
                className="p-1.5 rounded-lg text-adm-muted hover:text-adm-text hover:bg-adm-surface-2 transition-colors shrink-0"
                aria-label="Close preview"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 custom-scrollbar">
              {hasSafePreviewImage ? (
                <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden border border-adm-border bg-adm-surface-2">
                  <Image
                    src={previewImageUrl}
                    alt={previewItem.title || 'Project cover'}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="h-40 rounded-xl bg-adm-surface-2/60 border border-adm-border flex items-center justify-center text-adm-muted text-sm">
                  No Cover Image Uploaded
                </div>
              )}

              <div>
                <h2 className="text-2xl font-bold text-adm-text tracking-tight">
                  {previewItem.title || 'Untitled Project'}
                </h2>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-xs text-adm-muted">
                  <span>
                    Type:{' '}
                    <strong className="text-adm-text uppercase">
                      {previewItem.project_type || 'WebRTC'}
                    </strong>
                  </span>
                  {previewItem.voice_platform && (
                    <span>
                      Platform:{' '}
                      <strong className="text-adm-text uppercase">
                        {previewItem.voice_platform}
                      </strong>
                    </span>
                  )}
                  {previewItem.media_url && (
                    <span className="truncate max-w-full sm:max-w-xs" title={previewItem.media_url}>
                      Media / ID:{' '}
                      <strong className="text-adm-text">{previewItem.media_url}</strong>
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-adm-muted border-b border-adm-border pb-1.5">
                  <span className="font-semibold uppercase tracking-wider text-adm-text">
                    Complete Description
                  </span>
                  <span className="font-mono">
                    {(previewItem.short_description || '').length.toLocaleString()} / 2,500 characters
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-adm-surface-2/60 border border-adm-border text-sm text-adm-text leading-relaxed whitespace-pre-wrap break-words">
                  {previewItem.short_description || 'No description provided.'}
                </div>
              </div>

              {previewItem.metrics &&
                Array.isArray(previewItem.metrics) &&
                previewItem.metrics.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-adm-muted">
                      Key Metrics
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {previewItem.metrics.map((metric: PortfolioMetric, idx: number) => (
                        <div
                          key={idx}
                          className="p-3 bg-adm-surface-2/60 border border-adm-border rounded-lg"
                        >
                          <div className="text-lg font-bold text-adm-accent">
                            {metric.value || '-'}
                          </div>
                          <div className="text-[11px] text-adm-muted uppercase font-medium">
                            {metric.label || '-'}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {previewItem.integrations &&
                Array.isArray(previewItem.integrations) &&
                previewItem.integrations.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-adm-muted">
                      Integrations
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {previewItem.integrations.map((integration: string, idx: number) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 bg-adm-surface-2 border border-adm-border text-xs text-adm-text rounded-md"
                        >
                          {integration}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-4 border-t border-adm-border bg-adm-surface-2/60">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setPreviewItem(null)}
              >
                Close Preview
              </Button>
              <Button asChild size="sm">
                <Link href={`/admin/portfolio/${previewItem.id}`}>
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit Project
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
