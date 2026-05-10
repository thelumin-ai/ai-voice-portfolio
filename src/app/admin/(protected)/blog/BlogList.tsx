'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { deleteBlogPost } from './actions'
import { Trash2, Edit, ExternalLink } from 'lucide-react'
import Link from 'next/link'

interface BlogPost {
  id: string
  title: string
  slug: string
  status: string
  created_at: string
  published_at: string | null
}

export function BlogList({ initialPosts }: { initialPosts: BlogPost[] }) {
  const [posts, setPosts] = useState(initialPosts)
  const [isUpdating, setIsUpdating] = useState(false)

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      setIsUpdating(true)
      const result = await deleteBlogPost(id)
      
      if (result.success) {
        setPosts(posts.filter(post => post.id !== id))
      } else {
        alert('Failed to delete blog post')
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
        <p className="text-zinc-500 max-w-sm mx-auto">Click "Write Post" to create your first article.</p>
      </div>
    )
  }

  return (
    <div className={`bg-zinc-900/40 rounded-2xl border border-zinc-800/50 overflow-hidden backdrop-blur-sm ${isUpdating ? 'opacity-50 pointer-events-none' : ''}`}>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-zinc-800/50 bg-zinc-900/50">
            <th className="py-4 px-6 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Title</th>
            <th className="py-4 px-6 text-xs font-semibold text-zinc-400 uppercase tracking-wider hidden sm:table-cell">Date</th>
            <th className="py-4 px-6 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Status</th>
            <th className="py-4 px-6 text-xs font-semibold text-zinc-400 uppercase tracking-wider text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800/50">
          {posts.map(post => (
            <tr key={post.id} className="hover:bg-zinc-800/30 transition-colors group">
              <td className="py-4 px-6">
                <span className="font-semibold text-zinc-200 group-hover:text-white transition-colors block">{post.title}</span>
                <span className="text-xs text-zinc-500 font-mono mt-1 block">/blog/{post.slug}</span>
              </td>
              <td className="py-4 px-6 text-sm text-zinc-400 hidden sm:table-cell">
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
                      <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white hover:bg-zinc-800" asChild>
                    <Link href={`/admin/blog/${post.id}`}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300 hover:bg-red-950/30" onClick={() => handleDelete(post.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
