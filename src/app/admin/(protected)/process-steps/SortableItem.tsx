'use client'

import React, { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Edit, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { AdminConfirmDialog, AdminStatusBadge } from '@/components/admin/AdminStates'
import { useAdminToast } from '@/components/admin/AdminToast'
import { deleteProcessStep } from './actions'

export interface ProcessStepItem {
  id: string
  title?: string | null
  description?: string | null
  icon_url?: string | null
  status?: string | null
  display_order?: number | null
}

export function SortableItem({
  id,
  item,
  stepNumber,
  reorderDisabled = false,
}: {
  id: string
  item: ProcessStepItem
  stepNumber: number
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

  const displayTitle = item.title?.trim() || 'Untitled Step'

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const res = await deleteProcessStep(id)
      if (res?.error) {
        toast.error(res.error)
      } else {
        toast.success(`Deleted step "${displayTitle}"`)
        setConfirmOpen(false)
        router.refresh()
      }
    } catch {
      toast.error('Failed to delete process step')
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
              aria-label={`Drag to reorder ${displayTitle}`}
              title={reorderDisabled ? 'Clear filters to reorder' : 'Drag to reorder'}
            >
              <GripVertical className="h-4 w-4" />
            </button>

            <div className="w-10 h-10 flex items-center justify-center bg-adm-accent-soft border border-adm-accent/30 text-adm-accent rounded-full font-bold text-sm shrink-0">
              {stepNumber}
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-sm sm:text-base font-semibold text-adm-text truncate">
                {displayTitle}
              </h3>
              {item.description && (
                <p className="text-xs sm:text-sm text-adm-muted line-clamp-1 mt-0.5">
                  {item.description}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-t-0 border-adm-border pt-3 sm:pt-0 shrink-0">
            <AdminStatusBadge status={item.status} />

            <div className="flex items-center gap-1.5">
              <Button variant="outline" size="icon" asChild>
                <Link href={`/admin/process-steps/${id}`} aria-label={`Edit ${displayTitle}`}>
                  <Edit className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label={`Delete ${displayTitle}`}
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
        title="Delete process step?"
        description={`This will permanently remove "${displayTitle}" from your workflow timeline.`}
        confirmLabel="Delete"
        loading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  )
}
