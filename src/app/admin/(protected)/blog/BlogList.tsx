'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { deleteBlogPost } from './actions'
import { Trash2, Edit, ExternalLink, Search, ChevronLeft, ChevronRight, X } from 'lucide-react'
import Link from 'next/link'

interface BlogPost {
  id: string
  title: string
  slug: string
  status: string
  created_at: string
  published_at: string | null
}

const PAGE_SIZE = 10

export function BlogList({ initialPosts }: { initialPosts: BlogPost[] }) {
  const [posts, setPosts] = useState(initialPosts)
  const [isUpdating, setIsUpdating] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft' | 'archived'>('all')
  const [page, setPage] = useState(1)

  useEffect(() => {
    setPosts(initialPosts)
  }, [initialPosts])

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      setIsUpdating(true)
      setActionError(null)
      const result = await deleteBlogPost(id)

      if (result.success) {
        setPosts((prev) => prev.filter(post => post.id !== id))
      } else {
        setActionError(result.error || 'Failed to delete blog post')
      }
      setIsUpdating(false)
    }
  }

  if (posts.length === 0) {
    return (
      <div className="p-12 text-center flex flex-col items-center justify-center bg-zinc-900/40 rounded-2xl border border-zinc-800/50 backdrop-blur-sm">
        <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mb-4">
          <Edit className="w-8 h-8 text-zinc-500" />
        </div>
        <h3 className="text-lg font-medium text-zinc-200 mb-2">No Blog Posts Found</h3>
        <p className="text-zinc-500 max-w-sm mx-auto">Click &ldquo;Write Post&rdquo; to create your first article.</p>
      </div>
    )
  }

  const query = searchQuery.trim().toLowerCase()
  const filteredPosts = posts.filter((post) => {
    if (statusFilter !== 'all' && post.status !== statusFilter) return false
    if (!query) return true
    return post.title.toLowerCase().includes(query) || post.slug.toLowerCase().includes(query)
  })

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const paginatedPosts = filteredPosts.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  return (
    <div className="space-y-4">
      {actionError && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center justify-between gap-3">
          <span>{actionError}</span>
          <button
            type="button"
            onClick={() => setActionError(null)}
            className="p-1 hover:text-white transition-colors shrink-0"
            aria-label="Dismiss error"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Search & Status Filter */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-zinc-900/40 p-3 rounded-xl border border-zinc-800/50">
        <div className="relative flex-1 min-w-0">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setPage(1)
            }}
            placeholder="Search posts by title or slug..."
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value as 'all' | 'published' | 'draft' | 'archived')
            setPage(1)
          }}
          aria-label="Filter blog posts by status"
          className="px-3 py-2 text-sm rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-200 focus:outline-none focus:border-blue-500 shrink-0"
        >
          <option value="all">All Statuses ({posts.length})</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {filteredPosts.length === 0 ? (
        <div className="p-10 text-center bg-zinc-900/30 rounded-2xl border border-zinc-800/50 text-zinc-400 text-sm">
          No blog posts match your current filter.
        </div>
      ) : (
        <div className={`bg-zinc-900/40 rounded-2xl border border-zinc-800/50 overflow-hidden backdrop-blur-sm ${isUpdating ? 'opacity-50 pointer-events-none' : ''}`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[540px]">
              <thead>
                <tr className="border-b border-zinc-800/50 bg-zinc-900/50">
                  <th className="py-4 px-6 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Title</th>
                  <th className="py-4 px-6 text-xs font-semibold text-zinc-400 uppercase tracking-wider hidden sm:table-cell">Date</th>
                  <th className="py-4 px-6 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Status</th>
                  <th className="py-4 px-6 text-xs font-semibold text-zinc-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {paginatedPosts.map(post => (
                  <tr key={post.id} className="hover:bg-zinc-800/30 transition-colors group">
                    <td className="py-4 px-6">
                      <span className="font-semibold text-zinc-200 group-hover:text-white transition-colors block">{post.title}</span>
                      <span className="text-xs text-zinc-500 font-mono mt-1 block">/blog/{post.slug}</span>
                    </td>
                    <td className="py-4 px-6 text-sm text-zinc-400 hidden sm:table-cell whitespace-nowrap">
                      {new Date(post.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 text-xs font-medium rounded-md border inline-block ${
                        post.status === 'published' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                        post.status === 'draft' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                        'bg-zinc-800 text-zinc-400 border-zinc-700'
                      }`}>
                        {post.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {post.status === 'published' && (
                          <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white hover:bg-zinc-800" asChild>
                            <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer" aria-label={`View ${post.title}`}>
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                        <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white hover:bg-zinc-800" asChild>
                          <Link href={`/admin/blog/${post.id}`} aria-label={`Edit ${post.title}`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300 hover:bg-red-950/30" onClick={() => handleDelete(post.id)} aria-label={`Delete ${post.title}`}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs text-zinc-400">
          <span>
            Showing {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filteredPosts.length)} of {filteredPosts.length}
          </span>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="border-zinc-800 text-zinc-300 hover:bg-zinc-800"
            >
              <ChevronLeft className="w-4 h-4 mr-1" /> Prev
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
              className="border-zinc-800 text-zinc-300 hover:bg-zinc-800"
            >
              Next <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
