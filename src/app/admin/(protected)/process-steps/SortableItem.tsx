'use client'

import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { deleteProcessStep } from './actions'

interface ProcessStepItem {
  id: string
  title: string
  description: string
  icon_url: string
  status: string
  display_order: number
}

export function SortableItem({ id, item }: { id: string; item: ProcessStepItem }) {
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
    if (window.confirm('Are you sure you want to delete this process step?')) {
      await deleteProcessStep(id)
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative flex items-center justify-between p-5 bg-zinc-900/60 border border-zinc-800 rounded-2xl shadow-sm backdrop-blur-sm transition-all duration-300 ${
        isDragging ? 'shadow-2xl shadow-blue-500/20 ring-2 ring-blue-500 z-50 scale-[1.02]' : 'hover:border-blue-500/50 hover:bg-zinc-800/80'
      }`}
    >
      <div className="flex items-center gap-6 flex-1">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab p-2 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-700 transition-all"
          title="Drag to reorder"
        >
          <GripVertical className="h-5 w-5" />
        </div>
        
        <div className="relative">
            <div className="absolute inset-0 bg-blue-500 rounded-full blur-md opacity-20 group-hover:opacity-60 transition-opacity" />
            <div className="relative w-12 h-12 flex items-center justify-center bg-zinc-950 border border-blue-500/30 text-blue-400 rounded-full font-black text-lg shadow-inner">
            {item.display_order + 1}
            </div>
        </div>
        
        <div className="flex-1 pr-4">
          <h3 className="text-lg font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">{item.title}</h3>
          <p className="text-sm text-zinc-400 line-clamp-1">{item.description}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 pl-4 border-l border-zinc-800">
        <span className={`px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded-md border ${
          item.status === 'published' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
          item.status === 'draft' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
          'bg-zinc-800 text-zinc-400 border-zinc-700'
        }`}>
          {item.status}
        </span>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild className="bg-zinc-800 text-zinc-300 hover:text-white hover:bg-blue-600 border border-zinc-700 hover:border-transparent transition-all rounded-lg">
            <Link href={`/admin/process-steps/${id}`}>
              <Edit className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" className="bg-zinc-800 text-zinc-300 hover:text-white hover:bg-red-600 border border-zinc-700 hover:border-transparent transition-all rounded-lg" onClick={handleDelete}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
