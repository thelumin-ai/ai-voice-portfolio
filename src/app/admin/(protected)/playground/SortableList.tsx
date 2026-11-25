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
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import Link from 'next/link'
import { PlayCircle, PlusCircle, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AdminEmptyState } from '@/components/admin/AdminStates'
import { useAdminToast } from '@/components/admin/AdminToast'
import { SortableItem, type PlaygroundItem } from './SortableItem'
import { updatePlaygroundOrder } from './actions'

export function SortableList({
  initialItems,
  hasFetchError = false,
}: {
  initialItems: PlaygroundItem[]
  hasFetchError?: boolean
}) {
  const [items, setItems] = useState(initialItems)
  const [prevInitial, setPrevInitial] = useState(initialItems)
  const [isUpdating, setIsUpdating] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft' | 'archived'>('all')
  const toast = useAdminToast()

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
      (item.title || '').toLowerCase().includes(query) ||
      (item.category || '').toLowerCase().includes(query) ||
      (item.description || '').toLowerCase().includes(query)
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
      const res = await updatePlaygroundOrder(
        updatedItems.map((i) => ({ id: i.id, display_order: i.display_order }))
      )
      if (res?.error) {
        setItems(previousItems)
        toast.error(res.error)
      } else {
        toast.success('Playground order updated')
      }
    } catch {
      setItems(previousItems)
      toast.error('Failed to update order')
    } finally {
      setIsUpdating(false)
    }
  }

  if (items.length === 0) {
    if (hasFetchError) {
      return (
        <p className="py-6 text-center text-sm text-adm-muted">
          Fix the error above and click Retry to load playground apps.
        </p>
      )
    }
    return (
      <AdminEmptyState
        icon={PlayCircle}
        title="No playground apps yet"
        description="Add an interactive demo URL so visitors can test your AI agents live."
        action={
          <Button asChild size="sm">
            <Link href="/admin/playground/new">
              <PlusCircle className="w-4 h-4 mr-2" />
              Add App
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
              placeholder="Search apps by title, category, or description..."
              className="adm-input pl-9"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as 'all' | 'published' | 'draft' | 'archived')
            }
            aria-label="Filter playground apps by status"
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
            Clear search and status filters to drag-and-drop reorder apps.
          </p>
        )}
      </div>

      {filteredItems.length === 0 ? (
        <div className="rounded-xl border border-adm-border bg-adm-surface-2/40 p-8 text-center text-sm text-adm-muted">
          No playground apps match your current filter.
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
                />
              ))}
            </SortableContext>
          </DndContext>
        </div>
      )}
    </div>
  )
}
