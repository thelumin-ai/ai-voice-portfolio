'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Edit, Globe, PlusCircle, Search, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AdminConfirmDialog, AdminEmptyState } from '@/components/admin/AdminStates'
import { useAdminToast } from '@/components/admin/AdminToast'
import { deleteSeoSetting } from './actions'

interface SeoSetting {
  id: string
  page_path?: string | null
  title?: string | null
  description?: string | null
  keywords?: string | null
}

export function SeoList({
  initialSettings,
  hasFetchError = false,
}: {
  initialSettings: SeoSetting[]
  hasFetchError?: boolean
}) {
  const [settings, setSettings] = useState(initialSettings)
  const [prevInitial, setPrevInitial] = useState(initialSettings)
  const [searchQuery, setSearchQuery] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<SeoSetting | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const toast = useAdminToast()

  if (prevInitial !== initialSettings) {
    setPrevInitial(initialSettings)
    setSettings(initialSettings)
  }

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return
    setIsDeleting(true)
    try {
      const result = await deleteSeoSetting(deleteTarget.id)
      if (result.success) {
        setSettings((prev) => prev.filter((s) => s.id !== deleteTarget.id))
        toast.success(`Deleted SEO config for "${deleteTarget.page_path || '/'}"`)
        setDeleteTarget(null)
      } else {
        toast.error(result.error || 'Failed to delete SEO setting')
      }
    } catch {
      toast.error('Failed to delete SEO setting')
    } finally {
      setIsDeleting(false)
    }
  }

  if (settings.length === 0) {
    if (hasFetchError) {
      return (
        <p className="py-6 text-center text-sm text-adm-muted">
          Fix the error above and click Retry to load route SEO configurations.
        </p>
      )
    }
    return (
      <AdminEmptyState
        icon={Globe}
        title="No SEO settings configured"
        description="Add custom metadata titles, descriptions, and OpenGraph images for your routes."
        action={
          <Button asChild size="sm">
            <Link href="/admin/seo/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Route SEO
            </Link>
          </Button>
        }
      />
    )
  }

  const query = searchQuery.trim().toLowerCase()
  const filteredSettings = settings.filter((setting) => {
    if (!query) return true
    return (
      (setting.page_path || '').toLowerCase().includes(query) ||
      (setting.title || '').toLowerCase().includes(query) ||
      (setting.description || '').toLowerCase().includes(query)
    )
  })

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="w-4 h-4 text-adm-subtle absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search SEO routes by path, title, or description..."
          className="adm-input pl-9"
        />
      </div>

      {filteredSettings.length === 0 ? (
        <div className="rounded-xl border border-adm-border bg-adm-surface-2/40 p-8 text-center text-sm text-adm-muted">
          No SEO routes match your search query.
        </div>
      ) : (
        <div className="space-y-3">
          {filteredSettings.map((setting) => {
            const pathLabel = setting.page_path || '/'
            const titleLabel = setting.title || 'Untitled Route'
            return (
              <div
                key={setting.id}
                className="rounded-xl border border-adm-border bg-adm-surface-2/40 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-adm-accent/40 hover:bg-adm-surface-2/80 transition-all"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Globe className="w-4 h-4 text-adm-accent shrink-0" />
                    <span className="font-mono text-xs font-semibold text-adm-accent bg-adm-accent-soft px-2 py-0.5 rounded truncate">
                      {pathLabel}
                    </span>
                  </div>
                  <h3 className="font-semibold text-adm-text text-base truncate">{titleLabel}</h3>
                  {setting.description && (
                    <p className="text-sm text-adm-muted line-clamp-1 mt-0.5">
                      {setting.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-1.5 w-full sm:w-auto justify-end border-t sm:border-t-0 border-adm-border pt-3 sm:pt-0 shrink-0">
                  <Button variant="outline" size="icon" asChild>
                    <Link href={`/admin/seo/${setting.id}`} aria-label={`Edit SEO for ${pathLabel}`}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    aria-label={`Delete SEO for ${pathLabel}`}
                    onClick={() => setDeleteTarget(setting)}
                    className="text-adm-danger-text hover:bg-adm-danger-bg hover:border-adm-danger-border"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <AdminConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete SEO configuration?"
        description={`This will remove custom SEO metadata for "${deleteTarget?.page_path || '/'}".`}
        confirmLabel="Delete"
        loading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
