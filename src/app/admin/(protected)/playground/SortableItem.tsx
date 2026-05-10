'use client'

import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { deletePlaygroundApp } from './actions'

interface PlaygroundItem {
  id: string
  title: string
  description: string
  category: string
  status: string
  display_order: number
}

export function SortableItem({ id, item }: { id: string; item: PlaygroundItem }) {
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
    if (window.confirm('Are you sure you want to delete this app?')) {
      await deletePlaygroundApp(id)
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative p-5 bg-black border border-zinc-800 rounded-xl shadow-sm transition-all duration-300 overflow-hidden ${
        isDragging ? 'shadow-2xl shadow-green-500/10 ring-1 ring-green-500/50 z-50 scale-[1.02]' : 'hover:border-zinc-700 hover:bg-zinc-950 hover:shadow-lg hover:shadow-black'
      }`}
    >
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
          
          <div className="w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-lg flex items-center justify-center p-2 shadow-inner flex-shrink-0 relative">
            <span className="text-zinc-500 font-mono text-xs font-bold">&lt;/&gt;</span>
            <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-black ${
              item.status === 'published' ? 'bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.6)]' :
              item.status === 'draft' ? 'bg-yellow-500' : 'bg-zinc-500'
            }`} />
          </div>
          
          <div>
            <h3 className="text-lg font-bold text-white font-mono group-hover:text-green-400 transition-colors tracking-tight">{item.title}</h3>
            <p className="text-xs font-mono text-zinc-500 mt-1 uppercase tracking-widest">{item.category}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full sm:w-auto justify-end border-t sm:border-t-0 border-zinc-800/50 pt-4 sm:pt-0">
          <span className={`px-2 py-1 text-[10px] font-mono uppercase tracking-wider rounded-md border ${
            item.status === 'published' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
            item.status === 'draft' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
            'bg-zinc-800 text-zinc-400 border-zinc-700'
          }`}>
            SYS.{item.status}
          </span>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild className="bg-zinc-900 text-zinc-400 hover:text-white hover:bg-green-600/80 border border-zinc-800 hover:border-transparent transition-all rounded-lg font-mono">
              <Link href={`/admin/playground/${id}`}>
                <Edit className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" className="bg-zinc-900 text-zinc-400 hover:text-white hover:bg-red-600/80 border border-zinc-800 hover:border-transparent transition-all rounded-lg" onClick={handleDelete}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
