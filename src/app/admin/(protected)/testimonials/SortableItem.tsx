'use client'

import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { deleteTestimonial } from './actions'

interface TestimonialItem {
  id: string
  client_name: string
  company: string
  status: string
  display_order: number
}

export function SortableItem({ id, item }: { id: string; item: TestimonialItem }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.5 : 1,
  }

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this testimonial?')) {
      await deleteTestimonial(id)
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center justify-between p-4 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg shadow-sm"
    >
      <div className="flex items-center gap-4 flex-1">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab hover:bg-gray-100 dark:hover:bg-zinc-800 p-2 rounded"
        >
          <GripVertical className="h-5 w-5 text-gray-500" />
        </div>
        
        <div>
          <h3 className="font-medium text-gray-900 dark:text-gray-100">
            {item.client_name}
            {item.company && <span className="text-gray-500 dark:text-gray-400 font-normal"> - {item.company}</span>}
          </h3>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <span className={`px-2 py-1 text-xs rounded-full ${
          item.status === 'published' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
          item.status === 'draft' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
          'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
        }`}>
          {item.status}
        </span>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/admin/testimonials/${id}`}>
              <Edit className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/50" onClick={handleDelete}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
