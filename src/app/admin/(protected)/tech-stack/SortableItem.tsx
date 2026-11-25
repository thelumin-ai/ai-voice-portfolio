'use client'

import React, { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Edit, Trash2, Wrench } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { AdminConfirmDialog, AdminStatusBadge } from '@/components/admin/AdminStates'
import { useAdminToast } from '@/components/admin/AdminToast'
import { isSafeHttpUrl } from '@/lib/url'
import { deleteTechItem } from './actions'

export interface TechItem {
  id: string
  name?: string | null
  category?: string | null
  icon_url?: string | null
  status?: string | null
  display_order?: number | null
}

export function SortableItem({
  id,
  item,
  reorderDisabled = false,
}: {
  id: string
  item: TechItem
  reorderDisabled?: boolean
}) {
  const router = useRouter()
  const toast = useAdminToast()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled: reorderDisabled })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.6 : 1,
  }

  const displayName = item.name?.trim() || 'Untitled Tool'
  const iconUrl = item.icon_url?.trim() || ''
  const hasSafeIcon =
    Boolean(iconUrl) &&
    (isSafeHttpUrl(iconUrl) || (iconUrl.startsWith('/') && !iconUrl.startsWith('//')))

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const res = await deleteTechItem(id)
      if (res?.error) {
        toast.error(res.error)
      } else {
        toast.success(`Deleted "${displayName}"`)
        setConfirmOpen(false)
        router.refresh()
      }
    } catch {
      toast.error('Failed to delete tool')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className={`group rounded-xl border border-adm-border bg-adm-surface-2/40 p-4 transition-all ${
          isDragging
            ? 'ring-2 ring-adm-accent shadow-xl bg-adm-surface'
            : 'hover:border-adm-accent/40 hover:bg-adm-surface-2/80'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 min-w-0 flex-1">
            <button
              type="button"
              disabled={reorderDisabled}
              className={`p-2 rounded-lg shrink-0 transition-colors ${
                reorderDisabled
                  ? 'text-adm-subtle opacity-40 cursor-not-allowed'
                  : 'cursor-grab text-adm-muted hover:text-adm-text hover:bg-adm-surface active:cursor-grabbing'
              }`}
              {...(reorderDisabled ? {} : attributes)}
              {...(reorderDisabled ? {} : listeners)}
              aria-label={`Drag to reorder ${displayName}`}
              title={reorderDisabled ? 'Clear filters to reorder' : 'Drag to reorder'}
            >
              <GripVertical className="h-4 w-4" />
            </button>

            <div className="w-12 h-12 rounded-lg border border-adm-border bg-adm-surface flex items-center justify-center p-2 shrink-0">
              {hasSafeIcon ? (
                <Image
                  src={iconUrl}
                  alt={displayName}
                  width={36}
                  height={36}
                  unoptimized
                  className="w-9 h-9 object-contain"
                />
              ) : (
                <Wrench className="h-5 w-5 text-adm-subtle" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="text-sm sm:text-base font-semibold text-adm-text truncate">
                {displayName}
              </h3>
              <p className="text-xs font-medium text-adm-muted uppercase tracking-wide truncate mt-0.5">
                {item.category || 'Uncategorized'}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-t-0 border-adm-border pt-3 sm:pt-0 shrink-0">
            <AdminStatusBadge status={item.status} />

            <div className="flex items-center gap-1.5">
              <Button variant="outline" size="icon" asChild>
                <Link href={`/admin/tech-stack/${id}`} aria-label={`Edit ${displayName}`}>
                  <Edit className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label={`Delete ${displayName}`}
                onClick={() => setConfirmOpen(true)}
                className="text-adm-danger-text hover:bg-adm-danger-bg hover:border-adm-danger-border"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <AdminConfirmDialog
        open={confirmOpen}
        title="Delete tool?"
        description={`This will permanently remove "${displayName}" from your tech stack.`}
        confirmLabel="Delete"
        loading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  )
}
