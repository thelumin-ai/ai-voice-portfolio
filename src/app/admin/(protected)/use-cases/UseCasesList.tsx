'use client'

import React, { useState } from 'react'
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
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ExternalLink,
  GripVertical,
  Layers,
  Pencil,
  Plus,
  Search,
  Trash2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  AdminConfirmDialog,
  AdminEmptyState,
  AdminStatusBadge,
} from '@/components/admin/AdminStates'
import { useAdminToast } from '@/components/admin/AdminToast'
import { deleteUseCase, updateUseCaseOrder } from './actions'

export interface UseCaseListItem {
  id: string
  industry_slug?: string | null
  name?: string | null
  headline?: string | null
  status?: string | null
  display_order?: number | null
}

function SortableUseCaseRow({
  item,
  reorderDisabled,
  onRequestDelete,
}: {
  item: UseCaseListItem
  reorderDisabled: boolean
  onRequestDelete: (item: UseCaseListItem) => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id, disabled: reorderDisabled })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.65 : 1,
  }

  const nameLabel = item.name?.trim() || 'Untitled Use Case'
  const slugLabel = item.industry_slug?.trim() || ''

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`rounded-xl border border-adm-border bg-adm-surface-2/40 p-4 transition-all ${
        isDragging
          ? 'ring-2 ring-adm-accent shadow-xl bg-adm-surface'
          : 'hover:border-adm-accent/40 hover:bg-adm-surface-2/80'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 min-w-0 flex-1">
          <button
            type="button"
            disabled={reorderDisabled}
            className={`p-2 rounded-lg shrink-0 transition-colors ${
              reorderDisabled
                ? 'text-adm-subtle opacity-40 cursor-not-allowed'
                : 'cursor-grab text-adm-muted hover:text-adm-text hover:bg-adm-surface active:cursor-grabbing'
            }`}
            {...(reorderDisabled ? {} : attributes)}
            {...(reorderDisabled ? {} : listeners)}
            aria-label={`Drag to reorder ${nameLabel}`}
            title={reorderDisabled ? 'Clear filters to reorder' : 'Drag to reorder'}
          >
            <GripVertical className="h-4 w-4" />
          </button>

          <div className="w-10 h-10 rounded-lg bg-adm-accent-soft border border-adm-accent/25 flex items-center justify-center text-adm-accent shrink-0">
            <Layers className="w-5 h-5" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm sm:text-base font-semibold text-adm-text truncate">
                {nameLabel}
              </h3>
              {slugLabel && (
                <span className="text-xs font-mono text-adm-subtle truncate">
                  /use-cases/{slugLabel}
                </span>
              )}
            </div>
            {item.headline && (
              <p className="text-xs sm:text-sm text-adm-muted line-clamp-1 mt-0.5">
                {item.headline}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-2 border-t sm:border-t-0 border-adm-border pt-3 sm:pt-0 shrink-0">
          <AdminStatusBadge status={item.status} />

          <div className="flex items-center gap-1.5">
            {slugLabel && item.status === 'published' && (
              <Button variant="outline" size="icon" asChild>
                <a
                  href={`/use-cases/${slugLabel}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`View ${nameLabel} page`}
                  title="Open live use case page"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </Button>
            )}
            <Button variant="outline" size="icon" asChild>
              <Link href={`/admin/use-cases/${item.id}`} aria-label={`Edit ${nameLabel}`}>
                <Pencil className="w-4 h-4" />
              </Link>
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label={`Delete ${nameLabel}`}
              onClick={() => onRequestDelete(item)}
              className="text-adm-danger-text hover:bg-adm-danger-bg hover:border-adm-danger-border"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function UseCasesList({
  initialItems,
  hasFetchError = false,
}: {
  initialItems: UseCaseListItem[]
  hasFetchError?: boolean
}) {
  const router = useRouter()
  const toast = useAdminToast()
  const [items, setItems] = useState<UseCaseListItem[]>(initialItems)
  const [prevInitial, setPrevInitial] = useState<UseCaseListItem[]>(initialItems)
  const [isUpdating, setIsUpdating] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft' | 'archived'>('all')
  const [deleteTarget, setDeleteTarget] = useState<UseCaseListItem | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  if (prevInitial !== initialItems) {
    setPrevInitial(initialItems)
    setItems(initialItems)
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const query = searchQuery.trim().toLowerCase()
  const isFiltered = query.length > 0 || statusFilter !== 'all'
  const filteredItems = items.filter((item) => {
    const normalizedStatus = (item.status || 'draft').toLowerCase()
    if (statusFilter !== 'all' && normalizedStatus !== statusFilter) return false
    if (!query) return true
    return (
      (item.name || '').toLowerCase().includes(query) ||
      (item.industry_slug || '').toLowerCase().includes(query) ||
      (item.headline || '').toLowerCase().includes(query)
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
      const res = await updateUseCaseOrder(
        updatedItems.map((i) => ({ id: i.id, display_order: i.display_order ?? 0 }))
      )
      if (res?.error) {
        setItems(previousItems)
        toast.error(res.error)
      } else {
        toast.success('Use case order updated')
      }
    } catch {
      setItems(previousItems)
      toast.error('Failed to reorder use cases')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return
    setIsDeleting(true)
    try {
      const res = await deleteUseCase(deleteTarget.id)
      if (res?.error) {
        toast.error(res.error)
      } else {
        setItems((prev) => prev.filter((u) => u.id !== deleteTarget.id))
        toast.success(`Deleted "${deleteTarget.name || 'Use Case'}"`)
        setDeleteTarget(null)
        router.refresh()
      }
    } catch {
      toast.error('Failed to delete use case')
    } finally {
      setIsDeleting(false)
    }
  }

  if (items.length === 0) {
    if (hasFetchError) {
      return (
        <p className="py-6 text-center text-sm text-adm-muted">
          Fix the error above and click Retry to load use cases.
        </p>
      )
    }
    return (
      <AdminEmptyState
        icon={Layers}
        title="No use cases in database yet"
        description="Click Sync All 12 Defaults above to load the full set of dedicated industry & capability pages."
        action={
          <Button asChild size="sm">
            <Link href="/admin/use-cases/new">
              <Plus className="w-4 h-4 mr-2" />
              Add Use Case
            </Link>
          </Button>
        }
      />
    )
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1 min-w-0">
            <Search className="w-4 h-4 text-adm-subtle absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search use cases by industry, slug, or headline..."
              className="adm-input pl-9"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as 'all' | 'published' | 'draft' | 'archived')
            }
            aria-label="Filter use cases by status"
            className="adm-input sm:w-48 shrink-0"
          >
            <option value="all">All Statuses ({items.length})</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>
        {isFiltered && (
          <p className="text-xs text-adm-warn-text">
            Clear search and status filters to drag-and-drop reorder use cases.
          </p>
        )}
      </div>

      {filteredItems.length === 0 ? (
        <div className="rounded-xl border border-adm-border bg-adm-surface-2/40 p-8 text-center text-sm text-adm-muted">
          No use cases match your current filter.
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
                <SortableUseCaseRow
                  key={item.id}
                  item={item}
                  reorderDisabled={isFiltered}
                  onRequestDelete={(target) => setDeleteTarget(target)}
                />
              ))}
            </SortableContext>
          </DndContext>
        </div>
      )}

      <AdminConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete use case?"
        description={`This will remove "${deleteTarget?.name || 'this use case'}" from the database.`}
        confirmLabel="Delete"
        loading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
