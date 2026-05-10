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
    cover_image_url: string
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
      className={`group relative overflow-hidden bg-zinc-900/40 rounded-2xl border border-zinc-800/50 backdrop-blur-sm transition-all duration-300 ${
        isDragging ? 'opacity-70 scale-105 shadow-2xl shadow-blue-500/20 ring-2 ring-blue-500 z-50' : 'hover:border-zinc-700/50 hover:shadow-lg hover:shadow-black/50'
      }`}
    >
      <div className="flex flex-col sm:flex-row h-full">
        {/* Image Section */}
        <div className="relative w-full sm:w-48 h-32 sm:h-full bg-zinc-950 flex-shrink-0">
           {item.cover_image_url ? (
             <img src={item.cover_image_url} alt={item.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
           ) : (
             <div className="w-full h-full flex items-center justify-center bg-zinc-800/50 text-zinc-500">No Image</div>
           )}
           <div className="absolute inset-0 bg-gradient-to-r from-transparent to-zinc-900/90 sm:to-zinc-900/40" />
        </div>

        {/* Content Section */}
        <div className="flex-1 p-5 flex flex-col justify-center">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-bold text-lg text-white group-hover:text-blue-400 transition-colors">{item.title}</h3>
              <p className="text-sm font-medium text-zinc-400 mt-1 uppercase tracking-wider">{item.industry_tag}</p>
            </div>
            <span className={`px-2.5 py-1 text-xs font-bold rounded-md border ${
              item.status === 'published' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
              item.status === 'draft' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
              'bg-zinc-800 text-zinc-400 border-zinc-700'
            }`}>
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </span>
          </div>
        </div>

        {/* Actions Section */}
        <div className="flex sm:flex-col items-center justify-between sm:justify-center gap-2 p-4 sm:p-5 bg-zinc-950/30 sm:border-l border-zinc-800/50">
          <button
            className="cursor-grab p-2.5 rounded-lg bg-zinc-800/50 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-all active:cursor-grabbing"
            {...attributes}
            {...listeners}
            title="Drag to reorder"
          >
            <GripVertical className="h-4 w-4" />
          </button>
          
          <div className="flex sm:flex-col items-center gap-2">
            <Link
              href={`/admin/portfolio/${id}`}
              className="p-2.5 rounded-lg bg-zinc-800/50 text-zinc-400 hover:text-white hover:bg-blue-600 transition-all"
            >
              <Edit2 className="h-4 w-4" />
            </Link>
            <button
              onClick={handleDelete}
              className="p-2.5 rounded-lg bg-zinc-800/50 text-zinc-400 hover:text-white hover:bg-red-600 transition-all"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
