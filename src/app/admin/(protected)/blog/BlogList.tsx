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
      <div className="text-center py-12 border border-dashed rounded-lg dark:border-zinc-800">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No blog posts found</h3>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Click "Write Post" to create your first article.</p>
      </div>
    )
  }

  return (
    <div className={`space-y-4 ${isUpdating ? 'opacity-50 pointer-events-none' : ''}`}>
      {posts.map(post => (
        <Card key={post.id}>
          <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1">
              <h3 className="font-medium text-gray-900 dark:text-gray-100 text-lg">{post.title}</h3>
              <div className="flex items-center gap-4 mt-1 text-sm text-gray-500 dark:text-gray-400">
                <span>/{post.slug}</span>
                <span>•</span>
                <span>{new Date(post.created_at).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
              <span className={`px-2 py-1 text-xs rounded-full ${
                post.status === 'published' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                post.status === 'draft' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
              }`}>
                {post.status}
              </span>
              
              <div className="flex items-center gap-2">
                {post.status === 'published' && (
                  <Button variant="ghost" size="icon" asChild>
                    <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                )}
                <Button variant="ghost" size="icon" asChild>
                  <Link href={`/admin/blog/${post.id}`}>
                    <Edit className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/50" onClick={() => handleDelete(post.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
