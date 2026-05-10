'use client'

import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { deleteTechItem } from './actions'

interface TechItem {
  id: string
  name: string
  category: string
  icon_url: string
  status: string
  display_order: number
}

export function SortableItem({ id, item }: { id: string; item: TechItem }) {
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
    if (window.confirm('Are you sure you want to delete this tech item?')) {
      await deleteTechItem(id)
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative p-5 bg-zinc-950 border-2 border-zinc-900 rounded-xl shadow-sm transition-all duration-300 overflow-hidden ${
        isDragging ? 'shadow-2xl shadow-blue-500/20 ring-2 ring-blue-500 z-50 scale-[1.02]' : 'hover:border-zinc-700 hover:bg-zinc-900/50 hover:shadow-lg hover:shadow-black'
      }`}
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-5 flex-1">
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab p-2 rounded-lg text-zinc-600 hover:text-white hover:bg-zinc-800 transition-all flex-shrink-0"
            title="Drag to reorder"
          >
            <GripVertical className="h-5 w-5" />
          </div>
          
          <div className="w-14 h-14 bg-zinc-900 border border-zinc-800 rounded-lg flex items-center justify-center p-2 group-hover:border-zinc-600 transition-colors shadow-inner flex-shrink-0">
            {item.icon_url ? (
              <img src={item.icon_url} alt={item.name} className="w-full h-full object-contain filter group-hover:brightness-125 transition-all" />
            ) : (
              <span className="text-zinc-600 font-bold text-sm">?</span>
            )}
          </div>
          
          <div>
            <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">{item.name}</h3>
            <p className="text-xs font-bold font-mono tracking-widest text-zinc-500 mt-1 uppercase">{item.category}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full sm:w-auto justify-end border-t sm:border-t-0 border-zinc-800/50 pt-4 sm:pt-0">
          <span className={`px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded-md border ${
            item.status === 'published' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
            item.status === 'draft' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
            'bg-zinc-800 text-zinc-400 border-zinc-700'
          }`}>
            {item.status}
          </span>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild className="bg-zinc-900 text-zinc-400 hover:text-white hover:bg-blue-600 border border-zinc-800 hover:border-transparent transition-all rounded-lg">
              <Link href={`/admin/tech-stack/${id}`}>
                <Edit className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" className="bg-zinc-900 text-zinc-400 hover:text-white hover:bg-red-600 border border-zinc-800 hover:border-transparent transition-all rounded-lg" onClick={handleDelete}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
