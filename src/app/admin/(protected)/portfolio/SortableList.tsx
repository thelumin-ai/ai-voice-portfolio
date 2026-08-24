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
import { X, Edit2, ExternalLink, Sparkles, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function SortableList({ initialItems }: { initialItems: PortfolioItem[] }) {
  const [items, setItems] = useState<PortfolioItem[]>(initialItems)
  const [isUpdating, setIsUpdating] = useState(false)
  const [previewItem, setPreviewItem] = useState<PortfolioItem | null>(null)

  // Update items when initialItems changes
  useEffect(() => {
    setItems(initialItems)
  }, [initialItems])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)

        const newItems = arrayMove(items, oldIndex, newIndex)
        
        // Update display_order based on new array index
        const updatedItems = newItems.map((item, index) => ({
          ...item,
          display_order: index,
        }))

        // Call server action to save order
        setIsUpdating(true)
        reorderPortfolioProjects(updatedItems.map(i => ({ id: i.id, display_order: i.display_order })))
          .finally(() => setIsUpdating(false))

        return updatedItems
      })
    }
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500 dark:text-gray-400">
        No portfolio projects found. Click "Add Project" to create one.
      </div>
    )
  }

  return (
    <>
      <div className={`space-y-3 ${isUpdating ? 'opacity-50 pointer-events-none' : ''}`}>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={items.map((item) => item.id)}
            strategy={verticalListSortingStrategy}
          >
            {items.map((item) => (
              <SortableItem
                key={item.id}
                id={item.id}
                item={item}
                onPreview={(itemToPreview) => setPreviewItem(itemToPreview)}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>

      {/* Admin Full Portfolio Preview Modal */}
      {previewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden text-zinc-100">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-950/60">
              <div className="flex items-center gap-3">
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
                onClick={() => setPreviewItem(null)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                aria-label="Close preview"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Full Cover Image */}
              {previewItem.cover_image_url ? (
                <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950">
                  <img
                    src={previewItem.cover_image_url}
                    alt={previewItem.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="h-40 rounded-xl bg-zinc-800/40 border border-zinc-800 flex items-center justify-center text-zinc-500 text-sm">
                  No Cover Image Uploaded
                </div>
              )}

              {/* Title & Metadata */}
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">{previewItem.title}</h2>
                <div className="flex items-center gap-4 mt-2 text-xs text-zinc-400">
                  <span>Type: <strong className="text-zinc-200 uppercase">{previewItem.project_type || 'WebRTC'}</strong></span>
                  {previewItem.voice_platform && (
                    <span>Platform: <strong className="text-zinc-200 uppercase">{previewItem.voice_platform}</strong></span>
                  )}
                  {previewItem.media_url && (
                    <span className="truncate max-w-xs" title={previewItem.media_url}>
                      Media / ID: <strong className="text-zinc-200">{previewItem.media_url}</strong>
                    </span>
                  )}
                </div>
              </div>

              {/* Full 2,500-Character Description */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-zinc-400 border-b border-zinc-800/80 pb-1.5">
                  <span className="font-semibold uppercase tracking-wider text-zinc-300">Complete Description</span>
                  <span className="font-mono">
                    {(previewItem.short_description || '').length.toLocaleString()} / 2,500 characters
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800 text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">
                  {previewItem.short_description || 'No description provided.'}
                </div>
              </div>

              {/* Metrics (if any) */}
              {previewItem.metrics && Array.isArray(previewItem.metrics) && previewItem.metrics.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Key Metrics</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {previewItem.metrics.map((metric: any, idx: number) => (
                      <div key={idx} className="p-3 bg-zinc-950/50 border border-zinc-800 rounded-lg">
                        <div className="text-lg font-bold text-blue-400">{metric.value || '-'}</div>
                        <div className="text-[11px] text-zinc-400 uppercase font-medium">{metric.label || '-'}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Integrations (if any) */}
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
            <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-800 bg-zinc-950/60">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPreviewItem(null)}
                className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
              >
                Close Preview
              </Button>
              <Link href={`/admin/portfolio/${previewItem.id}`}>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-500 text-white">
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

