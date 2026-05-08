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
import { updateProcessStepOrder } from './actions'

interface ProcessStepItem {
  id: string
  title: string
  description: string
  icon_url: string
  status: string
  display_order: number
}

export function SortableList({ initialItems }: { initialItems: ProcessStepItem[] }) {
  const [items, setItems] = useState(initialItems)
  const [isUpdating, setIsUpdating] = useState(false)

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
        
        const updatedItems = newItems.map((item, index) => ({
          ...item,
          display_order: index,
        }))

        setIsUpdating(true)
        updateProcessStepOrder(updatedItems.map(i => ({ id: i.id, display_order: i.display_order })))
          .finally(() => setIsUpdating(false))

        return updatedItems
      })
    }
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500 dark:text-gray-400">
        No process steps found. Click "Add Step" to create one.
      </div>
    )
  }

  return (
    <div className={`space-y-2 ${isUpdating ? 'opacity-50 pointer-events-none' : ''}`}>
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
