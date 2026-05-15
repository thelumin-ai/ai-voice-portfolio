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
  image_url?: string
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
      className={`group relative p-6 bg-zinc-900/60 border border-zinc-800 rounded-2xl shadow-sm backdrop-blur-sm transition-all duration-300 overflow-hidden ${
        isDragging ? 'shadow-2xl shadow-blue-500/20 ring-2 ring-blue-500 z-50 scale-[1.02]' : 'hover:border-zinc-600/50 hover:bg-zinc-800/80'
      }`}
    >
      {/* Quote Watermark */}
      <div className="absolute -top-4 -right-4 text-9xl text-zinc-800/30 font-serif leading-none select-none pointer-events-none group-hover:text-blue-900/20 transition-colors duration-500">
        &ldquo;
      </div>

      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-5 w-full sm:w-auto">
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab p-2 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-700 transition-all flex-shrink-0"
            title="Drag to reorder"
          >
            <GripVertical className="h-5 w-5" />
          </div>
          
          <div>
            <div className="flex items-center gap-3">
              {item.image_url ? (
                <img src={item.image_url} alt={item.client_name} className="w-8 h-8 rounded-full object-cover border border-zinc-700" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700">
                  <span className="text-xs font-bold text-zinc-400">{item.client_name.charAt(0)}</span>
                </div>
              )}
              <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                {item.client_name}
              </h3>
            </div>
            {item.company && (
              <p className="text-sm font-medium text-zinc-400 mt-1 tracking-wide uppercase pl-11">
                {item.company}
              </p>
            )}
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
            <Button variant="ghost" size="icon" asChild className="bg-zinc-800 text-zinc-300 hover:text-white hover:bg-blue-600 border border-zinc-700 hover:border-transparent transition-all rounded-lg">
              <Link href={`/admin/testimonials/${id}`}>
                <Edit className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" className="bg-zinc-800 text-zinc-300 hover:text-white hover:bg-red-600 border border-zinc-700 hover:border-transparent transition-all rounded-lg" onClick={handleDelete}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
