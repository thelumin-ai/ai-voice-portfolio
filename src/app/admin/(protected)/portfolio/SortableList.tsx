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
import { SortableItem, PortfolioItem } from './SortableItem'
import { reorderPortfolioProjects } from './actions'
import { X, Edit2, Search } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import type { PortfolioMetric } from '@/lib/types'

export function SortableList({ initialItems }: { initialItems: PortfolioItem[] }) {
  const [items, setItems] = useState<PortfolioItem[]>(initialItems)
  const [isUpdating, setIsUpdating] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [previewItem, setPreviewItem] = useState<PortfolioItem | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft' | 'archived'>('all')

  useEffect(() => {
    setItems(initialItems)
  }, [initialItems])

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
    if (statusFilter !== 'all' && item.status !== statusFilter) return false
    if (!normalizedQuery) return true
    return (
      item.title.toLowerCase().includes(normalizedQuery) ||
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
    setErrorMsg(null)
    setIsUpdating(true)

    try {
      const res = await reorderPortfolioProjects(
        updatedItems.map(i => ({ id: i.id, display_order: i.display_order }))
      )
      if (res?.error) {
        setItems(previousItems)
        setErrorMsg(res.error)
      }
    } catch {
      setItems(previousItems)
      setErrorMsg('Failed to reorder portfolio projects')
    } finally {
      setIsUpdating(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-10 text-gray-400">
        No portfolio projects found. Click &ldquo;Add Project&rdquo; to create one.
      </div>
    )
  }

  return (
    <>
      {errorMsg && (
        <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {errorMsg}
        </div>
      )}

      <div className="mb-4 space-y-2">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-zinc-900/40 p-3 rounded-xl border border-zinc-800/50">
          <div className="relative flex-1 min-w-0">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects by title, industry, or description..."
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | 'published' | 'draft' | 'archived')}
            aria-label="Filter projects by status"
            className="px-3 py-2 text-sm rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-200 focus:outline-none focus:border-blue-500 shrink-0"
          >
            <option value="all">All Statuses ({items.length})</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>
        {isFiltered && (
          <p className="text-xs text-amber-400 px-1">
            Clear filters to reorder projects cleanly.
          </p>
        )}
      </div>

      {filteredItems.length === 0 ? (
        <div className="p-10 text-center bg-zinc-900/30 rounded-2xl border border-zinc-800/50 text-zinc-400 text-sm">
          No portfolio projects match your current filter.
        </div>
      ) : (
        <div className={`space-y-3 ${isUpdating ? 'opacity-50 pointer-events-none' : ''}`}>
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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm"
          onClick={() => setPreviewItem(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={previewItem.title}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-3xl max-h-[90vh] flex flex-col bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden text-zinc-100"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-4 border-b border-zinc-800 bg-zinc-950/60">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 min-w-0">
                <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
                  {previewItem.industry_tag || 'Portfolio Preview'}
                </span>
                <span
                  className={`px-2 py-0.5 text-xs font-bold rounded-md border ${
                    previewItem.status === 'published'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : previewItem.status === 'draft'
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                  }`}
                >
                  {previewItem.status.charAt(0).toUpperCase() + previewItem.status.slice(1)}
                </span>
                {previewItem.is_featured && (
                  <span className="px-2 py-0.5 text-xs font-bold rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    Featured
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => setPreviewItem(null)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors shrink-0"
                aria-label="Close preview"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 custom-scrollbar">
              {previewItem.cover_image_url ? (
                <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950">
                  <Image
                    src={previewItem.cover_image_url}
                    alt={previewItem.title}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="h-40 rounded-xl bg-zinc-800/40 border border-zinc-800 flex items-center justify-center text-zinc-500 text-sm">
                  No Cover Image Uploaded
                </div>
              )}

              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">{previewItem.title}</h2>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-xs text-zinc-400">
                  <span>Type: <strong className="text-zinc-200 uppercase">{previewItem.project_type || 'WebRTC'}</strong></span>
                  {previewItem.voice_platform && (
                    <span>Platform: <strong className="text-zinc-200 uppercase">{previewItem.voice_platform}</strong></span>
                  )}
                  {previewItem.media_url && (
                    <span className="truncate max-w-full sm:max-w-xs" title={previewItem.media_url}>
                      Media / ID: <strong className="text-zinc-200">{previewItem.media_url}</strong>
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-zinc-400 border-b border-zinc-800/80 pb-1.5">
                  <span className="font-semibold uppercase tracking-wider text-zinc-300">Complete Description</span>
                  <span className="font-mono">
                    {(previewItem.short_description || '').length.toLocaleString()} / 2,500 characters
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800 text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap break-words">
                  {previewItem.short_description || 'No description provided.'}
                </div>
              </div>

              {previewItem.metrics && Array.isArray(previewItem.metrics) && previewItem.metrics.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Key Metrics</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {previewItem.metrics.map((metric: PortfolioMetric, idx: number) => (
                      <div key={idx} className="p-3 bg-zinc-950/50 border border-zinc-800 rounded-lg">
                        <div className="text-lg font-bold text-blue-400">{metric.value || '-'}</div>
                        <div className="text-[11px] text-zinc-400 uppercase font-medium">{metric.label || '-'}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {previewItem.integrations && Array.isArray(previewItem.integrations) && previewItem.integrations.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Integrations</h4>
                  <div className="flex flex-wrap gap-2">
                    {previewItem.integrations.map((integration: string, idx: number) => (
                      <span key={idx} className="px-2.5 py-1 bg-zinc-800 border border-zinc-700 text-xs text-zinc-300 rounded-md">
                        {integration}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-4 border-t border-zinc-800 bg-zinc-950/60">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setPreviewItem(null)}
                className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
              >
                Close Preview
              </Button>
              <Link href={`/admin/portfolio/${previewItem.id}`}>
                <Button type="button" size="sm" className="bg-blue-600 hover:bg-blue-500 text-white">
                  <Edit2 className="w-4 h-4 mr-2" /> Edit Project
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
