import { getBlogPosts } from './actions'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { PenSquare } from 'lucide-react'
import { BlogList } from './BlogList'

export default async function BlogAdminPage() {
  const { data: posts } = await getBlogPosts()

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Blog & Insights</h1>
        <Button asChild>
          <Link href="/admin/blog/new">
            <PenSquare className="mr-2 h-4 w-4" /> Write Post
          </Link>
        </Button>
      </div>

      <BlogList initialPosts={posts || []} />
    </div>
  )
}
