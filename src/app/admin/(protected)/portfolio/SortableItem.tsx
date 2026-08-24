'use client'

import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Edit2, Trash2, Eye } from 'lucide-react'
import Link from 'next/link'
import { deletePortfolioProject } from './actions'

export interface PortfolioItem {
  id: string
  title: string
  industry_tag: string
  short_description?: string
  case_study_body?: string
  metrics?: any
  integrations?: string[]
  media_files?: any[]
  project_type?: 'webrtc' | 'audio' | 'video' | 'iframe'
  media_url?: string
  api_key?: string
  cover_image_url?: string
  voice_platform?: string
  status: string
  is_featured?: boolean
  display_order: number
}

interface Props {
  id: string
  item: PortfolioItem
  onPreview: (item: PortfolioItem) => void
}

export function SortableItem({ id, item, onPreview }: Props) {
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
    if (confirm(`Are you sure you want to delete "${item.title}"?`)) {
      await deletePortfolioProject(id)
    }
  }

  const desc = item.short_description || ''
  const previewDesc = desc.length > 400 ? `${desc.slice(0, 400)}...` : desc

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative overflow-hidden bg-zinc-900/40 rounded-2xl border border-zinc-800/50 backdrop-blur-sm transition-all duration-300 ${
        isDragging ? 'opacity-70 scale-105 shadow-2xl shadow-blue-500/20 ring-2 ring-blue-500 z-50' : 'hover:border-zinc-700/50 hover:shadow-lg hover:shadow-black/50'
      }`}
    >
      <div className="flex flex-col sm:flex-row h-full">
        {/* Consistent Fixed Aspect Ratio Image Section */}
        <div className="relative w-full sm:w-48 sm:min-w-[12rem] h-36 sm:h-auto bg-zinc-950 flex-shrink-0 overflow-hidden">
          {item.cover_image_url ? (
            <img
              src={item.cover_image_url}
              alt={item.title}
              className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-zinc-800/50 text-zinc-500 text-xs font-medium">
              No Image
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-zinc-900/90 sm:to-zinc-900/40" />
        </div>

        {/* Content Section with 400-char truncated preview */}
        <div className="flex-1 p-5 flex flex-col justify-center min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
                  {item.industry_tag || 'AI Automation'}
                </span>
                {item.is_featured && (
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    Featured
                  </span>
                )}
              </div>
              <h3 className="font-bold text-lg text-white group-hover:text-blue-400 transition-colors truncate">
                {item.title}
              </h3>
            </div>
            <span
              className={`px-2.5 py-1 text-xs font-bold rounded-md border flex-shrink-0 ${
                item.status === 'published'
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : item.status === 'draft'
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  : 'bg-zinc-800 text-zinc-400 border-zinc-700'
              }`}
            >
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </span>
          </div>

          {/* 400-character description preview with line-clamp */}
          {desc && (
            <p className="text-xs text-zinc-400 mt-2 line-clamp-2 sm:line-clamp-3 leading-relaxed">
              {previewDesc}
            </p>
          )}
        </div>

        {/* Actions Section */}
        <div className="flex sm:flex-col items-center justify-between sm:justify-center gap-2 p-4 sm:p-5 bg-zinc-950/30 sm:border-l border-zinc-800/50 flex-shrink-0">
          <button
            className="cursor-grab p-2.5 rounded-lg bg-zinc-800/50 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-all active:cursor-grabbing"
            {...attributes}
            {...listeners}
            title="Drag to reorder"
          >
            <GripVertical className="h-4 w-4" />
          </button>
          
          <div className="flex sm:flex-col items-center gap-2">
            <button
              onClick={() => onPreview(item)}
              title="Preview full portfolio details"
              className="p-2.5 rounded-lg bg-zinc-800/50 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-all"
            >
              <Eye className="h-4 w-4" />
            </button>
            <Link
              href={`/admin/portfolio/${id}`}
              title="Edit project"
              className="p-2.5 rounded-lg bg-zinc-800/50 text-zinc-400 hover:text-white hover:bg-blue-600 transition-all"
            >
              <Edit2 className="h-4 w-4" />
            </Link>
            <button
              onClick={handleDelete}
              title="Delete project"
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

