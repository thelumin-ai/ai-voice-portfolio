'use client'

import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Edit2, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { deletePortfolioProject } from './actions'

interface Props {
  id: string
  item: {
    id: string
    title: string
    industry_tag: string
    status: string
  }
}

export function SortableItem({ id, item }: Props) {
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
  }

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this project?')) {
      await deletePortfolioProject(id)
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center justify-between p-4 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/10 rounded-lg shadow-sm ${
        isDragging ? 'opacity-50 ring-2 ring-blue-500' : ''
      }`}
    >
      <div className="flex items-center gap-4">
        <button
          className="cursor-grab p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-5 w-5" />
        </button>
        <div>
          <h3 className="font-medium text-gray-900 dark:text-white">{item.title}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{item.industry_tag}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
          item.status === 'published' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
          item.status === 'draft' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
          'bg-gray-100 text-gray-800 dark:bg-zinc-800 dark:text-gray-400'
        }`}>
          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
        </span>
        
        <Link
          href={`/admin/portfolio/${id}`}
          className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
        >
          <Edit2 className="h-4 w-4" />
        </Link>
        <button
          onClick={handleDelete}
          className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
