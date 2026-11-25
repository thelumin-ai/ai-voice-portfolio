'use client'

import React, { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Edit, Trash2 } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { AdminConfirmDialog, AdminStatusBadge } from '@/components/admin/AdminStates'
import { useAdminToast } from '@/components/admin/AdminToast'
import { isSafeHttpUrl } from '@/lib/url'
import { deleteTestimonial } from './actions'

export interface TestimonialItem {
  id: string
  client_name?: string | null
  company?: string | null
  status?: string | null
  display_order?: number | null
  image_url?: string | null
}

export function SortableItem({
  id,
  item,
  reorderDisabled = false,
}: {
  id: string
  item: TestimonialItem
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

  const displayName = item.client_name?.trim() || 'Unnamed Client'
  const imageUrl = item.image_url?.trim() || ''
  const hasSafeImage =
    Boolean(imageUrl) &&
    (isSafeHttpUrl(imageUrl) || (imageUrl.startsWith('/') && !imageUrl.startsWith('//')))

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const res = await deleteTestimonial(id)
      if (res?.error) {
        toast.error(res.error)
      } else {
        toast.success(`Deleted testimonial from "${displayName}"`)
        setConfirmOpen(false)
        router.refresh()
      }
    } catch {
      toast.error('Failed to delete testimonial')
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

            {hasSafeImage ? (
              <Image
                src={imageUrl}
                alt={displayName}
                width={40}
                height={40}
                unoptimized
                className="w-10 h-10 rounded-full object-cover border border-adm-border shrink-0"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-adm-accent-soft border border-adm-accent/25 flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-adm-accent">
                  {displayName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}

            <div className="min-w-0 flex-1">
              <h3 className="text-sm sm:text-base font-semibold text-adm-text truncate">
                {displayName}
              </h3>
              {item.company && (
                <p className="text-xs text-adm-muted truncate mt-0.5">{item.company}</p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-t-0 border-adm-border pt-3 sm:pt-0 shrink-0">
            <AdminStatusBadge status={item.status} />

            <div className="flex items-center gap-1.5">
              <Button variant="outline" size="icon" asChild>
                <Link href={`/admin/testimonials/${id}`} aria-label={`Edit ${displayName}`}>
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
        title="Delete testimonial?"
        description={`This will permanently remove the testimonial from "${displayName}".`}
        confirmLabel="Delete"
        loading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  )
}
