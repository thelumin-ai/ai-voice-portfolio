'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ChevronLeft,
  ChevronRight,
  Edit,
  ExternalLink,
  PenSquare,
  Search,
  Trash2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  AdminConfirmDialog,
  AdminEmptyState,
  AdminStatusBadge,
} from '@/components/admin/AdminStates'
import { useAdminToast } from '@/components/admin/AdminToast'
import { deleteBlogPost } from './actions'

interface BlogPost {
  id: string
  title?: string | null
  slug?: string | null
  status?: string | null
  created_at?: string | null
  published_at?: string | null
}

const PAGE_SIZE = 10

function formatDate(raw: string | null | undefined): string {
  if (!raw) return '—'
  const date = new Date(raw)
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString()
}

export function BlogList({
  initialPosts,
  hasFetchError = false,
}: {
  initialPosts: BlogPost[]
  hasFetchError?: boolean
}) {
  const [posts, setPosts] = useState(initialPosts)
  const [prevInitial, setPrevInitial] = useState(initialPosts)
  const [deleteTarget, setDeleteTarget] = useState<BlogPost | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft' | 'archived'>('all')
  const [page, setPage] = useState(1)
  const toast = useAdminToast()

  if (prevInitial !== initialPosts) {
    setPrevInitial(initialPosts)
    setPosts(initialPosts)
  }

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return
    setIsDeleting(true)
    try {
      const result = await deleteBlogPost(deleteTarget.id)
      if (result.success) {
        setPosts((prev) => prev.filter((post) => post.id !== deleteTarget.id))
        toast.success(`Deleted "${deleteTarget.title || 'post'}"`)
        setDeleteTarget(null)
      } else {
        toast.error(result.error || 'Failed to delete blog post')
      }
    } catch {
      toast.error('Failed to delete blog post')
    } finally {
      setIsDeleting(false)
    }
  }

  if (posts.length === 0) {
    if (hasFetchError) {
      return (
        <div className="adm-surface adm-card-pad text-center text-sm text-adm-muted">
          Fix the error above and click Retry to load blog posts.
        </div>
      )
    }
    return (
      <div className="adm-surface adm-card-pad">
        <AdminEmptyState
          icon={Edit}
          title="No blog posts yet"
          description="Create your first article or generate one with the built-in AI Writer."
          action={
            <Button asChild size="sm">
              <Link href="/admin/blog/new">
                <PenSquare className="w-4 h-4 mr-2" />
                Write Post
              </Link>
            </Button>
          }
        />
      </div>
    )
  }

  const query = searchQuery.trim().toLowerCase()
  const filteredPosts = posts.filter((post) => {
    const normalizedStatus = (post.status || 'draft').toLowerCase()
    if (statusFilter !== 'all' && normalizedStatus !== statusFilter) return false
    if (!query) return true
    return (
      (post.title || '').toLowerCase().includes(query) ||
      (post.slug || '').toLowerCase().includes(query)
    )
  })

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  )

  return (
    <div className="space-y-4">
      <div className="adm-surface p-3 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 min-w-0">
          <Search className="w-4 h-4 text-adm-subtle absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setPage(1)
            }}
            placeholder="Search posts by title or slug..."
            className="adm-input pl-9"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value as 'all' | 'published' | 'draft' | 'archived')
            setPage(1)
          }}
          aria-label="Filter blog posts by status"
          className="adm-input sm:w-48 shrink-0"
        >
          <option value="all">All Statuses ({posts.length})</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {filteredPosts.length === 0 ? (
        <div className="adm-surface p-8 text-center text-sm text-adm-muted">
          No blog posts match your current filter.
        </div>
      ) : (
        <div className="adm-surface overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[540px]">
              <thead>
                <tr className="border-b border-adm-border bg-adm-surface-2/60">
                  <th className="py-3.5 px-5 text-xs font-semibold text-adm-muted uppercase tracking-wider">
                    Title
                  </th>
                  <th className="py-3.5 px-5 text-xs font-semibold text-adm-muted uppercase tracking-wider hidden sm:table-cell">
                    Created
                  </th>
                  <th className="py-3.5 px-5 text-xs font-semibold text-adm-muted uppercase tracking-wider">
                    Status
                  </th>
                  <th className="py-3.5 px-5 text-xs font-semibold text-adm-muted uppercase tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-adm-border">
                {paginatedPosts.map((post) => {
                  const titleLabel = post.title || 'Untitled Post'
                  const slugLabel = post.slug || ''
                  return (
                    <tr key={post.id} className="hover:bg-adm-surface-2/40 transition-colors">
                      <td className="py-3.5 px-5">
                        <span className="font-semibold text-adm-text block truncate max-w-md">
                          {titleLabel}
                        </span>
                        {slugLabel && (
                          <span className="text-xs text-adm-subtle font-mono mt-0.5 block truncate max-w-md">
                            /blog/{slugLabel}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-5 text-sm text-adm-muted hidden sm:table-cell whitespace-nowrap">
                        {formatDate(post.created_at)}
                      </td>
                      <td className="py-3.5 px-5">
                        <AdminStatusBadge status={post.status} />
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {post.status === 'published' && slugLabel && (
                            <Button variant="outline" size="icon" asChild>
                              <a
                                href={`/blog/${slugLabel}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`View ${titleLabel}`}
                              >
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            </Button>
                          )}
                          <Button variant="outline" size="icon" asChild>
                            <Link href={`/admin/blog/${post.id}`} aria-label={`Edit ${titleLabel}`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            aria-label={`Delete ${titleLabel}`}
                            onClick={() => setDeleteTarget(post)}
                            className="text-adm-danger-text hover:bg-adm-danger-bg hover:border-adm-danger-border"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs text-adm-muted">
          <span>
            Showing {(currentPage - 1) * PAGE_SIZE + 1}–
            {Math.min(currentPage * PAGE_SIZE, filteredPosts.length)} of {filteredPosts.length}
          </span>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Prev
            </Button>
            <span className="font-mono px-2">
              Page {currentPage} / {totalPages}
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      <AdminConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete blog post?"
        description={`This will permanently remove "${deleteTarget?.title || 'this post'}" from your blog.`}
        confirmLabel="Delete"
        loading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
