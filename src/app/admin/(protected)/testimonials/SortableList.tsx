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
import { SortableItem } from './SortableItem'
import { updateTestimonialOrder } from './actions'

interface TestimonialItem {
  id: string
  client_name: string
  company: string
  status: string
  display_order: number
}

export function SortableList({ initialItems }: { initialItems: TestimonialItem[] }) {
  const [items, setItems] = useState(initialItems)
  const [isUpdating, setIsUpdating] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

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
      const res = await updateTestimonialOrder(
        updatedItems.map(i => ({ id: i.id, display_order: i.display_order }))
      )
      if (res?.error) {
        setItems(previousItems)
        setErrorMsg(res.error)
      }
    } catch {
      setItems(previousItems)
      setErrorMsg('Failed to update order')
    } finally {
      setIsUpdating(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-10 text-gray-400">
        No testimonials found. Click &ldquo;Add Testimonial&rdquo; to create one.
      </div>
    )
  }

  return (
    <div className={`space-y-2 ${isUpdating ? 'opacity-50 pointer-events-none' : ''}`}>
      {errorMsg && (
        <div className="mb-3 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {errorMsg}
        </div>
      )}
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
            <SortableItem key={item.id} id={item.id} item={item} />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  )
}
